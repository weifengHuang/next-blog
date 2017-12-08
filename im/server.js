
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

io.on('connection', (socket) => {
  console.log('a user connected')
  // socket.broadcast.emit('hi')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
  socket.on('chat message', () => {
    console.log('收到消息')
    io.emit('chat message', '123')
  })
})

http.listen(3001, function(){
  console.log('listening on *:3001')
})
