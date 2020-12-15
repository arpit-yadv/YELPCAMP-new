const Campground = require('./models/campground');
const Review = require('./models/review')

module.exports.isLoggedIn=(req,res,next)=>{
    req.session.returnTo = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash('error','You need to Login First');
        return res.redirect('/login');
    }
    next();
}
module.exports.isAuthorised = async function(req,res,next){
	let foundCamp = await Campground.findOne({_id:req.params.id})
	if (!foundCamp) {
		req.flash("error", "Campground not found!!");
		return res.redirect("/campgrounds");
	}
	if(!req.user._id.equals(foundCamp.author)){
        console.log(foundCamp.author);
        console.log(req.user._id);
		req.flash('error','Sorry you are not authorised to do this:(');
		return res.redirect('/campgrounds/'+foundCamp._id);
	}
	next();
}
module.exports.isValidId = function(req,res,next){
	if (!(req.params.id).match(/^[0-9a-fA-F]{24}$/)) {
		req.flash('error','Campground not found!!');
		return res.redirect('/campgrounds')
	  }
	  next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
	review = await Review.findById(req.params.reviewId);
	if(!(req.user._id).equals(review.author)){
	req.flash('error','You have not permission for this!');
	return res.redirect('/campgrounds/'+req.params.id);
	}
	next();
}