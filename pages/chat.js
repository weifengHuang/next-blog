import React from 'react'
import DialogLayout from '../components/dialog/index'

export default class Chat extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }
  render () {
    return (
      <div id='chat'>
        <h1>群聊室</h1>
        <DialogLayout/>
        <style jsx>{`
          #chat {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 20px;
          }
          `}</style>
      </div>
    )
  }
}
