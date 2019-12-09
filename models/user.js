var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// plugin will automatically add username and hashed storage of password
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname:{
        type:String,
        default:''
    },
    lastname:{
        type:String,
        default:''
    },
    facebookId: String,

   admin:{
       type: Boolean,
       default:false
   }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',User);