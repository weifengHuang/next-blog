const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  name:  String,
  socketId: String
})
const User = mongoose.model('User', userSchema)

modulex.exports = User
