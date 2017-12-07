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
      date: new Date()
    }
  }
  componentWillMount() {
    var socket = ioClient('http://127.0.0.1'); // this happens after render
  }
  handleClick () {
  }
  // static async getInitialProps({ req }) {
  //   const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
  //   return { userAgent }
  // }
  render() {
    return (
      <div id='content'>
       <div id="id">content</div>
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
