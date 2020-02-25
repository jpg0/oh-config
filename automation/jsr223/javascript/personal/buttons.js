const constants = require('constants');
const log = require('ohj').log('buttons');
const { fluent, actions, items } = require('ohj');
const LocalTime = require('js-joda').LocalTime;
const comms = require('comms');


with(fluent) {

    when(item('Doorbell_Button').changed().to('ON')).then(() => {
        comms.notify("Doorbell!");
    }, inGroup("House"));

    when(item('Kitchen_1_Button').changed().to("single")).
        then(sendToggle().toItem('zgLivingRoomLights_Light'), inGroup("Kitchen"));

    when(item('Indis_Closet_Button').changed().to("single")).then(sendToggle().toItem('Indis_Closet_Light'), inGroup("Kids Bedrooms"));
    when(item('Indis_Closet_Button').changed().to("long")).then(send(constants.DAYTIME_LIGHT_COLOR).toItem('Indis_Closet_Light'), inGroup("Kids Bedrooms"));   


    when(item('Bedside_1_Button').changed().to('single')).then(sendToggle().toItem('Bedside_1_Light'), inGroup("Upstairs"));
    when(item('Bedside_1_Button').changed().to('triple')).then(() => {
        let rollers = items.getItem('vRollersScene');
        if(rollers.previousState == "DOWN") { 
            rollers.sendCommand("UP");
        } else {
            rollers.sendCommand("DOWN");
        }
    });

    when(item('Bedside_2_Button').changed().to('single')).then(sendToggle().toItem('Bedside_2_Light'), inGroup("Upstairs"));

    when(item('UpstairsBathroomLight_Switch').receivedCommand()).then(sendToggle().toItem('Upstairs_Toilet_Light'), inGroup("Upstairs"));

    when(item('UpstairsLEDSwitchMain_Switch').receivedCommand()).then(sendToggle().toItem('Upstairs_Closet_Light'), inGroup("Upstairs"));
    when(item('UpstairsLEDSwitchSecond_Switch').receivedCommand()).then(sendToggle().toItem('Upstairs_Closet_Light'), inGroup("Upstairs"));

}