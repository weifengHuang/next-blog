import Link from 'next/link'
import Router from 'next/router'
import Head from 'next/head'
const ReactMarkdown = require('react-markdown')
import content from '../md/ci.md'
import markdownCss from 'github-markdown-css/github-markdown.css'
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
      <div>
        <ReactMarkdown
        source={content}
        className={'markdown-body'}
        />
        <style global jsx>
				    {markdownCss}
			  </style>
      </div>
    )
  }
}
