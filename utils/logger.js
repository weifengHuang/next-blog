const log4js = require('log4js')
const path = require('path')
const pathlog = path.join(__dirname, '..', '/logs/server.log')
log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: pathlog,  maxLogSize: 524288000  }
  },
  categories: {
    default: { appenders: [ 'out', 'app' ], level: 'debug' }
  }
})
module.exports = log4js
