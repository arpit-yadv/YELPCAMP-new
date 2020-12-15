const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require('passport');

router.get("/register", (req, res) => {
	res.render("users/register");
});

router.post(
	"/register",
	catchAsync(async (req, res) => {
		try{
			const { username, email, password } = req.body;
			const user = new User({ username, email });
			const newUser = await User.register(user, password);
			req.login(newuser,(err)=>{
				if(err) return next(err);
				req.flash('success','Successfully Registered')
				res.redirect('/campgrounds')
			})
			
		}catch(e){
			req.flash('error',e.message);
			res.redirect('/register')
		}
		
	})
);

router.get('/login',(req,res)=>{
	res.render('users/login')
})
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res,next)=>{
	const redirectUrl = req.session.returnTo||'/campgrounds';
	
	req.flash('success','Welcome Back');
	delete req.session.returnTo;
	res.redirect(redirectUrl);
})

router.get('/logout',(req,res)=>{
	req.logout();
	req.flash('success','GoodBye!')
	res.redirect('/campgrounds')
})

module.exports = router;
