import redisClient from "../redis.client.js";
import { projectStatusKey } from "../redis.keys.js";

type RedisProjectStatusProps = {
  slug: string;
  response:
    | false
    | null
    | {
        sandboxId: string | null;
        sandboxUrl: string | null;
        projectId: string | null;
        message: string | null;
      };
  status: "enquing" | "enqued" | "processing" | "processed" | "error";
};

export const updateRedisProjectStatus = async ({
  slug,
  response,
  status,
}: RedisProjectStatusProps) => {
  try {
    const redis = redisClient.getClient();
    const key = projectStatusKey(slug);
    const body = response ? { ...response, status } : { status };
    return await redis.set(key, JSON.stringify(body), "EX", 300);
  } catch (error) {
    return null;
  }
};

export const getRedisProjectStatus = async (slug: string) => {
  try {
    const redis = redisClient.getClient();
    const key = projectStatusKey(slug);
    const res = await redis.get(key);
    return res ? JSON.parse(res) : null;
  } catch (error) {
    return null;
  }
};
