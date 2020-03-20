const commontai = require('./commontai');
const { items } = require('ohj');
const log = require('ohj').log('rollertai');

class NeoRollerTAI extends commontai.MQTTTAI {
    init(config) {
        super.init(config);
        this.itemSuffix = config.itemSuffix || 'Roller';
        this.name = config.name;
        log.info("Set rfCode as {} for {}", config.rfCode, config.name);
        this.rfCode = config.rfCode;

        this.thingBuilder.withLabel(this.name);
    }

    buildObjects() {
        super.buildObjects();
        let channel = this.buildChannel();

        /*
        States may be:
        Up, Down, Fav, Unknown

        Accepted commands are:
        Up, Down, Fav, Stop

        Stop will result in an Unknown state, others should match
        */
        let item = items.createItem(`${this.id}_${this.itemSuffix}`, 'String', 'rollershutter', [...this.groups, "gRoller"], `${this.name} Roller`, ["Switchable","Tasmota"]);    
        this.linkItemToChannel(item, channel);

        this.item = item; //used for sitemap
    }

    buildChannel() {
        return this.withNewMQTTChannel(`STATE`, 'state', 'string', {
            commandTopic: `/cmnd/blinds/neo/192.168.1.103/3900370002504b464d323820/${this.rfCode}`
        });
    }
}

module.exports = {
    NeoRollerTAI
}
 