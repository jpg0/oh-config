
let log = require('ohj').log("rf_bridge");
let { rules, triggers, actions, utils } = require('ohj');

let broker = actions.get("mqtt", "mqtt:broker:mosquitto");

rules.JSRule({
    name: "rf_bridge - incoming",
    description: "Rewrites RF messages from RF bridge",
    triggers: [
        triggers.ChannelEventTrigger('mqtt:topic:mosquitto:rf_bridge:status', '')
    ],
    execute: function (triggerData) {
        var rfData = JSON.parse(triggerData.payload.event);
        log.debug("Received incoming RF data: " + triggerData.payload.event);


        if(rfData.RfReceived){
            broker.publishMQTT(`stat/rf/data/${rfData.RfReceived.Data}`, rfData.RfReceived.Data);
        } else if(rfData.RfRaw){
            broker.publishMQTT(`stat/rf/raw/${rfData.RfRaw.Data}`, rfData.RfRaw.Data);
        } else {
            log.error(`Failed to extract data from RF ${rfData}`);
        }
    }
});

rules.JSRule({
    name: "rf_bridge - outgoing",
    description: "Rewrites RF messages to RF bridge",
    triggers: [
        triggers.ChannelEventTrigger('mqtt:topic:mosquitto:rf_bridge:dataCommand', '')
    ],
    execute: function (triggerData) {
        try {
            var rfDataStr = triggerData.receivedTrigger;

            log.debug("Received outgoing RF data: " + rfDataStr);

            let rfData = JSON.parse(rfDataStr);
            let cmd = `RfSync ${rfData.Sync}; RfLow ${rfData.Low}; RfHigh ${rfData.High}; RfCode #${rfData.Data};`
            
            broker.publishMQTT("cmnd/sonoff-8E7A68/Backlog", cmd);

        } catch (error) {
            log.error(`Failed to execute rule ${this.name}; ${error} at line ${error.lineNumber}`);
        }
    }
});
