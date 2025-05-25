const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js")

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
       
        type:String,
        // required:true,
        default:"shubham-dhage-fMCHQ2uUzrk-unsplash.jpg",
        set:(v)=>v===""?"shubham-dhage-fMCHQ2uUzrk-unsplash.jpg":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
});

//moongoose middleware for deletion of review(post mongoose middleware)
listingSchema.post("findOneAndDelete",async(listing)=>{
if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
}
});

const Listing=mongoose.model("listing",listingSchema);
module.exports=Listing;