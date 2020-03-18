
const { rules, triggers, items } = require('ohj');
const log = require('ohj').log('lighting_colors');
const constants = require('constants');
const color = require('color');

let currentLightColorItem = items.getItem('vCurrent_Light_Color');
let todItem = items.getItem('vTimeOfDay');

let getColorForPeriod = function (periodInDay) {
    switch (periodInDay) {
        case "NIGHT":
        case "EVENING":
            return constants.NIGHTTIME_LIGHT_COLOR;
        default:
            return constants.DAYTIME_LIGHT_COLOR;
    }
};

rules.JSRule({
    name: "Update Current Light Color",
    description: "Updates the current light color",
    triggers: [triggers.ItemStateChangeTrigger(todItem.name)],
    execute: () => applyColorForCurrentPeriod()
});

let updateColor = function (/*item*/ fromItem) {
    let toColor = targetColorForItem(fromItem);
    let fromColor = fromItem.state || "0,0,0";
    let to = color.create(toColor);
    let from = color.create(fromColor);
    log.debug(`merging color: ${from}->${to}`);

    return color.hsb(to.set('hsv.v', Math.min(to.get('hsv.v'), from.get('hsv.v'))));
}

let targetColorForItem = function(item) {
    
    let lightColor = currentLightColorItem.state;

    if(todItem.state === constants.NIGHTTIME_LIGHT_COLOR && item.tags.includes("NightDim")) {
        lightColor = color.transform(lightColor, c => c.darken().darken());
    }

    return lightColor;
}

let applyColorForCurrentPeriod = function(){
    var newColor = getColorForPeriod(todItem.state);
    log.info("Setting light color to {} based on tod: {}", newColor.toString(), todItem.state);
    currentLightColorItem.sendCommand(newColor.toString());
}

rules.JSRule({
    name: "Propagate Current Light Color",
    description: "Propagates or resets the current light color",
    triggers: [
        triggers.ItemStateChangeTrigger(currentLightColorItem.name)
    ],
    execute: () => {
        log.debug("Current light color is {}", currentLightColorItem.state);

        if (currentLightColorItem.state === '0,0,0') { // special command indicating a reset
            applyColorForCurrentPeriod();
        } else {
            for(let colorLight of items.getItem('gColorLights').descendents) {
                colorLight.sendCommandIfDifferent(updateColor(colorLight));
            }
        }
    }
});



for(let item of items.getItemsByTag('ColorLight')) {

    let target = items.getItem(item.getMetadataValue('proxyFor'));

    rules.JSRule({
        name: `proxy light ${item.name}`,
        description: `proxies commands to light ${item.name}, possibly introducing a transition`,
        triggers: [triggers.ItemCommandTrigger(item.name)],
        execute: function(args){
            let receivedCommand = args.receivedCommand.toString();
            log.debug("proxy for {} received command {}", item.name, receivedCommand);
            
            if(receivedCommand === 'ON') { //use the current light colour
                target.sendCommand(targetColorForItem(item));
            } else {
                target.sendCommand(receivedCommand);
            }
        }
    });
}