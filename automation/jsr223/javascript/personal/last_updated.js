const { triggers, items, rules } = require('ohj');
 
const log = require('ohj').log('last_updated');
const { DateTimeType } = require('@runtime/Defaults');

//todo: move to TAI?

rules.JSRule({
    name: "Last_Updated Updater",
    description: "Updates the 'Last Updated' item for remote end devices",
    triggers: items.getItem('gMeasurements').descendents.map(item => triggers.ItemStateChangeTrigger(item.name)),
    execute: function (triggerData) {
        let triggerItemName = triggerData.itemName;

        //get the correct item to update from metadata
        let lastUpdatedItemName = items.getItem(triggerItemName).getMetadataValue('lastupdated_item');

        if(!lastUpdatedItemName) {
            log.error(`No lastupdated_item for trigger item ${triggerItemName}`);
            return;
        }

        //update the last updated
        let now = new DateTimeType();
        let lastUpdatedItem = items.getItem(lastUpdatedItemName, true)

        if(!lastUpdatedItem) {
            log.warn(`Cannot find last updated item named ${lastUpdatedItemName} for trigger item ${triggerItemName}`);
            return;
        }

        lastUpdatedItem.sendCommand(now);

        log.debug("Recorded last update as {} to {} by {}", now, lastUpdatedItemName, triggerItemName);
    }
});