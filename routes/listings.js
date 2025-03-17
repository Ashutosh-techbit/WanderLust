const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema , reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

const validatelisting = (req,res,next)=>{
  let {error} =  listingSchema.validate(req.body); //server side validation by Joi npm package
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}

//index route-list of all hotels
//Index route
router.get("/",wrapAsync(async (req,res)=>{

  let allListings = await Listing.find({});
  res.render("./listings/index.ejs",{allListings});
}))

//create new listing - handle request from user
//New route
router.get("/new",(req,res)=>{
  res.render("./listings/new.ejs");
})

//show route
router.get("/:id", wrapAsync(async(req,res)=>{
  let {id} = req.params;
  // let listing = await Listing.findById(id);
  const listing = await Listing.findById(id).populate("reviews");
  res.render("./listings/show.ejs",{listing});
}))

//create route
router.post("/", validatelisting , wrapAsync(async (req,res,next)=>{
 
  const newlisting = new Listing(req.body.listing)
  await newlisting.save()
  res.redirect("/listings")
})
);

//Edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});

}))

//Update Route
router.put("/:id", validatelisting , wrapAsync(async (req,res)=>{
   let{id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing}); // parsing by ...
  res.redirect(`/listings/${id}`)
  }))

//Delete route 
router.delete("/:id",wrapAsync( async(req,res)=>{
  let {id} =req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  res.redirect("/listings")
}))

module.exports = router;