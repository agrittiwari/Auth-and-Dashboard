const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true        
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: email,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    password2: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("User", UserSchema)