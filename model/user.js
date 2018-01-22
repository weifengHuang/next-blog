const mongoose = require('mongoose')
let {log4js} = require('../utils')
let logger = log4js.getLogger('test')
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
const User = mongoose.model('User', userSchema)
//
userSchema.statics.saltedPassword = (password, salt = 'test') => {
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
    return {code: 1, message: e}
  }
}
userSchema.methods.validateAuth = async (form) => {
  try {
    const { name, password } = form
    const saltedPassword = User.saltedPassword(password)
    const usernameEquals = this.name === name
    const passwordEquals = this.password === saltedPassword
    if (!passwordEquals) {
      return {code: 1, message: 'passwordError'}
    }
    if (usernameEquals && passwordEquals) {
      return {code: 0, message: 'success'}
    }
  } catch (e) {
    logger.error('e', e)
    return {code: 1, message: e}
  }
}
// User.methods.
module.exports = User
