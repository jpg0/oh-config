const LocalTime = require('js-joda').LocalTime;
const log = require('ohj').log('zonetemperature');
const { items } = require('ohj');
const JSJoda = require('js-joda');
const ISO8601Formatter = JSJoda.DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSS[xxxx][xxxxx]");


class ZoneTemperatureBounds {
    constructor(name, boundsConfig, passiveBoundsConfig) {
        this.name = name;
        this.boundsConfig = boundsConfig;
        this.passiveBoundsConfig = passiveBoundsConfig;
        this.buildItems();
        this.updateItems();
    }

    buildItems() {
        this.groupItem = items.replaceItem(`gZoneTemp${this.name}`, 'Group', null, ['gZoneTemps'], `Temp Items for ${this.name}`);
        this.maxTempItem = items.replaceItem(`vMaxTemp${this.name}`, 'Number', null, [this.groupItem.name], `Max: ${this.name} []`);
        this.minTempItem = items.replaceItem(`vMinTemp${this.name}`, 'Number', null, [this.groupItem.name], `Min: ${this.name}`);
        this.overideEndItem = items.replaceItem(`vOverrideEnd${this.name}`, 'DateTime', null, [this.groupItem.name], `Override for ${this.name}`);
    }

    isOverrideActive() {
        let overrideEndStr = this.overideEndItem.state;

        if(!overrideEndStr || overrideEndStr == "") {
            return false;
        }

        let overrideEnd = JSJoda.LocalDateTime.parse(overrideEndStr, ISO8601Formatter);
        return overrideEnd.isAfter(JSJoda.LocalDateTime.now());
    }

    updateItems() {
        let bounds = this.configBoundsNow();

        log.info(`${this.name}:${JSON.stringify(bounds)}`);

        if(bounds.max) {
            this.maxTempItem.sendCommandIfDifferent(bounds.max);
        }

        if(bounds.min) {
            this.minTempItem.sendCommandIfDifferent(bounds.min);
        }
    }

    boundsAtTimeForConfig(time, boundsConfig) {
        for (let zoneRuleData of boundsConfig) {
            let from = LocalTime.parse(zoneRuleData[0]);
            let to = LocalTime.parse(zoneRuleData[1]);

            log.debug("Checking bound " + JSON.stringify(zoneRuleData));

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
        this.updateItems();
        return this.configBoundsNow();
    }

    passiveBoundsNow() {
        this.updateItems();
        return this.boundsAtTimeForConfig(LocalTime.now(), this.passiveBoundsConfig);
    }
}

module.exports = {
    ZoneTemperatureBounds
}