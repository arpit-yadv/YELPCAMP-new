const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const methodOverrider = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const Campground = require("./models/campground");
const Review = require("./models/review");
const seedDB = require("./seedDB");
const campgroundRoutes = require("./routes/campgroundroutes");
const reviewRoutes = require("./routes/reviewsRoutes");
const AppError = require("./AppError");
const catchAsync = require("./utils/catchAsync");

mongoose
	.connect("mongodb://localhost:27017/yelpcampDB", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(function () {
		console.log("Connection Created!!!");
	})
	.catch((err) => {
		console.log("Something went wrong with the mongoDB connection!!!" + err);
	});
app.use(express.urlencoded({ extended: true }));
app.use(methodOverrider("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/review", reviewRoutes);
app.use(
	session({
		secret: "thisshouldbeasecret",
		resave: "true",
		saveUninitialized: true,
		cookie: {
			httpOnly: true,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7,
		},
	})
);
app.use(flash());
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	next();
});

app.get("/", (req, res) => {
	res.render("home.ejs");
});






app.use((err, req, res, next) => {
	const { status = 400, message = "Something went wrong!!" } = err;
	console.log(message);
	res.status(status).send(message,);
});


app.listen(3000, () => {
	console.log("Serving on the port localhost:3000");
});
