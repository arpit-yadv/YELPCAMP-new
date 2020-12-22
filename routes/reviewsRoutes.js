const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require('../controllers/reviews');
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

router.post(
	"/",
	isLoggedIn,
	catchAsync(reviews.create)
);

router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	catchAsync(reviews.delete)
);

module.exports = router;
