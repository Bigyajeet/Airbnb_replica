const mongoose=require("mongoose");
const Schema=mongoose.Schema;

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

const Listing=mongoose.model("listing",listingSchema);
module.exports=Listing;