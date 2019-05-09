const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const User = require("./../../schema/Users");

//统一验证信息
let msgData;
router.use((req, res, next) => {
    msgData = {
        code: 0,
        msg: ""
    }
    next();
})

router.get("/", (req, res) => {
    if (req.session.userid) {
        res.render("api/api.html", {
            title: "接口API"
        });
    } else {
        res.redirect("/login");
    }

    // if (req.flash.user_info._id) {
    //     res.render("api/api.html", {
    //         title: "接口API"
    //     });
    // } else {
    //     res.redirect("/login");
    // }
})

//注册
router.post("/register", (req, res) => {
    let r = req.body;
    if (!r.username) {
        msgData.code = 1;
        msgData.msg = "用户名不能为空";
        return res.json(msgData);
    }
    if (!r.email) {
        msgData.code = 2;
        msgData.msg = "邮箱不能为空";
        return res.json(msgData);
    }
    if (!r.password || !r.password2) {
        msgData.code = 3;
        msgData.msg = "密码不能为空";
        return res.json(msgData);
    }
    if (r.password != r.password2) {
        msgData.code = 4;
        msgData.msg = "两次密码不一致！";
        return res.json(msgData);
    }
    console.log("当前注册信息为：", r);
    User.findOne({
        username: r.username
    }).then((user) => {
        if (user) {
            msgData.code = 4;
            msgData.msg = "当前用户已存在！";
            return res.json(msgData);
        }
        const avatar = gravatar.url(r.email, { s: '200', r: 'pg', d: 'mm' });
        //构造用户信息
        const newUser = new User({
            username: r.username,
            password: r.password,
            avatar,
            email: r.email
        })

        //密码加密
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                newUser.password = hash;
                newUser.save().then((newUserInfo) => {
                    msgData.msg = "注册成功！";
                    msgData.userInfo = {
                        _id: newUserInfo._id,
                        username: newUserInfo.username,
                        isAdmin: newUserInfo.isAdmin,
                        email: newUserInfo.email,
                        avatar: newUserInfo.avatar,
                        date: newUserInfo.date
                    };
                    req.flash("user_info", msgData.userInfo);
                    return res.json(msgData);
                }).catch((err) => {
                    throw err;
                    // msgData.code = 5;
                    // msgData.msg = "注册失败！";
                    // return res.status(500).json(msgData);
                })
            })
        })

    })
})

//登录
router.post("/login", (req, res) => {
    let r = req.body;
    if (!r.username || !r.password) {
        msgData.code = 6;
        msgData.msg = "用户名和密码不能为空";
        return res.json(msgData);
    }
    User.findOne({
        username: r.username
    }).then((userInfo) => {
        if (!userInfo) {
            msgData.code = 7;
            msgData.msg = "用户不存在！";
            return res.json(msgData);
        }
        bcrypt.compare(r.password, userInfo.password, (err, isMatch) => {
            if (err) {
                throw err
            }
            if (!isMatch) {
                msgData.code = 8;
                msgData.msg = "密码错误！";
                return res.json(msgData);
            }
            msgData.msg = "登录成功！";
            msgData.userInfo = {
                _id: userInfo._id,
                username: userInfo.username,
                isAdmin: userInfo.isAdmin,
                email: userInfo.email,
                avatar: userInfo.avatar,
                date: userInfo.date
            }
            req.session.userid = userInfo._id;
            req.flash("user_info", msgData.userInfo);
            return res.json(msgData);
        })
    })
})

//注销
router.get("/loginout", (req, res) => {
    req.session.destroy(err => {
        res.redirect("/");
    });
})

module.exports = router;