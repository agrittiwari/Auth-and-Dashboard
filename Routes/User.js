const express = require('express')
const router = express.Router()
const User =require('../Schema/User')
const {check, validateResult}= require('express-validator')


//Register User
router.post('/', async (req, res) =>
{
    const {firstName, lastName, username, email, password}= req.body

    try {
        let user = await User.findOne({email}) 
                if (user) {
             res.status(400).json({msg :"User Already exist"})
        }
        let usernameCheck = await User.findOne({ username })

        if (usernameCheck) {
            res.status(400).json({msg :"username already taken"})
        }
    
      
        if (!user || !usernameCheck) {
            user = new User({
                firstName,
                lastName,
                username,
                email,
                password,

            })
        }
        
        await user.save();
        res.json(user)
    } catch (err) {
        console.error(err.message)
    }
})


module.exports = router;