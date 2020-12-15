const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const { isLoggedIn, isAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

router.post(
	"/",
	isLoggedIn,
	catchAsync(async (req, res, next) => {
		let { review, rating } = req.body;
		let author = req.user._id;
		let newR = { review, rating, author };
		const newReview = new Review(newR);
		let camp = await Campground.findById({ _id: req.params.id });
		await newReview.save();
		camp.reviews.push(newReview);
		await camp.save();
		req.flash("success", "Review Added Successfully");
		res.redirect("/campgrounds/" + req.params.id);
	})
);

router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	catchAsync(async (req, res, next) => {
		await Review.findByIdAndDelete(req.params.reviewId);
		req.flash("success", `Review Deleted!!`);
		res.redirect("/campgrounds/" + req.params.id);
	})
);

module.exports = router;
