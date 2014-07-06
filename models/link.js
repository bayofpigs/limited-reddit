var redis = require('redis');
var async = require('async');
var client = redis.createClient();

client.on('error', function(err) {
  console.log("Redis Error: " + err);
});

function makeModel() {
  var properties = ["domain", "subreddit", "selftext", "selftext_html", "gilded",
                        "author", "score", "over_18", "thumbnail", "url", "title", "ups", "id"]
  var numProperties = properties.length;

  var LinkObject = function(initData) {
    for (var i = 0; i < numProperties; i++) {
      var property = properties[i];
      this[property] = initData[property];
    }
  };

  LinkObject.initFromRedis = function(index, done) {
    if (!client.get("limitedreddit:datawritten") === "true") {
      done(new Error("Redis not ready"));
    }
    init = {};
    var processedCount = 0;

    // Using async library
    var fcnList = [];

    // Generate a list of functions to call
    for (var i = 0; i < numProperties; i++) {
      var property = properties[i];
      console.log("Making fcn for " + property);

      // Add a new function that fetches from redis and calls callback
      fcnList[fcnList.length] = (function(property, index) {
        return function(callback) {
          client.lindex("limitedreddit:" + property + "s", index, function(err, reply) {
            console.log("Asking for key: " + "limitedreddit:" + property + "s at index " + index);
            console.log("Got reply: " + reply + " for property " + property);
            if (err) {
              callback(err);
            } else {
              init[property] = reply;
              callback();
            }
          });
        }
      }(property, i));
    }

    async.parallel(fcnList, function(err, results) {
      if (err) {
        done(new Error("Failure to read from database: " + err));
      }

      done(null, new LinkObject(init));
    })
  };

  LinkObject.writeToRedis = function(object) {
    if (!object) {
      throw new Error("Error: Cannot write undefined");
    }
    for (var i = 0; i < numProperties; i++) {
      var property = properties[i];
      client.lpush("limitedreddit:" + property + "s", object[property]);
    }
  };

  LinkObject.properties = properties;
  LinkObject.numProperties = numProperties;

  return LinkObject;
}

module.exports = makeModel();