const express = require('express');
const router = express.Router({mergeParams: true});

router.get("/", async (req,res)=>{
    res.send("good to go!")
});

module.exports = router;