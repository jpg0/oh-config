//Power on: octoPrint/event/PrinterStateChanged {"_timestamp": 1583193851, "state_string": "Starting", "_event": "PrinterStateChanged", "state_id": "STARTING"}

/*
{
    "origin": "local",
    "_event": "PrintStarted",
    "name": "NodeMCU_Case_-_35_gap.gcode",
    "file": "/.../NodeMCU_Case_-_35_gap.gcode",
    "path": "NodeMCU_Case_-_35_gap.gcode",
    "filename": "NodeMCU_Case_-_35_gap.gcode",
    "size": 2858607
  }

  {
    "origin": "local",
    "_event": "PrintDone",
    "name": "NodeMCU_Case.gcode",
    "file": "/.../NodeMCU_Case.gcode",
    "time": 5252.172917127609,
    "path": "NodeMCU_Case.gcode",
    "filename": "NodeMCU_Case.gcode",
    "size": 2823042
  }
  */


let log = require('ohj').log("octoprint");
let { rules, triggers, items } = require('ohj');

let printerPowerSwitch = items.getItem('3D_Printer_Switch');

rules.JSRule({
    name: "octoprint_power",
    description: "Powers on/off printer from octoprint messages",
    triggers: [
        triggers.ChannelEventTrigger('mqtt:topic:mosquitto:octoprint:status', '')
    ],
    execute: (triggerData) => {
        try {
            let octoprintEvent = JSON.parse(triggerData.receivedTrigger);

            switch(octoprintEvent._event) {
                case 'PrintStarted':
                    printerPowerSwitch.sendCommand('ON');
                    break;
                case 'PrintDone':
                case 'PrintCancelled':
                    printerPowerSwitch.sendCommand('OFF');
                    break;
            }

        } catch (error) {
            log.error(`Failed to execute rule ${this.name}; ${error} at line ${error.lineNumber}`);
        }
    }
});