const { BaseTAI } = require('thingandlink').device;

// class TelegramTAI extends BaseTAI {
//     init(config) {
//         super.init(config);
//         this.id = config.id || items.safeItemName(config.name);
//         this.chatId = config.chatId;
//     }

//     buildObjects() {
//         super.buildObjects();
//         this.things.push(
//             things.createThing(`telegram:telegramBot`, this.id, {
//                 chatIds: this.chatId, 
//                 botToken: require('secret').telegram.botToken
//             })
//         );
//     }
// }

module.exports = [
    //new TelegramTAI({id: 'general-comms', chatId: '-1034790760'}),
    // new TelegramTAI({id: 'system-comms', chatId: '-481316266'})
];
 