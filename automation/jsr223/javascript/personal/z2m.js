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
                    comms.notify("z2m - device joined - " + JSON.stringify(message), comms.SYSTEM);
                }
            }
        }
    }
});