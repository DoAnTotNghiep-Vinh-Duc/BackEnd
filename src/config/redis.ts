import { createClient } from 'redis';
export const client = createClient({
  url: `redis://:@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});