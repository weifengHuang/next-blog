
var Redis = require('ioredis');
var redis = new Redis();

// let test = async () => {
//   redis.hset('user', 'name', 11)
//   let data = await redis.hget('user', 'name')
//   console.log('dataname', data)
//   redis.hset('user', 'year', 11)
//   let year = await redis.hget('user', 'year')
//   console.log('year', year)
// }
// test()
exports = redis
