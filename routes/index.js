var router = require('express').Router();

/* Get home page */
router.get('/', function(req, res) {
  res.render('index');
});

module.exports = router;