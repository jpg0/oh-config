const { things, metadata, itemchannellink, utils, items } = require('ohj');

const StateDescriptionFragmentBuilderClass = utils.typeBySuffix('core.types.StateDescriptionFragmentBuilder');

class BaseTAI {
    constructor(config){
        this.items = [];
        this.things = [];
        this.metadata = [];
        this.itemChannelLinks = [];
        this.stateDescriptionFragments = {};
        this.sealed = false;

        if(typeof config.groups != 'undefined') {
            if(typeof config.groups == 'string') {
                this.groups = [config.groups];
            } else {
                this.groups = config.groups;
            }
        } else {
            this.groups = [];
        }

        if(typeof config.label != 'undefined') {
            this.label = config.label;
        }

        this.init(config);
        this.buildObjects();
    }

    init(config) {

    }

    buildObjects() {

    }

    activateRules() {
        
    }

    addToItemsProvider(itemsProvider) {
        this.seal(false);
        itemsProvider.addCallback(() => this.items.map(i => i.rawItem));
    }

    addToThingsProvider(thingsProvider) {
        this.seal(false);
        thingsProvider.addCallback(() => this.things.map(t => t.rawThing));
    }

    addToMetadataProvider(metadataProvider) {
        this.seal(false);
        metadataProvider.addCallback(() => this.metadata);
    }

    addToItemChannelLinksProvider(itemChannelLinksProvider) {
        this.seal(false);
        itemChannelLinksProvider.addCallback(() => this.itemChannelLinks);
    }

    addToStateDescriptionFragmentProvider(stateDescriptionFragmentProvider) {
        this.seal(false);
        stateDescriptionFragmentProvider.addCallback(i => this.stateDescriptionFragments[i]);
    }

    linkItemToChannel(item, channel, additionalProps) {
        this.metadata.push(metadata.createMetadata(item.name, 'channel', channel.uid));
        for(let k in additionalProps) {
            this.metadata.push(metadata.createMetadata(item.name, k, additionalProps[k]));
        }
        this.items.push(item);
    }

    addStateFormat(item, format) {
        this.stateDescriptionFragments[item.name] = StateDescriptionFragmentBuilderClass.create().withPattern(format).build();
    }

    addMetadataToItem(item, key, value) {
        this.metadata.push(metadata.createMetadata(item.name, key, value));
    }

    seal(throwOnSealed) {
        if(throwOnSealed && this.sealed) {
            throw Error("TAI aleady sealed!")
        }

        let isSealing = !this.sealed;
        this.sealed = true;
        return isSealing;
    }
}

class MQTTTAI extends BaseTAI {
    init(config) {
        super.init(config);
        this.id = config.id || items.safeItemName(config.name);
        this.mqttPrefix = `_${this.constructor.name}`;
        this.createMQTTThingBuilder();
    }

    withNewMQTTChannel(channelId, acceptedItemType, channelType, config) {
        let channel = things.newChannelBuilder(this.thingBuilder.thingUID, channelId, acceptedItemType).
                 withConfiguration(config).
                 withLabel(channelId).
                 withKind('STATE').
                 withType(`mqtt:${channelType}`).
                 build();
        this.thingBuilder.withChannel(channel);
        return channel;
    }

    createMQTTThingBuilder() {
        this.thingBuilder = things.newThingBuilder(`mqtt:topic`, `${this.id}${this.mqttPrefix}`, `mqtt:broker:mosquitto`);
    }

    seal(throwOnSealed){
        let isSealing = super.seal(throwOnSealed);
        if(isSealing){
            this.things.push(this.thingBuilder.build());
        }
        return isSealing;
    }
}

module.exports = {
    BaseTAI,
    MQTTTAI
}
