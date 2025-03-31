const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

// ======================SIGN UP=====================↓
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async(req,res) => {
      try{
        let {username , email , password} = req.body
        const newUser = new User({email,username}); 
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","Welcome to WanderLust")
        res.redirect("/listings")
      }
      catch (e) {
        // Handle specific error if user already exists
        if (e.name === "UserExistsError") {
          req.flash("error", "A user with this name already registered.");
        } else {
          req.flash("error", e.message);
        }
        
        // Redirect to the signup page
        res.redirect("/signup");
      }
    
}))


// ======================== LOGIN ==================
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login",passport.authenticate("local",{ failureRedirect:"/login" , failureFlash : true}), async(req,res)=>{
     req.flash("success","Login Successful!! Welcome to WanderLust");
     res.redirect("/listings")

})

module.exports = router;