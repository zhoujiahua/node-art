const express = require("express");
const router = express.Router();
const User = require("./../../schema/Users");
router.get("/", (req, res) => {
    if (req.session.userid) {
        User.findById(req.session.userid).then((userInfo) => {
            res.render("admin/admin.html", {
                title: "后台管理",
                _id: userInfo._id,
                username: userInfo.username,
                email: userInfo.email,
                isAdmin: userInfo.isAdmin
            });
        })
    } else {
        res.redirect("/login");
    }
})
module.exports = router;