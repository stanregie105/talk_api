var express = require('express');
var bodyParser =require('body-parser');
var mongoose =require('mongoose');

const cors = require('./cors');
var Favorites = require('../models/favorite');
var authenticate = require('../authenticate');

var favsRouter = express.Router();
favsRouter.use(bodyParser.json());

favsRouter.route('/')
.get(authenticate.verifyUser,(req,res,next)=>{
    Favorites.find({ 'postedBy': req.user._id})
    //populates the postedBy and talks using the object id
    .populate('postedBy')
    .populate('talks')
    
      .then((favs)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favs);
      },(err)=>next(err))
      .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({'postedBy': req.user._id})
    .then((favs)=>{
        // fovorites exists
    if(favs!==null){
        
        for(var i =0; i<req.body.length; i++){
                // talk with the id does not exist in req body
                if(favs.talks.indexOf(req.body[i]._id)===-1){
                    favs.talks.push(req.body[i]._id);
                }
        }
         
        favs.save()
        .then((favs)=>{
        Favorites.findById(favs._id)
              .populate('postedBy')
              .populate('talks')
              
              .then((favs)=>{
                 res.statusCode = 200;
                 res.setHeader('Content-Type','application/json');
                 res.json(favs);
              },(err)=>next(err));
    },(err)=>next(err));
    
}
    else {
        Favorites.create({'postedBy': req.user._id, 'talks': req.body})
        .then(()=>{
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favs);
    },(err)=>next(err))
    .catch((err)=>next(err));
    }
});
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    res.statusCode = 403;
    res.end('Put operation not supported on /favoritetalk')
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Favorites.remove({'postedBy': req.user._id})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
     },(err)=>next(err))
      .catch((err)=>next(err));
});

favsRouter.route('/:favsId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get((req, res, next) => {
 Favotites.findOne({ 'postedBy': req.user._id})
 .then((favs)=>{
    if(!favs){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({'exists': false, 'favoritetalk':favs})
    }else{
        if(favs.talks.indexOf(req.params.favsId)<0){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({'exists': false, 'favoritetalk':favs})
        }else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({'exists': true, 'favoritetalk':favs})
        }
    }
 },(err)=>next(err))
 .catch((err)=>next(err));
})
.post(authenticate.verifyUser, (req, res, next)=>{
   Favorites.findOne({'postedBy': req.user._id})
   .then((favs)=>{
      if(favs!==null){
          var index = favs.dishes.indexOf(req.params.favsId);
          // dish with the id does not exist in req parameter
          if(index === -1){
              // add the id in dish collection
              favs.dishes.push(req.params.favsId);
          }
          favs.save()
          .then((favs)=>{
              Favorites.findById(favs._id)
              .populate('postedBy')
              .populate('talks')
              
              .then((favs)=>{
                 res.statusCode = 200;
                 res.setHeader('Content-Type','application/json');
                 res.json(favs);
              })
            
          },(err)=>next(err));
          
          
      }else{
          Favorites.create({'postedBy': req.user._id, 'dishes': [req.params.favsId]})
          then((favs)=>{
             res.statusCode = 200;
             res.setHeader('Content-Type','application/json');
             res.json(favs);
   },(err)=>next(err))
   .catch((err)=>next(err));
   }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /favorites');
})
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
   Favorites.findOne({'postedBy': req.user._id})
   .then((favs)=>{
       //favorites exists
      if(favs!==null){
          var index = favs.dishes.indexOf(req.params.favsId);
               // remove the id from dish collection
               if(index>=0){
              favs.dishes.splice(index,1);
               }
          favs.save()
          .then((favs)=>{
             res.statusCode = 200;
             res.setHeader('Content-Type','application/json');
             res.json(favorites);
          },(err)=>next(err));
          
          
      }else{
          var err = new Error (' No favorites available');
          err.status = 401;
          return next(err);
      }
   },(err)=>next(err))
   .catch((err)=>next(err));
});

module.exports = favsRouter;
