const commontai = require('./commontai');
const { items, metadata } = require('ohj');
const log = require('ohj').log('zigbeetai');

class ZigbeeTAI extends commontai.MQTTTAI {
    init(config) {
        super.init(config);

        this.mqttRoot = "zigbee2mqtt";
        this.name = config.name;
        this.thingBuilder.withLabel(this.name);
        this.zigbeeId = config.zigbeeId;
        log.debug("Setting zigbeeGroupId for {} as {}", this.name, config.zigbeeGroupId);
        this.zigbeeGroupId = config.zigbeeGroupId;
        this.itemPrefix = config.itemPrefix || '';
    }

    get itemKindGroups() {
        return [];
    }
}

module.exports = {
    ZigbeeTAI
};