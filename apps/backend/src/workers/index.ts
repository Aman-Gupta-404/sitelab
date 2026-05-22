import "@/config/env.js";

import { createAIWorker } from "./ai.worker.js";
import { connectDB } from "@/infra/database/mongo.js";

async function startWorkers() {
  console.log("Initializing mongo connection");
  await connectDB(); // ✅ connect DB first

  console.log("Started all workers...");

  const workers = [createAIWorker()];

  workers.forEach((worker) => {
    worker.on("completed", (job) => {
      console.log(`Job completed: ${job.id}`);
    });

    worker.on("failed", (job, err) => {
      console.error(`Job failed: ${job?.id}`);
      console.error(err);
    });
  });
}

startWorkers();
