const commontai = require('./commontai');
const { items } = require('ohj');
const log = require('ohj').log('dahuacamtai');
// const { DahuaCam } = require('dahua-cam');
const { rules } = require('ohj');
 
class DahuaCamTAI extends commontai.MQTTTAI {
    init(config) {
        super.init(config);
        this.itemSuffix = config.itemSuffix || 'Cam';

        let camCreds = require('secret').camCreds;

        this.alarmTypes = config.alarmTypes || ["VideoMotion", "Tripwire"];

        this.cam = new DahuaCam({
            username: camCreds.username,
            password: camCreds.password,
            hostname: config.hostname
        });

        this.name = config.name;

        this.thingBuilder.withLabel(this.name);
    }

    buildObjects() {
        super.buildObjects();


        this.cam.name()
            .then(name => this.buildCam(name))
            .catch(log.error)

        let channel = this.buildChannel();


        let item = items.createItem(`${this.id}_${this.itemSuffix}`, 'String', 'rollershutter', [...this.groups, "gRoller"], `${this.name} Roller`, ["Switchable","Tasmota"]);    
        this.linkItemToChannel(item, channel);

        this.item = item; //used for sitemap
    }

    async create() {
        let name = await cam.name();
        await this.buildCam(name);
        return super.create();
    }


    buildCam(name) {
        this.alarmTypes.forEach(alarmType => {
            buildCamAlarm(name, alarmType);
        })
    }

    buildCamAlarm(name, alarmType) {
        let item = items.createItem(`${this.id}_${this.itemSuffix}_${alarmType}`, 'String', 'camera', [`gCam${this.id}`, "gCam"], `${this.name} Cam`, []);    
        this.linkItemToChannel(item, this.buildAlarmChannel(name, alarmType));
    }

    //cam/dahua/name/Garden/code/VideoMotion/action/Start/index/0 {"host":"192.168.101.200","name":"Garden","code":"VideoMotion","action":"Start","index":"0"}                                                                        
    buildAlarmChannel(name, alarmType) {
        return this.withNewMQTTChannel(`STATE`, 'state', 'string', {
            stateTopic: `cam/dahua/name/${name}/#`
        });
    }

    activateRules() {
        super.activateRules();
    
        rules.JSRule({
            name: `apply cam alarms to items`,
            triggers: this.items.map(i => triggers.ItemStateChangeTrigger(i.name)),
            execute: (args) => {
                log.info(args);
            }
        })
    }
}

module.exports = {
    DahuaCamTAI
}
 