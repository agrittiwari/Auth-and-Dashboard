const express = require('express')
const router = express.Router()
const User =require('../Schema/User')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')


//Register User
router.post('/', [
    check("firstName", " First Name is required").notEmpty().isLength({ min: 5}),
    check("lastName", " Last Name is required").notEmpty(),
    check("username", " Username is required. It must be unique").notEmpty(),
    check("email" ," Email is required").isEmail(),
    check("password", " Password is required").notEmpty(),
    check("password2", " Confirm password is required. It should be same as password").notEmpty()

], async (req, res) =>
{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({errors :errors.array()})
    }
    const { firstName, lastName, username, email, password, password2} = req.body



    try {


        let user = await User.findOne({email}) 
         if (user) {
             res.status(400).json({msg :"User Already exist"})
                }


     
       let usernameCheck = await User.findOne({ username })


        
        
        if (usernameCheck) {
            res.status(400).json({msg :"username already taken"})
        }
        if (password !== password2) {
          res.status(400).json({msg:"Password do not match"})
      }
    
        if ((!user && !usernameCheck ) && password === password2  ) {
            user = new User({
                firstName,
                lastName,
                username,
                email,
                password,
                password2

            })
        }

        //hashing the password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        user.password2 = await bcrypt.hash(password2, salt)
      
        //saving it into database
        await user.save();

        //generating jwt for authentication
const payload ={
    user: {
        id: user._id
    }
        }
        
        jwt.sign(payload, config.get("jwtsecret1"), {
            expiresIn: 360000,
        }, (err, token1) =>
        {
            if (err) throw err;
            res.json({token1})
        })

        //generating jwt for nodemail verify email


        jwt.sign(payload, config.get("jwtsecret2"), {
            expiresIn: 360000,
        }, (err, token2) =>
        {
            if (err) throw err;
            res.json({token2})
        })

        
        
    } catch (err) {
        console.error(err.message)
    }
})


module.exports = router;