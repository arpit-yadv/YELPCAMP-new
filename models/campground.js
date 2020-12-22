const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./user')
const Review = require("./review");
const { url } = require("inspector");
const opts = { toJSON: { virtuals: true } };
const imageSchema = new Schema({
	url:String,
	filename:String
})
imageSchema.virtual('thumbnail').get(function(){
	return this.url.replace('/upload','/upload/w_150')
})
imageSchema.virtual('profile').get(function(){
	return this.url.replace('/upload','/upload/w_500')
})
const campgroundSchema = Schema({
	title: {
		type: String,
		required: true,
	},
	images: 
		[imageSchema],	
	description: {
		type: String,
	},
	location: {
		type: String,
		required: true,
	},
	geometry:{
		type: {
			type: String,
			enum: ['Point'],
			required: true
		  },
		  coordinates: {
			type: [Number],
			required: true
		  }
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
	author:{
		type:Schema.Types.ObjectId,
		ref:"User"
	},
	reviews: [
		{
			type:mongoose.Schema.Types.ObjectId,
			ref: "review",
		},
	],
},opts);


campgroundSchema.virtual('properties.popUpText').get(function(){
	return `<a href='/campgrounds/${this._id}'>${this.title}</a>`
})


campgroundSchema.post('findOneAndDelete',async (doc)=>{
	if(doc){
		await Review.deleteMany({
			_id:{
				$in:doc.reviews
			}
		})
	}
	// doc.reviews.forEach(async (review) => {
	// 	let result = await Review.findByIdAndDelete(review._id);
	// 	console.log(result);
	// });
})

module.exports = mongoose.model("campground", campgroundSchema);
