const express = require('express');
const router = express.Router({mergeParams: true});
const users = require('../models').Users;



router.get('/',async (req,res)=>{
        let purchase = req.params.amount;
        console.log(req.params.email)
        let current_coin = await users.findAll({raw:true, attributes: ['coin'], where:{email: req.params.email}}).then(
            result => {return result}
        );
        current_coin = current_coin[0].coin
        purchase = parseInt(purchase);
        let total = current_coin + purchase;
        await users.update({coin: `${total}` },{where:{email:req.params.email}}).then(result => {res.send("done")});
    }
)



module.exports = router;
