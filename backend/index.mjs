import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { URI, PORT, feUrlDev, feUrlProd } from './config.mjs';
import route from './src/routes/route.mjs';


const app = express();
// console.log("Test Log......")
// app.use((req, res, next) => {
//     if (req.method === 'OPTIONS') {
//         console.log("OPTIONS Request Reached Backend ::", req.headers.origin);
//         res.send("OPTIONS Request Reached Backend ::", req.headers.origin)
//     }
//     next();
// });
app.use(express.json());

const allowedOrigins = [feUrlDev, feUrlProd];

app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        const origin = req.headers.origin;
        const allowed = !origin || allowedOrigins.some(
            (url) =>
                origin.toLowerCase() === url.toLowerCase() ||
                (url.includes('localhost') && origin.includes('localhost'))
        );

        if (allowed) {
            res.setHeader('Access-Control-Allow-Origin', origin || '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.status(204).end(); // Preflight success
            return;
        } else {
            res.status(403).end(); // Forbidden
            return;
        }
    }
    next();
});

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true); // Server-to-server requests

            const allowed = allowedOrigins.some(
                (url) =>
                    origin.toLowerCase() === url.toLowerCase() ||
                    (url.includes('localhost') && origin.includes('localhost'))
            );

            if (allowed) callback(null, origin);
            else callback(null, false);
        },
        credentials: false,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Handle OPTIONS for Express 5
// app.options(/.*/, cors({
//     origin: (origin, callback) => {
//         if (!origin) return callback(null, true);
//         const allowed = allowedOrigins.some((url) =>
//             origin.toLowerCase() === url.toLowerCase() ||
//             (url.includes('localhost') && origin.includes('localhost'))
//         );
//         if (allowed) callback(null, origin);
//         else callback(null, false);
//     },
//     credentials: false,
// }));

app.use((req, res, next) => {
    console.log("Incoming:", req.method, req.path, "Origin:", req.headers.origin);
    next();
});

// console.log("Problem::<1>")

// app.options(/.*/, cors());  // app.options("*", cors());  works in Express 4 not in 5+

// console.log("Problem::<2>")


mongoose.connect(URI)
    .then(() => console.log("Database connected successfully!"))
    .catch((err) => console.error(err));

app.use('/', route);

app.listen(PORT, () => {
    console.log(`App is Connected on PORT: ${PORT}`);
})