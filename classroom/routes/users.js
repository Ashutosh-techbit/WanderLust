const express = require("express");
const router = express.Router();

//users
router.get("/",(req,res)=>{
    res.send("hi i am user");
})

router.get("/:id",(req,res)=>{
    res.send("get User with id");
})

router.post("/",(req,res)=>{
    res.send("post for user")
})

router.delete("/:id",(req,res)=>{
        res.send("delete for user")
})

module.exports = router;