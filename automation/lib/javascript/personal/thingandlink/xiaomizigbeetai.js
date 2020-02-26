const zigbeetai = require('./zigbeetai');
const { items, metadata } = require('ohj');
const log = require('ohj').log('xiaomizigbeetai');

class XiaomiZigbeeEndDeviceTAI extends zigbeetai.ZigbeeTAI {
    buildObjects(){
        super.buildObjects();
        
        let lastUpdatedItem = items.createItem(`${this.id}_LastUpdated`, 'DateTime', 'clock', ['gLastUpdated'], `${this.id} Last Seen [%1$ta %1$tR]`);
        this.items.push(lastUpdatedItem);

        let measurementGroupItem = items.createItem(`g${this.id}_Measurements`, 'Group', null, ['gMeasurements'], `${this.id}: All measurements`);
        this.items.push(measurementGroupItem);


        let batteryItem = items.createItem(`${this.id}_Battery`, 'Number', 'batterylevel', ['gBattery', `g${this.id}_Measurements`], `${this.id} Battery [%.1f%%]`);

        let batteryChannel = this.withNewMQTTChannel("battery", "Number", "number", {
            stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
            transformationPattern: "JSONPATH:$.battery"
        });

        this.metadata.push(metadata.createMetadata(batteryItem.name, 'lastupdated_item', lastUpdatedItem.name));

        this.linkItemToChannel(batteryItem, batteryChannel);

    }
}

class AqaraButtonTAI extends XiaomiZigbeeEndDeviceTAI {
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
    buildObjects(){
        super.buildObjects();

        this.linkItemToChannel(
            items.createItem(`${this.id}_Illuminance`, 'Number', 'light', ['gIlluminance',`g${this.id}_Measurements`], `${this.id} Illuminance [%.1f]`),
            this.withNewMQTTChannel("Illuminance", "Number", "number", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JSONPATH:$.illuminance"
            }), {
                lastupdated_item:`${this.id}_LastUpdated`
            }
        );

        this.linkItemToChannel(
            items.createItem(`${this.id}_Occupancy`, 'Contact', 'occupancy', [...this.groups, 'gOccupancy',`g${this.id}_Measurements`], `${this.id} Occupancy`),
            this.withNewMQTTChannel("Occupancy", "Contact", "contact", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JS:occupancy.js"
            }), {
                lastupdated_item:`${this.id}_LastUpdated`
            }
        );
    }
}

class AqaraContactTAI extends XiaomiZigbeeEndDeviceTAI {
    buildObjects(){
        super.buildObjects();

        this.linkItemToChannel(
            items.createItem(`${this.id}_Contact`, 'Contact', 'door', [...this.groups, 'gContact',`g${this.id}_Measurements`], `${this.id} Contact`),
            this.withNewMQTTChannel("state", "Contact", "contact", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JS:z2m_contact.js"
            }), {
                lastupdated_item: `${this.id}_LastUpdated`,
                zigbeeId: this.zigbeeId
            }
        )
    }
}

class MijiaTemperatureTAI extends XiaomiZigbeeEndDeviceTAI {
    buildObjects(){
        super.buildObjects();

        this.linkItemToChannel(
            items.createItem(`${this.id}_Temperature`, 'Number', 'temperature', [...this.groups, 'gTemperature',`g${this.id}_Measurements`], `${this.name} Temperature [%.1f °C]`),
            this.withNewMQTTChannel("temperature", "Number", "number", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JSONPATH:$.temperature"
            }), {
                lastupdated_item: `${this.id}_LastUpdated`,
                zigbeeId: this.zigbeeId
            }
        );

        this.linkItemToChannel(
            items.createItem(`${this.id}_Humidity`, 'Number', 'water', ['gHumidity',`g${this.id}_Measurements`], `${this.id} Humidity [%.1f]`),
            this.withNewMQTTChannel("humidity", "Number", "number", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JSONPATH:$.humidity"
            }), {
                lastupdated_item: `${this.id}_LastUpdated`,
                zigbeeId: this.zigbeeId
            }
        );
    }
}

class AqaraTemperatureTAI extends MijiaTemperatureTAI {
    buildObjects(){
        super.buildObjects();

        this.linkItemToChannel(
            items.createItem(`${this.id}_Pressure`, 'Number', 'pressure', ['gPressure',`g${this.id}_Measurements`], `${this.id} Pressure [%.1f]`),
            this.withNewMQTTChannel("pressure", "Number", "number", {
                stateTopic: `${this.mqttRoot}/${this.zigbeeId}`,
                transformationPattern: "JSONPATH:$.pressure"
            }), {
                lastupdated_item: `${this.id}_LastUpdated`,
                zigbeeId: this.zigbeeId
            }
        );
    }
}

class AqaraSwitchTAI extends zigbeetai.ZigbeeTAI {
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
    AqaraTemperatureTAI
};