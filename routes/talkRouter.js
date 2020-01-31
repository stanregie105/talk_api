const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Talks = require('../models/talk');
const authenticate = require('../authenticate');
const cors = require('./cors');


const talkRouter = express.Router();
talkRouter.use(bodyParser.json());// enable talk router support request body
talkRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (req,res,next)=>{
   Talks.find(req.query)//make it ableto handle query parameter
      .then((talks)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(talks);
      },(err)=>next(err))
      .catch((err)=>next(err));
    
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    Talks.create(req.body)
     .then((talk)=>{
        console.log('Dish Created', talk);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(talk);
        },(err)=>next(err))
      .catch((err)=>next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end('put OPeration not supported on talks');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    Talks.remove({})
     .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
     },(err)=>next(err))
      .catch((err)=>next(err));

});// this is a dangerous operation as it deletes all the items in the dishes
talkRouter.route('/:talkId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (req,res,next)=>{
 Talks.findById(req.params.leaderId)
    .then((talk)=>{
     res.statusCode = 200;
     res.setHeader('Content-Type','application/json');
     res.json(talk);
    },(err)=>next(err))
      .catch((err)=>next(err));    
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
  res.end('POST operation not supported on /talks/'+ req.params.talkId);
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
     Talks.findByIdAndUpdate(req.params.talkId,
   {$set: req.body},
   {new: true})
   .then((talk)=>{
     res.statusCode = 200;
     res.setHeader('Content-Type','application/json');
     res.json(talk);
    },(err)=>next(err))
   .catch((err)=>next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
 Talks.findByIdAndRemove(req.params.talkId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
     },(err)=>next(err))
    .catch((err)=>next(err));});

 talkRouter.route('/:talkId/attendees')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors,(req,res,next)=>{
    Talks.findById(req.params.talkId)
    .populate('attendees.name')
      .then((talk)=>{
          if(talk!=null){
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(talk.attendees);
      } // dish exists
      else{
          err = new Error('Dish'+ req.params.talkId+ 'not found');
          err.status=404;
          return next(err);
      }//error message
      },(err)=>next(err))
      .catch((err)=>next(err));
    
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    Talks.findById(req.params.talkId)
     .then((talk)=>{
          if(talk!=null){
        req.body.author = req.user._id;
        talk.attendees.push(req.body); // push req body of name to attendees
        talk.save()
        .then((talk)=>{
         Talks.findById(talk._id)
          .populate('attendees.name')
          .then((name)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(talk);
         })
         
         },(err)=>next(err));
        
      }else{
          err = new Error('Dish'+ req.params.talkId+ 'not found');
          err.status=404;
          return next(err);
      }
        },(err)=>next(err))
      .catch((err)=>next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end('put OPeration not supported on talks'+req.params.dishId+'/attendees');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    Talks.findById(req.parms.talkId)
     .then((talk)=>{
        if(talk!=null){
        for(var i=(talk.attendees.length-1);i>=0;i--){
            talk.attendees.id(talk.attendees[i]._id).remove();
        }
        talk.save()
         .then((talk)=>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json(talk);
         },(err)=>next(err));
        
      }else{
          err = new Error('Dish'+ req.params.talkId+ 'not found');
          err.status=404;
          return next(err);
      }
     },(err)=>next(err))
      .catch((err)=>next(err));
});// this is a dangerous operation as it deletes all the items in the talks

talkRouter.route('/:talkId/attendees/:attendeeId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('attendees.name')
    .then((talk)=>{
     if(talk!=null && talk.attendees.id(req.params.attendeeId)!=null){
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(talk.attendees.id(req.params.attendeeId));
      } // dish exists
      else if(talk==null){
          err = new Error('Talk'+ req.params.talkId+ 'not found');
          err.status=404;
          return next(err);
      }
      else {
          err = new Error('attendees'+ req.params.attendeeId+ 'not found');
          err.status=404;
          return next(err);
      }
    },(err)=>next(err))
      .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
  res.end('POST operation not supported on /talks/'+ req.params.talkId+
  '/talks'+req.params.attendeeId+'/attendees/');
})

.put(cors.corsWithOptions, authenticate.verifyUser,(req,res,next)=>{
    Talks.findById(req.params.talkId)
    .then((talk)=>{
     if(talk!=null && talk.attendees.id(req.params.attendeeId)!=null &&
        req.user._id.equals(talk.attendees._id(req.params.attendeeId).name)){
       if(req.body.rating){
         talk.attendees.id(req.params.attendeeId).rating = req.body.rating;
       }
        if(req.body.presenter){
        talk.attendees.id(req.params.attendeeId).presenter = req.body.presenter;
       }
        talk.save()
         .then((dish)=>{
            Talks.findById(talk._id)
            .populate('attendees.name')
            
            .then((talk)=>{
                
               res.statusCode = 200;
               res.setHeader('Content-Type','application/json');
               res.json(talk);
               
                
            })
         
         },(err)=>next(err));
      } // talk exists
      else if(talk==null){
          err = new Error('Talk'+ req.params.talkId+ 'not found');
          err.status=404;
          return next(err);
      }
      else if(talk.attendees.id(req.params.attendeeeId) == null){
          err = new Error('attendees'+ req.params.attendeeId+ 'not found');
          err.status=404;
          return next(err);
      }else{
             var err = new Error("You are not authorized to delete this attendee");
             err.status = 401;
             return next(err);
         }
    },(err)=>next(err))
   .catch((err)=>next(err));
})// An ordinary user can performa delete operation on attendee

.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
     Talks.findById(req.params.talkId)
     .then((talk)=>{
        if(talk!=null && talk.attendees.id(req.params.attendeeId)!=null&&
        req.user._id.equals(talk.attendees._id(req.params.attendeeId).name)){
        //deletes specific attendee with the given id
            talk.attendees.id(req.params.attendeeId).remove();
        
        talk.save()
         .then((talk)=>{
          Talks.findById(talk._id)
            .populate('attendees.name')
            .then((talk)=>{
               
               res.statusCode = 200;
               res.setHeader('Content-Type','application/json');
               res.json(talk);
               
            })
         },(err)=>next(err));
        
      }  else if(talk==null){
          err = new Error('Talk'+ req.params.talkId+ 'not found');
          err.status=404;
          return next(err);
      }
      else if(talk.attendees.id(req.params.attendeeId) == null) {
          err = new Error('attendees'+ req.params.attendeeId+ 'not found');
          err.status=404;
          return next(err);
      } else{
                     var err = new Error("You are not authorized to delete this attendee");
                     err.status = 401;
                     return next(err);
                }
     },(err)=>next(err))
      .catch((err)=>next(err));
});


module.exports = talkRouter;