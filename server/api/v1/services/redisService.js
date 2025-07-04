import Redis from 'ioredis';

export class RedisService {

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    
    this.redis.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  async storeOTP(email, otp, expirationMinutes = 10) {
    const otpData = {
      otp,
      email,
      verified: false,
    };
    
    const key = `otp:${email}`;
    await this.redis.setex(key, expirationMinutes * 60, JSON.stringify(otpData));
  }

  async getOTP(email) {
    const key = `otp:${email}`;
    const data = await this.redis.get(key);
    
    if (!data) {
      return null;
    }
    
    return JSON.parse(data);
  }

  async verifyOTP(email, otp) {
    const otpData = await this.getOTP(email);
    
    if (!otpData || otpData.otp !== otp) {
      return false;
    }
    
    // Mark as verified
    otpData.verified = true;
    const key = `otp:${email}`;
    const ttl = await this.redis.ttl(key);
    
    if (ttl > 0) {
      await this.redis.setex(key, ttl, JSON.stringify(otpData));
    }
    
    return true;
  }

  async deleteOTP(email) {
    const key = `otp:${email}`;
    await this.redis.del(key);
  }

  async isOTPVerified(email, otp) {
    const otpData = await this.getOTP(email);
    return otpData?.verified === true && otpData.otp === otp;
  }

  async cacheUserSession(userId, sessionData, expirationHours = 24) {
    const key = `session:${userId}`;
    await this.redis.setex(key, expirationHours * 3600, JSON.stringify(sessionData));
  }

  async getUserSession(userId) {
    const key = `session:${userId}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteUserSession(userId) {
    const key = `session:${userId}`;
    await this.redis.del(key);
  }

  // General purpose cache methods
  async cacheData(key, data, expirationHours = 24) {
    await this.redis.setex(key, expirationHours * 3600, JSON.stringify(data));
  }

  async getData(key) {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteData(key) {
    await this.redis.del(key);
  }

  // Bulk operations
  async cacheBulkData(dataMap, expirationHours = 24) {
    const pipeline = this.redis.pipeline();
    
    for (const [key, value] of dataMap.entries()) {
      pipeline.setex(key, expirationHours * 3600, JSON.stringify(value));
    }
    
    await pipeline.exec();
  }

  // Cache with hash fields
  async cacheHashData(key, data, expirationHours = 24) {
    const pipeline = this.redis.pipeline();
    
    for (const [field, value] of Object.entries(data)) {
      pipeline.hset(key, field, JSON.stringify(value));
    }
    
    pipeline.expire(key, expirationHours * 3600);
    await pipeline.exec();
  }

  async getHashData(key, field) {
    if (field) {
      const data = await this.redis.hget(key, field);
      return data ? JSON.parse(data) : null;
    } else {
      const data = await this.redis.hgetall(key);
      
      // Parse all JSON values in the hash
      if (Object.keys(data).length === 0) {
        return null;
      }
      
      const parsed = {};
      for (const [field, value] of Object.entries(data)) {
        parsed[field] = JSON.parse(value);
      }
      
      return parsed;
    }
  }

  // Rate limiting utility
  async incrementCounter(key, expirationSeconds) {
    const exists = await this.redis.exists(key);
    
    if (exists) {
      const count = await this.redis.incr(key);
      return count;
    } else {
      await this.redis.setex(key, expirationSeconds, '1');
      return 1;
    }
  }
  
  // List operations for SSE
  async lpush(key, value) {
    return await this.redis.lpush(key, value);
  }
  
  async ltrim(key, start, stop) {
    return await this.redis.ltrim(key, start, stop);
  }
  
  async expire(key, seconds) {
    return await this.redis.expire(key, seconds);
  }
  
  async lrange(key, start, stop) {
    return await this.redis.lrange(key, start, stop);
  }
}
