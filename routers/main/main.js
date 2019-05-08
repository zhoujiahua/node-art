const express = require("express");
const User = require("./../../schema/Users");
const router = express.Router();

router.get("/", (req, res) => {
    if (req.session.userid) {
        User.findById(req.session.userid).then((userInfo) => {
            res.render("main/main", {
                title: "首页",
                _id: userInfo._id,
                username: userInfo.username,
                email: userInfo.email,
                isAdmin: userInfo.isAdmin
            });
        })
    } else {
        res.render("main/main", {
            title: "首页"
        });
    }
})

router.get("/login", (req, res) => {
    if (req.session.userid) {
        res.redirect("/");
    } else {
        res.render("main/login", {
            title: "登录"
        });
    }

})

module.exports = router;