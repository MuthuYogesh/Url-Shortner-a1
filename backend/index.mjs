import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {URI, PORT} from './config.mjs';
import route from './src/routes/route.mjs';


const app = express();
app.use(express.json());

// It allows Cross Origin Requests
app.use(cors()); 

mongoose.connect(URI)
.then(()=>console.log("Database connected successfully!"))
.catch((err)=>console.error(err));

app.use('/', route);

app.listen(PORT, ()=>{
    console.log(`App is Connected on PORT: ${PORT}`);
})