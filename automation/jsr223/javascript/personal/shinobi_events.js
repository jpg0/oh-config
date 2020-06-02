const { items, triggers, rules } = require('ohj');
const logger = require('ohj').log("shinobi_events");
const request = require('request');

let alertItems = items.getItem('gCam').descendents.filter(item => item.type !== "Group");

let shinobi = require('secret').shinobi;

rules.JSRule({
    name: "Propagate Events to NVR",
    description: "Propagates Events from security cams to Shinobi",
    triggers: [triggers.ChannelEventTrigger(`cam/dahua/name/#`, '')],
    execute: event => {
        let data = JSON.parse(event.payload.event);

        if(data.action == "Start") {
            //
            logger.info(JSON.stringify(data));
        }
        
    }
})

rules.JSRule({
    name: "Propagate Events to NVR",
    description: "Propagates Events from security cams to Shinobi",
    triggers: alertItems.map(i => triggers.ItemStateChangeTrigger(i.name)),
    execute: event => {
        let diff = event.payload.value > event.payload.oldValue;

        if(diff > 0) {
            let [camName,,alertType] = event.itemName.split('_');
            let confidence = alertType == "TripWire" ? 0.4 : 0.2;
            let region = Math.log2(diff);

            let dataToSend = {
                plug: camName,
                name: "region" + region,
                reason: alertType,
                confidence: confidence
            };

            request({
                uri: `http://192.168.1.15:8080/${shinobi.api_key}/motion/${shinobi.group_key}/${camName}?data=${encodeURIComponent(JSON.stringify(dataToSend))}`
            }, (error, response, body) => {
                if(error) {
                    logger.error(error);
                } else if(response.statusCode !== 200) {
                    logger.error("Request to shinobi failed. " + body)
                } else {
                    logger.debug("Sent alert for " + camName + " to Shinobi");
                }
            })
        }
    }
})