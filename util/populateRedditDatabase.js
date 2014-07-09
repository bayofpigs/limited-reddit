var request = require('request');
var redis = require('redis');
var link = require('../models/link');
var async = require('async');

// Variable to check if fetching
var fetchingVar = false;

// Helper function
var setExpiration = function() {
  // two hours
  var expirationTime = 7200
  client.expire("limitedreddit:datawritten", expirationTime);
  for (var i = 0; i < link.numProperties; i++) {
    var property = link.properties[i];
    client.expire("limitedreddit:" + property + "s", expirationTime);
  }
};

// Redis client
client = redis.createClient();

client.on('error', function(err) {
  console.log("Redis Error: " + err);
});

var limit = 100;
var fetchRedditData = function(callback) {
  var now = new Date();
  var curTime = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  console.log("Fetching new data at " + curTime);
  // Don't try to fetch if already fetching
  client.get("limitedreddit:datawritten", function(err, written) {
    if (!written) {
      console.log(written);

      if (fetchingVar) {
        // If the data is currently being fetched, wait for completion
        waitClient = redis.createClient();
        waitClient.subscribe("completed");
        waitClient.on("message", function (channel, message) {
          if (message === "success") {
            callback(null);
          } else {
            callback(message);
          }
        });
      } else {
        fetchingVar = true;
        request("http://api.reddit.com/hot?limit=" + limit, function(error, response, body) {
          if (error) {
            client.publish("completed", error);
            callback(error);
          } else if (!error && response.statusCode == 200) {
            var object = JSON.parse(body);
            var links = object.data.children;

            for (var i = 0; i < links.length; i++) {
              var dataObject = links[i].data;
              link.writeToRedis(dataObject);
            }

            // Unset the fetching indicator
            fetchingVar = false;
            client.set("limitedreddit:datawritten", "true");
            setExpiration();

            client.publish("completed", "success");

            callback(null);
          }
        });
      }
    } else {
      callback(null);
    }
  });
};

module.exports = fetchRedditData;
