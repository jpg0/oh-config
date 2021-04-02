const comms = require('comms');
const { items, rules, triggers } = require("ohj");

function mosquittosLikely() {
    return true;
}

rules.JSRule({
    name: "mosquitto_alert",
    description: "Alerts when mosquittos are around and things are left open",
    triggers: [
        triggers.GenericCronTrigger("0 0 18 * * ?")
    ],
    execute: (triggerData) => {
        if(mosquittosLikely()){
            let leftOpen = items.getItem("gUnscreened").members.filter(i => i.state === "OPEN");

            if(leftOpen.length > 0) {
                let msg = ['🦟 Mosquitto Alert!'];
                leftOpen.forEach(i => msg.push(i.label));
                comms.notify(msg.join("\n") , "system");
            }
        }
    }
});



