
var log = require('ohj').log("rf_bridge");
var { rules, triggers, actions, utils } = require('ohj');

rules.JSRule({
    name: "rf_bridge - incoming",
    description: "Rewrites RF messages from RF bridge",
    triggers: [
        triggers.ChannelEventTrigger('mqtt:topic:mosquitto:rf_bridge:status', '')
    ],
    execute: function (triggerData) {
        var rfData = JSON.parse(triggerData.payload.event);
        log.debug("Received incoming RF data: " + rfData);


        if(rfData.RfReceived){
            actions.get("mqtt", "mqtt:broker:mosquitto").publishMQTT(`stat/rf/data/${rfData.RfReceived}`, rfData.RfReceived);
        } else if(rfData.RfRaw){
            actions.get("mqtt", "mqtt:broker:mosquitto").publishMQTT(`stat/rf/raw/${rfData.RfRaw.Data}`, rfData.RfRaw.Data);
        } else {
            log.error(`Failed to extract data from RF ${rfData}`);
        }
    }
});

rules.JSRule({
    name: "rf_bridge - outgoing",
    description: "Rewrites RF messages to RF bridge",
    triggers: [
        triggers.ChannelEventTrigger('mqtt:topic:mosquitto:rf_bridge:command', '')
    ],
    execute: function (triggerData) {
        try {
            var rfData = triggerData.receivedTrigger;

            log.debug("Received outgoing RF data: " + rfData);

            actions.get("mqtt", "mqtt:broker:mosquitto").publishMQTT("cmnd/sonoff-8E7A68/Backlog", `rfRaw ${rfData}`);

        } catch (error) {
            log.error(`Failed to execute rule ${this.name}; ${error} at line ${error.lineNumber}`);
        }
    }
});