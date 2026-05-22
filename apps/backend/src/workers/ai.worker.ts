import { Worker } from "bullmq";
import { Redis } from "ioredis";

import { processAIJob } from "@/infra/queue/jobs/ai.jobs.js";
import { redisconfig } from "@/config/redis.config.js";

export function createAIWorker() {
  console.log({ redisconfig });

  return new Worker("ai-queue", async (job) => processAIJob(job), {
    connection: new Redis(redisconfig),
  });
}
