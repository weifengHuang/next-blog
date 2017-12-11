
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var count = 0
var loginUserList = []
io.on('connection', (socket) => {
  console.log('a user connected')
  // socket.on('disconnect', () => {
  //   console.log('user disconnected')
  // })
  socket.on('chat message', (data) => {
    console.log('收到消息', data)
    io.to(data.to).emit('chat message', data.msg)
  })
  socket.on('login', (data, fn) => {
    console.log('触发login事件', count, socket.id)
    let user = {
      id: count++,
      name: `user${count}`,
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

http.listen(3001, function(){
  console.log('listening on *:3001')
})
