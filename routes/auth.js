const router = require("express").Router();
const { response } = require("express");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

// const joi = require("@hapi/joi");
// const Joi = require("@hapi/joi");


router.post("/register", async(req, res) => {
    
    // Let validate Data before we a user
     const {error} = registerValidation(req.body);
    // res.send(error.details[0].message);
    if(error) return res.status(400).send(error.details[0].message)

    // Checking if the Email the email already exist
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(500).send("Email already exist");

    //Hash the password
    const salt =await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    
    const users = new User ({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword,
    })
   
    user = await users.save();

    if (!users){
        res.status(500).send({error: "Error detected"})
    }
    else{
        res.status(200).send({user : user._id})
    }

});

router.post("/login", async(req, res) =>{

    // Let validate Data before we a user
    const {error} = loginValidation(req.body);
    // res.send(error.details[0].message);
    if(error) return res.status(400).send(error.details[0].message)

    // Checking if the Email the email already exist
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(500).send("Email does not exist");

    const valPass = await bcrypt.compare(req.body.password, user.password)
    if(!valPass) return res.status(400).send("Invalid Password");

    // create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.SECRETE_TOKEN);
    res.header('auth-token', token).send(token);

    // return res.status(200).send("Logged in Successfully!")
})
module.exports = router; 