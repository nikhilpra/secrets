//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express()

/* console.log(process.env.SECRET) */

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser:true})

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

const secret = process.env.SECRET 

userSchema.plugin(encrypt,{secret:secret, encryptedFields: ["password"]})

const User = new mongoose.model('User', userSchema)

app.get("/", (req,res)=>{
    res.render('home')
})

app.get("/login", (req,res)=>{
    res.render('login')
})
 
app.post("/login",(req,res)=>{
    const userName = req.body.username
    const password = req.body.password
    User.findOne({email:userName}).then((foundUser)=>{
        if(foundUser){
            if(password === foundUser.password){

                res.render('secrets')
            }
        }
        
    })

    .catch((err)=>{
        console.log(err)
    })
})

app.get("/register", (req,res)=>{
    res.render('register')
})

app.post("/register",(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save().then(()=>res.render('secrets')).catch((err)=>console.log(err))
})

app.listen(3000,()=>console.log("Sever started at 3000"))