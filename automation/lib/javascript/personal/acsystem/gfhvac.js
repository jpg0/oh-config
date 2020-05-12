const LocalTime = require('js-joda').LocalTime;


const { HVACZone } = require('./hvaczone');
const { ZoneTemperatureBounds } = require('./zonetemperature');


let Zones = {
    "Main": new HVACZone(
        "Granny Flat",
        "gLivingRoomTemperature",
        "gGrannyFlatDoors",
        new ZoneTemperatureBounds("Granny Flat", [
            ["08:00", "17:30", 20, 28]
        ])
    )
}


const processHvac = function () {

};

module.exports = {
    Zones,
    processHvac
}