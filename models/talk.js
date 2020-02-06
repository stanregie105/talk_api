const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


const attendeeSchema = new Schema({
   
    name:{
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'User',
       
    },
    occupation:{
        type: String ,
        default: '',
       
    },
    rating:{
      type: Number,
      min:1,
      max:2,
      required:true
  },
  presenter:{
      type: String,
      required: true

  }
},
    {
    timestamps:true
});

const talkSchema = new Schema({
   
    sport:{
        type: String ,
        required: true,
       
    },
    price:{
      type: Currency,
      required: true,
      min:0
    },
    attendees: [attendeeSchema]
},

    {
    timestamps:true
});

var Talks = mongoose.model('talk', talkSchema);

module.exports = Talks;