const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.create= async (req, res, next) => {
    let { review, rating } = req.body.review;
    let author = req.user._id;
    try{
        let newR = { review, rating, author };
        const newReview = new Review(newR);
        let camp = await Campground.findById({ _id: req.params.id });
        await newReview.save();
        camp.reviews.push(newReview);
        await camp.save();
        req.flash("success", "Review Added Successfully");
        res.redirect("/campgrounds/" + req.params.id);
    }catch(e){
        req.flash('error',e.message);
        res.redirect("/campgrounds/" + req.params.id);
    }
}

module.exports.delete = async (req, res, next) => {
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", `Review Deleted!!`);
    res.redirect("/campgrounds/" + req.params.id);
}