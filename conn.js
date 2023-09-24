const mon = require("mongoose");
<<<<<<< HEAD
// creating a database
mon
  .connect(
    "mongodb+srv://abhishek:as0709716@cluster0.pe0m0ij.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connection Successful");
  })
  .catch((error) => {
=======
// creating a database 
mon.connect("mongodb+srv://abhishek:as0709716@cluster0.pe0m0ij.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("connection Successful")
}).catch((error)=>{
>>>>>>> d9822ef9cbad80cfc37c50e4c7d336d5d4db79d5
    console.log(error);
  });
