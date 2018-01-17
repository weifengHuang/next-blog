import React from 'react'
import io from 'socket.io-client'
import DialogList from './Dialog-List'
import DialogContent from './Dialog-Content'
import DialogMenu from './Dialog-Menu'
import { imUrl } from 'config/index.js'
import { Modal, Button, Input } from 'antd'
import antdCss from 'antd/dist/antd.css'
// const socket = ioClient('http://127.0.0.1:3001')

export default class DialogIndex extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLogin: true,
      inputValue: '',
      loginName: '',
      user: {},
      chatRecords: [
        // {
        //   type: 'input',
        //   owner: 'mine',
        //   content: '131231231',
        //   time: new Date()
        // },
        // {
        //   type: 'input',
        //   owner: 'other',
        //   content: '别人的',
        //   time: new Date()
        // }
      ],
      userList: [],
      chatUser: {}
    }
  }
  componentDidMount () {
    this.socket = io(imUrl)
    this.socket.emit('login', '', (user) => {
      console.log('login 服务器返回user', user)
      this.setState({
        user: user
      })
    })
    this.socket.on('chat message', (msg) => {
      setTimeout(() => {
        let message = {
          type: 'text',
          owner: 'other',
          content: msg,
          time: new Date()
        }
        this.pushToChatRecores(message)
      }, 1000)
      console.log('接受到服务器返回')
    })
    this.socket.on('broadcast', (msg) => {
      console.log(`广播发出的消息${msg}`)
      // this.pushToChatRecores(msg)
    })

    this.socket.on('getLoginList', (loginUserList) => {
      let exceptUserList =  loginUserList.filter( e => e.socketId !== this.state.user.socketId)
      this.setState({
        userList: exceptUserList
      })
    })
    // this.socket.on('message', this.handleMessage)
  }
  // close socket connection
  componentWillUnmount () {
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
    let message = {
      type: 'input',
      owner: 'mine',
      content: this.state.inputValue,
      time: new Date()
    }
    this.pushToChatRecores(message)
    this.setState({
      inputValue: ''
    })
    this.socket.emit('chat message', {
      to: this.state.chatUser.socketId,
      msg: this.state.inputValue
    })
  }
  inputOnchange (event) {
    this.setState({
      inputValue: event.target.value
    })
  }
  inputChangeLoginName (event) {
    this.setState({
      loginName: event.target.value
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
  handleOk (e) {
    console.log(e)
    this.setState({
      visible: false,
    })
  }
  handleCancel (e) {
    console.log(e)
    this.setState({
      visible: false,
    })
  }
  // static async getInitialProps({ req }) {
  //   const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
  //   return { userAgent }
  // }
  render () {
    let dialogContent = null
    if (this.state.chatUser.name) {
      dialogContent =
      <div id='selectedUser'>
        <div id='top'>
          <Button type="primary">123</Button>
          <div id='chat-user'>
            {this.state.chatUser.name || '无对话人'}
          </div>
          <DialogContent chatRecords={this.state.chatRecords} />
        </div>
        <div id='bottom'>
          <input type='text' value={this.state.inputValue} onChange={e => this.inputOnchange(e)} onKeyPress={e => this.handleKeyPress(e)} />
          <button className='send-button' onClick={e => this.handleClick(e)} >发送</button>
        </div>
        <style jsx>{`
          #selectedUser {
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
        `}
        </style>
      </div>
    } else {
      dialogContent =
      <div id='noneSelect'>
        无对话记录
        <style jsx>{`
          #noneSelect {
            flex:1;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          `
        }</style>
      </div>
    }
    return (
      <div id='dialog'>
        <Modal
          visible={this.state.isLogin}
          title="Title"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>Return</Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
            Submit
            </Button>,
          ]}>
          <Input type="text" placeholder="Basic usage" value={this.state.loginName} onChange={e => this.inputChangeLoginName(e)}/>
        </Modal>
        <div id='dialog-left'>
          <DialogMenu id='dialog-menu' {...this.state.user} />
          <DialogList id='dialog-list' userList={this.state.userList} selectUserChat={user => this.selectUserChat(user)} />
        </div>
        <div id='dialog-body'>
          {dialogContent}
        </div>
        <style jsx>{`
        ${antdCss}
        #dialog {
          border: 1px solid #cebdbd;
          margin: 15px;
          height: 500px;
          width: 900px;
          display: flex;
          flex-wrap: wrap;
          #dialog-left {
            width: 250px;
            border: 1px solid gray;
            display: flex;
          }
          #dialog-body {
            display: flex;
            flex: 1;
          }
        }
        `
        }
        </style>
      </div>
    )
  }
}
