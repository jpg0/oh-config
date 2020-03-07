const log = require('ohj').log('fluoro_lights');
const { fluent, actions, items, rules, triggers } = require('ohj');
const mqtt = actions.get("mqtt", "mqtt:broker:mosquitto");

const RF_DATA = {"Sync":12290,"Low":440,"High":1250,"Data":"600601","RfKey":"None"};

with(fluent) {

    let lightItem = items.replaceItem('Red_Hand', 'Switch', 'light', [], 'Red Hand Light')

    //send switch updates to the light
    when(item('Red_Hand').receivedCommand()).then(state => {

        require('ohj').utils.dumpObject(state);

        log.info(`oldState:${state.oldState}`);

        log.info(`it:${state.it}`);
        log.info(`receivedCommand:${state.receivedCommand}`);
        log.info(`lightItem.state:${lightItem.state}`);

        let mState = lightItem.getMetadataValue('mState');

        log.info(`mState:${mState}`);

        //ON
        if(mState !== `${state.it}`) {
            //publish rf code
            mqtt.publishMQTT("cmnd/rf/data", JSON.stringify(RF_DATA));
            lightItem.upsertMetadataValue('mState', `${state.it}`);
        }
    });

    //apply rf changes to the switch
    rules.JSRule({
        name: "apply rf changes to the switch",
        description: "apply rf changes to the switch",
        triggers: [
            triggers.ChannelEventTrigger('mqtt:topic:mosquitto:rf_bridge:dataRf', RF_DATA.Data)
        ],
        execute: (triggerData) => {
            let toSend = ('ON' == lightItem.state) ? 'OFF' : 'ON';
            lightItem.postUpdate(toSend);
            lightItem.upsertMetadataValue('mState', toSend);

        }
    });
}