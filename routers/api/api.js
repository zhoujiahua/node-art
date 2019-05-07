const express = require("express");
const router = express.Router();
router.get("/", (re, res) => {
    res.render("api/api.html",{title:"接口API"});
})
module.exports = router;