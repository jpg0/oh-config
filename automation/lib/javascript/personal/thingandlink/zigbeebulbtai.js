const zigbeetai = require('./zigbeetai');
const { items, metadata } = require('ohj');
const log = require('ohj').log('zigbeebulbtai');

class ZigbeeColorBulbTAI extends zigbeetai.ZigbeeTAI {
    buildObjects() {
        super.buildObjects();
        
        let colorChannel = this.buildColorChannel();
        
        let groups = [...this.groups];
        if (this.zigbeeGroupId) {
            groups.push(`gz${this.zigbeeGroupId}`);
        }

        log.debug(`Using groups: ${this.groups}`);

        let realItem = items.createItem(`${this.itemPrefix}${this.id}_Light_Real`, 'Color', 'light', [], `${this.name} Light (Real)`);
        this.linkItemToChannel(realItem, colorChannel);

        let proxyItem = items.createItem(`${this.itemPrefix}${this.id}_Light`, 'Color', 'light', this.groups, `${this.name} Light`, ["ColorLight"]);
        this.metadata.push(metadata.createMetadata(proxyItem.name, 'zigbeeId', this.zigbeeId));
        this.metadata.push(metadata.createMetadata(proxyItem.name, 'proxyFor', realItem.name));
        this.items.push(proxyItem);
    }

    buildColorChannel() {
        return this.withNewMQTTChannel("State", "Color", "colorHSB", {
            commandTopic: `${this.mqttRoot}/${this.zigbeeId}/set`,
            transformationPatternOut: "JS:z2m_color.js"
        })
    }
}

class ZigbeeDualColorBulbTAI extends zigbeetai.ZigbeeTAI {
    init(config) {
        super.init(config);
        this.itemPrefix = config.itemPrefix || '';
    }

    buildObjects() {
        let colorItem = items.createItem(`${this.itemPrefix}${this.id}_Light_RGB`, 'Color', 'light', [], `${this.name} Light RGB (Real)`);
        this.linkItemToChannel(colorItem, this.buildColorChannel());

        let whiteItem = items.createItem(`${this.itemPrefix}${this.id}_Light_WW`, 'Dimmer', 'light', [], `${this.name} Light WW (Real)`);
        this.linkItemToChannel(whiteItem, this.buildWhiteChannel());

        let groups = [...this.groups];
        if (this.zigbeeGroupId) {
            groups.push(`gz${this.zigbeeGroupId}`);
        } else {
            groups.push('gColorLights');
        }

        let proxyItem = items.createItem(`${this.itemPrefix}${this.id}_Light`, 'Color', 'light', groups, `${this.name} Light`, ["DualLEDs"]);
        this.metadata.push(metadata.createMetadata(proxyItem.name, 'proxyForDimmer', whiteItem.name));
        this.metadata.push(metadata.createMetadata(proxyItem.name, 'proxyForColor', colorItem.name));
        this.metadata.push(metadata.createMetadata(proxyItem.name, 'zigbeeId', this.zigbeeId));
        this.items.push(proxyItem);
    }

    buildColorChannel() {
        return this.withNewMQTTChannel("color", "Color", "colorHSB", {
            commandTopic: `${this.mqttRoot}/${this.zigbeeId}/set`,
            transformationPatternOut: "JS:z2m_color.js"
        })
    }

    buildWhiteChannel() {
        return this.withNewMQTTChannel("white", "White", "dimmer", {
            commandTopic: `${this.mqttRoot}/${this.zigbeeId}/white/set`,
            transformationPatternOut: "JS:z2m_dual_ww.js"
        })
    }
}

module.exports = {
    ZigbeeColorBulbTAI,
    ZigbeeDualColorBulbTAI
};