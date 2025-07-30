import { createClient } from "redis";
import { nodeEnv, redisUrl } from "../../config.mjs";

const isProd = nodeEnv === 'production';
// console.log(isProd, redisUrl);
const redisURL = isProd ? redisUrl : "redis://127.0.0.1:6379";
// creates instance with default settings. Redis Default PORT localhost:6379
const redisClient = createClient({
    url: redisURL,
    socket: isProd ? {
        tls: true, // Transport Layer Security: Secure communication b/w server and redis server
        rejectUnauthorized: false
    } : {} // Local Docker containerized Redis DB does not require TLS
});


// adding event listener to catch errors
redisClient.on('error', (err) => console.error('redis client error: ', err));

// in ES module mjs top level await is available with out Async function
await redisClient.connect();


// Export
export default redisClient;