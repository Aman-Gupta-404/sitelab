import { Queue } from "bullmq";
import { Redis } from "ioredis";

import { redisconfig } from "@/config/redis.config.js";

export const aiQueue = new Queue("ai-queue", {
  connection: new Redis(redisconfig),
});
1;
