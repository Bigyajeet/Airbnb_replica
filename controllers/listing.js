const Listing=require("../models/listing.js");
const user=require("../models/user.js");



module.exports.index=async(req,res)=>{
   const allListing= await Listing.find({});

   res.render("listings/index.ejs",{allListing});
    

}


module.exports.newlisting=async(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
            model:'User'
        },
    })
    .populate('owner');
    if(!listing){
        req.flash("error","listing you requested for does not exist!");
       return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{ listing });
}

module.exports.createListing=async(req,res,next)=>{
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
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New listing Created!")
     res.redirect("/listings");
    }

    module.exports.EditListing=async(req,res)=>{
        let { id }=req.params;
        const listing=await Listing.findById(id);
         if(!listing){
            req.flash("error","listing you requested for does not exist!");
            res.redirect("/listings");
        }
        

        let OriginalImageUrl=listing.image.url;
       OriginalImageUrl= OriginalImageUrl.replace('/upload','/upload/h_200,w_250')
       res.render("listings/edit.ejs",{listing,OriginalImageUrl});
    
    }

    module.exports.updateListing=async(req,res)=>{
        // if(!req.body.listing){
        //     throw new ExpressError(400,"bad request")
        // }
        let {id}=req.params;
        let listing=await Listing.findByIdAndUpdate(id);
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
        }
        req.flash("success","Listing updated!");
        res.redirect(`/listings/${id}`);
    }

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
}