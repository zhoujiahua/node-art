const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.render("main/main",{title:"欢迎来到主页"});
})

module.exports = router;