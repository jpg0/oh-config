const items = require('ohj').items;

const { when, item } = require('ohj').fluent;


const ALERTED_ITEMS_TAG = "__alerted_item__";
const ALERTED_ITEMS_ITEM_NAME = "vLastAlerted";
const { DateTimeType } = require('@runtime/Defaults');


let lastAlertedItem = items.replaceItem(ALERTED_ITEMS_ITEM_NAME, 'DateTime', null, [], 'Time Last Alerted')


module.exports = {

    setAlerted:(item, isAlerted) => {
        if(typeof item === 'string') {
            item = items.getItem(item);
        }

        let isCurrentlyAlerted = item.tags.includes(ALERTED_ITEMS_TAG);

        if(isAlerted !== isCurrentlyAlerted) {

            if(isAlerted) {
                item.addTags(ALERTED_ITEMS_TAG);
            } else {
                item.removeTags(ALERTED_ITEMS_TAG);
            }

            log.info("Updating alerted to {} for {}", isAlerted, item.name);
            lastAlertedItem.sendCommand(new DateTimeType());
        }
    },
    getAlertedItems: () => items.getItemsByTag(ALERTED_ITEMS_TAG),
    onChanged: (callback) => when(item(lastAlertedItem.name).changed()).then(callback)
}