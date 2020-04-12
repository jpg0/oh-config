const { DateTimeType } = require('@runtime/Defaults');
const { items } = require('ohj');
const log = require('ohj').log('lastupdated');


let lastUpdatedItemForItem = (fromItem) => {
    if(typeof fromItem === 'string') {
        fromItem = items.getItem(fromItem);
    }

    //get the correct item to update from metadata
    let lastUpdatedItemName = fromItem.getMetadataValue('lastupdated_item');

    if(!lastUpdatedItemName) {
        log.error(`No lastupdated_item for item ${fromItem.name}`);
        return;
    }

    //update the last updated
    let lastUpdatedItem = items.getItem(lastUpdatedItemName, true)

    if(!lastUpdatedItem) {
        log.warn(`Cannot find last updated item named ${lastUpdatedItemName} for item ${fromItem.name}`);
        return;
    }

    return lastUpdatedItem;
}

module.exports = {
    lastUpdatedItemForItem,
    update: (item) => {
        let toUpdate = lastUpdatedItemForItem(item);
        let now = new DateTimeType();
        if(toUpdate != null) {
            toUpdate.sendCommand(now);
        }

        log.debug("Recorded last update as {} to {} by {}", now, toUpdate, item);
    },
    allItems: () => items.getItem('gHasLastUpdated').members,

}