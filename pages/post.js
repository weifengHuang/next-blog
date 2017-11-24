import Layout from '../components/MyLayout.js'
import fetch from 'isomorphic-unfetch'
import React from 'react'
import Link from 'next/link'

export default class extends React.Component {
  static async getInitialProps(context) {
    console.log('context', context.query)
    const { id } = context.query
    const res = await fetch(`https://api.tvmaze.com/shows/${id}`)
    const show = await res.json()
    console.log(`Fetched show: ${show.name}`)
    return { show }
  }

  render () {
    return (
      <Layout>
        <div>
          <Link href={{ pathname: '/about', query: { name: 'Zeit' }}}>
            <h1>{this.props.show.name}</h1>
          </Link>
          <p>{this.props.show.summary.replace(/<[/]?p>/g, '')}</p>
          <img src={this.props.show.image.medium}/>
        </div>
      </Layout>
    )
  }
}
