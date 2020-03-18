const log = require('ohj').log("acmanager");
const { items, rules, fluent, triggers } = require('ohj');
const acsystem = require('acsystem');
 
const LocalTime = require('js-joda').LocalTime;

//first wire up the switches
with (fluent) {

    when(item('gDucts').changed().toOff()).then(sendOn().toItem('KitchenDuct_Switch'));

    //AC duct buttons - maybe create a 'proxy' method instead of the following?
    when(item('KitchenDuct_Switch').receivedCommand()).then(sendIt().toItem('ACDucts_Switch_1'));
    when(item('UpstairsDuct_Switch').receivedCommand()).then(sendIt().toItem('ACDucts_Switch_2'));
    when(item('GamesDuct_Switch').receivedCommand()).then(sendIt().toItem('ACDucts_Switch_3'));
    when(item('KidsRoomsDuct_Switch').receivedCommand()).then(sendIt().toItem('ACDucts_Switch_4'));
    when(item('ACDucts_Switch_1').receivedUpdate()).then(copyState().fromItem('ACDucts_Switch_1').toItem('KitchenDuct_Switch'));
    when(item('ACDucts_Switch_2').receivedUpdate()).then(copyState().fromItem('ACDucts_Switch_2').toItem('UpstairsDuct_Switch'));
    when(item('ACDucts_Switch_3').receivedUpdate()).then(copyState().fromItem('ACDucts_Switch_3').toItem('GamesDuct_Switch'));
    when(item('ACDucts_Switch_4').receivedUpdate()).then(copyState().fromItem('ACDucts_Switch_4').toItem('KidsRoomsDuct_Switch'));


    //the following rules propagate set temp stuff

    when(item('HVAC_LowTemp').changed())
        .if(stateOfItem('HVAC_Mode').in("auto", "heat"))
        .then(copyAndSendState().fromItem('HVAC_LowTemp').toItem('HVAC_SetTemp'));

    when(item('HVAC_HighTemp').changed())
        .if(stateOfItem('HVAC_Mode').in("cool"))
        .then(copyAndSendState().fromItem('HVAC_HighTemp').toItem('HVAC_SetTemp'));

    when(item('HVAC_SetTemp').changed())
        .if(stateOfItem('HVAC_Mode').in("auto", "cool"))
        .then(copyAndSendState().fromItem('HVAC_SetTemp').toItem('HVAC_HighTemp'));

    when(item('HVAC_SetTemp').changed())
        .if(stateOfItem('HVAC_Mode').in("heat"))
        .then(copyAndSendState().fromItem('HVAC_SetTemp').toItem('HVAC_LowTemp'));
}
 
const calculateFanspeed = function (ductsOpenCount, time) {
    var speed = ductsOpenCount > 1 ? 3 : 2;

    if (time.isAfter(acsystem.SLEEP_TIME_START) || time.isBefore(acsystem.SLEEP_TIME_END)) {
        speed -= 1;
    }
 
    return speed;
};

const doExecute = function () {

    let mode = null;
    let zoneCmds = {
        toOpen: [],
        toClose: []
    };

    for (let zoneName in acsystem.Zones) {
        let zone = acsystem.Zones[zoneName];

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

    log.debug("Setting HVAC mode to {}", mode);

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
        var fanspeed = calculateFanspeed(zoneCmds.toOpen.length, LocalTime.now());

        var temp = mode == "heat" ? 30 : 18;

        items.getItem('HVAC_House').sendCommandIfDifferent("ON") && log.info("Turning on AC")
        items.getItem('HVAC_Mode').sendCommandIfDifferent(mode) && log.info("Setting AC Mode to {}", mode)
        items.getItem('HVAC_FanSpeed').sendCommandIfDifferent(fanspeed) && log.debug("Setting AC Fanspeed to {}", fanspeed)
        items.getItem('HVAC_SetTemp').sendCommandIfDifferent(temp) && log.debug("Setting AC temp to {}", temp)
    }
};

//start with the system off
let houseItem = items.getItem('HVAC_House');
houseItem.sendCommand("ON");
houseItem.sendCommand("OFF");

rules.SwitchableJSRule({
    name: "AC-Manager",
    description: "Manages HVAC system",
    triggers: [
        triggers.GenericCronTrigger("0 */5 * * * *") //every 5 mins
        //TimerTrigger("0/15 * * * * ?") //every 15 secs
    ],
    execute: doExecute
});

rules.SwitchableJSRule({
    name: "Upstairs Passive Temperature Control",
    description: "Manages upstairs temperatures during the day with windows & shades",
    triggers: [
        triggers.GenericCronTrigger("0 */5 * * * *") //every 5 mins
        //TimerTrigger("0/15 * * * * ?") //every 15 secs
    ],
    execute: () => acsystem.Zones['Upstairs'].processPassiveHVAC()
});

//start now
acsystem.Zones['Upstairs'].processPassiveHVAC();
