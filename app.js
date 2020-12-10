const { nextTick } = require("process");
const express = require("express"),
	app = express(),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	seedDB	=	require('./seedDB');


mongoose
	.connect("mongodb://localhost:27017/yelpcampDB", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(function () {
		console.log("Connection Created!!!");
	})
	.catch((err) => {
		console.log("Something went wrong with the mongoDB connection!!!" + err);
	});

app.set("view engine", "ejs");
app.get("/", (req, res) => {
	res.render("home.ejs");
});

// Campground.find({}).then(campinfo=>{
//     console.log(campinfo);
// })

app.get("/campgrounds",async (req, res) => {
	let campgrounds = await Campground.find({});
	res.render("campgrounds.ejs", { campgrounds: campgrounds });
});

app.get("/campground/new",(req,res,next)=>{
	res.render("newcampground-form")
})

app.get("/campgrounds/:id", (req, res, next) => {
	campId = req.params.id;
	Campground.findOne({ _id: campId })
		.then((campground) => {
			res.render("campgrounds-id",{campground:campground});
		})
		.catch((err) => {
			next(err);
		});
});

app.get("campgrounds/:id/edit",(req,res,next)=>{
	campId= req.params.id;
	Campground.findOne({_id:campId}).then(campground=>{
		res.render(campground-edit)
	})
})

app.use((req, res, next) => {
	res.send("something went wrong");
});
// Campground.create({
//     title:"RUPIN PASS TREK",
//     image:"https://indiahikes.com/wp-content/uploads/2011/07/Lower-Waterfall-Campsite-Indiahikes-Rupin-Pass-Vinod-Krishna.jpg",
//     description:`A Change in Scenery at Every Turn
//     If there is a classic trek in India, it has to be the Rupin Pass. This trek is like an orchestra, building up momentum with surprises in scenery every hour or so. With every step, the trek throws up a new vista to see, a new scenery to unfold. Quite suddenly too!

//     The surprises begin right from your first day of trekking. When, around 20 minutes into the trail,  you see the Rupin River make an appearance, fanning out into a wide bed below you. And it doesn’t stop here.
//     From here, the trail takes you through hanging villages and then quite suddenly, it plunges into a deep pine forest!  That’s not all. The trail then meanders through glacial meadows, snow bridges, glacial valleys, snow fields and hundreds of waterfalls!
//     The only constant in this trail that keeps blindsiding you with surprises is the Rupin river. The blue waters of the Rupin runs along the trail as if to complement the scenery. Sometimes rushing, at times gliding by.

//     That being said, this is a moderate-difficult trek. You cover almost 10 km every day and the terrain is quite tricky. The climb to Rati Pheri from Upper waterfall and the steep ascent to Rupin Pass through the gully at 15,380 ft  require very good lung power. Prepare well!`,
//     location:"Dhaula,Uttrakhand",
//     price:18300

// }).then(data=>{
//     console.log("Campground created succesfully");
//     console.log(data);
// }).catch(err=>{
//     console.log("couldn't create database");
//     console.log(err)
// });

app.listen(3000, () => {
	console.log("Serving on the port localhost:3000");
});
