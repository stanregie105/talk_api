var passport = require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User = require('./models/user');
// configuring passport with our localstrategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));
//supports sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());