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
        <div id="person-description">
          <span id="name">Breeze</span>
          <span>会点前端，会点后端</span>
        </div>
        <div id="navigator">
          <span>Index</span>
          <span onClick={() => Router.push('/post')}>Post</span>
          <span onClick={e => this.handleClick('chat', e)}>chatRoom</span>
        </div>
        <div id="contact">
        </div>
        {
          //<button onClick={e => this.handleClick(e)}>点击成功</button>
        }
        <style jsx>{
          `
        #Sider {
          font-family: Taviraj,"Palatino Linotype","Book Antiqua",Palatino,serif;
          display: flex;
          flex-direction: column;
          color: #fff;
          width: 240px;
          padding: 32px;
          background-color:#212121;
          align-items: center;
          justify-content: center;
          #person-description {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 17px;
            margin-bottom: 30px;
            #name {
              margin-bottom: 15px
            }
          }
          #navigator {
            width: 100%;
            border-top: 1px solid #fff;
            border-bottom: 1px solid #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 25px 0;
            span {
              // width: 40px;
              padding: 20px;
              cursor: pointer;
              border: 1px solid transparent;
            }
            // span:hover {
            //   border: 1px solid #fff
            // }
          }
        }
        `
        }
        </style>
      </div>
    )
  }
}
