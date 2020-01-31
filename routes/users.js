var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');

var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.options('*',cors.corsWithOptions, authenticate.verifyUser, (req, res)=>{res.statusCode= 200;});// checks whether cors is allowed
router.get('/',cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=> {
  
  User.find({}, function(err,user){
       if(err){
        var err = new Error("You are not authorised to perform this operation");
        err.status = 401;
        return next(err);
       }else{
         res.json(user);
       }
  });
});

router.post( '/signup',cors.corsWithOptions,(req,res,next)=>{
   User.register(new User({username: req.body.username}),
   req.body.password, (err,user)=>{
   //user with same userfield already exists
    
     if(err){
       
     res.statusCode = 500;
     res.setHeader('Content-Type','application/json');
     res.json({err:err});
     }// there is same user in userfield
     else{
       if(req.body.firstname)// if firstname is in req.body
         user.firstname = req.body.firstname; // load into the user
        if(req.body.lastname)
         user.lastname = req.body.lastname;
         user.save((err, user)=>{
           if(err){
              res.statusCode = 500;
              res.setHeader('Content-Type','application/json');
              res.json({err:err});
              return;
           }// if err exists for the new chqnge
            passport.authenticate('local')(req,res, ()=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({success:true,status:'Registration Successful!'});
         }); //success result if everything succeeds
       
       
       
        });// saves the changes
     } // if registration was successful
    })
  });

router.post('/login',cors.corsWithOptions,(req,res, next)=>{
      passport.authenticate('local', (err, user, info)=>{
        if(err)
          return next(err);
        if(!user){
           res.statusCode = 401;
           res.setHeader('Content-Type','application/json');
           res.json({success:false,  status:'Login unsuccessful!', err:info});
        }
        req.logIn(user, (err)=>{
           if(err){
             res.statusCode = 401;
             res.setHeader('Content-Type','application/json');
             res.json({success:false,  status:'Login unsuccessful!', err:'could not login user'});
           }
        
         var token = authenticate.getToken({_id : req.user._id});
         res.statusCode = 200;
         res.setHeader('Content-Type','application/json');
         res.json({success:false,  status:'Login Successful!', token: token});
        });
      })(req,res, next);// structure for passport.authenticate
     
     
});

router.get('/logout',cors.corsWithOptions,  (req,res)=>{
   if(req.session){
     req.session.destroy();//destroying session on serverside
     res.clearCookie('session-id');// destroying cookie on clientside
     res.redirect('/');
   }
   else {
     var err = new Error('You are not logged in');
     err.status = 403
     next(err);
   }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res)=>{
  if(req.user){
     var token = authenticate.getToken({_id : req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json({success:true, token: token, status:'You are successfully logged in!'});
  }
});
router.get('checkJWTToken', cors.corsWithOptions, (req, res)=>{
  passport.authenticate('jwt', {session: false}, (err, user, info)=>{
    if(err){
      return next(err);
    }
    if(!user){
     res.statusCode = 403;
     res.setHeader('Content-Type', 'application/json');
     res.json({status:'JWT invalid', success: false, error: info});
    }
    else{
     res.statusCode = 200;
     res.setHeader('Content-Type', 'application/json');
     res.json({status:'JWT valid', success: true, user: user});

    }
  })(req, res);
}) // to check that the jwt is still valid

module.exports = router;
