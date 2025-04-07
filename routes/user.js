const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");
// const user = require("../models/user.js");

// ======================SIGN UP=====================↓

router
  .route("/signup")
  .get((req, res) => {
    res.render("users/signup.ejs");
  })
  .post(wrapAsync(userController.signup));


// ======================== LOGIN ==================

router.route("/login")
.get((req, res) => {
  res.render("users/login.ejs");
})
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// =============================== LOGOUT ====================================
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logged you out!!");
    res.redirect("/listings");
  });
});

module.exports = router;
