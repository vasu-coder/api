const mongoose = require("mongoose");
const guideline = mongoose.Schema({
    headline: {
      type: String,
    },
  
    guidelines: {
      type: String,
    },
    
  });

const Guideline = mongoose.model("guideline",guideline);
module.exports = Guideline;