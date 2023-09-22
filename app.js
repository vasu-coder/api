const express= require('express')
const app = express()
const port =process.env.PORT || 4000;

const mongoclinet = require('mongodb').MongoClient
 const url ="mongodb+srv://vishalvasumittal1973:vishalvasumittal1973@cluster0.avinw5c.mongodb.net/?retryWrites=true&w=majority"

 mongoclinet.connect(url,(err,db)=>{
    if(err){
        console.log("Error while connecting to db")
    }
    else{
        const mydb =db.db("mydb")
        const collection= mydb.collection("mytable")
        app.post('/singup',(res,req)=>{
            const newuser={
                name:req.body.name,
                email:req.body.email,
                password:req.body.password
            
            }
            const query = {email:newuser.email}
            collection.findOne(query,(err,result)=>{
                if(result==null){
                    collection.insertOne(newuser,(err,result)=>{
                        res.status(200).send()
                    })
                }
                else{
                    res.status(400).send()
                }
            })
        })
        app.post('/login',(res,req)=>{
            const query = {email:req.body.email,
                password:req.body.password}
                collection.findOne(query,(err,result)=>{
                    if(result!=null){
                        const obj ={name: result.name,
                        email:result.email}
                        res.status(200).send(JSON.stringify(obj))
                    }
                    else{
                        res.status(404).send()
                    }
                })
        })

    }
 })
app.use(express.json)

app.listen(4000,()=>{console.log(`Server is running on ${port}`)
});
