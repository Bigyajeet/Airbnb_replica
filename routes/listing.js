const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
//index route
router.get("/",wrapAsync(async(req,res)=>{
   const allListing= await Listing.find({});

   res.render("listings/index.ejs",{allListing});
    

}));


//new route
router.get("/new",isLoggedIn,wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs");
}));


//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate('owner');
    if(!listing){
        req.flash("error","listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{ listing });
})
);

//create route
router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res,next)=>{
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

    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    console.log(user);
    await newListing.save();
    req.flash("success","New listing Created!")
     res.redirect("/listings");
    }
));

//Edit route
router.get("/:id/edit",
    isLoggedIn,
    wrapAsync(async(req,res)=>{
    let { id }=req.params;
    const listing=await Listing.findById(id);
     if(!listing){
        req.flash("error","listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});

}));

//update route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"bad request")
    // }
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id);
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn,
    isOwner,
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
}));


module.exports=router;