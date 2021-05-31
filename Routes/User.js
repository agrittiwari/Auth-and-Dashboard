const express = require('express')
const router = express.Router()
const User =require('../Schema/User')
const {check, validationResult}= require('express-validator')


//Register User
router.post('/', [
    check("firstName", " First Name is required").notEmpty(),
    check("lastName", " Last Name is required").notEmpty(),
    check("username", " Username is required. It must be unique").notEmpty(),
    check("email" ," Email is required").isEmail(),
    check("password", " Password is required"),
    check("passwordConfirmation" ," Confirm password is required. It should be same as password").custom((value, {req}) => { value === req.body.password })


], async (req, res) =>
{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({errors :errors.array()})
    }
    const { firstName, lastName, username, email, password, passwordConfirmation } = req.body

    try {
        let user = await User.findOne({email}) 
                if (user) {
             res.status(400).json({msg :"User Already exist"})
        }
        let usernameCheck = await User.findOne({ username })

        if (usernameCheck) {
            res.status(400).json({msg :"username already taken"})
        }
    
        if ((!user || !username  )&& password != passwordConfirmation  ) {
            user = new User({
                firstName,
                lastName,
                username,
                email,
                password,
                passwordConfirmation

            })
        }
        
        await user.save();
        res.json(user)
    } catch (err) {
        console.error(err.message)
    }
})


module.exports = router;