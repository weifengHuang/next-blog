const config = require('./env.json')[process.env.NODE_ENV || 'development']
const apiUrl = config['apiUrl']
const domainAdress = config['domainAdress']
const imUrl = config['imUrl']
console.log('apiUrl', apiUrl, imUrl)
module.exports = {
  config,
  apiUrl,
  domainAdress,
  imUrl
}
