const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Unknown",
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "UnSolved",
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  photoClicked: {
    type: Date,
    default: Date.now(),
  },
  solvedPhoto: {
    data: Buffer,
    contentType: String,
  },
  timeOfComplete: {
    type: Date,
  },
});
const PhotoSchema = new mongoose.model("details", photoSchema);
module.exports = PhotoSchema;
