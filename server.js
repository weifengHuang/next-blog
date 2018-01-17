const express = require('express')
const next = require('next')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const server = require('http').Server(app)
var io = require('socket.io')(server)

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandle = nextApp.getRequestHandler()
const {config} = require('./config')
const { apiUrl } = config
const port = apiUrl.split(':')[2]
var count = 0
var loginUserList = []
io.on('connection', (socket) => {
  console.log('a user connected')
  // socket.on('disconnect', () => {
  //   console.log('user disconnected')
  // })
  socket.join('group')
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

nextApp.prepare()
.then(() => {
  // api server
  app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/json
  app.use(bodyParser.json())
  app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*')
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
		next()
	})
  app.get('/api/login', (req, res) => {
    return res.json({code: 0})
  })
  // mongodb connection
  require('./model')
  // Next request
  app.get('/p/:id', (req, res) => {
    const actualPage = '/post'
    const queryParams = { id: req.params.id }
    app.render(req, res, actualPage, queryParams)
  })
  app.get('*', (req, res) => {
    return nextHandle(req, res)
  })
  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on ${apiUrl}` )
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
