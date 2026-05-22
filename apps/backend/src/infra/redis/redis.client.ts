import { redisconfig } from "@/config/redis.config.js";
import { Redis } from "ioredis";

class RedisClient {
  private redis: Redis | null;

  constructor() {
    this.redis = null;
  }

  connectRedis() {
    if (this.redis) return this.redis;

    this.redis = new Redis(redisconfig);

    this.redis.on("connect", () => {
      console.log("✅ Redis connected");
    });

    this.redis.on("error", (err) => {
      console.error("❌ Redis error:", err);
    });

    return this.redis;
  }

  getClient() {
    if (this.redis) {
      return this.redis;
    } else {
      return this.connectRedis();
    }
  }

  /**
   * Create a subscriber using duplicate()
   */
  createSubscriber() {
    const base = this.getClient();
    const sub = base.duplicate();

    sub.on("connect", () => {
      console.log("📥 Redis subscriber connected");
    });

    sub.on("error", (err) => {
      console.error("❌ Redis subscriber error:", err);
    });

    return sub;
  }

  /**
   * Cleanly close a subscriber
   */
  async closeSubscriber(sub: Redis) {
    try {
      await sub.unsubscribe();
    } catch (err) {
      // ignore if already unsubscribed
    }

    try {
      await sub.quit();
    } catch (err) {
      console.log("Error closing subscriber:", err);
    }
  }
}

export default new RedisClient();
