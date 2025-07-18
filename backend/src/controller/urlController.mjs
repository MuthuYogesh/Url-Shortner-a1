import { nanoid } from 'nanoid';
import urlDB from '../models/urlModel.mjs'
import redisClient from '../redis/redisClient.mjs';

const shortner = async (req, res)=>{
    let longurl = req.body.url;
    if(!/^https?:\/\//i.test(longurl)){
        longurl = "https://" + longurl;
    }
    try{
        // Checking Redis cache
        const codeCached = await redisClient.get(`long:${longurl}`);
        if(codeCached){
            console.log("from redis", codeCached)
            return res.status(200).send(`${req.protocol}://${req.get('host')}/${codeCached}`);
        }

        //  Checking MongoDB
        const check = await urlDB.findOne({longurl});
        if(check && check.shortcode){
            await redisClient.setEx(`long:${longurl}`, 60*15, check.shortcode);
            await redisClient.setEx(`short:${check.shortcode}`, 60*15, longurl);
            console.log("from mongodb", check.shorturl);
            return res.status(200).send(check.shorturl);
        }

        // Creating New ShortCode
        const shortcode = nanoid(7); //afwj-gr
        const shorturl = `${req.protocol}://${req.get('host')}/${shortcode}`;

        await redisClient.setEx(`long:${longurl}`, 60*15, shortcode);
        await redisClient.setEx(`short:${shortcode}`, 60*15, longurl);

        const response = await urlDB.create({shortcode, longurl, shorturl});

        return res.status(200).send(response.shorturl);
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error")
    }
}

const redirecturl = async (req, res)=>{
    const code = req.params.code;

    const cachedLongUrl = await redisClient.get(`short:${code}`)
    console.log(cachedLongUrl);
    if(cachedLongUrl){
        console.log("cache: ", cachedLongUrl);
        return res.redirect(cachedLongUrl);
    }

    const response = await urlDB.findOne({shortcode:code});
    if(!response){
        return res.send("Page Not Found");
    }

    const longurl = response.longurl;
    await redisClient.setEx(`short${code}`, 60*15, longurl);
    console.log("res: ", longurl);
    return res.redirect(longurl);
}

const rateLimiter = async (req, res, next)=>{
    const ip = req.ip;
    const key = `ratelimit:${ip}`;
    const limit = 100;
    const windowLimit = 60*15;

    const current = await redisClient.incr(key);

    if(current == 1){
        try{
            const didExpire = await redisClient.expire(key, windowLimit);
            if (!didExpire) console.warn("Expire failed for:", key);
        }catch(err){
            console.error("Redis Error: ",err);
        }
    }

    if(current > limit){
        return res.status(429).json({message:'too many attempts, retry later'});
    }

    next();
}

export {shortner, redirecturl, rateLimiter};