//Requirements
const mongoose = require('mongoose')
const Schema = mongoose.Schema


//User Schema
let userSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    age: {
        type: Number,
        min: 18,
    },
    email: {
        type: String,
        required: true,
    },
},{ collection : 'Users' })


//User Model
let userModel = mongoose.model('userModel', userSchema)


//Export model
module.exports = userModel