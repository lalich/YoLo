const mongoose = require('./connections')

const { Schema, model} = mongoose

const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: { type: String, requireed: true, },
})

const User = model('user', userSchema)

module.exports = User