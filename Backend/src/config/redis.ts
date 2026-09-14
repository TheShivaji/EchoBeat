import { createClient } from "redis";
import config from "./config.js"

export const redis = createClient({
    url: config.redisUrl
})


redis.on("error", (error) => {
    console.error("Redis Client Error", error);
});

export const redisConnectPromise = redis.connect();

export async function connectRedis() {
    await redisConnectPromise;
}