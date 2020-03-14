const zigbeetai = require('./zigbeetai');
const { items, metadata, rules, triggers } = require('ohj');
const log = require('ohj').log('zigbeebulbtai');
const constants = require('constants');


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

        let proxyItem = items.createItem(`${this.itemPrefix}${this.id}_Light`, 'Color', 'light', groups, `${this.name} Light`, [...this.tags, "ColorLight"]);
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
        this.colorItem = items.createItem(`${this.itemPrefix}${this.id}_Light_RGB`, 'Color', 'light', [], `${this.name} Light RGB (Real)`);
        this.linkItemToChannel(this.colorItem, this.buildColorChannel());

        this.whiteItem = items.createItem(`${this.itemPrefix}${this.id}_Light_WW`, 'Dimmer', 'light', [], `${this.name} Light WW (Real)`);
        this.linkItemToChannel(this.whiteItem, this.buildWhiteChannel());

        let groups = [...this.groups];
        if (this.zigbeeGroupId) {
            groups.push(`gz${this.zigbeeGroupId}`);
        } else {
            groups.push('gColorLights');
        }

        this.proxyItem = items.createItem(`${this.itemPrefix}${this.id}_Light`, 'Color', 'light', groups, `${this.name} Light`, ["DualLEDs"]);
        this.metadata.push(metadata.createMetadata(this.proxyItem.name, 'proxyForDimmer', this.whiteItem.name));
        this.metadata.push(metadata.createMetadata(this.proxyItem.name, 'proxyForColor', this.colorItem.name));
        this.metadata.push(metadata.createMetadata(this.proxyItem.name, 'zigbeeId', this.zigbeeId));
        this.items.push(this.proxyItem);
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

    activateRules() {
        super.activateRules();
    
        rules.JSRule({
            name: `multiplex dual leds for ${this.proxyItem.name}`,
            triggers: [triggers.ItemCommandTrigger(this.proxyItem.name)],
            execute: (args) => {
                let receivedCommand = args.receivedCommand;
                log.debug("multiplexing proxy for {} received command {}", this.proxyItem.name, receivedCommand);
    
    
                if (receivedCommand.toString() === "ON") {
                    receivedCommand = items.getItem('vCurrent_Light_Color').rawState;
                }
    
    //            //if warm white, then set to full brightness WW LEDs, and turn off RGB
                if(receivedCommand.toString() === 'OFF') {
                    this.colorItem.sendCommand('OFF');
                } else {
                    let warmWhiteHsb = constants.WARM_WHITE_COLOR;
    
                    //is warm white if hue & sat match
                    if (receivedCommand.getHue().equals(warmWhiteHsb.getHue()) && receivedCommand.getSaturation().equals(warmWhiteHsb.getSaturation())) {
                        //setting the white strip appears to turn off the RGB one, so just set it
                        if (receivedCommand.getBrightness() === 0) { //cannot cope with brightness 0, so just turn off if we get it
                            this.whiteItem.sendCommand('OFF');
                        } else {
                            this.whiteItem.sendCommand(receivedCommand.getBrightness().toString());
                        }
                    } else { //else it's no warm white so use RGB exclusively
                        this.whiteItem.sendCommand('OFF');
                        this.colorItem.sendCommand(receivedCommand.toString());
                    }
                }
            }
        });

    }
}

module.exports = {
    ZigbeeColorBulbTAI,
    ZigbeeDualColorBulbTAI
};