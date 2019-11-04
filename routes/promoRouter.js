const express = require('express');
const bodyParser = require('body-parser');
const promoRouter = express.Router();
promoRouter.use(bodyParser.json());// enable dish router support request body
promoRouter.route('/')




.all((req,res,next)=>{
   res.statusCode = 200;
   res.setHeader('Content-Type','text/plain');
   next();// looks for additional methods to execute
})

.get((req,res,next)=>{
    res.end('Will send all the promotions to you');
    
})
.post((req,res,next)=>{
    res.end('Will add to the promotions: '+req.body.name+'with detail'+req.body.description);
})

.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('put OPeration not supported on promotions');
})

.delete((req,res,next)=>{
    res.end('deleting all the promotions');
});// this is a dangerous operation as it deletes all the items in the dishes

promoRouter.route('/:promoId')

.all((req,res,next)=>{
   res.statusCode = 200;
   res.setHeader('Content-Type','text/plain');
   next();// looks for additional methods to execute
})

.get((req,res,next)=>{
     res.end('Will send details of the promotions: ' + req.params.promoId +' to you!');
    
})
.post((req,res,next)=>{
    res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})

.put((req,res,next)=>{
    res.write('Updating the promotions: ' + req.params.promoId + '\n');
  res.end('Will update the promotions: ' + req.body.name + 
        ' with details: ' + req.body.description);
})

.delete((req,res,next)=>{
    res.end('Deleting promotions: ' + req.params.promoId);
});


module.exports = promoRouter;