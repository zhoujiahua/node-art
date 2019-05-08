const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    if(req.session.userid){
        res.render("admin/admin.html",{title:"后台管理"});
    }else{
        res.redirect("/login");
    }
})
module.exports = router;