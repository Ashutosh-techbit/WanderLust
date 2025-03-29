const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path")
const methodOverride  = require("method-override")
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")


const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))

app.engine('ejs', ejsMate); //setting template engine as ejsMate

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

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews );

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
