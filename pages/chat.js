import React from 'react'
import DialogLayout from '../components/dialog/index'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }
  render() {
    return (
      <div>
        <DialogLayout/>
      </div>
    )
  }
}
