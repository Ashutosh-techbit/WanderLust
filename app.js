const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path")
const methodOverride  = require("method-override")
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")



const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))

app.engine('ejs', ejsMate); //setting template engine as ejsMate

//session
const sessionoptions = {
  secret : "mysupersecretcode",
  resave : false,
  saveUninitialized : true,
  cookie:{
    expires : Date.now() +  7 * 24 * 60 * 60 * 1000 ,
    maxAge : 7*24*60*60*1000,
    httpOnly : true,
  }
}


app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"/public")));


main()
.then(() => console.log("connected to db"))
.catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/", (req, res) => {
  res.send("server started");
});

app.use(session(sessionoptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //authenticate user

passport.serializeUser(User.serializeUser()) //store login data
passport.deserializeUser(User.deserializeUser()) //remove login data

// ========== create a fake demo user for testing ====================
// app.get("/demouser",async (req,res)=>{
//      let fakeuser = ({
//       email :"eve@gmail.com",
//       username:"eva" // we dont intialised in schema , it is intialised by passport itself ; every time username must be unique
//      });

//       let registereduser1 = await User.register(fakeuser,"eve123");
//      res.send(registereduser1);
// })


app.use((req,res,next)=>{
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   next();
})

//routes middlewares
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter );
app.use("/",userRouter);

// app.get("/testListing",wrapAsync( async (req, res) => {
//   let sampleListing = new Listing({
//     title: "new villa",
//     description: "near beach",
//     price: 23232,
//     location: "goa",
//     country: "india",
//   });
//   await sampleListing.save();
//   console.log("listed");
//   res.send("gotcha");
//   }));


//for all non-existing routes
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found !!"));
})

app.use((err,req,res,next)=>{
  let {statuscode=500 , message="something went wrong"} = err;
  res.status(statuscode).render("./listings/error.ejs" ,{ message});
})

 app.listen("8080", () => {
  console.log("server listening to port 8080 ");
 });
