var express = require("express");
var router = express.Router();

router.post('/login', (req, res) => {
    console.log("Logged in");
    console.log(req.body);
    res.send({msg:req.body});
});

module.exports = router;