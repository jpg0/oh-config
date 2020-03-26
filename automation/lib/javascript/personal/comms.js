const { actions, items } = require('ohj');

const ITEM_NAME = "___STATUS_COMMS_ITEM___";

let metadataItem = null;

try {
    metadataItem = items.getItem(ITEM_NAME);
} catch (e) {
    metadataItem = items.addItem(ITEM_NAME, "String");
}


let updateStatus = (statusId, statusValue, messageIfChanged) => {
    //get current status value from metadata, with statusId as key
    //if it's changed, then store new value & emit message
    //otherwise ignore

    let previous = metadataItem.getMetadataValue(statusId);
    if(previous != statusValue) {
        if(messageIfChanged) {
            notify(messageIfChanged);
        }
        metadataItem.upsertMetadataValue(statusId, statusValue);
    }

    return previous;
}

let chats = {
    general: -295213257,
    system: -481316266
}

let doSend = function(message, kind) {
    try {
        let chatId = chats[kind];

        if(typeof chatId == 'number') {
            actions.thingActions("telegram",`telegram:telegramBot:comms`).sendTelegram(chatId, message);
        }

    } catch (e) {
        log.error(`Failed to send comms to ${kind} `, e);
    }
}
let notify = (message, kind='general') => {
    doSend(message, kind);
}


module.exports = {
    notify,
    updateStatus,
    
    SYSTEM: 'system',
    GENERAL: 'general',
    
}