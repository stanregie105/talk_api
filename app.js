var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');// setup our sessions
var FileStore =require('session-file-store')(session);// keeptrack of our sessions
var passport =require('passport');
var authenticate = require('./authenticate');
var config = require('./config');
const cors = require('cors');


// imports routers

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var talkRouter = require('./routes/talkRouter');

var favsTalkRouter = require('./routes/favoriteTalkRouter');

const mongoose = require('mongoose');

//const Dishes = require('./models/dishes');//require dish schema to connect to database

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db)=>{
   console.log('connected successfully to server');
},(err)=>{ console.log(err);});

var app = express();

app.all('*', (req, res, next)=>{
  if(req.secure){
    return next();
  }
  else{
    res.redirect(307,'https://' + req.hostname + ':' + app.get('secPort')+ req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));


app.use(passport.initialize());

app.use(cors());
app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(express.static(path.join(__dirname, 'public')));


app.use('/talks', talkRouter);

app.use('/favoritestalk', favsTalkRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
