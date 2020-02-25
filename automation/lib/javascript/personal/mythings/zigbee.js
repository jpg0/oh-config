const { items } = require('ohj');
const { ZigbeeColorBulbTAI, ZigbeeDualColorBulbTAI } = require('thingandlink').device;

class ZigbeeDualColorBulbGroupTAI extends ZigbeeDualColorBulbTAI {
    constructor(config) {
        super({
            ...config,
            itemPrefix: 'zg',
            zigbeeId: config.groupId,
          });
    }

    buildObjects() {
        let groupItem = items.createItem(`gz${this.id}`, 'Group', 'light', ['gZigbeeGroups'], `${this.name} Light Group`,);
        this.addMetadataToItem(groupItem, 'zigbeeGroupId', this.id);
        this.addMetadataToItem(groupItem, 'zigbeeProxyItemName', `zg${this.id}_Light`);
        this.items.push(groupItem);

        super.buildObjects();
    }
}

class ZigbeeColorBulbGroupTAI extends ZigbeeColorBulbTAI {
    constructor(config) {
        super({
            ...config,
            itemPrefix: 'zg',
            zigbeeId: config.groupId,
          });
    }

    buildObjects() {
        let groupItem = items.createItem(`gz${this.id}`, 'Group', 'light', ['gZigbeeGroups'], `${this.name} Light Group`,);
        this.addMetadataToItem(groupItem, 'zigbeeGroupId', this.id);
        this.addMetadataToItem(groupItem, 'zigbeeProxyItemName', `zg${this.id}_Light`);
        this.items.push(groupItem);

        super.buildObjects();

    }
}


module.exports = [
    new ZigbeeColorBulbGroupTAI({name: 'LivingRoomLights', groupId: 'LivingRoomLights', groups: ['gLivingRoom']}),

    new ZigbeeColorBulbTAI({name: 'LivingRoom Corner', zigbeeId: '0x0017880104250673', zigbeeGroupId: "LivingRoomLights", groups: ["gColorLights","gLivingRoom"]}),
    new ZigbeeColorBulbTAI({name: 'TVLight', zigbeeId: '0x00158d0001dd7f3e', zigbeeGroupId: "LivingRoomLights", groups: ["gColorLights","gLivingRoom","gTransitionalLights"]}),
    
    new ZigbeeColorBulbTAI({name: 'FloorLamp', zigbeeId: '0x00158d0001dd7f00', groups: ["gColorLights","gEveningLights"]}),

    new ZigbeeColorBulbTAI({name: 'Indis Closet', zigbeeId: '0x0017880103cfc584', groups: ["gIndisRoom"]}),
    new ZigbeeColorBulbTAI({name: 'Hallway', zigbeeId: '0x0017880104190686', groups: ["gColorLights"]}),

    new ZigbeeColorBulbTAI({name: 'Upstairs Toilet', zigbeeId: '0x0017880106bc3445', groups: ["gColorLights","gUpstairs","gTransitionalLights"]}),
    new ZigbeeColorBulbTAI({name: 'Upstairs Closet', zigbeeId: '0x0017880104985398', groups: ["gColorLights","gUpstairs"]}),

    new ZigbeeColorBulbTAI({name: 'Bedside 1', zigbeeId: '0x0017880104184075', groups: ["gColorLights"]}),
    new ZigbeeColorBulbTAI({name: 'Bedside 2', zigbeeId: '0x00158d0002009074', groups: ["gColorLights"]}),

    new ZigbeeDualColorBulbGroupTAI({name: "KitchenLeds", groupId: "KitchenLeds"}),

    new ZigbeeDualColorBulbTAI({name: 'KitchenLEDs.1.1', zigbeeId: '0x00124b001ba6fe1b', groups: 'gKitchenLeds', zigbeeGroupId: 'KitchenLeds'}),
    new ZigbeeDualColorBulbTAI({name: 'KitchenLEDs.1.2', zigbeeId: '0x00124b001d43d06f', groups: 'gKitchenLeds', zigbeeGroupId: 'KitchenLeds'}),
    new ZigbeeDualColorBulbTAI({name: 'KitchenLEDs.2.1', zigbeeId: '0x00124b001ba703ec', groups: 'gKitchenLeds', zigbeeGroupId: 'KitchenLeds'}),
    new ZigbeeDualColorBulbTAI({name: 'KitchenLEDs.2.2', zigbeeId: '0x00124b001d43d193', groups: 'gKitchenLeds', zigbeeGroupId: 'KitchenLeds'}),
];