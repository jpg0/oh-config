const { rules, triggers, items } = require('ohj');
const log = require('ohj').log('lighting_colors');

const colorlights = require('colorlights');
const { LocalTime } = require('js-joda');
let todItem = items.getItem('vTimeOfDay');


rules.JSRule({
    name: "Propagate Light Color on TOD",
    description: "Propagates the light color when tod changes",
    triggers: [
        triggers.ItemStateChangeTrigger(todItem.name),
    ],
    execute: () => {
        for(let colorLight of items.getItem('gColorLights').descendents) {
            colorLight.sendCommandIfDifferent(colorlights.determineColor(colorLight));
        }
    }
});

rules.JSRule({
    name: "Propagate Light Transition",
    description: "Transitions the light colours",
    triggers: [
        triggers.GenericCronTrigger("0 30/5 19 * * ? *"),
        triggers.GenericCronTrigger("0 0,5,10,15,20,25,30 20 * * ? *"),
    ],
    execute: () => {
        for(let colorLight of items.getItem('gColorLights').descendents) {
            require('transitioner').transition(colorLight.name, colorlights.determineColor(colorLight, LocalTime.now().plusMinutes(5)), 300);
        }
    }
});

//proxy to real light
for(let item of items.getItemsByTag('ColorLight')) {

    let target = items.getItem(item.getMetadataValue('proxyFor'));

    rules.JSRule({
        name: `proxy light ${item.name}`,
        description: `proxies commands to light ${item.name}, possibly introducing a transition`,
        triggers: [triggers.ItemCommandTrigger(item.name)],
        execute: args => {
            let receivedCommand = args.receivedCommand.toString();
            log.debug("proxy for {} received command {}", item.name, receivedCommand);
            
            if(receivedCommand === 'ON') { //use the current light colour
                target.sendCommand(colorlights.targetColorForItem(item));
            } else {
                target.sendCommand(receivedCommand);
            }
        }
    });
} 