const express = require("express");
const router = express.Router();

//posts
router.get("/",(req,res)=>{
    res.send("hi i am post");
})

router.get("/:id",(req,res)=>{
    res.send("get post with id");
})

router.post("/",(req,res)=>{
    res.send("post for post")
})

router.delete("/:id",(req,res)=>{
        res.send("delete for post")
})

module.exports = router;