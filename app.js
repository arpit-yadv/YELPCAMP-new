if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
// console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_KEY);
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const methodOverrider = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser')
const helmet = require('helmet');
const mongoStore = require('connect-mongo')(session)


const Campground = require("./models/campground");
const Review = require("./models/review");
const seedDB = require("./seedDB");
const campgroundRoutes = require("./routes/campgroundroutes");
const reviewRoutes = require("./routes/reviewsRoutes");
const userRoutes = require("./routes/userRoutes");
const AppError = require("./AppError");
const catchAsync = require("./utils/catchAsync");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
 const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelpcampDB"
mongoose
	.connect(dbUrl, {
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
const secret = process.env.SECRET || 'thisshouldbeasecret';
const store = new mongoStore({
	url:dbUrl,
	secret:secret,
	touchAfter:24*3600
})
store.on("error",function(e){
	console.log("Error with mongo session store ",e);
})
app.use(
	session({
		store:store,
		secret: secret,
		resave: "true",
		saveUninitialized: true,
		cookie: {
			httpOnly: true,
			// secure:true,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7,
		},
	})
);
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
	"https://cdn.jsdelivr.net",
	'https://code.jquery.com',
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
				"https://res.cloudinary.com/arpityadav/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
				"https://invinciblengo.org/photos/event/slider/kasol-sar-pass-trekking-expedition-kullu-himachal-pradesh-HMgkmr5-1440x810.jpg",
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// seedDB();
app.use(mongoSanitize({
	replaceWith:"_"
}))
app.use(helmet({contentSecurityPolicy:false}))
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverrider("_method"));
app.use(flash());
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/review", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
	res.render("home.ejs");
});


app.get('/:id',(req,res)=>{
	req.flash('error',"Unable to find your URL")
	res.redirect('/campgrounds');
})

app.use((err, req, res, next) => {
	const { status = 400, message = "Something went wrong!!" } = err;
	console.log(message);
	res.status(status).render('error',{error:err});
});

app.listen(3000, () => {
	console.log("Serving on the port localhost:3000");
});
