
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.broadcast.emit('broadcast')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
  socket.on('chat message', (data) => {
    console.log('收到消息', data)
    io.emit('chat message', data)
  })
})

http.listen(3001, function(){
  console.log('listening on *:3001')
})
