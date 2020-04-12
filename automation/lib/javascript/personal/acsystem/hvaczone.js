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

    /**
     * 
     * @param {DateTime} time the time to check
     * @returns heat/cool/fan/null
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
        } else { //within bounds
            this.notifyOpenNotRequired();

            //possibly ventilate
            if(bounds.ventilate) {
                //todo: maybe don't ventilate if other zones require cool/heat
                return 'fan';
            } else {
                return null;
            }   
        }
    }

    notifyOpen(operation, label, unsealedItems) {
        let itemsStr = unsealedItems.map(i => i.label.endsWith(" Contact") ? i.label.slice(0, -8) : i.label).join(', ');

        let message = `Want to ${operation} ${label}, but ${itemsStr} ${unsealedItems.length==1?'is':'are'} open`;

        let previous = comms.updateStatus(`hvacopen_${this._safeName}`, 'open');

        if(previous == 'closed' || previous == 'notrequired') {
            comms.notify(message);
        }
    }

    notifyClosed(operation) {
        let previous = comms.updateStatus(`hvacopen_${this._safeName}`, 'closed');
        if(previous == 'open') {
            comms.notify(`Sealed ${this.label}, activating ${operation}ing...`);
        }
    }

    notifyOpenNotRequired() {
        comms.updateStatus(`hvacopen_${this._safeName}`, 'notrequired');
    }

    get _safeName(){
        return this.label.replace(/[^A-Za-z0-9_-]/, '_');
    }

    /**
     * 
     * @param {DateTime} time the time to check
     * @returns heat/cool/null
     */
    shouldHeatOrCoolNow() {
        return this.shouldHeatOrCoolWithBounds(this.boundsConfig.boundsNow());
    }
}

class UpstairsHVACZone extends HVACZone {

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
                let passiveBounds = this.boundsConfig.passiveBoundsNow();
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
        let cmd = isActive ? "ON" : "OFF";
        items.getItem('UpstairsDoorLatch_Switch').sendCommandIfDifferent(cmd) && log.debug("Setting door latch active as {}", isActive);
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
        let cmd = isOpen ? 'up' : 'down';
        items.getItem('gUpstairsScreens').sendCommandIfDifferent(cmd) && log.debug("Setting shades as {}", cmd);;;
    }
}

let SLEEP_TIME_START = LocalTime.parse("20:00");
let SLEEP_TIME_END = LocalTime.parse("08:00");

module.exports = {
    HVACZone,
    UpstairsHVACZone,
    SLEEP_TIME_START,
    SLEEP_TIME_END,
}