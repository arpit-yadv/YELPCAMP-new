const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const AppError = require("../AppError");
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn,isAuthorised,isValidId} = require("../middleware");


router.get(
	"/",
	catchAsync(async (req, res) => {
		let campgrounds = await Campground.find({});
		res.render("campgrounds.ejs", { campgrounds: campgrounds });
	})
);
router.get("/new", isLoggedIn, (req, res, next) => {
	res.render("newcampground-form");
});
router.post(
	"/",
	isLoggedIn,
	catchAsync(async (req, res, next) => {
		let campground = new Campground(req.body.campground);
		campground.author = req.user._id;
		let camp1 = await campground.save();
		console.log(`${camp1.title} added successfully!!`);
		req.flash("success", `${camp1.title} added successfully!!`);
		res.redirect("/campgrounds/"+camp1._id);
	})
);
router.get(
	"/:id",isValidId,
	catchAsync(async (req, res, next) => {
		campId = req.params.id;
		let campground = await Campground.findOne({ _id: campId }).populate({
			path:"reviews",
			populate:{
				path:"author"
		 	}
		}).populate("author");	
		if (!campground) {
			req.flash("error", "Campground not found!!");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds-id", { campground: campground });
	})
);
router.get(
	"/:id/edit",isValidId,
	isLoggedIn,isAuthorised,
	catchAsync(async (req, res, next) => {
		campId = req.params.id;
		let campground = await Campground.findOne({ _id: campId });
		if(!campground){
			return res.redirect('/campgrounds');
		}
		res.render("campground-edit", { campground: campground });
		
	})
);
router.patch(
	"/:id",isValidId,
	isLoggedIn,
	isAuthorised,
	catchAsync(async (req, res, next) => {
		let newcamp = req.body.campground;
		let updatedCampground = await Campground.findByIdAndUpdate(
			{ _id: req.params.id },
			{ ...newcamp }
		)
		console.log(updatedCampground.title + " succesfully updated");
		req.flash("success", `${updatedCampground.title} Successfully Updated`);
		res.redirect("/campgrounds/" + req.params.id);
	})
);

router.delete(
	"/:id",isValidId,
	isLoggedIn,isAuthorised,
	catchAsync(async (req, res, next) => {
		let id = req.params.id;
		if (!(req.params.id).match(/^[0-9a-fA-F]{24}$/)) {
			req.flash('error','Campground with this id not found!!');
			return res.redirect('/campgrounds')
		  }
		let camp1 = await Campground.findByIdAndDelete({ _id: id });
		console.log(camp1.title, "Removed successfully");
		req.flash("success", `${camp1.title} Deleted Successfully`);
		res.redirect("/campgrounds");
	})
);

module.exports = router;
