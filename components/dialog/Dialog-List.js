import React from 'react'
export default class Dialoglist extends React.Component {
  constructor (props) {
    super(props)
    console.log('props', this.props)
    this.state = {
    }
  }
  clickUser (e, user) {
    console.log('user', user)
    this.props.selectUserChat(user)
  }
  render () {
    return (
      <div id="dialogList">
        {this.props.userList.map(user => {
          return <div className="user" onClick={e => this.clickUser(e, user)} key={user.id}>
            <div className="user-name">{user.name}</div>
            {
              user.chatRecords.length > 0 &&
              <div>
                <div className="last-record">{user.chatRecords[user.chatRecords.length - 1].content}</div>
              </div>
            }
          </div>})
        }
        <style jsx> {`
          #dialogList {
            overflow: auto;
            height: 100%;
            flex: 1;
            .user {
              cursor: pointer;
              margin: 5px;
              &:hover {
                background-color: #eee;
              }
              .user-name {
                font-size: 17px;
                color: black;
              }
              .last-record {
                font-size: 12px;
                color: #9e9e9e;
              }
            }
          }
          `
        }
        </style>
      </div>
    )
  }
}
