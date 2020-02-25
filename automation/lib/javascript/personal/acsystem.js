const items = require('ohj').items;
const log = require('ohj').log('acsystem');

const LocalTime = require('js-joda').LocalTime;

const comms = require('comms');

class HVACZone {
    constructor(label, temperatureItemName, ductItemName, openingsItemName, boundsConfig) {
        this.label = label;
        this.temperatureItemName = temperatureItemName;
        this.ductItemName = ductItemName;
        this.openingsItemName = openingsItemName;
        this.boundsConfig = boundsConfig;
    }

    get currentTemperature() {
        return items.getItem(this.temperatureItemName).state;
    }

    /**
     * Sets whether the ducts are open or not
     * @param {Boolean} isOpen whether to set open (true=open, false=closed)
     * @returns whether the state was changed
     */
    setDuctState(isOpen) {
        let cmd = isOpen ? 'ON' : 'OFF';
        let changed = items.getItem(this.ductItemName).sendCommandIfDifferent(cmd);
        if(changed) {
            log.info("Setting duct " + this.ductItemName + " to " + cmd)
        } 
        return changed;
    }

    isZoneSealed() {
        return items.getItem(this.openingsItemName).state == "CLOSED";
    }

    get unsealedItems() {
        return items.getItem(this.openingsItemName).descendents.filter(i => i.state != 'CLOSED');
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
                    max: zoneRuleData[3]
                };
            }
        }
        return {};
    }

    boundsAt(time) {
        return this.boundsAtTimeForConfig(time, this.boundsConfig);
    }

    /**
     * 
     * @param {DateTime} time the time to check
     * @returns heat/cool/null
     */
    shouldHeatOrCoolWithBounds(bounds, respectSealed = true) {
        let currentTemp = this.currentTemperature;
        let isSealed = respectSealed ? this.isZoneSealed() : false;

        if ('min' in bounds && currentTemp < bounds.min) {
            if(isSealed) {
                this.notifyClosed('heat');
                return 'heat';
            } else {
                this.notifyOpen('heat', this.label, this.unsealedItems);
                return null;
            }
        } else if (bounds.max && currentTemp > bounds.max) {
            if(isSealed) {
                this.notifyClosed('cool');
                return 'cool';
            } else {
                this.notifyOpen('cool', this.label, this.unsealedItems);
                return null;
            }
        } else {
            this.notifyOpenNotRequired();
            return null;
        }
    }

    notifyOpen(operation, label, unsealedItems) {
        let itemsStr = unsealedItems.map(i => i.label).join(', ');
        if(label.endsWith(" Contact")) {
            label = label.slice(0, -8);
        }
        let message = `Want to ${operation} ${label}, but ${itemsStr} ${unsealedItems.length==1?'is':'are'} open`;

        let previous = comms.updateStatus(`hvacopen_${this._safeName}`, 'open');

        if(previous == 'closed' || previous == 'notrequired') {
            comms.notify(message);
        }
    }

    notifyClosed(operation) {
        let previous = comms.updateStatus(`hvacopen_${this._safeName}`, 'closed');
        if(previous == 'open') {
            comms.notify(`Closed, activating ${operation}ing...`);
        }
    }

    notifyOpenNotRequired() {
        comms.updateStatus(`hvacopen_${this._safeName}`, 'notrequired');
    }

    get _safeName(){
        return this.label.replace(/[^A-Za-z0-9_-]/, '_');
    }

    shouldHeatOrCoolAt(time) {
        return this.shouldHeatOrCoolWithBounds(this.boundsAt(time));
    }
    /**
     * 
     * @param {DateTime} time the time to check
     * @returns heat/cool/null
     */
    shouldHeatOrCoolNow() {
        let time = LocalTime.now();
        return this.shouldHeatOrCoolAt(time);
    }
}

class UpstairsHVACZone extends HVACZone {
    constructor(label, temperatureItemName, ductItemName, openingsItemName, boundsConfig, passiveBoundsConfig) {
        super(label, temperatureItemName, ductItemName, openingsItemName, boundsConfig);
        this.passiveBoundsConfig = passiveBoundsConfig;
    }

    processPassiveHVAC(isActiveHVACEnabled) {
        if(typeof isActiveHVACEnabled === 'undefined') {
            isActiveHVACEnabled = this.isActiveHVACEnabled
        }

        if(isActiveHVACEnabled) {
            log.debug("Ensure windows closed & shades open as active AC is on");

            this.setWindowsOpen(false); //ensure windows are closed if active HVAC is on
            //for the moment, don't use shades with active HVAC
            this.setShadesOpen(true);

            this.setDoorLatchActive(false);

        } else { //no active HVAC

            this.setDoorLatchActive(true);

            if(this.isPassiveHVACEnabled) { //all passive HVAC
                let passiveBounds = this.boundsAtTimeForConfig(LocalTime.now(), this.passiveBoundsConfig);
                let coolOrHeat = this.shouldHeatOrCoolWithBounds(passiveBounds, false);

                switch(coolOrHeat) {
                    case 'cool': {
                        if(this.outdoorTemperature < this.currentTemperature) { //use windows
                            log.debug("Ensure windows & shades open as it's too hot inside but cool outside");
                            this.setWindowsOpen(true);
                            this.setShadesOpen(true);
                        } else { //use shades
                            log.debug("Ensure windows & shades closed as it's too hot inside but even hotter outside")
                            this.setShadesOpen(false);
                            this.setWindowsOpen(false)
                        }
                        break;
                    }
                    case 'heat': {
                        if(this.outdoorTemperature > this.currentTemperature) { //use windows
                            log.debug("Ensure windows closed & shades open as it's too cold inside but warm outside");
                            this.setWindowsOpen(true);
                            this.setShadesOpen(true);
                        } else { //use nothing
                            log.debug("Ensure windows & shades closed as it's too cold inside but colder outside");
                            this.setShadesOpen(true);
                            this.setWindowsOpen(false);
                        }
                        break;
                    }
                    case null: {  //we're currently within passive bounds
                        if('min' in passiveBounds && this.outdoorTemperature < passiveBounds.min) {
                            //too cold outside
                            log.debug("Ensure windows open & shades closed as whilst it's good inside, it's too cold outside ({}°C)", this.outdoorTemperature);
                            this.setWindowsOpen(false);
                            this.setShadesOpen(true);
                        } else if('max' in passiveBounds && this.outdoorTemperature > passiveBounds.max) {
                            //too hot outside
                            log.debug("Ensure windows & shades closed as whilst it's good inside, it's too hot good outside ({}°C)", this.outdoorTemperature);
                            this.setWindowsOpen(false);
                            this.setShadesOpen(false);
                        } else {
                            //good inside and out
                            log.debug("Ensure windows and shades open to get some air as it's good inside and out");
                            this.setWindowsOpen(true);
                            this.setShadesOpen(true);
                        }
                        break;
                    }
                }
            } else {
                //neither active nor passive enabled, so do nothing
            }
        }
    }

    getPassiveBoundsNow() {
        return this.boundsAtTimeForConfig(LocalTime.now(), this.passiveBoundsConfig);
    }

    get outdoorTemperature() {
        return items.getItem('Outside_Upstairs_Temperature').state;
    }

    get isActiveHVACEnabled() {
        return items.getItem(this.ductItemName).state == 'ON';
    }

    get isPassiveHVACEnabled() {
        return this.isWithinPassiveHVACTimes && !this.blindsAreDown;
    }

    get isWithinPassiveHVACTimes() {
        let time = LocalTime.now();
        return time.isAfter(acsystem.SLEEP_TIME_END) && time.isBefore(acsystem.SLEEP_TIME_START);
    }

    get blindsAreDown() {
        return items.getItem('gUpstairsBlinds').state === "down";
    }

    setDoorLatchActive(isActive) {
        log.debug("Setting door latch active as {}", isActive);
        let cmd = isActive ? "ON" : "OFF";
        items.getItem('UpstairsDoorLatch_Switch').sendCommand(cmd);
    }

    setDuctState(isOpen) {
        //immediately process passive HVAC if active status changes
        super.setDuctState(isOpen) && this.processPassiveHVAC(isOpen);        
    }

    setWindowsOpen(isOpen) {
        let ignoreContactState = isOpen ? 'OPEN' : 'CLOSED';
        let cmd = isOpen ? 'ON' : 'OFF';

        if(items.getItem('UpstairsLouvresSmall_Contact').state != ignoreContactState) {
            items.getItem('UpstairsLouvresSmall').sendCommand(cmd);
        }

        if(items.getItem('UpstairsLouvresLarge_Contact').state != ignoreContactState) {
            items.getItem('UpstairsLouvresLarge').sendCommand(cmd);
        }
    }

    setShadesOpen(isOpen) {
        items.getItem('gUpstairsScreens').sendCommandIfDifferent(isOpen ? 'up' : 'down');
    }
}

exports.Zones = {
    "Living": new HVACZone(
        "Living Room",
        "gLivingRoomTemperature",
        "KitchenDuct_Switch",
        "gKitchenOpenings",
        [
            ["06:30", "21:00", 19, 30]
        ]
    ),
    "Kids": new HVACZone(
        "Kids Rooms",
        "gKidsRoomsTemperature",
        "KidsRoomsDuct_Switch",
        "gKidsRoomsOpenings",
        [ //heatup rate of 0.2C/min
            ["06:15", "07:15", 20, 30],
            ["18:15", "19:45", 20, 23],
            ["19:45", "06:15", 15, 23]
        ]
    ),
    "Games": new HVACZone(
        "Games Room",
        "Main_Bedroom_Temperature",
        "GamesDuct_Switch",
        "gGamesRoomOpenings",
        []
    ),
    "Upstairs": new UpstairsHVACZone(
        "Upstairs",
        "gUpstairsBedroomTemperature",
        "UpstairsDuct_Switch",
        "gUpstairsOpenings",
        [
            ["06:15", "07:45", 18, 24],
            ["20:00", "06:15", 15, 20]
        ],
        [
            ["08:15", "20:00", 18, 35] //passive HVAC desires
        ]
    )
};

exports.SLEEP_TIME_START = LocalTime.parse("20:00");
exports.SLEEP_TIME_END = LocalTime.parse("08:00");