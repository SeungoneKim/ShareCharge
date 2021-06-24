const express = require('express');
const router = express.Router({mergeParams: true});
const Users = require('../models').Users;
const Chargers = require("../models").Chargers
const Reservations = require("../models").Reservations;

router.get('/',async (req,res)=>{
    // information from req
    let chargerKey = req.params.charger_key;
    let yesorno = req.params.yesorno;

    let starting_time=0;
    let ending_time=0;

    // information about people
    let ownerEmail = await Chargers.findOne({
        raw: true,
        attributes: ['email'],
        where: {charger_key: `${chargerKey}`}
    });
    ownerEmail = ownerEmail['email'];
    let reservationKey = await Chargers.findOne({
        raw: true,
        attributes: ['reservation_key'],
        where: {charger_key: `${chargerKey}`}
    });
    reservationKey=reservationKey['reservation_key'];

    let firstTimetoFindNegative= false;

    for(inspectTime=0;inspectTime<=23;inspectTime++){
        let availableInspect = await Reservations.findOne({
            raw:true,
            attributes: ['time_'+inspectTime.toString()],
            where: {reservation_key: `${reservationKey}`}
        });
        availableInspect= availableInspect['time_'+inspectTime.toString()];
        if(!firstTimetoFindNegative && availableInspect<0){
            firstTimetoFindNegative=true;
            starting_time=inspectTime;
        }
        else if(firstTimetoFindNegative && availableInspect>=0){
            ending_time=inspectTime-1;
            break;
        }
    }
    if(firstTimetoFindNegative){
        // find value of userId
        let userKey = await Reservations.findOne({
            raw:true,
            attributes: ['time_'+starting_time.toString()],
            where: {reservation_key: `${reservationKey}`}
        });
        userKey= userKey['time_'+starting_time.toString()];
        userKey = -userKey;

        // update info of Reservation : both for accepted and declined!
        for(inspectTime=starting_time;inspectTime<=ending_time;inspectTime++){
            let whichtime = 'time_'+inspectTime.toString();
            let updateData= {};
            updateData[`${whichtime}`] = userKey;
            await Reservations.update(
                updateData,
                {where:{reservation_key: `${reservationKey}`}}
            );
        }
        let userEmail = await Users.findOne({
            raw: true,
            attributes: ['email'],
            where: {user_key: `${userKey}`}
        });
        userEmail = userEmail['email'];
        // if Owner declined the request
        if(yesorno==1){
            await Users.update(
                {waiting_charger: `${-chargerKey}`},
                {where:{email: `${userEmail}`}}
            );
        }
        // whether accepted or declined by Owner
        res.send("Your consideration was applied");
    }
    else{
        res.send("You shouldn't have called this router.");
    }
    
})

module.exports = router;