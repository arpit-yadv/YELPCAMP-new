const { cloudinary } = require("../cloudinary");
Campground = require("../models/campground");
const Joi = require('joi');
const mapBoxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const AppError = require("../AppError");
const mapBoxToken = process.env.MAPBOX_TOKEN; 
const geocoder = mapBoxGeoCoding({accessToken:mapBoxToken});

module.exports.index = async (req, res) => {
	let campgrounds = await Campground.find({});
	res.render("./campgrounds/campgrounds.ejs", { campgrounds: campgrounds });
};

module.exports.renderNewForm = (req, res, next) => {
	res.render("./campgrounds/newcampground-form");
};

module.exports.create = async (req, res, next) => {
	console.log(req.body)
	const campgroundSchema = Joi.object({
		campground:Joi.object({
			title:Joi.string().required(),
			price:Joi.number().min(0).required(),
			description:Joi.string().required(),
			location:Joi.string().required()
		}).required()
	})
	const {error} = campgroundSchema.validate(req.body);
	if(error){
		console.log(error.details);
		const message = error.details.map(f=>f.message).join(',')
		throw new AppError(message,400);
	}
	const geodata = await geocoder.forwardGeocode({
		query:req.body.campground.location,
		limit:1
	}).send();
	let campground = new Campground(req.body.campground);
	campground.images = req.files.map(f=>({url:f.path,filename:f.filename}))
	// this is orthodox but iterative method to map imagesarray to the campground object
	// for (image of req.files) {
	// 	const img = { url: image.path, filename: image.filename };
	// 	console.log(img);
	// 	campground.images.push(img);
	// }
	campground.geometry = geodata.body.features[0].geometry;
	campground.author = req.user._id;
	let camp1 = await campground.save();
	console.log(`${camp1.title} added successfully!!`);
	req.flash("success", `${camp1.title} added successfully!!`);
	res.redirect("/campgrounds/" + camp1._id);
};

module.exports.show = async (req, res, next) => {
	campId = req.params.id;
	let campground = await Campground.findOne({ _id: campId })
		.populate({
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate({ path: "images" })
		.populate("author");
	if (!campground) {
		req.flash("error", "Campground not found!!");
		return res.redirect("/campgrounds");
	}
	res.render("./campgrounds/campgrounds-id", { campground: campground });
};

module.exports.renderEditForm = async (req, res, next) => {
	campId = req.params.id;
	let campground = await Campground.findOne({ _id: campId });
	if (!campground) {
		return res.redirect("/campgrounds");
	}
	res.render("./campgrounds/campground-edit", { campground: campground });
};

module.exports.update = async (req, res, next) => {
	try {
		let newcamp = req.body.campground;
		deleteImages = req.body.deleteImages;
		const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
		const camp1 = await Campground.findOne({ _id: req.params.id });
		if(camp1.location!==newcamp.location){
			const geodata = await geocoder.forwardGeocode({
				query:newcamp.location,
			}).send();
			
			newcamp.geometry = geodata.body.features[0].geometry;

		}
		const oldimages = camp1.images;
		if (oldimages && deleteImages) {
			for (filename of deleteImages) {
	//deleting images from cloudinary by using inbuilt method cloudinary.uploader.destroy(filename)
				await cloudinary.uploader.destroy(filename);
				camp1.images.forEach((image, i) => {
					if (image.filename == filename) {
						oldimages.splice(i, 1);
					}
				});
			}
		}

		imgs.push(...oldimages);
		newcamp.images = imgs;
		//better method to update and delete the images
		// if(req.body.deleteImages){
		// 	Campground.updateOne({_id:req.params.id},{$pull:{images:{filename:{$in:req.body.deleteImages}}}})
		// }
		const camp2 = await Campground.updateOne(
			{ _id: req.params.id },
			{ ...newcamp },{runValidators:true}
		);
		// const camp2 = await Campground.updateOne({_id:req.params.id},{$pull:{image}})
		res.redirect("/campgrounds/" + req.params.id)
	} catch (e) {
		req.flash("error", `Error!! ${e.message}`);
		res.redirect("/campgrounds/" + req.params.id);
	}
};

module.exports.delete = async (req, res, next) => {
	let id = req.params.id;
	if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
		req.flash("error", "Campground with this id not found!!");
		return res.redirect("/campgrounds");
	}
	let camp1 = await Campground.findByIdAndDelete({ _id: id });
	console.log(camp1.title, "Removed successfully");
	req.flash("success", `${camp1.title} Deleted Successfully`);
	res.redirect("/campgrounds");
};
