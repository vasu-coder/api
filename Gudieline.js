const mongoose = require("mongoose");
const moment = require('moment');
const dateFormat = require('mongoose-date-format');
const guideline = mongoose.Schema({
    headline: {
      type: String,
    },
  
    guidelines: {
      type: String,
    },
    date:{
      type:String,
      
      
      
  }
    
 } 

 );



const Guideline = mongoose.model("guideline",guideline);
module.exports = Guideline;