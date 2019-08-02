'use strict';

const BaseService = require(__dirname + '/../base_service');

class Redis extends BaseService {
  async set(key, value, time) {
    if (time) {
      await this.app.redis.set(key, value, 'EX', time);
    } else {
      await this.app.redis.set(key, value);
    }
  }

  async get(key) {
    return await this.app.redis.get(key);
  }

  async del(key) {
    await this.app.redis.del(key);
  }

  // 对外接口请求次数的权限设置
  async auth(key, count, time) {
    const authCacheKey = await this.getCacheKey(key);
    let val = await this.get(authCacheKey);
    let res;
    if (val >= count) {
      res = true;
    } else {
      val = val == null ? 1 : Number(val) + 1;
      await this.set(authCacheKey, val, time);
      res = false;
    }
    return res;
  }

  async getCacheKey(key) {
    return `${this.ctx.request.ip}_${key}`;
  }
}

module.exports = Redis;
