const LocalTime = require('js-joda').LocalTime;
const log = require('ohj').log('gfhvac');
const { items } = require('ohj');


const { HVACZone } = require('./hvaczone');
const { ZoneTemperatureBounds } = require('./zonetemperature');


let zone = new HVACZone({
        label: "Granny Flat",
        temperature: "gLivingRoomTemperature",
        openings: "gGrannyFlatDoors",
    },
    new ZoneTemperatureBounds({
        name: "GrannyFlat", 
        bounds: [
            ["08:00", "17:30", 20, 27]
        ],
        workdaysOnly: true
    })
);

const processHvac = () => {

    let mode = zone.shouldHeatOrCoolNow(); //null = within bounds

    if (mode == null) {
        items.getItem('HVAC2_House').sendCommandIfDifferent("OFF") && log.info("Turning off GF AC");
    } else {
        log.debug("Setting GF HVAC mode to {}", mode);

        let fanspeed = 2;
        var temp = mode == "heat" ? 30 : 18;

        items.getItem('HVAC2_House').sendCommandIfDifferent("ON") && log.info("Turning on GF AC")
        items.getItem('HVAC2_Mode').sendCommandIfDifferent(mode.toUpperCase()) && log.info("Setting GF AC Mode to {}", mode)
        items.getItem('HVAC2_FanSpeed').sendCommandIfDifferent(fanspeed) && log.debug("Setting GF AC Fanspeed to {}", fanspeed)
        items.getItem('HVAC2_SetTemp').sendCommandIfDifferent(temp) && log.debug("Setting GF AC temp to {}", temp)
    }
};

module.exports = {
    processHvac,
    Zone: zone
}