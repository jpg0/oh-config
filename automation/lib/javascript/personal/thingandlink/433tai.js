const commontai = require('./commontai');
const { items, metadata } = require('ohj');

class Button433TAI extends commontai.MQTTTAI {
    init(config) {
        super.init(config);
        this.rfCode = config.rfCode;
    }

    buildObjects() {
        super.buildObjects();
        let channel = this.buildChannel();
        this.item = items.createItem(`${this.id}_Button`, 'Switch', undefined, this.groups, `${this.name} Button`);
        this.linkItemToChannel(this.item, channel);

        this.metadata.push(metadata.createMetadata(this.item.name, 'expire', "1s,OFF"));
        this.items.push(this.item);
    }

    buildChannel() {
        return this.withNewMQTTChannel("state", "Button press", "switch", {
            stateTopic: `stat/rf/${this.rfCode}`, 
            on: this.rfCode
        })
    }

    activateRules() {
        super.activateRules();
        //abuse this post-contruction hook to set state
        this.item.postUpdate('OFF');
    }
}

// class Relay433TAI extends commontai.MQTTTAI {
//     constructor(config){
//         super({
//             ...config,
//             mqttPrefix: '_rf_button',
//             id: config.id || items.safeItemName(config.name),
//           });

//           this.rfCode = config.rfCode;
//           this.buildObjects();
//     }

//     buildObjects() {
//         let channel = this.buildChannel();
//         let item = items.createItem(`${this.id}_Button`, 'Switch', undefined, this.groups, `${this.name} Button`);
//         this.linkItemToChannel(item, channel);

//         this.metadata.push(metadata.createMetadata(item.name, 'expire', "1s,OFF"));
//         this.items.push(item);
//     }

//     buildChannel() {
//         return this.withNewMQTTChannel("state", "Button press", "switch", {
//             stateTopic: `stat/rf/${this.rfCode}`, 
//             on: this.rfCode
//         })
//     }
// }

module.exports = {
    Button433TAI
}