const config = require('./env.json')[process.env.NODE_ENV || 'development']
const {mongodb, imUrl, domainAdress, apiUrl} = config
console.log('apiUrl', apiUrl, imUrl, mongodb)
module.exports = {
  config,
  apiUrl,
  domainAdress,
  imUrl,
  mongodb
}
