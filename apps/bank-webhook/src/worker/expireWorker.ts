import { Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@repo/db";
import dotenv from "dotenv";
dotenv.config();


const connection = new IORedis({ 
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null });

connection.on('connect', () => {
    console.log('Connected to Redis');
});

connection.on('error', (err) => {
    console.error('Redis connection error', err);
});

export const worker = new Worker(
  "expireQueue",
  async (job) => {
    const { token, userId } = job.data;
    console.log(`Processing job for token: ${token}`, token);
    try {
        // update throw error if the cosntraints are not unique so update many is used insted
        await prisma.onRampTransaction.updateMany({
            where: {
              token: token,
              status: "Processing",
              userId: userId
            },
            data: {
              status: "Failure",
            },
          });
    } catch (error) {
        console.log(error);
    }
    },
  { connection }
);

