const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    postedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }
  ,
    talks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Talks'
 }]
}  
  ,{
    timestamps:true
}
);

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;