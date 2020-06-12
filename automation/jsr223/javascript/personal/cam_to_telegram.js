const { items, triggers, rules } = require('ohj');
const logger = require('ohj').log("cam_to_telegram");
//const request = require('request');

let camCreds = require('secret').camCreds;
let { DahuaCam } = require('vendor/dahua-cam');

rules.JSRule({
    name: "Propagate Cam Events to Telegram",
    description: "Propagates Events from security cams to Telegram Group",
    triggers: [triggers.ChannelEventTrigger(`cam/dahua/#`, '')],
    execute: event => pullAndSend(JSON.parse(event.payload.event))
})

function pullAndSend({action, code, host}) {
    if(action == "Start") {
        if(code == "CrossLineDetection") {
            //pull a snapshot & send to telegram
            let cam = new DahuaCam({
                username: camCreds.username,
                password: camCreds.password,
                host: host
            });
             
            cam.snapshot()
                .then(a => logger.info("Len: " + a.length))
                .catch(e => logger.error(`Failed to pull snapshot: ${e}`))
        }
    }
}

pullAndSend({
    action: "Start",
    code: "CrossLineDetection",
    host: "192.168.101.200"
});





