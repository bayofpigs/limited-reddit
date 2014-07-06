var request = require('request');
var redis = require('redis');
var link = require('../models/link');
var async = require('async');

// Helper function
var setExpiration = function() {
  // One day
  client.expire("limitedreddit:datawritten", 900);
  for (var i = 0; i < link.numProperties; i++) {
    var property = link.properties[i];
    client.expire("limitedreddit:" + property + "s", 900);
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
  client.get("limitedreddit:fetching", function(err, fetching) {
    if (fetching) {
      callback(new Error("Cannot fetch while still fetching"));
    } else {
      // Set the fetching indicator - preventing future setting
      client.set("limitedreddit:fetching", "true", redis.print)
      request("http://api.reddit.com/top?limit=" + limit, function(error, response, body) {
        if (error) callback(error);;
        if (!error && response.statusCode == 200) {
          var object = JSON.parse(body);
          var links = object.data.children;

          var fcnList = [];
          for (var i = 0; i < links.length; i++) {
            var dataObject = links[i].data;
            link.writeToRedis(dataObject);
          }

          // Unset the fetching indicator
          client.del("limitedreddit:fetching");
          client.set("limitedreddit:datawritten", "true");
          setExpiration();

          callback(null);
        }
      });
    }
  })
};

module.exports = fetchRedditData;