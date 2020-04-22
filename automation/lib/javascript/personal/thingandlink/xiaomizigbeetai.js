const zigbeetai = require('./zigbeetai');
const { items, metadata } = require('ohj');
const log = require('ohj').log('xiaomizigbeetai');
const { Duration } = require('js-joda');

class XiaomiZigbeeEndDeviceTAI extends zigbeetai.ZigbeeTAI {
    init(config) {
        super.init(config);
        this.maxDurationWithoutContact = config.maxDurationWithoutContact;
    }

    buildObjects(){
        super.buildObjects();

        this.groups.push('gHasLastUpdated');
        
        this.lastUpdatedItem = items.createItem(`${this.id}_LastUpdated`, 'DateTime', 'clock', ['gLastUpdated'], `${this.id} Last Seen [%1$ta %1$tR]`);
        if(this.maxDurationWithoutContact) { 
            this.addMetadataToItem(this.lastUpdatedItem, require('lastupdated').MAX_DURATION_WITHOUT_CONTACT_KEY, this.maxDurationWithoutContact.toString());
        }
    this.items.push(this.lastUpdatedItem);

        let measurementGroupItem = items.createItem(`g${this.id}_Measurements`, 'Group', null, ['gMeasurements'], `${this.id}: All measurements`);
        this.items.push(measurementGroupItem);


        let batteryItem = items.createItem(`${this.id}_Battery`, 'Number', 'batterylevel', ['gBattery', `g${this.id}_Measurements`], `${this.id} Battery [%.1f%%]`);

        let batteryChannel = this.withNewMQTTChannel("battery", "Number", "number", {
            stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
            transformationPattern: "JSONPATH:$.battery"
        });

        this.linkItemToChannel(batteryItem, batteryChannel);

    }

    linkItemToChannel(item, channel, config) {
        super.linkItemToChannel(item, channel, config);
        this.setLastUpdatedItem(item);
    }

    setLastUpdatedItem(forItem) {
        this.metadata.push(metadata.createMetadata(forItem.name, 'lastupdated_item', this.lastUpdatedItem.name));
    }
}

class AqaraButtonTAI extends XiaomiZigbeeEndDeviceTAI {
    init(config) {
        super.init({
            ...config,
            maxDurationWithoutContact: Duration.ofDays(14)
        });
    }

    buildObjects(){
        super.buildObjects();

        this.linkItemToChannel(
            items.createItem(`${this.id}_Button`, 'String', null, this.groups, `${this.id} Button`),
            this.withNewMQTTChannel("state", "String", "string", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JS:aqara_button.js"
            }), {
                expire:"1s,null"
            }
        )
    }
}

class AqaraMotionTAI extends XiaomiZigbeeEndDeviceTAI {
    init(config) {
        super.init({
            ...config,
            maxDurationWithoutContact: Duration.ofDays(3)
        });
    }

    buildObjects(){
        super.buildObjects();

        this.linkItemToChannel(
            items.createItem(`${this.id}_Illuminance`, 'Number', 'light', ['gIlluminance',`g${this.id}_Measurements`], `${this.id} Illuminance [%.1f]`),
            this.withNewMQTTChannel("Illuminance", "Number", "number", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JSONPATH:$.illuminance"
            })
        );

        this.linkItemToChannel(
            items.createItem(`${this.id}_Occupancy`, 'Contact', 'occupancy', [...this.groups, 'gOccupancy',`g${this.id}_Measurements`], `${this.id} Occupancy`),
            this.withNewMQTTChannel("Occupancy", "Contact", "contact", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JS:occupancy.js"
            })
        );
    }
}

class AqaraContactTAI extends XiaomiZigbeeEndDeviceTAI {
    init(config) {
        super.init({
            ...config,
            maxDurationWithoutContact: Duration.ofDays(3)
        });
    }

    buildObjects(){
        super.buildObjects();

        this.linkItemToChannel(
            items.createItem(`${this.id}_Contact`, 'Contact', 'door', [...this.groups, 'gContact',`g${this.id}_Measurements`], `${this.id} Contact`),
            this.withNewMQTTChannel("state", "Contact", "contact", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JS:z2m_contact.js"
            }), {
                zigbeeId: this.zigbeeId
            }
        )
    }
}

class MijiaTemperatureTAI extends XiaomiZigbeeEndDeviceTAI {
    init(config) {
        super.init(config);
        this.maxDurationWithoutContact = config.maxDurationWithoutContact || Duration.ofDays(1);
    }

    buildObjects(){
        super.buildObjects();

        this.linkItemToChannel(
            items.createItem(`${this.id}_Temperature`, 'Number', 'temperature', [...this.groups, 'gTemperature',`g${this.id}_Measurements`], `${this.name} Temperature [%.1f °C]`),
            this.withNewMQTTChannel("temperature", "Number", "number", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JSONPATH:$.temperature"
            }), {
                zigbeeId: this.zigbeeId
            }
        );

        this.linkItemToChannel(
            items.createItem(`${this.id}_Humidity`, 'Number', 'water', ['gHumidity',`g${this.id}_Measurements`], `${this.id} Humidity [%.1f]`),
            this.withNewMQTTChannel("humidity", "Number", "number", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JSONPATH:$.humidity"
            }), {
                zigbeeId: this.zigbeeId
            }
        );
    }
}

class AqaraTemperatureTAI extends MijiaTemperatureTAI {
    init(config) {
        super.init(config);
        this.maxDurationWithoutContact = config.maxDurationWithoutContact || Duration.ofDays(1);
    }

    buildObjects(){
        super.buildObjects();

        this.linkItemToChannel(
            items.createItem(`${this.id}_Pressure`, 'Number', 'pressure', ['gPressure',`g${this.id}_Measurements`], `${this.id} Pressure [%.1f]`),
            this.withNewMQTTChannel("pressure", "Number", "number", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JSONPATH:$.pressure"
            }), {
                zigbeeId: this.zigbeeId
            }
        );
    }
}

class AqaraSwitchTAI extends zigbeetai.ZigbeeTAI {
    init(config) {
        super.init(config);
        this.maxDurationWithoutContact = config.maxDurationWithoutContact || Duration.ofDays(1);
    }

    buildObjects(){
        super.buildObjects();

        this.linkItemToChannel(
            items.createItem(`${this.id}_Switch`, 'Switch', 'light', this.groups, `${this.id} Switch`),
            this.withNewMQTTChannel("state", "Switch", "switch", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JSONPATH:$.state",
                commandTopic: `zigbee2mqtt/${this.zigbeeId}/set`, 
                transformationPatternOut: "MAP:zjson.map",
            }));

        this.linkItemToChannel(
            items.createItem(`${this.id}_Switch_Power`, 'Number', 'energy', ['gHourlyStats'], `${this.id} Power`),
            this.withNewMQTTChannel("power", "Number", "number", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JSONPATH:$.consumption"
            }));

        this.linkItemToChannel(
            items.createItem(`${this.id}_Switch_Temperature`, 'Number', 'temperature', ['gHourlyStats'], `${this.id} Switch Temperature`),
            this.withNewMQTTChannel("temperature", "Number", "number", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JSONPATH:$.temperature"
            }));
        
    }
}

module.exports = {
    AqaraButtonTAI,
    AqaraMotionTAI,
    AqaraContactTAI,
    AqaraSwitchTAI,
    MijiaTemperatureTAI,
    AqaraTemperatureTAI,
    XiaomiZigbeeEndDeviceTAI
};