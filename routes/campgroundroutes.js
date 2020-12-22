const express = require("express");
const router = express.Router();
const {storage} = require("../cloudinary/index");
const multer = require("multer");
const upload = multer({ storage });



campgrounds = require("../controllers/campgrounds");
const Campground = require("../models/campground");
const AppError = require("../AppError");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthorised, isValidId, validateCampground } = require("../middleware");

router
	.route("/")
	.get(catchAsync(campgrounds.index))
	.post( upload.array('image'), catchAsync(campgrounds.create));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);


router
	.route("/:id")
	.get(isValidId, catchAsync(campgrounds.show))
	.patch(isValidId, isLoggedIn, isAuthorised, upload.array('image'),catchAsync(campgrounds.update))
	.delete(isValidId, isLoggedIn, isAuthorised, catchAsync(campgrounds.delete));

router.get(
	"/:id/edit",
	isValidId,
	isLoggedIn,
	isAuthorised,
	catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
