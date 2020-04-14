const LocalTime = require('js-joda').LocalTime;
const log = require('ohj').log('zonetemperature');
const JSJoda = require('js-joda');
const { rules, triggers, items } = require('ohj');


const ISO8601Formatter = JSJoda.DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSS[xxxx][xxxxx]");


class ZoneTemperatureBounds {
    constructor(name, boundsConfig, passiveBoundsConfig) {
        this.name = name;
        this.boundsConfig = boundsConfig;
        this.passiveBoundsConfig = passiveBoundsConfig;
        this.buildItems();
        this.updateItems();
        this.installRules();
    }

    buildItems() {
        let groupItem = items.replaceItem(`gZoneTemp${this.name}`, 'Group', null, ['gZoneTemps'], `Temp Items for ${this.name}`);
        items.replaceItem(`vMaxTemp${this.name}`, 'Number', null, [groupItem.name], `Max: ${this.name} []`);
        items.replaceItem(`vMinTemp${this.name}`, 'Number', null, [groupItem.name], `Min: ${this.name}`);
        items.replaceItem(`vOverrideEnd${this.name}`, 'DateTime', null, [groupItem.name], `Override end time for ${this.name}`);
        items.replaceItem(`vOverrideMinsRemaining${this.name}`, 'Number', null, [groupItem.name], `Override mins remaining for ${this.name}`);
    }

    get maxTempItem() {
        return items.getItem(`vMaxTemp${this.name}`);
    }

    get minTempItem() {
        return items.getItem(`vMinTemp${this.name}`);
    }

    get overideEndItem() {
        return items.getItem(`vOverrideEnd${this.name}`);
    }

    get overideMinRemainingItem() {
        return items.getItem(`vOverrideMinsRemaining${this.name}`);
    }



    installRules() {
        rules.JSRule({
            id: this.name.replace(/[^\w]/g, "-"), //set the ID as we only want one of these
            name: `Apply Override Mins to Override Time for ${this.name}`,
            triggers: [triggers.ItemStateChangeTrigger(this.overideMinRemainingItem.name)],
            execute: () => this.applyEndMinsToEndTime()
        });
    }
    
    itemUndefined(itemState) {
        return itemState === null || itemState === undefined || itemState === "" || itemState === 'NULL' || itemState === 'UNDEF';
    }

    isOverrideActive() {
        let overrideEndStr = this.overideEndItem.state;

        if(this.itemUndefined(overrideEndStr)) {
            // log.debug(`No override defined for ${this.name} [${overrideEndStr}]`);
            return false;
        }

        let overrideEnd = JSJoda.LocalDateTime.parse(overrideEndStr, ISO8601Formatter);
        let overrideInFuture = overrideEnd.isAfter(JSJoda.LocalDateTime.now());
        // log.debug(`Override for ${this.name} in ${overrideInFuture?'future':'past'}`);
        return overrideInFuture;
    }

    currentOverriddenBounds() {
        let rv = {};

        let overridden = this.isOverrideActive();
        // log.debug(`Overriden for ${this.name} is ${overridden}`);
        if(overridden) {
            let minTemp = this.minTempItem.state;
            let maxTemp = this.maxTempItem.state;
            // log.debug(`Overriden temps for ${this.name}: ${minTemp}-${maxTemp}`);
            if(!this.itemUndefined(minTemp)) {
                rv.min = minTemp;
            }
            if(!this.itemUndefined(maxTemp)) {
                rv.max = maxTemp;
            }
        }

        return rv;
    }
 
    applyEndMinsToEndTime() {
        let minRemaining = this.overideMinRemainingItem.state;
        let overrideEnd = JSJoda.LocalDateTime.now().plusMinutes(minRemaining);
        this.overideEndItem.postUpdate(overrideEnd.format(ISO8601Formatter));
    }

    applyEndTimeToEndMins() {
        let overrideEnd = JSJoda.LocalDateTime.parse(this.overideEndItem.state, ISO8601Formatter);
        let minRemaining = JSJoda.Duration.between(JSJoda.LocalDateTime.now(), overrideEnd).toMinutes();
        this.overideMinRemainingItem.postUpdate(minRemaining);
    }

    updateItems() {
        if(this.isOverrideActive()) {
            this.applyEndTimeToEndMins();
        } else {
            let bounds = this.configBoundsNow();

            if(bounds.max) {
                this.maxTempItem.sendCommandIfDifferent(bounds.max);
            } else {
                this.maxTempItem.postUpdate('UNDEF');
            }
    
            if(bounds.min) {
                this.minTempItem.sendCommandIfDifferent(bounds.min);
            } else {
                this.minTempItem.postUpdate('UNDEF');
            }

            this.overideEndItem.postUpdate('UNDEF');
            this.overideMinRemainingItem.postUpdate('0');
        }
    }

    boundsAtTimeForConfig(time, boundsConfig) {
        for (let zoneRuleData of boundsConfig) {
            let from = LocalTime.parse(zoneRuleData[0]);
            let to = LocalTime.parse(zoneRuleData[1]);

            // log.debug("Checking bound " + JSON.stringify(zoneRuleData));

            if (
                (from.isBefore(time) && to.isAfter(time)) || //span within day
                ((from.isAfter(to)) && ((from.isBefore(time)) || (to.isAfter(time)))) //spanning days
            ) {
                return {
                    min: zoneRuleData[2],
                    max: zoneRuleData[3],
                    ventilate: zoneRuleData.length > 4 && zoneRuleData[4]
                };
            }
        }
        return {};
    }

    configBoundsNow() {
        return this.boundsAtTimeForConfig(LocalTime.now(), this.boundsConfig);
    }

    boundsNow() {
        // log.debug(`Entering boundsNow() for ${this.name} [${this.overideEndItem.state}]`);
        this.updateItems();
        let configBounds = this.configBoundsNow();
        let overriddenBounds = this.currentOverriddenBounds();
        // log.debug("c:"+JSON.stringify(configBounds));
        // log.debug("o:"+JSON.stringify(overriddenBounds));
        

        let rv = Object.assign(configBounds, overriddenBounds);
        log.debug("Bounds for {}: {}", this.name, JSON.stringify(rv));
        return rv;
    }

    passiveBoundsNow() {
        this.updateItems();
        return this.boundsAtTimeForConfig(LocalTime.now(), this.passiveBoundsConfig);
    }
}

module.exports = {
    ZoneTemperatureBounds
}