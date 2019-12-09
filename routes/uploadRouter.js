const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

// configuring multer

const storage = multer.diskStorage({
  destination: (req, file,cb) => {
     cb(null, 'public/images');
  },

  file: (req,file, cb) =>{
      cb(null, file.originalname)
  }
});

//filefilter to specify the typeof file am willing to upload

const imageFileFilter = (req, file, cb)=>{
     if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
         return cb(new Error('You can upload only image files!'),false)
     }
     cb(null, true);
};

//configuring multer module for use withinour application

const upload = multer({storage : storage, fileFilter : imageFileFilter});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());// enable dish router support request body
uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end('Get OPeration not supported on /image/upload');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,
upload.single('imageFile'),(req,res)=>{
   res.statusCode = 200;
   res.setHeader('content-type', 'application/json');
   res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end('Put OPeration not supported on /image/upload');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end('Delete OPeration not supported on /image/upload');
})

module.exports = uploadRouter;