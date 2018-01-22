import React from 'react'
export default class layoutContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }
  // static async getInitialProps({ req }) {
  //   const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
  //   return { userAgent }
  // }
  render () {
    return (
      <div id='content'>
        {this.props.children}
        <style jsx>{`
          #content {
            color: black;
            overflow: auto;
            padding-left: 30px;
          }
          `
        }
        </style>
      </div>
    )
  }
}
