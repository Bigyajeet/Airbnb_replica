const express=require("express");
const router=express.Router({mergeParams:true});
const ExpressError =require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewcontroller=require("../controllers/review.js")




// post review for show
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewcontroller.createReview)
);


//Delete Review Route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewcontroller.destroyreview
));

module.exports=router;
