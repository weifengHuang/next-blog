export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  componentDidMount () {
    console.log('this menu', this.props)
  }
  render () {
    return (
      <div id='dialog-menu'>
        <div id="avatar">
          <img id='avatar' src='static/avatar.png' alt='' />
        </div>
        用户名
        {this.props.name}
        <style jsx>{`
          #dialog-menu {
            width: 50px;
            border-right: 1px solid gray;
            #avatar {
              display: flex;
              justify-content: center;
              img {
                margin-top: 5px;
                width: 40px;
                height: 40px;
              }
            }
          }
        `}
        </style>
      </div>
    )
  }
}
