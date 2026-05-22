import "@/config/env.js";

import app from "./app.js";
import RedisClient from "@/infra/redis/redis.client.js";
import { appContext } from "@/shared/context/appContext.js";
import { connectDB } from "./infra/database/mongo.js";

const PORT = process.env.PORT || 3001;

async function startServer() {
  // redis connection
  await RedisClient.connectRedis();

  // mongodb connection
  await connectDB(); // ✅ connect DB first

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  appContext.server = server;
  appContext.redis = RedisClient.getClient();
}

startServer();
