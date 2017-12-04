import React from 'react'
import Header from '../components/Header'
import Layout from '../components/Layout'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    return { userAgent }
  }
  render() {
    return (
      <div>
        <Layout/>
      </div>
    )
  }
}
