import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor () {
    this.redisClient = createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD
    });
    this.redisClient.on('error', (error) => {
      console.error(error);
    });
    // this.redisClient.on('connect', () => {
    //   console.log('Redis client connected');
    // });
  }

  getRedisClient () {
    return this.redisClient;
  }

  isAlive () {
    return this.redisClient.connected;
  }

  async get (key) {
    const getAsync = promisify(this.redisClient.get).bind(this.redisClient);
    return await getAsync(key);
  }

  async set (key, value, duration) {
    const setAsync = promisify(this.redisClient.set).bind(this.redisClient);
    await setAsync(key, value, "EX", duration);
  }

  async del (key) {
    const delAsync = promisify(this.redisClient.del).bind(this.redisClient);
    await delAsync(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
