// const Redis = require('ioredis')
// const redis = new Redis()
const User = require('../model/user.js')
let {log4js} = require('../utils')
let logger = log4js.getLogger('SocketHandle')
const SocketHandle = class SocketHandle {
  constructor () {
  }
  static async saveUserSocketId (params) {
    try {
      let {name, socketId, password} = params
      let encrypted = User.saltPassword(password)
      if (!name || !password) {
        return {code: 1, message: 'name or password not null'}
      }
      let createdUser = await User.create({
        name: name,
        socketId: socketId,
        onlineStatus: 0,
        password: encrypted
      })
      return createdUser
    } catch (e) {
      console.error('e', e)
      return false
    }
    // redis.hset('userList', userName, socketId)
  }
  static async updateUserSockeId (name, socketId) {
    try {
      let user = await User.findOneAndUpdate({name: name}, {socketId: socketId, onlineStatus: 1})
      logger.debug('user', user)
      return user
    } catch (e) {
      logger.error('updateUserSockeId', e)
      return false
    }
  }
  static async disconnect (socketId) {
    try {
      let user = await User.findOneAndUpdate({socketId: socketId}, {onlineStatus: 0})
      logger.debug('user', `${user}下线`)
      return user
    } catch (e) {
      logger.error('updateUserSockeId', e)
      return false
    }
  }
  static async getUserSocketId (name) {
    try {
      let user = await User.findOne({name: name})
      if (user) {
        return user.socketId
      } else {
        return null
      }
    } catch (e) {
      return false
    }
    // await redis.hget('userList', userName, userName)
  }
}
module.exports = {
  SocketHandle
}
