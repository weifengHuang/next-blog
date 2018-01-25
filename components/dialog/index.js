import React from 'react'
import Router from 'next/router'
import io from 'socket.io-client'
import fetch from 'isomorphic-unfetch'
import DialogList from './Dialog-List'
import DialogContent from './Dialog-Content'
import DialogMenu from './Dialog-Menu'
import { imUrl, apiUrl } from 'config/index.js'
import { Modal, Button, Input, Form, message } from 'antd'
const FormItem = Form.Item
import antdCss from 'antd/dist/antd.css'
const CollectionCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props
    const { getFieldDecorator } = form
    return (
      <Modal
        visible={visible}
        title='用户登录'
        okText='登录'
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout='vertical'>
          <FormItem label='用户名'>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入用户名' }]
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label='密码'>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }]
            })(<Input type='text' />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
)

export default class DialogIndex extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      form: null,
      isShowLoginModal: true,
      inputValue: '',
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
      chatUser: {},
      userName: ''
    }
  }
  initSocket () {
    this.socket = io(imUrl)
    this.socket.emit('login', {name: this.state.userName}, (user) => {
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
      let exceptUserList = loginUserList.filter(e => e.name !== this.state.user.name)
      this.setState({
        userList: exceptUserList
      })
    })
  }
  componentDidMount () {
  }
  // close socket connection
  componentWillUnmount () {
    // this.socket.close()
  }
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
  sendMessage () {
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
      this.sendMessage()
    }
  }
  closeLoginDialog () {
    // 点击取消，调回首页
    Router.push('/')
  }
  saveFormRef (form) {
    this.form = form
  }
  async handleLogin () {
    const form = this.form
    form.validateFields(async (err, values) => {
      if (err) {
        return
      }
      console.log('Received values of form: ', values)
      let loginRes = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      if (loginRes.ok) {
        let res = await loginRes.json()
        console.log('res', res)
        if (res.code === 0 ) {
          message.success('登录成功')
          this.setState({
            userName: values.name
          })
          form.resetFields()
          this.setState({ isShowLoginModal: false })
          this.initSocket()
        } else if (res.code === 1 && res.message === 'passwordError'){
          message.error('密码错误')
        }
      }
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
            <div id='chat-user'>
              {this.state.chatUser.name || '无对话人'}
            </div>
            <DialogContent chatRecords={this.state.chatRecords} />
          </div>
          <div id='bottom'>
            <Input type='text' value={this.state.inputValue} onChange={e => this.inputOnchange(e)} onKeyPress={e => this.handleKeyPress(e)} />
            <Button className='send-button' onClick={e => this.sendMessage(e)} >发送</Button>
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
          <style jsx>
            {`
              #noneSelect {
                flex:1;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              `
            }
          </style>
        </div>
    }
    return (
      <div id='dialog'>
        <CollectionCreateForm
          ref={(form) => this.saveFormRef(form)}
          visible={this.state.isShowLoginModal}
          onCancel={this.closeLoginDialog}
          onCreate={(e) => this.handleLogin(e)}
        />
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
