const express = require('express');
const router = express.Router({mergeParams: true});
const Users = require('../models').Users;
const Chargers = require("../models").Chargers
const Reservations = require("../models").Reservations;

router.get('/',async (req,res)=>{
    // information from req
    let userEmail = req.params.email;

    let starting_time=0;
    let ending_time=0;

    // information about people
    let userKey = await Users.findOne({
        raw:true,
        attributes: ['user_key'],
        where: {email: `${userEmail}`}
    });
    userKey = userKey['user_key'];
    let waitingCharger = await Users.findOne({
        raw:true,
        attributes: ['waiting_charger'],
        where: {email: `${userEmail}`}
    });
    waitingCharger = waitingCharger['waiting_charger'];
    let you_are_declined = false;

    if(waitingCharger!==0){
        if(waitingCharger<0){
            you_are_declined=true;
            waitingCharger= -waitingCharger;
        }
        let ownerEmail = await Chargers.findOne({
            raw: true,
            attributes: ['email'],
            where: {charger_key: `${waitingCharger}`}
        });
        ownerEmail = ownerEmail['email'];
        let reservationKey = await Chargers.findOne({
            raw: true,
            attributes: ['reservation_key'],
            where: {charger_key: `${waitingCharger}`}
        });
        reservationKey = reservationKey['reservation_key'];

        let firstTimetoFindMyself= false;
        for(inspectTime=0;inspectTime<=23;inspectTime++){
            let availableInspect = await Reservations.findOne({
                raw:true,
                attributes: ['time_'+inspectTime.toString()],
                where: {reservation_key: `${reservationKey}`}
            });
            availableInspect =availableInspect['time_'+inspectTime.toString()];
            
            if(!firstTimetoFindMyself && availableInspect===userKey){
                firstTimetoFindMyself=true;
                starting_time=inspectTime;
            }
            else if(firstTimetoFindMyself && availableInspect!==userKey){
                ending_time=inspectTime-1;
                break;
            }
        }
        if(firstTimetoFindMyself){
            let curUserCoin = await Users.findOne({
                raw: true,
                attributes: ['coin'],
                where: {email: `${userEmail}`}
            });
            curUserCoin = curUserCoin['coin'];
            let curOwnerCoin = await Users.findOne({
                raw: true,
                attributes: ['coin'],
                where: {email: `${ownerEmail}`}
            });
            curOwnerCoin = curOwnerCoin['coin'];
            let CostperHour = await Chargers.findOne({
                raw:true,
                attributes: ['price_per_hour'],
                where: {charger_key: `${waitingCharger}`}
            });
            CostperHour = CostperHour['price_per_hour']
            let reservation_length = ending_time - starting_time;
            let totalCost = reservation_length * CostperHour;
            let newcurUserCoin = curUserCoin-totalCost;
            let newcurOwnerCoin = curOwnerCoin+totalCost;
            
            // change waiting_charger back to default value
            if(you_are_declined){
                Users.update(
                    {waiting_charger: 0},
                    {where:{email: `${userEmail}`}}
                );
                res.send("your request was not accepted by provider");
                //res.send(1);
            }
            else{ 
                //res.send("Your request was not accepted by provider.");
                try{
                    await Users.update(
                        {waiting_charger: 0},
                        {where:{email: `${userEmail}`}}
                    ).then( 
                        Users.update(
                            {coin: `${newcurUserCoin}`},
                            {where: {email: `${userEmail}`}}
                        )
                    ).then(
                        Users.update(
                            {coin: `${newcurOwnerCoin}`},
                            {where: {email: `${ownerEmail}`}}
                        )
                    ).then(
                        function(){
                            for(inspectTime=starting_time;inspectTime<=ending_time;inspectTime++){
                                let whichtime = 'time_'+inspectTime.toString();
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
                                availableInspect = availableInspect['time_'+inspectTime.toString()];
                                if(availableInspect===0){
                                    atLeastOneTimeAvailable=true;
                                    break;
                                }
                            }
                            if(!atLeastOneTimeAvailable){
                                Chargers.update(
                                    {available_time_left: false},
                                    {where:{charger_key:waitingCharger}}
                                );
                            }
                        }
                    )
                    res.json({"starting_time":starting_time, "ending_time":ending_time, "email":ownerEmail});
                    
                }
                catch(error){
                    console.log(error);
                    res.send("Server error. This wouldn't happen")
                    //res.send(0);
                }
            }
        }
        else{
            //res.json({'userEmail':userEmail,'userKey':userKey,'starting':starting_time,'ending':ending_time,
            //    'waitingCharger':waitingCharger,'ownerEmail':ownerEmail,'reservationKey':reservationKey});
            res.send("Your request was not regarded by provider yet.");
            //res.send(2);
        }
    }
    else{
        res.send("You shouldn't have called this router.");
        //res.send(3);
    }
    
})

module.exports = router;