const constants = require('constants');
const log = require('ohj').log('buttons');
const { fluent, actions, items, rules } = require('ohj');
const LocalTime = require('vendor/js-joda').LocalTime;
const comms = require('comms');

with(fluent) {

    when(item('Doorbell_Button').changed().from('OFF').to('ON')).then(() => {
        comms.notify("Doorbell!");
    }, inGroup("House"));

    when(item('Kitchen_1_Button').changed().to("single")).
        then(sendToggle().toItem('zgLivingRoomLights_Light'), inGroup("Kitchen"));

    when(item('Indis_Closet_Button').changed().to("single")).then(sendToggle().toItem('Indis_Closet_Light'), inGroup("Kids Bedrooms"));
    when(item('Indis_Closet_Button').changed().to("long")).then(send(constants.DAYTIME_LIGHT_COLOR.toString()).toItem('Indis_Closet_Light'), inGroup("Kids Bedrooms"));   

    when(item('Front_Door_Button').changed().to('single')).then(sendOn().toItem('GarageSideDoor_Switch'));

    when(item('UpstairsBathroomLight_Switch').receivedCommand()).then(sendToggle().toItem('Upstairs_Toilet_Light'), inGroup("Upstairs"));

    when(item('UpstairsLEDSwitchMain_Switch').receivedCommand()).then(sendToggle().toItem('Upstairs_Closet_Light'), inGroup("Upstairs"));
    when(item('UpstairsLEDSwitchSecond_Switch').receivedCommand()).then(sendToggle().toItem('Upstairs_Closet_Light'), inGroup("Upstairs"));

    when(item('Bedside_1_Button').changed().to("on-press")).then(send('UP').toItem('vRollersScene'));
    when(item('Bedside_1_Button').changed().to("off-press")).then(send('DOWN').toItem('vRollersScene'));
    when(item('Bedside_1_Button').changed().to("up-press")).then(send('ON' ).toItem('Bedside_1_Light'));
    when(item('Bedside_1_Button').changed().to("down-press")).then(send('OFF').toItem('Bedside_1_Light'));

    when(item('Bedside_2_Button').changed().to("button_4_single")).then(send('UP').toItem('vRollersScene'));
    when(item('Bedside_2_Button').changed().to("button_3_single")).then(send('DOWN').toItem('vRollersScene'));
    when(item('Bedside_2_Button').changed().to("button_2_single")).then(send('ON' ).toItem('Bedside_2_Light'));
    when(item('Bedside_2_Button').changed().to("button_1_single")).then(send('OFF').toItem('Bedside_2_Light'));
    
}
