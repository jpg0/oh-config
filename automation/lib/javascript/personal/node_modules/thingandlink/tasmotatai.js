const commontai = require('./commontai');
const { items } = require('ohj');

class AbstractTasmotaTAI extends commontai.MQTTTAI {
    init(config) {
        super.init(config);
        this.name = config.name;
        this.mqttId = config.mqttId;
        this.thingBuilder.withLabel(this.name);
    }

    buildSignalTAIs(){
        let reachableChannel = this.withNewMQTTChannel(`reachable`, 'Switch','switch', {
            stateTopic: `tele/${this.mqttId}/LWT`,
            transformationPattern: "MAP:reachable.map"
        })

        let rssiChannel = this.withNewMQTTChannel(`rssi`, 'Number', 'number', {
            stateTopic: `tele/${this.mqttId}/STATE`,
            transformationPattern: "JSONPATH:$.Wifi.RSSI"
        });
        
        let reachableItem = items.createItem(`${this.id}_Switch_Reachable`, 'Switch', null, ['gReachable'], `${this.name} Switch: Reachable`, []);
        this.linkItemToChannel(reachableItem, reachableChannel);

        let rssiItem = items.createItem(`${this.id}_Switch_RSSI`, 'Number', null, ['gRSSI'], `${this.name} Switch: RSSI`, []);
        this.addStateFormat(rssiItem,  '[%d %%]');
        this.linkItemToChannel(rssiItem, rssiChannel);
    }

    addRelay(index){
        if(typeof index === 'undefined') {
            index = "";
        }

        let switchChannel = this.buildSwitchChannel(index);

        let switchItem = (index === "" ?
            items.createItem(`${this.id}_Switch`, 'Switch', 'light', this.groups, `${this.name} Switch`, ["Switchable","Tasmota"]) :
            items.createItem(`${this.id}_Switch_${index}`, 'Switch', 'light', this.groups, `${this.name} Switch ${index}`, ["Switchable","Tasmota"])
        );

        this.linkItemToChannel(switchItem, switchChannel, {
            autoupdate: 'false'
        });

        this.switchItem = switchItem; //used for sitemap
    } 

    buildSwitchChannel(index) {
        if(typeof index === 'undefined') {
            index = "";
        }

        return this.withNewMQTTChannel(`POWER${index}`, 'Switch', 'switch', {
            stateTopic: `stat/${this.mqttId}/POWER${index}`, 
            commandTopic: `cmnd/${this.mqttId}/POWER${index}`
        });
    }
}

class TasmotaTAI extends AbstractTasmotaTAI {
    buildObjects() {
        super.buildObjects();
        this.addRelay();
        this.buildSignalTAIs();
    }
}

class FourChannelTasmotaTAI extends AbstractTasmotaTAI {
    buildObjects() {
        super.buildObjects();
        this.addRelay(1);
        this.addRelay(2);
        this.addRelay(3);
        this.addRelay(4);
        this.buildSignalTAIs();
    }
}

 module.exports = {
     TasmotaTAI,
     FourChannelTasmotaTAI
 }
 