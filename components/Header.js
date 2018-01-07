import Link from 'next/link'
import Router from 'next/router'
// import header from '/styles/header.scss'
export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }
  handleClick (router) {
    Router.push(`/${router}`)
    console.log('点击成功')
  }
  // static async getInitialProps({ req }) {
  //   const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
  //   return { userAgent }
  // }
  render() {
    return (
      <div id='header'>
        <span>导航</span>
        <span onClick={e => Router.push('/post')}>文章</span>
        <span onClick={e => this.handleClick('chat', e)}>聊天室</span>
        {
          //<button onClick={e => this.handleClick(e)}>点击成功</button>
        }
        <style jsx>{
        `
        #header {
          span {
            margin: 10px;
            cursor: pointer
          }
        }
        `
        }
        </style>
      </div>
    )
  }
}
