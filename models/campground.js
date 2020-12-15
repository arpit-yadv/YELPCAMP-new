const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./user')
const Review = require("./review");

const campgroundSchema = Schema({
	title: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	location: {
		type: String,
		required: true,
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
});

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
