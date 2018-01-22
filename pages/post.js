import React from 'react'
const ReactMarkdown = require('react-markdown')
import content from '../md/ci.md'
import Layout from '../components/layout'
import markdownCss from 'github-markdown-css/github-markdown.css'
export default class Page extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }
  render () {
    return (
      <div id='post'>
        <Layout>
          <ReactMarkdown
            source={content}
            className={'markdown-body'}
          />
        </Layout>
        <style global jsx>{`
          ${markdownCss}
          #post {
            height: 100%;
          }
          `
        }</style>
      </div>
    )
  }
}
