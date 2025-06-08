const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingcontroller=require("../controllers/listing.js");
//index route
router.get("/",wrapAsync(listingcontroller.index));


//new route
router.get("/new",isLoggedIn,wrapAsync(listingcontroller.newlisting));


//show route
router.get("/:id",wrapAsync(listingcontroller.showListing)
);

//create route
router.post("/",isLoggedIn,validateListing,wrapAsync(listingcontroller.createListing));

//Edit route
router.get("/:id/edit",
    isLoggedIn,
    wrapAsync(listingcontroller.EditListing));

//update route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingcontroller.updateListing));

//delete route
router.delete("/:id",isLoggedIn,
    isOwner,
    wrapAsync(listingcontroller.destroyListing));


module.exports=router;