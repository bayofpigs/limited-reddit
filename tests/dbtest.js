var builddb = require('../util/populateRedditDatabase');

builddb(function(err) {
  if (err) console.error(err);
  else {
    console.log("Success");
  }
})