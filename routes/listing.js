const express=require("express");
const router=express.Router();
const ExpressError =require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");




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
router.get("/",wrapAsync(async(req,res)=>{
   const allListing= await Listing.find({});
   req.flash("success","new listing created!");
   res.render("listings/index.ejs",{allListing});
    

}));


//new route
router.get("/new",wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs")
}));


//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//create route
router.post("/", validateListing,wrapAsync(async(err,req,res,next)=>{
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
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let { id }=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

}));

//update route
router.put("/:id", validateListing,wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"bad request")
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


module.exports=router;