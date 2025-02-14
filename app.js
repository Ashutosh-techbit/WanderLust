const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing")

main()
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/", (req, res) => {
  res.send("server started");
});

app.get("/testlisting",async (req,res)=>{
  let sampleListing = new Listing({
    title:"new villa",
    description : "near beach",
    price: 23232,
    location:"goa",
    country:"india",

  })

  await sampleListing.save()
  console.log("listed");
  res.send("gotcha");
})

app.listen("8080", () => {
  console.log("server listening to port 8080 ");
});
