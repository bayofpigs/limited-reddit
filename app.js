var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var routes = require('./routes/index');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// Catch 404 errors
app.use(function(req, res, next) {
  console.log("Hit 404");
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Development error handler prints stack trace 
if (app.get('env') == 'development') {
  console.log("You are in mode development. Hoorah!");
  app.locals.pretty = true;
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler does not give any stinking stack traces
if (app.get('env') == 'production') {
  console.log("You are in mode production. Hoorah!");
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log("Express server listening on port " + server.address().port);
});
