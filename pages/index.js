import React from 'react'
import Layout from '../components/layout'

export default class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }
  static getInitialProps ({ req }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    return { userAgent }
  }
  render () {
    return (
      <div>
        <Layout/>
      </div>
    )
  }
}
