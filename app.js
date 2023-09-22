const express= require('express')
const app = express()
const bycrpt = require("bcryptjs");
require("./conn.js")
const Register = require("./Register.js")
const port =process.env.PORT || 4000;
app.use(express.json())
app.post("/register",async(req,res)=>{
    let register =  await new Register(req.body)
    const d= await register.save(register)
    res.send(d)
})


app.listen(4000,()=>{console.log(`Server is running on ${port}`)
});
app.post("/login",async(req,res)=>{

    try{
        const email= req.body.email;
        const password = req.body.password;
        const usermail=await Register.findOne({email:email});
        
        const ismatch =  await bycrpt.compare(password,usermail.password);
       

        console.log(ismatch);

        if(ismatch){
            const obj ={name: usermail.name,
                email:usermail.email}
                res.status(200).send(JSON.stringify(obj))
        }
        else{
            res.send("not match");
        }
    }
    catch(error){
        res.status(500).send("invalid Email")
    }
})