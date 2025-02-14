const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
    type: String,
    //check when image is undefined
    default:
      "https://unsplash.com/photos/a-logo-of-a-group-of-colorful-shapes-_1PkO1vvYVI",

      //check when image is empty
    set: (v) =>
      v === ""
        ? " https://unsplash.com/photos/a-logo-of-a-group-of-colorful-shapes-_1PkO1vvYVI"
        : v,
  },

  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;
