const log = require('ohj').log('fluoro_lights');
const { fluent, actions, items } = require('ohj');
const mqtt = actions.get("mqtt", "mqtt:broker:mosquitto");


with(fluent) {

    items.replaceItem('Red_Hand', 'Switch', 'light', [], 'Red Hand Light')

    when(item('Red_Hand').receivedCommand()).then(state => {
        if(items.getItem('Red_Hand').state != state.it) {
            //publish rf code
            mqtt.publishMQTT("cmnd/rf", "test!");
        }
    });

    

}