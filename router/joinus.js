const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../models').Users;

router.get('/',async (req,res,next)=>{
    try{    
        let exist = await User.findOne({raw:true,
            where:{email: req.params.email}})
        if(!exist){
            const update = await User.create({
                name: req.params.name,
                email: req.params.email,
                telephone_num: req.params.telephone_num,
                sns_token: req.params.sns_token
            })
            res.send("done")
        }else{
            res.send("User already Exsits");
        }
    }catch(err){
        console.error(err)
        next(err)
    }
})


module.exports = router;