const mongoose = require("mongoose")
const bycrpt= require("bcryptjs");
const { error } = require("jquery")
const userSchema=mongoose.Schema({
   name:{
    type:String
   },
    
    email:{
        type:String
        
    
    },
    password:{
        type:String
        
    }
   
   

})
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password= await bycrpt.hash(this.password,10);
    next();
    }
    
})
const Register =mongoose.model("register",userSchema);
module.exports =Register;