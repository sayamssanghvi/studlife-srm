var mongoose = require('mongoose');

var Schema = new mongoose.Schema(
  {
    title: {
        type:String  
    },
    message: {
        type: String,
    },
    userName: {
        type:String    
    },
    images: {
        type:Array
    },
  },
  {
    timestamps: true,
  }
);

var Announcement = mongoose.model('Announcement', Schema);

module.exports = Announcement;