const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path")
const methodOverride  = require("method-override")
const ejsMate = require("ejs-mate");

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

//index route-list of all hotels
app.get("/listings",async (req,res)=>{
  let allListings = await Listing.find({});
  res.render("./listings/index.ejs",{allListings});

})

//create new listing - handle request from user
app.get("/listings/new",(req,res)=>{
  res.render("./listings/new.ejs");
})

app.post("/listings", async (req,res)=>{
  const newlisting = new Listing(req.body.listing)
  await newlisting.save()
  res.redirect("/listings")
})

//detail of a hotel 
app.get("/listings/:id", async(req,res)=>{
   let {id} = req.params;
   let listing = await Listing.findById(id);
   res.render("./listings/show.ejs",{listing});
})

app.get("/listings/:id/edit",async (req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});

})

app.put("/listings/:id",async (req,res)=>{
let{id} = req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing}); // parsing by ...
res.redirect(`/listings/${id}`)
})


app.delete("/listings/:id", async(req,res)=>{
  let {id} =req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  res.redirect("/listings")
})

app.get("/testListing", async (req, res) => {
  let sampleListing = new Listing({
    title: "new villa",
    description: "near beach",
    price: 23232,
    location: "goa",
    country: "india",
  });
  await sampleListing.save();
  console.log("listed");
  res.send("gotcha");
  });



 app.listen("8080", () => {
  console.log("server listening to port 8080 ");
 });
