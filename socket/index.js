var Redis = require('ioredis')
var redis = new Redis()
const SocketHandle = class SocketHandle {
  constructor() {
  }
  static saveUserSocketId(socketId, userName) {
    redis.hset('userList', user, socketId)
    console.log('执行结束')
  }
  static async getUserSocketId(socketId, userName) {
    await redis.hget('userList', user, userName)
  }
}
module.exports = SocketHandle
