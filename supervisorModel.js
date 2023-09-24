const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");
const superVisorSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

superVisorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bycrpt.hash(this.password, 10);
    next();
  }
});

const supervisorSchema = new mongoose.model(
  "supervisorDetail",
  superVisorSchema
);
module.exports = supervisorSchema;
