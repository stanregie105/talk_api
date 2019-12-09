const express = require('express');
const cors = require('cors');

const app = express();

//whitelist includes all the rigin server is willing to accept
const whitelist = ['http://localhost:3000', 'https://localhost:3443'];

var corsOptionsDelegate = ( req, callback) => {
   var corsOptions;

   if(whitelist.indexOf(req.header('Origin')) !==-1){
       corsOptions = { origin : true};
   }// allows access control origin returned by serverside
   else{
       corsOptions = { origin: false};
   }//don't allows access control origin returned by serverside
   callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);