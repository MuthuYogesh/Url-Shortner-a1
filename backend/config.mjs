import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT;
const URI = process.env.MongoDB;

export {PORT, URI};