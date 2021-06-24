const express = require('express');
const router = express.Router({mergeParams: true});
const Chargers = require("../models").Chargers
const Reservations = require("../models").Reservations;


router.get('/',async (req,res,next)=>{
    try{    
        
        let starting_time = req.params.starting_time;
	    console.log(starting_time);
        let ending_time = req.params.ending_time;
	    console.log(ending_time);
        let url = req.params.image_src
        url.toString()
        console.log(url)
        let new_url = url.replace(/_/g, "/");
        console.log(new_url)


        await Chargers.create({
            price_per_hour: req.params.price_per_hour,
            x: req.params.x,
            y: req.params.y,
            address_name: req.params.region_1depth_name+" "+req.params.region_2depth_name+" "+req.params.region_3depth_name,
            region_1depth_name: req.params.region_1depth_name,
            region_2depth_name: req.params.region_2depth_name,
            region_3depth_name: req.params.region_3depth_name,
            image_src: `${new_url}`,
            email: req.params.email,
            owner_name: req.params.owner_name
        })
        await Reservations.create({})

        let char_key = await Chargers.findOne({raw:true, attributes:['charger_key'],order:[['charger_key','DESC']]})
    
        char_key = char_key.charger_key
        char_key.toString()
        let new_char = char_key

    
        await Chargers.findOne({ raw:true, where:{ charger_key: `${new_char}`}}).then(async charger =>{
                await Chargers.update({reservation_key: charger.charger_key},{where: {charger_key: charger.charger_key}})
                    for(inspectTime=starting_time;inspectTime<=ending_time;inspectTime++){
                        let whichtime = 'time_'+inspectTime.toString();
                        let updateData= {};
                        
                        updateData[`${whichtime}`] = 0;
                        console.log(updateData)
                        Reservations.update(
                            updateData,
                            {where: {reservation_key: `${new_char}`}}
                        )
                    }
                });
        res.send("done");
        console.log('done')
    }
    catch(err){

        console.log(err)
        res.send(err)
    }
})


module.exports = router;


