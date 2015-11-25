var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongoskin');
var routes = require('./routes/index');
var users = require('./routes/user'); // main router
var app = express();
var db = mongo.db("mongodb://localhost:27017/userData", {native_parser:true});
/*var collectionName = 'serverlist';
var obj = {
      "category": "students",
      "server": "localhost",
      "port": 3004,
      "start": "A",
      "end": "H"
    };
var obj2 = {
      "category": "students",
      "server": "localhost",
      "port": 3005,
      "start": "I",
      "end": "P"
    };
var obj3 = {
      "category": "students",
      "server": "localhost",
      "port": 3006,
      "start": "Q",
      "end": "Z"
    };
var obj4 = {
      "category": "courses",
      "server": "localhost",
      "port": 3001,
      "start": "A",
      "end": "H"
    };
var obj5 = {
      "category": "courses",
      "server": "localhost",
      "port": 3002,
      "start": "I",
      "end": "P"
    };
var obj6 = {
      "category": "courses",
      "server": "localhost",
      "port": 3003,
      "start": "Q",
      "end": "Z"
    };
db.collection(collectionName).insert(obj, function (err, result) {})
db.collection(collectionName).insert(obj2, function (err, result) {})
db.collection(collectionName).insert(obj3, function (err, result) {})
db.collection(collectionName).insert(obj4, function (err, result) {})
db.collection(collectionName).insert(obj5, function (err, result) {})
db.collection(collectionName).insert(obj6, function (err, result) {})*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
//app.use(express.static(path.join(__dirname, 'public')));

//import database
app.use(function(req,res,next){
    req.db = db;
    console.log("here");
    next();
});

//middleware, distribute 192.168.1.1:3000/api/ to router 'users'
app.use('/', routes);
app.use('/api', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
