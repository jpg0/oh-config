// const ThingFactory = Java.type('org.eclipse.smarthome.core.thing.binding.ThingFactory');
// const ThingTypeRegistry = require('ohj').osgi.getService("org.eclipse.smarthome.core.thing.type.ThingTypeRegistry");
// const Configuration = Java.type('org.eclipse.smarthome.config.core.Configuration');
// const ThingTypeUID = Java.type('org.eclipse.smarthome.core.thing.ThingTypeUID');
// const ThingUID = Java.type('org.eclipse.smarthome.core.thing.ThingUID');

// const { things } = require('ohj');

// let createThing = function(/*ThingType*/ thingTypeUID, /*ThingUID*/ thingId, /*Configuration*/ configuration) {
//     if(typeof thingTypeUID === 'string') {
//         thingTypeUID = new ThingTypeUID(...thingTypeUID.split(':'));
//     }
    
//     let thingType = ThingTypeRegistry.getThingType(thingTypeUID);
//     let thingUID = new ThingUID(thingTypeUID, thingId);

//     //return new things.OHThing(ThingFactory.createThing(thingType, thingUID, new Configuration(configuration)));
//     return {
//         rawThing: ThingFactory.createThing(thingType, thingUID, new Configuration(configuration))
//     };

// }

// ///

// const { BaseTAI } = require('thingandlink').device;
// const log = require('ohj').log("tt");

// class TelegramTAI extends BaseTAI {
//     init(config) {
//         super.init(config);
//         this.id = config.id || items.safeItemName(config.name);
//         this.chatId = config.chatId;
//     }

//     buildObjects() {
//         super.buildObjects();
//         let t = createThing(`telegram:telegramBot`, this.id, {
//             chatIds: this.chatId, 
//             botToken: require('secret').telegram.botToken
//         });

//         log.info(t);

//         //this.things.push(t);
//     }
// }

// const { addToSystem } = require('thingandlink');

// addToSystem([new TelegramTAI({id: 'comms-system', chatId: '-481316266'})]);

let comms = require('comms');

comms.notify("test", comms.SYSTEM);