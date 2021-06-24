const distance = function getDistanceFromLatLonInKm(user_lat,user_lng,charger_lat,charger_lng) { 
    function deg2rad(deg) { 
        return deg * (Math.PI/180) 
    } 

    var R = 6371; // Radius of the earth in km 
    var dLat = deg2rad(charger_lat-user_lat); // deg2rad below 
    var dLon = deg2rad(charger_lng-user_lng); 
    
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(user_lat)) * Math.cos(deg2rad(charger_lat)) * Math.sin(dLon/2) * Math.sin(dLon/2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km 
    return d; 
}




module.exports = distance;


