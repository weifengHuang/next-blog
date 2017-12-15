const path = require('path')
// function resolve (dir) {
//   return path.join(__dirname, '..')
// }
// console.log('resolove', path.resolve(__dirname))
module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push(
      {
        test: /\.md$/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      }
    )
    config.resolve = {
      extensions: ['.js', '.json'],
      alias: {
        '@': path.resolve(__dirname)
      }
    }
    return config
  },
  webpackDevMiddleware: (config) => {
    // Solve compiling problem via vagrant
    config.watchOptions = {
      poll: 1000,   // Check for changes every second
      aggregateTimeout: 300   // delay before rebuilding
    }
    return config
  }
}
