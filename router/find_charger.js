const express = require('express');
const router = express.Router({mergeParams: true});
const d = require("./utils/distance");
const Reservation  = require('../models').Reservations
const Charger = require('../models').Chargers
router.get('/',async (req,res)=>{
    try{
        let user_lat = req.params.current_lat; 
    let user_lng = req.params.current_lng;
    user_lat = parseFloat(user_lat);
    user_lng = parseFloat(user_lng);

    let chargers = await Reservation.findAll({raw: true});
    
    let free_chargers =[]

    for (let i = 0; i<chargers.length; i++){
        let now = new Date().getHours();
        now.toString
        let find = 'time_'+now
        let booked = chargers[i][`${find}`]
        

        if(booked == 0){
            free_chargers.push(chargers[i].reservation_key)
        }
    }

    let available_chargers = []
    for (let i = 0 ; i <free_chargers.length; i++){
        let key = free_chargers[i]
        let charger = await Charger.findOne({raw:true, where:{reservation_key: `${key}`}})
        available_chargers.push(charger)
    }
    console.log(available_chargers) // 현재 시간 기준 비어 있는 충전소들


    
    for (let i = 0; i<available_chargers.length;i++){
        let available_time =[]
        let reservationKey = available_chargers[i].reservation_key
        for(inspectTime=0;inspectTime<=23;inspectTime++){
            let availableInspect = await Reservation.findOne({
                raw:true,
                attributes: ['time_'+inspectTime.toString()],
                where: {reservation_key: `${reservationKey}`}
            });
            console.log(availableInspect)
            availableInspect = availableInspect['time_'+inspectTime.toString()];
            if(availableInspect==0){
                available_time.push(inspectTime);
            }
        }
        if(available_time.length!==0){
            available_chargers[i].available = available_time
        }
    } // 시간 추가
    
  
    let chargers_near = []
    for (let i = 0; i<available_chargers.length; i++){
        let charger_lng = available_chargers[i].x // x = 경도 = longitude
        let charger_lat = available_chargers[i].y // y = 위도 = latitude

        
        charger_lng = await parseFloat(charger_lng); 
        charger_lat = await parseFloat(charger_lat);  
        
        let Distance =  await d(user_lat,user_lng,charger_lat,charger_lng)
        
        if (Distance <= 20){
            available_chargers[i].distance_from = Distance;
            await chargers_near.push(available_chargers[i])
        };
    }
    chargers_near.sort(function(a,b) {
        return a.distance_from - b.distance_from
    })
    console.log(chargers_near)
    res.send({chargers_near})
    }catch(e){
        res.send(e)
    }}
    
    

)



module.exports = router;





