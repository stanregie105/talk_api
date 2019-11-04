const express = require('express');
const bodyParser = require('body-parser');
const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());// enable dish router support request body
leaderRouter.route('/')




.all((req,res,next)=>{
   res.statusCode = 200;
   res.setHeader('Content-Type','text/plain');
   next();// looks for additional methods to execute
})

.get((req,res,next)=>{
    res.end('Will send all the leaders to you');
    
})
.post((req,res,next)=>{
    res.end('Will add to the leaders: '+req.body.name+'with detail'+req.body.description);
})

.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('put OPeration not supported on leaders');
})

.delete((req,res,next)=>{
    res.end('deleting all the leaders');
});// this is a dangerous operation as it deletes all the items in the dishes

leaderRouter.route('/:leaderId')

.all((req,res,next)=>{
   res.statusCode = 200;
   res.setHeader('Content-Type','text/plain');
   next();// looks for additional methods to execute
})

.get((req,res,next)=>{
     res.end('Will send details of the leaders: ' + req.params.leaderId +' to you!');
    
})
.post((req,res,next)=>{
    res.statusCode = 403;
  res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})

.put((req,res,next)=>{
    res.write('Updating the leaders: ' + req.params.leaderId + '\n');
  res.end('Will update the leaders: ' + req.body.name + 
        ' with details: ' + req.body.description);
})

.delete((req,res,next)=>{
    res.end('Deleting leaders: ' + req.params.leaderId);
});


module.exports = leaderRouter;