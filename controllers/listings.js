const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  }

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
  }



module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    // let listing = await Listing.findById(id);
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested does not exsisted!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
  }

module.exports.createListing =  async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url , filename};
    await newlisting.save();
    req.flash("success", "New listing created ");
    res.redirect("/listings");
  }

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested does not exsisted!");
      res.redirect("/listings");
    }

    req.flash("success", "listing edited ");
    res.render("./listings/edit.ejs", { listing });
  }

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // parsing by ...
    req.flash("success", "listing updated ");
    res.redirect(`/listings/${id}`);
  }

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted ");
    res.redirect("/listings");
  }