const log = require('ohj').log("acmanager");
const { items, rules, fluent, triggers } = require('ohj');
const HouseHVAC = require('acsystem').house;

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
    execute: HouseHVAC.processHvac
});

rules.SwitchableJSRule({
    name: "Upstairs Passive Temperature Control",
    description: "Manages upstairs temperatures during the day with windows & shades",
    triggers: [
        triggers.GenericCronTrigger("0 */5 * * * *") //every 5 mins
        //TimerTrigger("0/15 * * * * ?") //every 15 secs
    ],
    execute: HouseHVAC.processPassiveHvac
});

//start now
HouseHVAC.processPassiveHvac();
