const express= require('express')
const app = express()
const port =process.env.PORT || 4000;
const mon = require("mongoose");

const cookieparser= require("cookie-parser");
// creating a database 
mon.connect("mongodb+srv://vishalvasumittal1973:vishalvasumittal1973@cluster0.avinw5c.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("connection Successful")
}).catch((error)=>{
    console.log(error);
})
app.use(cookieparser());
const { error } = require("jquery")
const mongoose = require("mongoose")
const bycrpt= require("bcryptjs");
const jwt = require("jsonwebtoken")


const loginSchema=mongoose.Schema({

    
    email:{
        type:String,
        required:true,
    
    },
    password:{
        type:String,
        required:true,
        minLenght:3
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
   

})
loginSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()},process.env.SECERT_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        // console.log(token);
        return token;
    }
    catch(err){
            console.log(err);
    }
}
loginSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password= await bycrpt.hash(this.password,10);
    next();
    }
    
})

const Login =mongoose.model("Login",loginSchema);

app.post("/register", async(req,res)=>{
    try{
        const code = req.body.code;
        
        const data =new Login(req.body);
        console.log(data);
        const token= await data.generateAuthToken();
        // console.log(token);
res.cookie("jwt",token,{
    expires:new Date(Date.now()+ 600000),
    httpOnly:true
});
        await data.save();
        
        res.status(201).send("done");



  
      }
    catch(error){
        res.status(500).send(error)
    }

})


app.post("/login",async(req,res)=>{

    try{
        const email= req.body.email;
        const password = req.body.password;
        const usermail=await Login.findOne({email:email});
        
        const ismatch =  await bycrpt.compare(password,usermail.password);
        const token= await usermail.generateAuthToken();
        // console.log(token);
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+ 600000),
            httpOnly:true
        });

        // console.log(coo);

        if(ismatch){
            const obj ={name: result.name,
                email:result.email}
                res.status(200).send(JSON.stringify(obj))
        }
        else{
            res.status(404).send()
        }
    }
    catch(error){
        res.status(500).send("invalid Email")
    }
})
app.get("/", (req, res) => {
  
    let data = {
        name: "GFG",
        age: 18,
        male: true
    }
  
    res.send(data);
});
app.use(express.json)

app.listen(4000,()=>{console.log(`Server is running on ${port}`)
});
