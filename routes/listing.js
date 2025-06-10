const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingcontroller=require("../controllers/listing.js");
const multer=require("multer");
const upload=multer({dest:"uploads/"});
//index route //create route
router.route("/")
.get(wrapAsync(listingcontroller.index))
// .post(isLoggedIn,validateListing,wrapAsync(listingcontroller.createListing));
.post(upload.single('listing[image]'),(req,res)=>{
res.send(req.file);
});

//new route
router.get("/new",isLoggedIn,wrapAsync(listingcontroller.newlisting));
//show route //update route //delete route
router.route("/:id")
.get(wrapAsync(listingcontroller.showListing))
.put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingcontroller.updateListing))
.delete(isLoggedIn,
    isOwner,
    wrapAsync(listingcontroller.destroyListing));


//Edit route
router.get("/:id/edit",
    isLoggedIn,
    wrapAsync(listingcontroller.EditListing));
module.exports=router;