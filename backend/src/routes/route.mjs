import express from 'express';
import { shortner, redirecturl, rateLimiter } from '../controller/urlController.mjs';

const route = express.Router();

route.post('/', rateLimiter,shortner);
route.get('/:code', rateLimiter,redirecturl);

export default route;