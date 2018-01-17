// import Link from 'next/link'
import React from 'react'
import Router from 'next/router'
// import header from '/styles/header.scss'
export default class Sider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }
  handleClick (router) {
    Router.push(`/${router}`)
    console.log('点击成功')
  }
  render () {
    return (
      <div id='Sider'>
        <span>Index</span>
        <span onClick={() => Router.push('/post')}>Post</span>
        <span onClick={e => this.handleClick('chat', e)}>chatRoom</span>
        {
          //<button onClick={e => this.handleClick(e)}>点击成功</button>
        }
        <style jsx>{
          `
        #Sider {
          display: flex;
          flex-direction: column;
          color: #fff;
          width: 240px;
          background-color:#212121;
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
