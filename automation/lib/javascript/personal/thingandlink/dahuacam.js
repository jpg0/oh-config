const commontai = require('./commontai');
const { items } = require('ohj');
const logger = require('ohj').log('dahuacamtai');
const { DahuaCam } = require('dahua-cam');
const { rules, triggers } = require('ohj');
 
class DahuaCamTAI extends commontai.MQTTTAI {
    init(config) {
        super.init(config);
        this.itemSuffix = config.itemSuffix || 'Cam';

        let camCreds = require('secret').camCreds;

        this.alarmTypes = config.alarmTypes || ["VideoMotion", "Tripwire"];

        this.channels = [];

        this.cam = new DahuaCam({
            username: camCreds.username,
            password: camCreds.password,
            host: config.host
        });

        this.name = config.name;

        this.thingBuilder.withLabel(this.name);
    }

    async create() {
        logger.debug("Creating Cam @ " + this.name);

        let name = await this.cam.name();
        await this.buildCam(name);
        return (await super.create());
    }

    buildCam(mqttName) {
        logger.debug(`Adding Cam ${this.name} [${mqttName}]`);
        this.items.push(items.createItem(`g${this.itemSuffix}${this.id}`, 'Group', 'camera', [`gCam${this.id}`, "gCam"], `${this.name} Cam`, [], 'Number', Java.type('org.openhab.core.library.types.ArithmeticGroupFunction').SUM));
        this.alarmTypes.forEach(alarmType => {
            this.buildCamAlarm(mqttName, alarmType);
        })
    }

    buildCamAlarm(mqttName, alarmType) {
        this.items.push(items.createItem(`${this.id}_${this.itemSuffix}_${alarmType}`, 'Number', 'camera', [`g${this.itemSuffix}${this.id}`, `g${this.itemSuffix}`], `${this.name} ${this.itemSuffix} ${alarmType}`, []));
        this.channels.push(this.buildAlarmChannel(mqttName, alarmType));
    }

    //cam/dahua/name/Garden/code/VideoMotion/action/Start/index/0 {"host":"192.168.101.200","name":"Garden","code":"VideoMotion","action":"Start","index":"0"}                                                                        
    buildAlarmChannel(mqttName, alarmType) {
        return this.withNewMQTTChannel(`${this.name}_${alarmType}`, 'state', 'string', {
            stateTopic: `cam/dahua/name/${mqttName}/code/${alarmType}/#`,
            trigger: true
        });
    }

    activateRules() {
        super.activateRules();
    
        this.channels.map(channel => logger.debug("Listening to " + channel.uid)),
        rules.JSRule({
            name: `apply cam alarms to items`,
            triggers: this.channels.map(channel => triggers.ChannelEventTrigger(channel.uid, '')),
            execute: event => {
                let data = JSON.parse(event.payload.event);
                let mask = 1 << data.index;
                let item = items.getItem(`${this.id}_${this.itemSuffix}_${data.code}`)
                let state = item.state;

                state = parseInt(item.state, 16);

                if(state == NaN) {
                    state = 0x0;
                }

                if(data.action == "Stop") {
                    state &= ~mask;
                } else {
                    state |= mask;
                }
                
                logger.debug(`${this.id}_${this.itemSuffix}_${data.code}:${state}`);
                item.postUpdate(state);
            }
        })
    }
}

module.exports = {
    DahuaCamTAI
}
 