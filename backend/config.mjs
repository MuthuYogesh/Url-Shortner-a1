import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT;
const URI = process.env.MongoDB;
const feUrlDev = process.env.FRONTEND_URL_DEV;
const feUrlProd = process.env.FRONTEND_URL_PROD;
const redisUrl = process.env.UPSTASH_REDIS_URL;
const nodeEnv = process.env.NODE_ENV;

export { PORT, URI, feUrlDev, feUrlProd, redisUrl, nodeEnv };