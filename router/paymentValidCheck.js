const express = require('express');
const router = express.Router({mergeParams: true});
const Users = require('../models').Users;
const Chargers = require("../models").Chargers
const Reservations = require("../models").Reservations;

// paymentValidCheck/:email/:charger_key/:starting_time/:ending_time
// debug
//      res.json({"usercoin":curUserCoin, "totalcost":totalCost, "reservationlen":reservation_length, 
//      "costperhour":CostperHour, "userkey":userKey, "ownerEmail":ownerEmail, "reservationKey":reservationKey,"possibletimeleft":possibleTimeLeft});
router.get('/',async (req,res)=>{
    // information from req
    let userEmail = req.params.email;
    let chargerKey = req.params.charger_key;
    let starting_time = req.params.starting_time;
    let ending_time = req.params.ending_time;
    let reservation_length = ending_time - starting_time;

    // information about people
    let userKey = await Users.findOne({
        raw:true,
        attributes: ['user_key'],
        where: {email: `${userEmail}`}
    });
    userKey = userKey['user_key'];
    let ownerEmail = await Chargers.findOne({
        raw: true,
        attributes: ['email'],
        where: {charger_key: `${chargerKey}`}
    });
    ownerEmail= ownerEmail['email'];
    let reservationKey = await Chargers.findOne({
        raw: true,
        attributes: ['reservation_key'],
        where: {charger_key: `${chargerKey}`}
    });
    reservationKey = reservationKey['reservation_key']

    // information about money and time
    let curUserCoin = await Users.findOne({
        raw: true,
        attributes: ['coin'],
        where: {email: `${userEmail}`}
    });
    curUserCoin = curUserCoin['coin']
    let CostperHour = await Chargers.findOne({
        raw:true,
        attributes: ['price_per_hour'],
        where: {charger_key: `${chargerKey}`}
    });
    CostperHour = CostperHour['price_per_hour']
    let totalCost = reservation_length * CostperHour;

    let possibleTimeLeft = await Chargers.findOne({
        raw:true,
        attributes: ['available_time_left'],
        where: {charger_key: `${chargerKey}`}
    });
    possibleTimeLeft = possibleTimeLeft['available_time_left']

    if(possibleTimeLeft){
        if(curUserCoin >= totalCost){
            let goodToGo = true;
            for(inspectTime=starting_time;inspectTime<=ending_time;inspectTime++){
                let availableInspect = await Reservations.findOne({
                    raw:true,
                    attributes: ['time_'+inspectTime.toString()],
                    where: {reservation_key: `${reservationKey}`}
                });
                availableInspect = availableInspect['time_'+inspectTime.toString()];
                if(availableInspect!==0){
                    res.send("You cannot change"); // the requested time is not possible
                    //res.send("the requested time is not possible");
                    goodToGo=false;
                    break;
                }
            }
            if(goodToGo){
                // update info of Reservation
                for(inspectTime=starting_time;inspectTime<=ending_time;inspectTime++){
                    let whichtime = 'time_'+inspectTime.toString();
                    let updateData= {};
                    updateData[`${whichtime}`] = `${-userKey}`;
                    await Reservations.update(
                        updateData,
                        {where:{reservation_key: `${reservationKey}`}}
                    );
                }
                await Users.update(
                    {waiting_charger:`${chargerKey}`},
                    {where:{email: `${userEmail}`}}
                );
                res.send("You can change"); // GOOD TO GO!
            }
        }
        else{
            res.send("You cannot change"); // requestor does not have enough coin to make reservation
            //res.send("requestor does not have enough coin to make reservation");
        }
    }
    else{
        res.send("You cannot change"); // there is no possible time left for this charger
        //res.send("there is no possible time left for this charger");
    }
})

module.exports = router;