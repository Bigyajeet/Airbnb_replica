const express=require("express");
const app=express();
const users=require("./routes/users.js");
const posts=require("./routes/post.js")
const cookieParser=require("cookie-parser");

//signed cookies
app.use(cookieParser("secretcode"));

//Signedcookie step 1

app.get("/getcookies",(req,res)=>{
    res.cookie("Location","Patia",{signed:true});
    res.send("signed cookie sent");
});

//Signedcookie step 2 ie.verify

app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("verified");
})

//cookie parser middleware
app.use(cookieParser());

app.get("/getcookies",(req,res)=>{
    res.cookie("greet","bigya");
      res.cookie("you","ready");
    res.send("ccokie sent");
});
//uses of cookies to be passed and accessed
app.get("/greet",(req,res)=>{
    let {name="unknown"}=req.cookies;
    res.send(`Hi,${name}`);

})

app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("Hi,I am root");
});


app.use("/users",users);
app.use("/posts",posts);

app.listen(3000,()=>{
    console.log("server is listening to 3000");
});



