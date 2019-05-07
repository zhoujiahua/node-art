const express = require('express');
const bcrypt = require("bcrypt");
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

//使用路由
app.use("/", mainRouter);
app.use("/api", apiRouter);
app.use("/admin", adminRouter);

//catch 404
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