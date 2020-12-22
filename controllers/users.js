const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
	res.render("users/register");
};

module.exports.register = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const user = new User({ username, email });
		const newUser = await User.register(user, password);
		req.login(newUser, (err) => {
			if (err) return next(err);
			req.flash("success", "Successfully Registered");
			res.redirect("/campgrounds");
		});
	} catch (e) {
		req.flash("error", e.message);
		console.log(e);
		res.redirect("/register");
	}
};

module.exports.renderLoginForm = (req, res) => {
	res.render("users/login");
};

module.exports.login = (req, res, next) => {
	const redirectUrl = req.session.returnTo || "/campgrounds";
	req.flash("success", "Welcome Back");
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
	req.logout();
	req.flash("success", "GoodBye!");
	res.redirect("/campgrounds");
};
