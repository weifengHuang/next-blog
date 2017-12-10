
export default class extends React.Component {
  constructor(props) {
    super(props)
    console.log('props', this.props)
    this.state = {
    }
  }
  render () {
    return (
      <div id="dialogList">
        {this.props.userList.map(user => <div>{user.name}</div>)}
      </div>
    )
  }
}
