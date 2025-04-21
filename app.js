const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");// helps to create layout
const wrapAsync=require("./utils/wrapAsync.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
      
main().then(()=>{
    console.log("connected to Db");
}).catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

//for view folder
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//api started
app.get("/",(req,res)=>{
    res.send("Hi, I am root");
})

//index route
app.get("/listings",async(req,res)=>{
   const allListing= await Listing.find({});
   res.render("listings/index.ejs",{allListing});
    

});
//new route
app.get("/listings/new",async(req,res)=>{
    res.render("listings/new.ejs")
});

//show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//create route
app.post("/listings",wrapAsync(async(err,req,res,next)=>{
    // let {title,description,image,price,country,location}=req.body;
   
    let newListing=new Listing(req.body.listing);
    await newListing.save();
     res.redirect("/listings");
    }
));

//Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let { id }=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

});

//update route
app.put("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});
//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});
//testing
// app.get("/testListing",async(req,res)=>{
//     // console.log("testing successfully");
//     let sampleTesting=new Listing({
//         title:"my work villa",
//         description:"ready ta enjoy pai",
//         image:"shubham-dhage-fMCHQ2uUzrk-unsplash.jpg",
        
//         price:12000,
//         location:"bhubaneswar",
//         country:"Odisha",

//     })
//    await sampleTesting.save();
//    console.log("saved");
//    res.send("saved successfully");
// });
app.use((err,req,res,next)=>{
    res.send("Something went wrong!");
});



app.listen(8080,()=>{
    console.log("server is running on port 8080");
});