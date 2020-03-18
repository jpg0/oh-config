const zigbeetai = require('./zigbeetai');
const { items, metadata, rules, triggers } = require('ohj');
const log = require('ohj').log('huezigbeetai');
const constants = require('constants');

class HueDimmerTAI extends zigbeetai.ZigbeeTAI {
    buildObjects() {
        super.buildObjects();
        
        let stateChannel = this.buildStateChannel();
        
        let buttonItem = items.createItem(`${this.id}_Button`, 'String', 'switch', [], `${this.name} Button`);

        this.linkItemToChannel(buttonItem, stateChannel);
        this.metadata.push(metadata.createMetadata(buttonItem.name, 'expire', "1s,OFF"));
    }

    buildStateChannel() {
        return this.withNewMQTTChannel("State", "String", "string", {
            stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
            transformationPattern: "JSONPATH:$.action"
        });
    }
}

module.exports = {
    HueDimmerTAI
}