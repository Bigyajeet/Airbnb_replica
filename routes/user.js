const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController= require("../controllers/user.js");


router.get("/signup",userController.rendersignupform);

router.post('/signup',wrapAsync(userController.signup
));
router.get('/login',userController.renderloginform).then

router.post('/login',
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:'/login',
        failureFlash:true,
    }),
    userController.login
    
);

router.get('/logout',userController.logOut);
module.exports=router;
