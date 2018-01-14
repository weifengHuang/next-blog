import React from 'react'
const ReactMarkdown = require('react-markdown')
import content from '../md/ci.md'
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
      <div>
        <ReactMarkdown
          source={content}
          className={'markdown-body'}
        />
        <style global jsx>{markdownCss}</style>
      </div>
    )
  }
}
