const mongoose = require('mongoose')
const crypto = require('crypto')
let {log4js} = require('../utils')
let logger = log4js.getLogger('User')
const Schema = mongoose.Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  socketId: String,
  onlineStatus: {
    type: Number,
    required: true,
    // 0不在线，1在线
    default: 0
  },
  password: {
    type: String,
    required: true
  }
})
//
userSchema.statics.saltPassword = (password, salt = 'test') => {
  function _sha1 (s) {
    const algorithm = 'sha1'
    const hash = crypto.createHash(algorithm)
    hash.update(s)
    const h = hash.digest('hex')
    return h
  }
  const hash1 = _sha1(password)
  const hash2 = _sha1(hash1 + salt)
  return hash2
}
userSchema.statics.register = async (name, password) => {
  try {
    let encrypted = User.saltPassword(password)
    if (!name || !password) {
      return {code: 1, message: 'name or password not null'}
    }
    try {
      let user = await User.create({
        name: name,
        onlineStatus: 0,
        password: encrypted
      })
      logger.debug('user', user)
      if (user) {
        return {code: 0, message: 'success'}
      }
    } catch (e) {
      logger.error('User.create', e)
      return {code: 1, message: e}
    }
  } catch (e) {
    logger.error('User.register', e)
    return {code: 1, message: e}
  }
}
userSchema.statics.getOnlineUsers = async function () {
  try {
    let users = await User.find({onlineStatus: 1})
    return users
  } catch (e) {
    return null
  }
}
userSchema.methods.validateAuth = function (form) {
  // 这里绑定箭头函数则拿不到调用的user实例, 用function，this指向调用者，及user实例
  try {
    const { name, password } = form
    const saltedPassword = User.saltPassword(password)
    console.log('saltedPassword', saltedPassword)
    console.log('this', this)
    const usernameEquals = this.name === name
    const passwordEquals = this.password === saltedPassword
    if (!passwordEquals) {
      return {code: 1, message: 'passwordError'}
    }
    if (usernameEquals && passwordEquals) {
      return {code: 0, message: 'success'}
    }
  } catch (e) {
    logger.error('validateAuth error', e)
    return {code: 1, message: e}
  }
}
const User = mongoose.model('User', userSchema)

// User.methods.
module.exports = User
