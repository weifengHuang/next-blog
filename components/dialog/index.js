import Link from 'next/link'
import Router from 'next/router'
import io from 'socket.io-client'
import DialogList from './Dialog-List'
// const socket = ioClient('http://127.0.0.1:3001')

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      user: '',
      chatRecords: [],
      userList: [],
      chatUser: {}
      // socket: io('http://127.0.0.1:3001')
    }
    // this.init() 错误示范！！！
  }
  init () {
    // this.socket = io('http://127.0.0.1:3001')
    // this.socket.emit('login', '', (user) => {
    //   console.log('login 服务器返回user', user)
    //   this.setState({
    //     user: user
    //   })
    // })
  }
  componentDidMount() {
    this.socket = io('http://127.0.0.1:3001')
    this.socket.emit('login', '', (user) => {
      console.log('login 服务器返回user', user)
      this.setState({
        user: user
      })
    })
    this.socket.on('chat message', (msg) => {
      setTimeout(() => {
        this.pushToChatRecores(msg)
      }, 1000)
      console.log('接受到服务器返回')
    })
    this.socket.on('broadcast', (msg) => {
      console.log(`广播发出的消息${msg}`)
      this.pushToChatRecores(msg)
    })

    this.socket.on('getLoginList', (loginUserList) => {
      this.setState({
        userList: loginUserList
      })
    })
    // this.socket.on('message', this.handleMessage)
  }
  // close socket connection
  componentWillUnmount() {
    this.socket.close()
  }
  // componentWillMount() {
  // }
  pushToChatRecores (input) {
    this.setState({
      chatRecords: [...this.state.chatRecords, input]
    })
  }
  pushToUserList (userList) {
    this.setState({
      userList: [...this.state.userList, userList]
    })
  }
  handleClick () {
    this.pushToChatRecores(this.state.inputValue)
    this.setState({
      inputValue: ''
    })
    this.socket.emit('chat message', {
      to: this.state.user.socketId,
      msg: this.state.inputValue
    })
  }
  inputOnchange (event) {
    this.setState({
      inputValue: event.target.value
    })
  }
  selectUserChat (user) {
    this.setState({
      chatUser: user
    })
  }
  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.handleClick()
    }
  }
  // static async getInitialProps({ req }) {
  //   const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
  //   return { userAgent }
  // }
  render() {
    return (
      <div id='dialog'>
        <div id="dialog-list">
        <DialogList userList={this.state.userList} selectUserChat = {user => this.selectUserChat(user)}/>
        </div>
        <div id="dialog-content">
          <div id="top">
            <div id="chat-user">
              {this.state.chatUser.name || '无对话人'}
              <span style={{'margin-left': '20px'}}>当前昵称：{this.state.user.name}</span>
            </div>
            <ul>{this.state.chatRecords.map(e => <li key={Math.random().toString()}>{e}</li>)}</ul>
          </div>
          <div id="bottom">
            <input type="text" value={this.state.inputValue} onChange={e => this.inputOnchange(e)} onKeyPress={e => this.handleKeyPress(e)} />
            <button className="send-button" onClick={e => this.handleClick(e)} >发送</button>
          </div>
        </div>
        <style jsx>{`
        #dialog {
          border: 1px solid #cebdbd;
          margin: 15px;
          height: 500px;
          width: 800px;
          display: flex;
          flex-wrap: wrap;
          #dialog-list {
            width: 200px;
            border: 1px solid gray;
          }
          #dialog-content {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            #top {
              flex-grow: 1;
              #chat-user {
                display: flex;
                justify-content: center;
                border: 1px solid #eee;
              }
            }
            #bottom {
              // height: 25px;
              display: flex;
              align-items: center;
              input {
                flex: 1;
                height: 25px;
                // border-radius: 2px;
                border: 1px solid #c5c0c0;
                &:focus{
                  outline: none;
                }
              }
              .send-button {
                background-color: #fff;
                border: 1px solid rgb(156, 205, 245);
                padding: 5px 20px;
                // border-radius: 6px;
                color: #2196F3;
              }
            }
          }
        }
        `
        }
        </style>
      </div>
    )
  }
}
