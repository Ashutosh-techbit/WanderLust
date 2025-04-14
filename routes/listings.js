if(process.env.NODE_ENV!="production"){
  require('dotenv').config()
}

console.log(process.env.SECRET)


const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isloggedin, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require('../cloudConfig')
const upload = multer({ storage })

router.route("/")
.get(
  wrapAsync(listingController.index)
)
.post(
  isloggedin,
  upload.single('listing[image]'),
  validatelisting,
  wrapAsync(listingController.createListing)
);


//create new listing - handle request from user
//New route
router.get("/new", isloggedin, listingController.renderNewForm);

router.route("/:id")
.get(
  wrapAsync(listingController.showListings)
)
.put(
  isloggedin,
  isOwner,
  upload.single('listing[image]'),
  validatelisting,
  wrapAsync(listingController.updateListing)
)
.delete(
  isloggedin,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

//Edit route
router.get(
  "/:id/edit",
  isloggedin,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
