const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isloggedin,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//post review route
router.post(
  "/",
  isloggedin,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// //delete reviews
router.delete(
  "/:reviewId",
  isloggedin,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
