const mon = require("mongoose");
// creating a database 
mon.connect("mongodb+srv://vishalvasumittal1973:Vasu.2003@cluster0.avinw5c.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("connection Successful")
}).catch((error)=>{
    console.log(error);
})

