import { createClient } from "redis";

// creates instance with default settings. Redis Default PORT localhost:6379
const redisClient = createClient();

// adding event listener to catch errors
redisClient.on('error', (err)=>console.error('redis client error: ',err));

// in ES module mjs top level await is available with out Async function
await redisClient.connect();

// Export
export default redisClient;