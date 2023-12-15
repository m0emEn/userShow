//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const port=process.env.PORT ||3000;


const app=express();
let msg;;
let userEmail;
let userPsw;
let user;
mongoose.connect("mongodb+srv://moemen:0000azert@cluster0.87dhght.mongodb.net/?retryWrites=true&w=majority" )
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    psw:String,
    info:String
});
const User=mongoose.model("User",userSchema);
app.get("/upload",function(req,res){
    res.render("upload");
})
app.post("/upload",function(req,res){
    res.redirect("/upload");
})
app.get("/login",function(req,res){
    res.render("login",{textMsg:msg})
    msg=""
})
app.get("/sign-up",function(req,res){
    res.render("signup",{textMsg:msg});
    msg=""
})
app.get("/",async function(req,res){
    let users=await User.find({});
    
    
    res.render("index",{users:users});
})
app.get("/user",function(req,res){
    res.render("user",{userName:user[0].name});
})
app.post("/login",async function(req,res){
     userEmail=req.body.email;
     userPsw=req.body.psw;
     user=await User.find({email:userEmail});

    if(user.length==0){
        msg="User Not Found";
        res.redirect("/login");
    }
    else if(user[0].psw!=userPsw){
        msg="Incorrect password";
        res.redirect("/login");
    }
    else{
        msg="Login successful";
        res.redirect("/user");
        msg=""
        
    }
    
    
})
app.post("/sign-up",async function(req,res){
    let userEmail=req.body.email;
    let userName=req.body.name;
    let userPsw=req.body.psw;
    let findUser=await User.find({email:userEmail});
    if(findUser.length==0){
        const newUser=await User.create({
            name:req.body.name,
            email:userEmail,
            psw:userPsw,
            info:""
        })
        res.redirect("/login");

    }
    else{
        msg="This Email is already in use.";
        res.redirect("/sign-up");
        
    }
    
    
})
app.post("/user",async function(req,res){
    let info=req.body.info;
    let newName=req.body.name;
    await User.updateOne({email:userEmail},{name:newName,info:info})
    res.redirect("/")
})

app.listen(port, function() {
    console.log(`Server started on port ${port}`);
  });
