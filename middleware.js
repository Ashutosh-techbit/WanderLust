const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema , reviewSchema} = require("./schema.js");

module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; //originalUrl save the path user want to access after click , which redirect to login
        req.flash("error","you must be logged !!");
        return res.redirect("/login");
    }
    next();
};

//this is done bcz passport will reintialize the sessions variables , hence to get redirectUrl we save it in locals variable
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner !!");
        return  res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validatelisting = (req,res,next)=>{
  let {error} =  listingSchema.validate(req.body); //server side validation by Joi npm package
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} =  reviewSchema.validate(req.body); //server side validation by Joi npm package
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  };

  
module.exports.isReviewAuthor = async (req,res,next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the creator of this !!");
        return  res.redirect(`/listings/${id}`);
    }
    next();
}