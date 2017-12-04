import Header from './Header'
import Content from './Content'

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
}

const Layout = (props) => (
  <div style={layoutStyle}>
    <Header />
    <Content></Content>
  </div>
)

export default Layout
