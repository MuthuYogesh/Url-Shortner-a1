import mongoose from 'mongoose';

const urlDB = new mongoose.Schema(
    {
        "shortcode":{
            type:String,
            require:true,
            unique:true
        },
        "longurl":{
            type:String,
            require:true,
            unique:true
        },
        "shorturl":{
            type:String,
            require:true,
            unique:true
        }
    },{timestamp:true}
);

export default mongoose.model("urlshortner",urlDB);