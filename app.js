const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");// helps to create layout
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError =require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const listingrouter=require("./routes/listing.js");
const reviewrouter=require("./routes/review.js");
const userrouter=require("./routes/user.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user.js");
const passportLocalMongoose=require("passport-local-mongoose");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
      
main().then(()=>{
    console.log("connected to Db");
}).catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);

  
}

//for view folder
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


//for express-session

const sessionOption={
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

//api started
app.get("/",(req,res)=>{
    res.send("Hi, I am root");
});


//session for use
app.use(session(sessionOption));
//connect-flash used
app.use(flash());


//before use passport must be intialized
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // console.log(res.locals.success)
    next();
});

//passport,salt,hash used checked
// app.get('/demouser',async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });






//resstructering listing
app.use("/listings",listingrouter);


//restructuring review
app.use("/listings/:id/reviews",reviewrouter);
app.use("/",userrouter);

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