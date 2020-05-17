const LocalTime = require('js-joda').LocalTime;


const { DuctedHVACZone, UpstairsHVACZone, SLEEP_TIME_START, SLEEP_TIME_END } = require('./hvaczone');
const { ZoneTemperatureBounds } = require('./zonetemperature');


const calculateFanspeed = function (ductsOpenCount, time) {
    var speed = ductsOpenCount > 1 ? 3 : 2;

    if (time.isAfter(SLEEP_TIME_START) || time.isBefore(SLEEP_TIME_END)) {
        speed -= 1;
    }
 
    return speed;
};



let Zones = {
    "Living": new DuctedHVACZone({
            label: "Living Room",
            temperature: "gLivingRoomTemperature",
            duct: "KitchenDuct_Switch",
            openings: "gKitchenOpenings"
        },
        new ZoneTemperatureBounds("Living", [
            ["06:30", "21:00", 18, 30]
        ])
    ),
    "Kids": new DuctedHVACZone({
            label: "Kids Rooms",
            temperature: "gKidsRoomsTemperature",
            duct: "KidsRoomsDuct_Switch",
            openings: "gKidsRoomsOpenings",
        },
        new ZoneTemperatureBounds("Kids", [
            ["06:15", "07:15", 20, 30],
            ["18:15", "19:45", 20, 23],
            ["19:45", "06:15", 15, 23]
        ])
    ),
    "Games": new DuctedHVACZone({
            label: "Games Room",
            temperature: "gGamesRoomTemperature",
            duct: "GamesDuct_Switch",
            openings: "gGamesRoomOpenings",
        },
        new ZoneTemperatureBounds("Games", [
            ["18:30", "21:30", 20, 27],
        ])
    ),
    "Upstairs": new UpstairsHVACZone({
            label: "Upstairs",
            temperature: "gUpstairsBedroomTemperature",
            duct: "UpstairsDuct_Switch",
            openings: "gUpstairsOpenings",
        },
        new ZoneTemperatureBounds("Upstairs", [
            ["06:15", "07:45", 18, 24],
            ["20:00", "21:30", 15, 20],
            ["21:30", "06:15", 15, 19] // no ventilation
            //["21:30", "06:15", 15, 19, true] //true -> ventilate if possible
        ],
        [
            ["08:15", "20:00", 18, 35] //passive HVAC desires
        ])
    )
}


const processHvac = function () {

    let mode = null;
    let zoneCmds = {
        toOpen: [],
        toClose: []
    };

    for (let zoneName in Zones) {
        let zone = Zones[zoneName];

        switch(zone.shouldHeatOrCoolNow()) {
            case 'cool': {
                if (mode == "heat") {
                    log.warn("Zone " + zoneName + " needs cooling, but AC is heating another zone. Ignoring until heating complete.")
                    zoneCmds.toClose.push(zone);
                    continue;
                }
                mode = "cool"
                zoneCmds.toOpen.push(zone);
                log.debug("Zone {} marked for cooling", zoneName);
                break;
            }
            case 'heat': {
                if (mode == "cool") {
                    log.warn("Zone " + zoneName + " needs heating, but AC is cooling another zone. Ignoring until cooling complete.")
                    zoneCmds.toClose.push(zone);
                    continue;
                }
                mode = "heat";
                zoneCmds.toOpen.push(zone);
                log.debug("Zone {} marked for heating", zoneName);
                break;
            }
            case 'fan': {
                if(mode === null) {               
                    mode = "fan"; //cool or heat will override this, but the vent will remain open
                }

                zoneCmds.toOpen.push(zone);
                log.debug("Zone {} marked for ventilation", zoneName);
                break;
            }
            case null: {
                zoneCmds.toClose.push(zone);
                log.debug("Zone {} marked as within bounds", zoneName);
            }
        }
    }

    if (zoneCmds.toOpen.length == 0) { //don't close the last duct
        zoneCmds.toOpen.push(zoneCmds.toClose.shift());
        zoneCmds.allClosed = true;
    }

    //open/close the ducts
    for (let z of zoneCmds.toOpen) {
        z.setDuctState(true)
    }
    for (let z of zoneCmds.toClose) {
        z.setDuctState(false)
    }

    if (zoneCmds.allClosed) {
        items.getItem('HVAC_House').sendCommandIfDifferent("OFF") && log.info("Turning off AC");
    } else {
        log.debug("Setting HVAC mode to {}", mode);


        var fanspeed = calculateFanspeed(zoneCmds.toOpen.length, LocalTime.now());

        var temp = mode == "heat" ? 30 : 18;

        items.getItem('HVAC_House').sendCommandIfDifferent("ON") && log.info("Turning on AC")
        items.getItem('HVAC_Mode').sendCommandIfDifferent(mode) && log.info("Setting AC Mode to {}", mode)
        items.getItem('HVAC_FanSpeed').sendCommandIfDifferent(fanspeed) && log.debug("Setting AC Fanspeed to {}", fanspeed)
        items.getItem('HVAC_SetTemp').sendCommandIfDifferent(temp) && log.debug("Setting AC temp to {}", temp)
    }
};

module.exports = {
    Zones,
    processHvac,
    processPassiveHvac: () => Zones['Upstairs'].processPassiveHVAC()
}