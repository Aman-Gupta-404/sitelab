import { Server } from "http";
import { Redis } from "ioredis";

class AppContext {
  server?: Server;
  redis?: Redis;
}

export const appContext = new AppContext();
