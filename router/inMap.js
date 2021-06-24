const express = require('express');
const router = express.Router({mergeParams: true});
const Chargers = require("../models").Chargers
const Reservation = require('../models').Reservations
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/', async (req,res)=>{
    let max_x = req.params.max_x;
    let max_y = req.params.max_y;
    let min_x = req.params.min_x;
    let min_y = req.params.min_y;
    console.log(max_x,max_y,min_x,min_y)
    
    let chargers_in_range = await Chargers.findAll({
        raw:true,
        where: {
            available_time_left: 1,
            [Op.and]:[
                {x : {[Op.gte]: `${min_x}`}},
                {x : {[Op.lte]: `${max_x}`}},
                {y : {[Op.gte]: `${min_y}`}},
                {y : {[Op.lte]: `${max_y}`}}
            ]
        }
    })  
    
    for (let i = 0; i<chargers_in_range.length;i++){
        let available_time =[]
        let reservationKey = chargers_in_range[i].reservation_key
        for(inspectTime=0;inspectTime<=23;inspectTime++){
        
            let availableInspect = await Reservation.findOne({
                raw:true,
                attributes: ['time_'+inspectTime.toString()],
                where: {reservation_key: `${reservationKey}`}
            });
    
            availableInspect = availableInspect['time_'+inspectTime.toString()];
            if(availableInspect==0){
                available_time.push(inspectTime);
            }
        }
        if(available_time.length!==0){
            chargers_in_range[i].available = available_time
        }
    }

    console.log(chargers_in_range)
    res.send(chargers_in_range) 
  }
)



let inMap = async (req,res) => {
    
}
module.exports = router;
