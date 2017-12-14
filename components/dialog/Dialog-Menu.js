export default class extends React.Component {
  constructor(props) {
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
        用户名
        {this.props.name}
        <style jsx>{`
          #dialog-menu {
            width: 50px;
            border-right: 1px solid gray;
          }
        `}
        </style>
      </div>
    )
  }
}
