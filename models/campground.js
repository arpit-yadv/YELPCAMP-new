const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const campgroundSchema= Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    location:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    }
})

module.exports = mongoose.model("campground",campgroundSchema)