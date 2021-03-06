const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const comm = require("./config/comm");
const app = express();

//引入路由模块
const mainRouter = require("./routers/main/main");
const adminRouter = require("./routers/admin/admin");
const apiRouter = require("./routers/api/api");

//设置静态目录
app.use(express.static(__dirname + "/public"));

// const swig = require('swig');
//设置swig页面不缓存
// swig.setDefaults({
//     cache: false
// })
// app.set('view cache', false);
// app.set('views', './views');
// app.set('view engine', 'html');
// app.engine('html', swig.renderFile);

//使用express-art-template
app.set('view cache', false);
app.set('views', './views');
app.set('view engine', 'html');
app.engine('html', require('express-art-template'));
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});

//路由
// router.get('/', function (req, res) {
//     res.render('index.html', {
//         title: "atr-template"
//     });
// });

//session & flash
app.use(session({
    secret: "haoahaoxuexi",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000 * 30
    }
}))

app.use(flash());

//全局变量
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.user_info = req.flash("user_info");
    next();
})

//使用body-parser
app.use(bodyParser.urlencoded({
    extend: false
}));
app.use(bodyParser.json());

//使用路由
app.use("/", mainRouter);
app.use("/api", apiRouter);
app.use("/admin", adminRouter);

// catch 404
app.use((req, res, next) => {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
})
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render("error/error.html", {
        message: err.message,
        error: {
            status: err.status,
            desc: "不好意思你的页面被狗叼走了！"
        }
    });
})

//端口监听
const port = process.env.PORT || 9000;
app.listen(port, (err) => {
    if (err) throw err;
    console.log(`正在监听：${port}端口`);
});

//数据库连接 (mongodb://localhost:27017/blog)
mongoose.connect(comm.localBD, {
    useNewUrlParser: true
}, (err) => {
    if (!err) {
        console.log("数据库连接成功！");
    } else {
        console.log("数据连接失败！");
    }
})

//passport 
app.use(passport.initialize());
require("./config/passport")(passport);
