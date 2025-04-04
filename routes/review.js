const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/review.js");
const { reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


//Reviews
// //review vlidation
const validateReview = (req,res,next)=>{
    let {error} =  reviewSchema.validate(req.body); //server side validation by Joi npm package
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  };
  
  //post review route
  router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save()
    await listing.save()
    req.flash("success","review create ")
    res.redirect(`/listings/${listing._id}`);
  }));
  
  
  // //delete reviews
  router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;
  
    await Listing.findByIdAndUpdate(id,{$pull: {reviews : reviewId} });
     await Review.findByIdAndDelete(reviewId);
     req.flash("success","review deleted ")
     res.redirect(`/listings/${id}`)
  }))

  module.exports = router;