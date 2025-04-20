const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")
const methodOverride  = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")
const PORT = process.env.PORT || 8080;

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.engine('ejs', ejsMate); //setting template engine as ejsMate

const store =  MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24*3600,
});

store.on("error",()=>{
  console.log("ERROR in mongo session store",err);
})

//session
const sessionoptions = {
  store,
  secret : process.env.SECRET,
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
  await mongoose.connect(dbUrl);
}

app.use(session(sessionoptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //authenticate user

passport.serializeUser(User.serializeUser()) //store login data
passport.deserializeUser(User.deserializeUser()) //remove login data

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

//for all non-existing routes
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found !!"));
})

app.use((err,req,res,next)=>{
  let {statuscode=500 , message="something went wrong"} = err;
  res.status(statuscode).render("./listings/error.ejs" ,{ message});
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});