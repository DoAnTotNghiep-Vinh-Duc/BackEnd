import * as redis from "redis";
export const client = redis.createClient({
  url: `redis://:@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  
});