const { items, rules, triggers } = require('ohj');
const log = require('ohj').log('color_lights');
const constants = require('constants');

for (let item of items.getItemsByTag('DualLEDs')) {

    let dimmerTarget = items.getItem(item.getMetadataValue('proxyForDimmer'));
    let colorTarget = items.getItem(item.getMetadataValue('proxyForColor'));

    rules.JSRule({
        name: `multiplex dual leds for ${item.name}`,
        triggers: [triggers.ItemCommandTrigger(item.name)],
        execute: function (args) {
            let receivedCommand = args.receivedCommand;
            log.debug("multiplexing proxy for {} received command {}", item.name, receivedCommand);


            if (receivedCommand.toString() === "ON") {
                receivedCommand = items.getItem('vCurrent_Light_Color').rawState;
            }

//            //if warm white, then set to full brightness WW LEDs, and turn off RGB
            if(receivedCommand.toString() === 'OFF') {
                colorTarget.sendCommand('OFF');
            } else {
                let warmWhiteHsb = constants.WARM_WHITE_COLOR;

                //is warm white if hue & sat match
                if (receivedCommand.getHue().equals(warmWhiteHsb.getHue()) && receivedCommand.getSaturation().equals(warmWhiteHsb.getSaturation())) {
                    //setting the white strip appears to turn off the RGB one, so just set it
                    if (receivedCommand.getBrightness() === 0) { //cannot cope with brightness 0, so just turn off if we get it
                        dimmerTarget.sendCommand('OFF');
                    } else {
                        dimmerTarget.sendCommand(receivedCommand.getBrightness().toString());
                    }
                } else { //else it's no warm white so use RGB exclusively
                    dimmerTarget.sendCommand('OFF');
                    colorTarget.sendCommand(receivedCommand.toString());
                }
            }
        }
    });
} 