const { triggers, items, rules } = require('ohj'); 
const lastupdated = require('lastupdated');

//todo: move to TAI?

rules.JSRule({
    name: "Last_Updated Updater",
    description: "Updates the 'Last Updated' item for remote end devices",
    triggers: items.getItem('gMeasurements').descendents.map(item => triggers.ItemStateChangeTrigger(item.name)),
    execute: triggerData => lastupdated.update(triggerData.itemName)
});
