const express = require('express')
const next = require('next')
const app = express()
const bodyParser = require('body-parser')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandle = nextApp.getRequestHandler()
const {config} = require('./config')
const { apiUrl } = config
const port = apiUrl.split(':')[2]
const { User } = require('./model')
const {log4js} = require('./utils')
const { SocketHandle } = require('./socket')
const logger = log4js.getLogger('server')
var count = 0
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
  socket.on('login', async (data, fn) => {
    let { name } = data
    console.log('触发login事件', count, socket.id)
    // 在线列表
    let updateUser = await SocketHandle.updateUserSockeId(name, socket.id)
    if (updateUser) {
      fn({name: updateUser.name, socketId: updateUser.socketId})
    }
    let loginList = await User.getOnlineUsers()
    console.log('loginList', loginList)
    socket.broadcast.emit('broadcast', `广播消息${name}上线了`)
    io.emit('getLoginList', loginList)
  })
  socket.on('disconnect', async () => {
    console.log('用户下线了')
    // todo 处理刷新时候的逻辑，刷新下线再上线
    await SocketHandle.disconnect(socket.id)
    // io.emit('disconnect', loginUserList)
  })
})

nextApp.prepare()
  .then(() => {
    // mongodb connection
    require('./model/connect.js')
    // api server
    app.use(bodyParser.urlencoded({ extended: false }))
    // Parse application/json
    app.use(bodyParser.json())
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    })
    app.post('/api/login', async (req, res) => {
      let {name, password} = req.body
      if (name) {
        name = name.trim()
      }
      let user = await User.findOne({name: name})
      if (user) {
        // 验证密码
        let validateRes = user.validateAuth({name, password})
        return res.json(validateRes)
      } else {
        // 直接注册一个
        let registerRes = await User.register(name, password)
        return res.json(registerRes)
      }
    })
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
      console.log(`> Ready on ${apiUrl}`)
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
