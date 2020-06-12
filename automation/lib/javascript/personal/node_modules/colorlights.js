const { items, rules, triggers } = require('ohj');
const color = require('color');
const constants = require('constants');

//todo: set up vCurrent_Light_Color
let colorItem = items.getItem('vCurrent_Light_Color');
let todItem = items.getItem('vTimeOfDay');


function colorAt(periodInDay) {
    switch (periodInDay) {
        case "NIGHT":
        case "EVENING":
            return constants.NIGHTTIME_LIGHT_COLOR;
        default:
            return constants.DAYTIME_LIGHT_COLOR;
    }
};

when(item(todItem.name).changed()).then(s => updateCurrentColor(s.it));

let currentColor = function() {
    return colorItem.state;
}

let updateCurrentColor = function(tod = todItem.state) {
    var newColor = colorAt(tod);
    log.info("Setting light color to {} based on tod: {}", newColor.toString(), tod);
    colorItem.sendCommand(newColor.toString());
}

function colorForLight(lightItem) {
    let lightColor = this.currentColor();

    if(item.tags.includes("NightDim")) {
        lightColor = color.process(lightColor, c => c.darken());
    }

    return lightColor;
}

module.exports = {
    currentColor,
    colorForLight
}

//proxy commands, transform 'ON'
for(let item of items.getItemsByTag('ColorLight')) {

    let target = items.getItem(item.getMetadataValue('proxyFor'));

    when(item(item.name).receivedCommand()).then(s => {
        log.debug("proxy for {} received command {}", item.name, s.it);  
        if(s.it === 'ON') { //use the current light colour
            target.sendCommand(colorForLight(target));
        } else {
            target.sendCommand(s.it);
        }
    })
}

let calculateNewState = function (/*h,s,v*/ fromColor = "0,0,0", /*h,s,v*/ toColor) {
    let to = color.create(toColor);
    let from = color.create(fromColor);
    return color.hsb(to.set('hsb.b', Math.min(to.hsb[2], from.hsb[2])));
}

function applyNewColor(item, newColor) {
    if(!newColor) {
        newColor = colorItem.state;
        if(item.tags.includes("NightDim")) {
            newColor = color.process(newColor, c => c.darken());
        }
    }

    let target = item;
    let proxyFor = item.getMetadataValue('proxyFor');

    if(proxyFor) {
        target = items.getItem(proxyFor);
    }

    let to = color.create(newColor);
    let from = color.create(item.state);
    target.sendCommand(color.hsb(to.set('hsb.b', Math.min(to.hsb[2], from.hsb[2]))));
}

//propagate changes
when(item(colorItem.name).changed()).then(() => {
    let currentColor = currentColor();
    for(let colorLight of items.getItem('gColorLights').descendents) {
        applyNewColor(colorLight);
    }
})