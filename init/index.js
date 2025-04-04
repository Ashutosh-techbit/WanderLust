//this file manages the database

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//delete pre-existing data and add new one
const initDB = async () => {
  await Listing.deleteMany({});
 initData.data = initData.data.map((obj)=>({...obj,owner:"67ead5739e4a5b40cc7e6194"}));
  await Listing.insertMany(initData.data); 
  console.log("data was initialized");
};

initDB();