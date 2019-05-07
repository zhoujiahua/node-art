const express = require("express");
const router = express.Router();
const User = require("./../../schema/Users");

router.get("/", (re, res) => {
    res.render("api/api.html", {
        title: "接口API"
    });
})

//注册
router.post("/register", (req, res) => {
    User.findOne({
        username: "user"
    }).then((user) => {
        console.log(user);
        if (user) {
            console.log("用户已存在！");
            res.send("用户已存在！");
        }
        let newUser = new User({
            username: "user",
            password: "123456",
            email: "jiahuasir@163.com"
        })
        newUser.save().then((userInfo) => {
            console.log("注册成功！");
            res.send("注册成功！");
        }).catch((err) => {
            console.log("注册失败！");
            res.send("注册失败！");
        })
    })
})


module.exports = router;