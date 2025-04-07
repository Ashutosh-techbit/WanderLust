const User = require("../models/user.js");

module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "logged in!!");
        res.redirect("/listings");
      });
    } catch (e) {
      // Handle specific error if user already exists
      if (e.name === "UserExistsError") {
        req.flash("error", "A user with this name already registered.");
      } else {
        req.flash("error", e.message);
      }

      // Redirect to the signup page
      res.redirect("/signup");
    }
  }

module.exports.login = async (req, res) => {
    req.flash("success", "Login Successful!! Welcome to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }