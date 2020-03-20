const xiaomizigbeetai = require('./xiaomizigbeetai');
const { items, metadata, rules, triggers } = require('ohj');
const log = require('ohj').log('zigbeebuttontai');
const constants = require('constants');


class ZigbeeButtonTAI extends xiaomizigbeetai.XiaomiZigbeeEndDeviceTAI {
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
    ZigbeeButtonTAI
}