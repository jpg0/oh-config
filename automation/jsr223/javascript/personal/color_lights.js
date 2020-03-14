// /*
// maybe todo: if 'transition' is enabled for the item, 
// then set the color to the transition color and then 500ms later, pass on the update. if transition isn't
// enabled, then just proxy the command thru.
// */

// //todo: move to TAI definitions

// const { items, rules, triggers } = require('ohj');
// const log = require('ohj').log('color_lights');
// const color = require('color');

// const colorForLight = function(item) {
//     let lightColor = items.getItem('vCurrent_Light_Color').state;

//     // if(item.tags.includes("NightDim")) { //todo pull out color code, as this only triggers at change time
//     //     lightColor = color.process(lightColor, c => c.darken());
//     // }

//     return lightColor;
// }

// for(let item of items.getItemsByTag('ColorLight')) {

//     let target = items.getItem(item.getMetadataValue('proxyFor'));

//     rules.JSRule({
//         name: `proxy light ${item.name}`,
//         description: `proxies commands to light ${item.name}, possibly introducing a transition`,
//         triggers: [triggers.ItemCommandTrigger(item.name)],
//         execute: function(args){
//             let receivedCommand = args.receivedCommand.toString();
//             log.debug("proxy for {} received command {}", item.name, receivedCommand);
            
//             if(receivedCommand === 'ON') { //use the current light colour
//                 target.sendCommand(colorForLight(target));
//             } else {
//                 target.sendCommand(receivedCommand);
//             }
//         }
//     });
// }