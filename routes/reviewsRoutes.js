const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");

router.post(
	"/",
	catchAsync(async (req, res, next) => {
		let newReview = new Review(req.body.review);
		let camp = await Campground.findById({ _id: req.params.id });
		await newReview.save();
		camp.reviews.push(newReview);
		await camp.save();
		res.redirect("/campgrounds/" + req.params.id);
	})
);

router.delete(
	"/:reviewId",
	catchAsync(async (req, res, next) => {
		await Review.findByIdAndDelete(req.params.reviewId);
		res.redirect("/campgrounds/" + req.params.id);
	})
);

module.exports = router;
