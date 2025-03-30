import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {  // Prevents multiple connections
      await redisClient.connect();
      console.log("\u{2705} Connected to Redis Cloud");
    }
  } catch (err) {
    console.error("\u{274C} Redis Connection Error:", err);
  }
};

export default redisClient;
