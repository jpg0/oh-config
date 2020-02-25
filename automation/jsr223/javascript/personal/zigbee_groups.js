const log = require('ohj').log('zigbee_groups');
const { items, actions, fluent } = require('ohj');
const mqtt = actions.get("mqtt", "mqtt:broker:mosquitto");

//only process at startup; this stuff almost never changes

const ZIGBEE_GROUPS_GROUP_NAME = 'gZigbeeGroups';
const ZIGBEE_GROUPID_METADATA_KEY = 'zigbeeGroupId';
const ZIGBEE_ID_METADATA_KEY = 'zigbeeId';
const ZIGBEE_PROXY_ITEM_NAME_METADATA_KEY = 'zigbeeProxyItemName';

let zigbeeGroupItems = items.getItem(ZIGBEE_GROUPS_GROUP_NAME).members;
log.debug("Found {} zigbee groups: {}", zigbeeGroupItems.length, zigbeeGroupItems.map(i => i.name));

for(let zigbeeGroupItem of zigbeeGroupItems) {
    let zigbeeGroupId = zigbeeGroupItem.getMetadataValue(ZIGBEE_GROUPID_METADATA_KEY);
    //first create the group
    mqtt.publishMQTT("zigbee2mqtt/bridge/config/remove_group", zigbeeGroupId);
    mqtt.publishMQTT("zigbee2mqtt/bridge/config/add_group", zigbeeGroupId);

    log.debug("Recreated zigbee group {}", zigbeeGroupId);

    //add members to the group
    for(let zigbeeItem of zigbeeGroupItem.members) {
        mqtt.publishMQTT(`zigbee2mqtt/bridge/group/${zigbeeGroupId}/add`, zigbeeItem.getMetadataValue(ZIGBEE_ID_METADATA_KEY));
        log.debug("Added {} to zigbee group {}", zigbeeItem.name, zigbeeGroupId);
    }

    //find the 'special' proxy item that sends out zigbee group commands
    let zigbeeGroupProxyItem = items.getItem(zigbeeGroupItem.getMetadataValue(ZIGBEE_PROXY_ITEM_NAME_METADATA_KEY));
    
    //wire up proxy item so that when it receive 
    with(fluent) {
        when(item(zigbeeGroupProxyItem).receivedCommand()).then(postIt().toItems(zigbeeGroupItem.members));
    }
}
