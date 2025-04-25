const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");// helps to create layout
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError =require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");


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
});

//middleware validate using joi
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next()
    }
};

//index route
app.get("/listings",wrapAsync(async(req,res)=>{
   const allListing= await Listing.find({});
   res.render("listings/index.ejs",{allListing});
    

}));
//new route
app.get("/listings/new",wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs")
}));

//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

//create route
app.post("/listings", validateListing,wrapAsync(async(err,req,res,next)=>{
    // let {title,description,image,price,country,location}=req.body;
    // if(!req.body.listing){
    //     throw new ExpressError(400,"bad request")
    // }
    //adding of joi
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);//joi sends error 
    // }
    // if(!newListing.title){
    //     throw new ExpressError(400,"title is missing")

    // }
    // if(!newListing.description){
    //     throw new ExpressError(400,"description is missing")

    // }
    // if(!newListing.location){
    //     throw new ExpressError(400,"location is missing")

    // } instead of these if condition we use joi tool for validation 

    
    await newListing.save();
     res.redirect("/listings");
    }
));

//Edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let { id }=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

}));

//update route
app.put("/listing/:id", validateListing,wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"bad request")
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));
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

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found")); //add expressError
// });

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    // res.send("Something went wrong!");
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
    
});




app.listen(8080,()=>{
    console.log("server is running on port 8080");
});