var redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
const client = redis.createClient()

client.on('error', function (err) {
  console.log('Error ' + err)
})

let test = async () => {
  await client.setAsync('string key', 'string val')
  let data = await client.getAsync('string key')
  console.log('data', data)
  client.hsetAsync('user', 'name', 11)
  client.saddAsync('userList', JSON.stringify({a:1, b:2}))
  let user = await client.hgetAsync('user', 'name')
  console.log('user', user)
  let userList = await client.smembersAsync('userList')
  console.log('userList', userList)
}
test()
