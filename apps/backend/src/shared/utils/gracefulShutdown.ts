import { appContext } from "@/shared/context/appContext.js";

let isShuttingDown = false;

export const gracefulShutdown = async (reason: string, error?: any) => {
  if (isShuttingDown) return;

  isShuttingDown = true;

  console.error(`x shutting down: ${reason}`);
  if (error) console.error(error);

  try {
    // close server
    if (appContext.server) {
      appContext.server.close(() => {
        console.log("HTTP server closed");
      });
    }

    // close redis
    if (appContext.redis) {
      await appContext.redis.quit();
      console.log("Redis server closed");
    }

    process.exit(1);
  } catch (error) {
    console.error("Error during shutdown", error);
    process.exit(1);
  }
};
