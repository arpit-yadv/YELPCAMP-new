const mongoose = require('mongoose');
const User = require('./user');

let reviewSchema= mongoose.Schema({
    review:String,
    rating:{
        type:Number,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports= mongoose.model("review",reviewSchema);