'use strict';

const log = require('ohj').log("z2m");
const { rules, triggers, actions, utils } = require('ohj');
const comms = require('comms');


rules.JSRule({
    name: "z2m-bridge-log",
    description: "Rules based on zigbee2mqtt bridge",
    triggers: [
        triggers.ChannelEventTrigger('mqtt:topic:mosquitto:zigbee_bridge:log', '')
    ],
    execute: function (triggerData) {
        let payload = triggerData.payload;

        if(typeof payload !== 'undefined' && payload !== null) {
            let eventData = payload.event;

            if(typeof eventData === 'string'){
                let event = JSON.parse(eventData);

                if (event.type === "device_connected") {
                    let message = event.message;
                    log.info("device " + message + " connected to z2m network!");
                    comms.notify("z2m - device joined - " + JSON.stringify(message));
                }
            }
        }
    }
});

rules.JSRule({
    name: "z2m-device-names",
    description: "Names devices in z2m based on OH item names",
    triggers: [
        //item registry changes?
    ],
    execute: () => updateZ2MDeviceNames()
});

// not yet compatible with z2m :(

// const metadata = require('metadata');

// const updateZ2MDeviceNames = function(){

//     const updateDeviceName = function(item) {
//         let zigbeeId = metadata.get_value(item.name, 'zigbeeId');
//         log.error(`Updating z2m device name for ${zigbeeId} to ${item.name}`);
//     }

//     //for each Z2M device, tell Z2M it's name
//     require('ohitems').forAllMembers("gZ2M", updateDeviceName);
// }

// updateZ2MDeviceNames();
