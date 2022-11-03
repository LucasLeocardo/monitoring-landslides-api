require('dotenv').config();
const redis = require('redis');
const createRedisClient = process.env.REDIS_URL ? createHerokuRedisClient : createLocalRedisClient;

module.exports = createRedisClient(redis);


function createHerokuRedisClient(redis) {
    const redisUrlObj = new URL(process.env.REDIS_URL);
    const redisClient = redis.createClient({url: process.env.REDIS_URL, no_ready_check: true, prefix: 'blacklist:'});
    //redisClient.auth(redisUrlObj.password);
    return redisClient;
}

function createLocalRedisClient(redis) {
    return redis.createClient({ prefix: 'blacklist:' });
}