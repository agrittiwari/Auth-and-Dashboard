const express = require('express')
const router = express.Router()
const User =require('../Schema/User')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


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
        console.log(password)
        //saving it into database
        await user.save();

        //generating jwt for authentication
// const payload ={
//     user: {
//         id: user._id
//     }
// }

        //generating jwt for nodemail verify email



        
        res.json(user)
    } catch (err) {
        console.error(err.message)
    }
})


module.exports = router;