const Listing=require("../models/listing.js");



module.exports.index=async(req,res)=>{
   const allListing= await Listing.find({});

   res.render("listings/index.ejs",{allListing});
    

}