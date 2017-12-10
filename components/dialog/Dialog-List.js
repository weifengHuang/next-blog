
export default class extends React.Component {
  constructor(props) {
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
        {this.props.userList.map(user => <div className="user" onClick={e => this.clickUser(e, user)} key={user.id}>{user.name}</div>)}
        <style jsx> {`
          #dialogList {
            .user {
              cursor: pointer;
              margin: 5px;
              &:hover {
                background-color: #eee;
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
