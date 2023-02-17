const redis = require("redis");

class RedisService {
  static instance = null;
  constructor() {
    if (RedisService.instance) {
      return RedisService.instance;
    } else {
      this.client = redis.createClient({
        socket: {
          port: process.env.REDIS_PORT,
          host: process.env.REDIS_HOST,
        },
        password: process.env.REDIS_PASSWORD,
      });
      this.client.connect();
      RedisService.instance = this;
    }
  }

  async set({ key, value, timeType, time }) {
    await this.client.set(key, value, timeType, time);
  }

  async get(key) {
    const result = await this.client.get(key);

    return result;
  }
  async del(key) {
    await this.client.del(key);
  }
}

module.exports = new RedisService();
