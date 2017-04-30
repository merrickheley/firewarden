var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var predict = require('./prediction')

const http = require('http');
const url = require('url');
const WebSocket = require('ws');

var app = express();

// Set up the database
var db = require('./database').init();
//db.logFire(123456857, 123.45, 67.89);
//db.getAllFires();

// Close the database. Good practice.
// db.teardown();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Create websocket server
var wss = new WebSocket.Server({server:"127.0.0.1", port:3001});
console.log("created websocket");

//List of all known fire locations with a timestamp
var locations = [];


//send webpage on landing
app.get('/',function(req,res){
     res.sendFile('index.jade');
});
app.get('/#about',function(req,res){
     res.sendFile('about.jade');
});
app.get('/#contact',function(req,res){
     res.sendFile('contact.jade');
});

wss.on('connection', function connection(ws) {
  const location = url.parse(ws.upgradeReq.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  //run when a new message is received
  ws.on('message', function incoming(message) {
	  var fires = JSON.parse(message);
	  fires.forEach(function (fire) {
		db.logFire(Date.now(),fire.lat,fire.lng);
	  });
    console.log('received: %s', message);
  });

	var fires =
	db.getAllFires(function (err,row) {
		ws.send(JSON.stringify([ {
			time: row["time"],
			lat: row["latitude"],
			lng: row["longitude"]
		}]));
		console.log("T:" + row["time"] + ", Lat:" + row['latitude'] + ", Lon:" + row['longitude']);
	});
  //ws.send(fires);
});

app.listen(3002);

module.exports = app;
