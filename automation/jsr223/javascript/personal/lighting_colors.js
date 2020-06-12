
const { rules, triggers, items } = require('ohj');
const log = require('ohj').log('lighting_colors');
const constants = require('constants');
const color = require('color');

const { LocalTime, ChronoUnit } = require('vendor/js-joda');
 
//todo: extract
const EVENING_START_STR = "19:30";
const EVENING_START = LocalTime.parse(EVENING_START_STR);

let todItem = items.getItem('vTimeOfDay');

let DAY_COLOUR_TEMP = 3200;
let NIGHT_COLOUR_TEMP = 200;

let adjustedColorTemp = (proportion) =>
{
    let adjustedProportion = 1 - (Math.pow(1 - proportion, 2));
    log.debug("temp="+((adjustedProportion * (DAY_COLOUR_TEMP - NIGHT_COLOUR_TEMP)) + NIGHT_COLOUR_TEMP));
    let rv = color.chroma.mix(
        color.chroma.temperature((adjustedProportion * (DAY_COLOUR_TEMP - NIGHT_COLOUR_TEMP)) + NIGHT_COLOUR_TEMP),
        "#ffe400",
        0.6 * adjustedProportion);

        return rv;
    }

let COLOR_POLICY = {
    default: ctx => { 
        let c;
        switch (ctx.periodInDay) {
            case "NIGHT":
                c = adjustedColorTemp(0);
                if(ctx.item.tags.includes("NightDim")) {
                    c = c.darken().darken();
                }
                break;
            case "EVENING":
                let proportion = EVENING_START.until(ctx.now, ChronoUnit.MINUTES) / 60;
                
                proportion = Math.min(proportion, 1);
                proportion = Math.max(proportion, 0);

                c = adjustedColorTemp(1 - proportion);
                break;
            default:
                c = adjustedColorTemp(1);
                break;
        }

        log.debug("chosen color: " + c.hsv())

        return color.hsb(c);
    }
}

let determineColor = function (/*item*/ fromItem, time) {
    let toColor = targetColorForItem(fromItem, time);
    let fromColor = fromItem.state || "0,0,0";
    let to = color.create(toColor);
    let from = color.create(fromColor);
    log.debug(`merging color: ${from}->${to}`);

    return color.hsb(to.set('hsv.v', Math.min(to.get('hsv.v'), from.get('hsv.v'))));
}

let targetColorForItem = function(item, time) {
    return COLOR_POLICY.default({
        periodInDay: todItem.state,
        now: time || LocalTime.now(),
        item: item,
    });
}

rules.JSRule({
    name: "Propagate Light Color on TOD",
    description: "Propagates the light color when tod changes",
    triggers: [
        triggers.ItemStateChangeTrigger(todItem.name),
    ],
    execute: () => {
        for(let colorLight of items.getItem('gColorLights').descendents) {
            colorLight.sendCommandIfDifferent(determineColor(colorLight));
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
            require('transitioner').transition(colorLight.name, determineColor(colorLight, LocalTime.now().plusMinutes(5)), 300);
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
                target.sendCommand(targetColorForItem(item));
            } else {
                target.sendCommand(receivedCommand);
            }
        }
    });
} 