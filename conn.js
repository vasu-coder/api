const mon = require("mongoose");
// creating a database
mon
  .connect(
    "mongodb+srv://abhishek:as0709716@cluster0.pe0m0ij.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connection Successful");
  })
  .catch((error) => {
    console.log(error);
  });
