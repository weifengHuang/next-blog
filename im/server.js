
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var count = 0
var loginUserList = []
const {config} = require('../config')
const { imUrl } = config
const port = imUrl.split(':')[2]
io.on('connection', (socket) => {
  console.log('a user connected')
  // socket.on('disconnect', () => {
  //   console.log('user disconnected')
  // })
  // socket.join(socket.id)
  // socket.on('join', function (user) {
  //   socket.join(socket.id); // We are using room of socket io
  // });
  socket.on('chat message', (data) => {
    console.log('收到消息', data.to)
    io.to(data.to).emit('chat message', data.msg)
  })
  socket.on('login', (data, fn) => {
    console.log('触发login事件', count, socket.id)
    let name = `user${count}`
    let user = {
      id: count++,
      name: name,
      socketId: socket.id
    }
    loginUserList.push(user)
    fn(user)
    socket.broadcast.emit('broadcast', `广播消息${user.name}上线了`)
    io.emit('getLoginList', loginUserList)
  })
  socket.on('disconnect', (user) => {
    console.log('用户下线了')
    loginUserList = loginUserList.filter(e => {
      return e.socketId !== socket.id
    })
    // io.emit('disconnect', loginUserList)
  })
})

http.listen(port, function(){
  console.log(`listen ${imUrl}`)
})
