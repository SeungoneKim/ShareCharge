const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../models').Users;
const Chargers = require("../models").Chargers
const Reservations = require("../models").Reservations;

// paymentValidCheck/:email/:charger_key/:starting_time/:ending_time
router.get('/',async (req,res)=>{
    // information from req
    let userEmail = req.params.email;
    let chargerKey = req.params.charger_key;
    let starting_time = req.params.starting_time;
    let ending_time = req.params.ending_time;
    let reservation_length = ending_time - starting_time;

    // information about people
    let userKey = await User.findOne({
        raw:true,
        attributes: ['user_key'],
        where: {email: `${userEmail}`}
    });
    let ownerEmail = await Chargers.findOne({
        raw: true,
        attributes: ['email'],
        where: {charger_key: `${chargerKey}`}
    });
    let reservationKey = await Chargers.findOne({
        raw: true,
        attributes: ['reservation_key'],
        where: {charger_key: `${chargerKey}`}
    });

    // information about money and time
    let curUserCoin = await Users.findOne({
        raw: true,
        attributes: ['coin'],
        where: {email: `${userEmail}`}
    });
    let curOwnerCoin = await Users.findOne({
        raw: true,
        attributes:['email'],
        where: {email: `${ownerEmail}`}
    })
    let CostperHour = await Chargers.findOne({
        raw:true,
        attributes: ['price_per_hour'],
        where: {charger_key: `${chargerKey}`}
    });
    let totalCost = reservation_length * CostperHour;
    let newcurUserCoin = curUserCoin-totalCost;
    let newcurOwnerCoin = curOwnerCoin+totalCost;

    try{
        await Users.update(
            {coin: `${newcurUserCoin}`},
            {where: {email: `${userEmail}`}}
        ).then(
            Users.update(
                {coin: `${newcurOwnerCoin}`},
                {where: {email: `${ownerEmail}`}}
            )
        ).then(
            function(){
                for(inspectTime=starting_time;inspectTime<=ending_time;inspectTime++){
                    let whichtime = 'time_'+inpsectTime.toString();
                    let updateData= {};
                    updateData[`${whichtime}`] = `${userKey}`;
                    Reservations.update(
                        updateData,
                        {where:{reservation_key: `${reservationKey}`}}
                    );
                }
            }
        ).then(
            function(){
                let atLeastOneTimeAvailable=false;
                for(inspectTime=0;inspectTime<=23;inspectTime++){
                    let availableInspect = Reservations.findOne({
                        raw:true,
                        attributes: ['time_'+inspectTime.toString()],
                        where: {reservation_key: `${reservationKey}`}
                    });
                    if(availableInspect===0){
                        atLeastOneTimeAvailable=true;
                        break;
                    }
                }
                if(!atLeastOneTimeAvailable){
                    Chargers.update(
                        {available_time_left: false},
                        {where:{charger_key:chargerKey}}
                    );
                }
            }
        )
        res.send('done');
    }
    catch(error){
        res.send('not done',error);
    }

    
})

module.exports = router;