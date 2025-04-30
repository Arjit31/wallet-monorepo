import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: "redis-18417.c15.us-east-1-4.ec2.redns.redis-cloud.com",
  port: 18417,
  password: "fH5M25ALwXKN95KL5zhCyvJoHGobhe28",
  maxRetriesPerRequest: null,
});


export const expireQueue = new Queue('expireQueue', { connection });