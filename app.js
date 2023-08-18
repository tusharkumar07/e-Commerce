//jshint esversion:6
const express = require("express");
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const findOrCreate = require('mongoose-findorcreate')
const nodemailer = require("nodemailer");

function sendMail(emailAdd){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "username",
          pass: "password"
        }
      });
      
      var mailOptions = {
        from: 'tusharkumar0510@gmail.com',
        to: emailAdd,
        subject: 'Verification email for Deals4U',
        text: 'You have successfully logged in to your Deals4U account'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  }

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: "ourLittleSecret",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
    }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB")

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    phno: String
})
 
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate)

const User = new mongoose.model("User", userSchema)

passport.use(User.createStrategy());

passport.serializeUser(function(user, done){
    done(null, user.id)
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

app.get("/", function(req,res){
    res.render("register")
})

app.get('/base', function(req,res){
    res.render("base");
})

app.get("/admin", function(req,res){
    res.render("admin")
})

app.get("/login", function(req,res){
    res.render("login")
})

app.get("/register", function(req,res){
    res.render("register")
})

app.get("/men",(req,res)=>{
    res.render("men")
})

app.get("/women",(req,res)=>{
    res.render("women")
})

app.get("/kid",(req,res)=>{
    res.render("kid")
})

app.get("/sportswear",(req,res)=>{
    res.render("sportswear")
})

app.get("/footwear",(req,res)=>{
    res.render("footwear")
})

app.get("/access",(req,res)=>{
    res.render("access")
})

app.get("/electro",(req,res)=>{
    res.render("electro")
})

app.get("/profile",(req,res)=>{
    res.render("profile")
})

app.get("/account",(req,res)=>{
    res.render("account")
})

app.get("/bag",(req,res)=>{
    res.render("bag")
})

app.get("/whislist",(req,res)=>{
    res.render("whislist")
})


app.post("/register", function(req,res){  
    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        phno:req.body.phno,
        password:req.body.password
    });
    // sendMail(req.body.email)
    newUser.save().then(res.redirect('/base'));
})
app.post("/login", function(req, res){

    const username = req.body.username
    const password = req.body.password
    User.find({'username': username}, function(err,foundUser){
        if(foundUser[0]){
            if(foundUser[0].password == password){
                sendMail(foundUser[0].email)
                res.redirect('/base');
            }
            else{
                res.redirect('/login');
            }
        }
        else{
            res.redirect('/login');
        }
    })
})
app.listen(3000, function(){
    console.log("Server started at port 3000");
})