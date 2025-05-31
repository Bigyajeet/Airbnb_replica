const express=require("express");
const app=express();
const users=require("./routes/users.js");
const posts=require("./routes/post.js")
const session=require("express-session");
const path=require("path");
const flash=require("connect-flash");
//session
// app.use(session({
//     secret:"my name is bigyajeet",
//     resave:false,
//     saveUninitialized:true,
// })
// );
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`You sent a request ${req.session.count} times`)
// });

// app.get("/test",(req,res)=>{
//     res.send("connection successful")
// });


//storing and using session

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions={
    secret:"my name is bigyajeet",
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=> {
     res.locals.successMsg=req.flash("success");
      res.locals.errorMsg=req.flash("error");
      next();

});

app.get("/register",(req,res)=>{
    let {name="anonymous ki queen"}=req.query;
    req.session.name=name;
    if(name==="anonymous ki queen"){
       req.flash("error","user not registered "); 
    }else{
           req.flash("success","user registered successfully");
    }
    
    // res.send(name);
    res.redirect("/hello")
});

app.get("/hello",(req,res)=>{
    // res.send(`hello,${req.session.name}`);
    //  res.locals.successMsg=req.flash("success");
    //   res.locals.errorMsg=req.flash("error");
    
    // res.locals.messages=req.flash("success")
    res.render("pages.ejs",{name:req.session.name});
});


app.listen(3000,()=>{
    console.log("server is listening to 3000");
});




// const cookieParser=require("cookie-parser");

// //signed cookies
// app.use(cookieParser("secretcode"));

// //Signedcookie step 1

// app.get("/getcookies",(req,res)=>{
//     res.cookie("Location","Patia",{signed:true});
//     res.send("signed cookie sent");
// });

// //Signedcookie step 2 ie.verify

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })

// //cookie parser middleware
// app.use(cookieParser());

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","bigya");
//       res.cookie("you","ready");
//     res.send("ccokie sent");
// });
// //uses of cookies to be passed and accessed
// app.get("/greet",(req,res)=>{
//     let {name="unknown"}=req.cookies;
//     res.send(`Hi,${name}`);

// })

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi,I am root");
// });


// app.use("/users",users);
// app.use("/posts",posts);




