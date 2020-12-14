const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const AppError = require("../AppError");
const catchAsync = require("../utils/catchAsync");

router.get(
	"/",
	catchAsync(async (req, res) => {
		let campgrounds = await Campground.find({});
		res.render("campgrounds.ejs", { campgrounds: campgrounds });
	})
);
router.get("/new", (req, res, next) => {
	res.render("newcampground-form");
});
router.post(
	"/",
	catchAsync(async (req, res, next) => {
		let campground = new Campground(req.body.campground);
		let camp1 = await campground.save();
		console.log(`${camp1.title} added successfully!!`);
		req.flash('success','Successfully added the campground')
		res.redirect("campgrounds");
	})
);
router.get(
	"/:id",
	catchAsync(async (req, res, next) => {
        campId = req.params.id;
		let campground = await Campground.findOne({ _id: campId }).populate(
			"reviews"
        );
		res.render("campgrounds-id", { campground: campground });
	})
);
router.get(
	"/:id/edit",
	catchAsync(async (req, res, next) => {
		campId = req.params.id;
		let campground = await Campground.findOne({ _id: campId });
		res.render("campground-edit", { campground: campground });
	})
);
router.patch("/:id", catchAsync( async (req, res, next) => {
		let newcamp = req.body.campground;
		let updatedCampground = await Campground.findByIdAndUpdate(
			{ _id: req.params.id },
			{ ...newcamp }
		);
		console.log(updatedCampground.title + " succesfully updated");
		res.redirect("/campgrounds/" + req.params.id);
	})
);

router.delete("/:id", catchAsync(async(req, res, next) => {
	let id = req.params.id;
	let camp1= await Campground.findByIdAndDelete({ _id: id })
			console.log(camp1.title, "Removed successfully");
			res.redirect("/campgrounds");
	
}));

module.exports = router;
