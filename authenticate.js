var passport = require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); 
var config = require('./config');

// configuring passport with our localstrategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));
//supports sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    return jwt.sign(user, config.secretKey,
    {expiresIn: 3600});
};

//configures jwt strategy
var opts = {}; // suggests how jsonwebtoken will be extracted frm incoming request message

// extracts json  token frm header
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey; // supplies the secret key to be used within my strategy

// jsonwebtoken passport configured
exports.jwtPassport = passport.use(new JwtStrategy(opts,
(jwt_payload, done)=>{
    console.log("JWT payload: ", jwt_payload);
    User.findOne({_id: jwt_payload._id},(err, user)=>{
        if(err){
            return done(err,false); 
        }
        else if(user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    });

}));


// verifies incoming user
exports.verifyUser = passport.authenticate('jwt', {session: false});
exports.verifyAdmin = function(req, res, next){
    if(req.user.admin){
        return next();
    }
    else{
        var err = new Error("You are not authorised to perform this operation");
        err.status = 401;
        return next(err);
    }
};