require('dotenv').config();
const redis = require('redis');
//const redis = require("ioredis");
const createRedisClient = process.env.REDIS_URL ? createHerokuRedisClient : createLocalRedisClient; 

module.exports = createRedisClient(redis);


function createHerokuRedisClient(redis) {
    //const redisUrlObj = new URL(process.env.REDIS_URL);
    return redis.createClient({
        url: process.env.REDIS_URL,
        socket: {
          tls: true,
          rejectUnauthorized: false
        }, 
        no_ready_check: true,
        prefix: 'blacklist:'
    });
    // return redis.createClient({url: process.env.REDIS_URL,
    //     socket: {
    //       tls: true,
    //       rejectUnauthorized: false
    //     }, no_ready_check: true, prefix: 'blacklist:'});
    //redisClient.auth(redisUrlObj.password);
}

// function createHerokuRedisClient(redis) {
//     return new redis(process.env.REDIS_URL, {
//         tls: {
//             rejectUnauthorized: false
//         }
//     });
// }

function createLocalRedisClient(redis) {
    return redis.createClient({ prefix: 'blacklist:' });
}