const express = require('express');
const cors = require('cors');
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")

const app = express();

app.use(cors())
app.use(express.json());

mongoose.connect("mongodb+srv://rishi:12345@cluster0.u5j4gv2.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0&tls=true").then(function()
{
    console.log("Connected to DB")
}).catch((err) => {
    console.log("Failed to Connect");
    console.log(err.message);
});

const credential = mongoose.model("credential",{},"bulkmail")


app.post("/sendmail",function(req,res){

    var msg = req.body.msg
    var emailList = req.body.emailList
   
   
   credential.find().then(function(data){
    console.log("MongoDB data:", data);
   const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user:data[0].toJSON().user,
        pass:data[0].toJSON().pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
})
new Promise(async function(resolve,reject){
       try{
    for(var i=0;i<emailList.length;i++){
     await transporter.sendMail(
    {
        from:"vinayagapperumalrishi@gmail.com",
        to:emailList[i],
        subject:"A message from Bulk Mail App",
        text:msg
    })
    console.log("Email sent to:"+emailList[i]

    )}
    resolve("Success")
    }  
    catch(error)
    {   console.log(error)
        reject("Failed")
    }

}).then(function(){
    res.send(true)
}).catch(function(){
    res.send(false)
})


}).catch(function(error){
  console.log(error)
  res.send(false)
})
    console.log(msg)


})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Started on ${PORT}`);
});