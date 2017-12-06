import Link from 'next/link'
import Router from 'next/router'
const ReactMarkdown = require('react-markdown')
import input from '../md/ci.md'
// import header from '/styles/header.scss'
export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }
  componentWillMount() {
    // fetch(readmePath)
    //   .then(response => {
    //     return response.text()
    //   })
    //   .then(text => {
    //     this.setState({
    //       markdown: text
    //     })
    //   })
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
      <ReactMarkdown source={input} />,
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
