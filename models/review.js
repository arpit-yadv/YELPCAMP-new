const mongoose = require('mongoose');

let reviewSchema= mongoose.Schema({
    review:{
        type:String,

    },
    rating:{
        type:Number,
        required:true
    }
})

module.exports= mongoose.model("review",reviewSchema);