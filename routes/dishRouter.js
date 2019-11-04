const express = require('express');
const bodyParser = require('body-parser');
const dishRouter = express.Router();
dishRouter.use(bodyParser.json());// enable dish router support request body
dishRouter.route('/')




.all((req,res,next)=>{
   res.statusCode = 200;
   res.setHeader('Content-Type','text/plain');
   next();// looks for additional methods to execute
})

.get((req,res,next)=>{
    res.end('Will send all the dishes to you');
    
})
.post((req,res,next)=>{
    res.end('Will add to the dishes: '+req.body.name+'with detail'+req.body.description);
})

.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('put OPeration not supported on dishes');
})

.delete((req,res,next)=>{
    res.end('deleting all the dishes');
});// this is a dangerous operation as it deletes all the items in the dishes

dishRouter.route('/:dishId')

.all((req,res,next)=>{
   res.statusCode = 200;
   res.setHeader('Content-Type','text/plain');
   next();// looks for additional methods to execute
})

.get((req,res,next)=>{
     res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
    
})
.post((req,res,next)=>{
    res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})

.put((req,res,next)=>{
    res.write('Updating the dish: ' + req.params.dishId + '\n');
  res.end('Will update the dish: ' + req.body.name + 
        ' with details: ' + req.body.description);
})

.delete((req,res,next)=>{
    res.end('Deleting dish: ' + req.params.dishId);
});


module.exports = dishRouter;