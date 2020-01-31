const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


const attendeeSchema = new Schema({
   
    name:{
        type: String ,
        required: true,
       
    },
    occupation:{
        type: String ,
        default: '',
       
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
    attendees: [attendeesSchema]
},

    {
    timestamps:true
});

var Talks = mongoose.model('talk', talkSchema);

module.exports = Talks;