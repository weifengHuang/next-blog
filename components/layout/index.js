import Sider from './Sider'
import Content from './Content'
import React from 'react'


export default class Layout extends React.Component {
  render () {
    return (
      <div id='layout'>
        <Sider id='siderBar'/>
        <Content id='content'></Content>
        <style jsx>{
          `
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
