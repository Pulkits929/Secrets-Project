const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption");

const urlencoded = require("body-parser/lib/types/urlencoded");
var app = express();
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/Secrets" , {
    useNewUrlParser : true
});
const trySchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
})

const secret = "thisislittlesecret.";
trySchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const item = mongoose.model("Second",trySchema)

app.get("/",(req,res)=>{
    res.render("home.ejs");
})
app.get("/login",(req,res)=>{
    res.render("login.ejs");
})
app.get("/register",(req,res)=>{
    res.render("register.ejs");
})
app.post("/register",(req,res)=>{
    const newUser = new item({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    newUser.save().then(()=>{
        res.render("home.ejs");
        console.log("user registered successfull!");
    }).catch(err =>{
        console.log(err);
    })

})

app.post("/login",(req,res)=>{
    
    const email = req.body.email;
    const password = req.body.password;

    item.findOne({email: email}).then(data=>{
        if(data){
            if(data.password === password){
                res.render("secrets.ejs")
            }       
        }
    }).catch(err =>{
        console.log(err);
    })
})
app.get("/s",(req,res)=>{
    res.render("submit.ejs");
})

app.listen("3000",function(){
    console.log("Server started on port 3000");
})
