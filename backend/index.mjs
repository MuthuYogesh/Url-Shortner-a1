import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { URI, PORT, feUrlDev, feUrlProd } from './config.mjs';
import route from './src/routes/route.mjs';


const app = express();
app.use(express.json());

const allowedOrigins = [feUrlDev, feUrlProd];

// It allows Cross Origin Requests
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // allow mobile apps or curl

        const allowed = allowedOrigins.some((url) => {
            return origin.toLowerCase() === url.toLowerCase()
                || (url.includes('localhost') && origin.includes('localhost')); // allow any localhost
        });

        if (allowed) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// console.log("Problem::<1>")

app.options("/*", cors());  // app.options("*", cors());  works in Express 4 not in 5+

// console.log("Problem::<2>")


mongoose.connect(URI)
    .then(() => console.log("Database connected successfully!"))
    .catch((err) => console.error(err));

app.use('/', route);

app.listen(PORT, () => {
    console.log(`App is Connected on PORT: ${PORT}`);
})