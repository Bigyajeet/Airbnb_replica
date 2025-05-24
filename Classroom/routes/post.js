const express=require("express");
const router=express.Router();



//posts
//index
router.get("",(req,res)=>{
    res.send("Get for users");
})

//show
router.get("/:id",(req,res)=>{
    res.send("Get for post users");
});

//post-show
router.post("/:id",(req,res)=>{
    res.send("post for show ");
});

//delete
router.delete("/:id",(req,res)=>{
    res.send("delete for post id");
});

module.exports=router;


