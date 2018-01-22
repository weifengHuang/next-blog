import Sider from './Sider'
import Content from './Content'
import React from 'react'

export default class Layout extends React.Component {
  render () {
    return (
      <div id='layout'>
        <Sider id='siderBar'/>
        <Content id='content'>
          {this.props.children}
        </Content>
        <style jsx global>{
          `
          html, body, body>div:first-child, #__next, #__next>div:first-child {
            height: 100%;
            width: 100%;
            margin: 0;
          }
          div {
            box-sizing: border-box;
          }
          #layout {
            display: flex;
            width: 100%;
            height: 100%;
            #siderBar {
              width: 240px;
              background-color:#212121
            }
          }
          `
        }
        </style>
      </div>
    )
  }
}
