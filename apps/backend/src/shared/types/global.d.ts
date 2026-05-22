import { server } from "http";
import { Redis } from "ioredis";

declare global {
  var server: server | undefined;
  var redis: Redis | undefined;
}

export {};
