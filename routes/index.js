var router = require('express').Router();
var redis = require('redis');
var client = redis.createClient();
var async = require('async');
var link = require('../models/link')
var dbwrite = require('../util/populateRedditDatabase');

/* Helper functions */
var initDB = function(written, callback) {
  if (!written) {
    dbwrite(callback);
  } else {
    callback();
  }
}

var getMessage = function() {
  var messages = ["Become a Master Programmer", "Go outside", "Make new friends", "Improve your social skills",
                  "Start a Startup", "Read a book", "Master your math skills", "Get that perfect body you've always wanted",
                  "Volunteer", "Write a blog"];
  var messageLen = messages.length;

  return messages[Math.floor(Math.random() * messageLen)]
}

/* Get home page */
router.get('/', function(req, res) {
  res.render('index', {message: getMessage()});
});

router.get('/data', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  client.get("limitedreddit:datawritten", function(err, written) {
    console.log("Written: " +  written);
    if (err) res.send(JSON.stringify({"Error": "Database issues " + err}));
    else {
      // check if the db is written. If it is, just call the function. If not,
      // write the db first and then call the function
      initDB(written, function() {
        var obj = {};
        client.llen("limitedreddit:urls", function(err, len) {
          var length = Number(len);

          var fcnList = [];
          for (var i = 0; i < length; i++) {
            fcnList[fcnList.length] = (function(i) {
              return function(callback) {
                link.initFromRedis(i, callback);
              };
            }(i));
          }

          async.parallel(fcnList, function(err, objects) {
            if (err) {
              res.send(JSON.stringify({"Error": "Error while fetching: " + err}))
            } else {
              obj.links = objects;
              res.send(JSON.stringify(obj), null, 3);
            }
          });
        });
      });

    }
  })
});

module.exports = router;
