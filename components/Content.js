import Link from 'next/link'
import Router from 'next/router'
const ReactMarkdown = require('react-markdown')
import ioClient from 'socket.io-client'
// import input from '../md/ci.md'
// import 'github-markdown-css/github-markdown.css'
// import header from '/styles/header.scss'
export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      socket: ioClient('http://127.0.0.1:3001')
    }
    this.init()
  }
  init () {
    this.state.socket.on('chat message', function(msg){
      console.log('接受到服务器返回')
    });
    this.state.socket.on('hi', function(msg){
      console.log('接受到服务器返回hi')
    });
  }
  componentWillMount() {
    // this.setState({
    //   socket: ioClient('http://127.0.0.1:3001')
    // })
    // this.state.socket.on('chat message', function(msg){
    //   console.log('接受到服务器返回')
    // });
  }
  handleClick () {
    console.log('发送', this.state.socket)
    this.state.socket.emit('chat message', '123');
    // socket.emit
  }
  // static async getInitialProps({ req }) {
  //   const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
  //   return { userAgent }
  // }
  render() {
    return (
      <div id='content'>
       <div id="id">content</div>
       <button onClick={e => this.handleClick(e)} >发送</button>
        <style jsx>{`
          #content {
            color: black;
          }
          `
        }
        </style>
      </div>
    )
  }
}
