const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    res.render("admin/admin.html",{title:"后台管理"});
})
module.exports = router;