<<<<<<< HEAD
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

=======
import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Represents a Redis client.
 */
class RedisClient {
  /**
   * Creates a new RedisClient instance.
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Checks if this client's connection to the Redis server is active.
   * @returns {boolean}
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Retrieves the value of a given key.
   * @param {String} key The key of the item to retrieve.
   * @returns {String | Object}
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key and its value along with an expiration time.
   * @param {String} key The key of the item to store.
   * @param {String | Number | Boolean} value The item to store.
   * @param {Number} duration The expiration time of the item in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * Removes the value of a given key.
   * @param {String} key The key of the item to remove.
   * @returns {Promise<void>}
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
>>>>>>> 67881231 (Commitment for the first time)
export default redisClient;
