
const { rules, triggers, items } = require('ohj');
const log = require('ohj').log('lighting_colors');
const constants = require('constants');
const { HSBType, PercentType } = require('@runtime/Defaults');

var getColor = function (periodInDay) {
    switch (periodInDay) {
        case "NIGHT":
        case "EVENING":
            return constants.NIGHTTIME_LIGHT_COLOR;
        default:
            return constants.DAYTIME_LIGHT_COLOR;
    }
};
 
var calculateNewState = function (/*HSBType*/ fromColor, /*HSBType*/ toColor) {
    if (typeof fromColor === 'undefined' || fromColor.toString() === 'NULL') {
        var brightness = 0;
    } else {
        var brightness = Math.min(toColor.getBrightness(), fromColor.getBrightness());
    }

    return new HSBType(
        toColor.getHue(),
        toColor.getSaturation(),
        new PercentType(brightness));
}

rules.JSRule({
    name: "Propagate Current Light Color",
    description: "Propagates or resets the current light color",
    triggers: [
        triggers.ItemStateChangeTrigger('vCurrent_Light_Color')
    ],
    execute: function () {
        var currentColor = items.getItem('vCurrent_Light_Color');

        log.debug("Current light color is  " + currentColor.state);

        if (currentColor.state === '0,0,0') { // special command indicating a reset
            var tod = items.getItem('vTimeOfDay').state;
            var newColor = getColor(tod);
            log.info("resetting light color to {} based on tod: {}", newColor.toString(), tod);
            items.getItem('vCurrent_Light_Color').sendCommand(newColor.toString());
        } else {
            for(let colorLight of items.getItem('gColorLights').descendents) {
                colorLight.sendCommand(calculateNewState(colorLight.rawState, currentColor.rawState).toString());
            }
        }
    }
});

rules.JSRule({
    name: "Update Current Light Color",
    description: "Updates the current light color",
    triggers: [
        triggers.ItemStateChangeTrigger('vTimeOfDay')
    ],
    execute: function () {
        var tod = items.getItem('vTimeOfDay').state.toString();
        var newState = getColor(tod);
        log.info("Setting current light colour to " + newState + " for " + tod);
        items.getItem('vCurrent_Light_Color').sendCommand(newState.toString());
    }
}); 