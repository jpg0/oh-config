'use strict';

let log = require('ohj').log("tasmota");
let { rules, triggers, actions } = require('ohj');
let http = require('jhttp');

let backupDir = Java.type("org.openhab.core.OpenHAB").getUserDataFolder() + "/tasmota";

// rules.withNewRuleProvider(() => { //not yet working in OH3
    rules.JSRule({
        name: "tasmota backup",
        description: "tasmota - backup config on status5 message",
        triggers: [
            triggers.ChannelEventTrigger('mqtt:topic:mosquitto:tasmota:status5', '')
        ],
        execute: function (triggerData) {
            var msg = JSON.parse(triggerData.payload.event);
            var ipAddress = msg.StatusNET.IPAddress;
            var hostname = msg.StatusNET.Hostname;

            log.debug("Backing up tasmota device: " + hostname + " (" + ipAddress + ")");

            http.download(`http://${ipAddress}/dl`, `${backupDir}/${hostname}`);
        }
    });

    rules.JSRule({
        name: "tasmota discover",
        description: "tasmota - request network details for all tasmota devices",
        triggers: [
            triggers.GenericCronTrigger("0 0 3 * * *") //3am
        ],
        execute: function () {
            actions.get("mqtt", "mqtt:broker:mosquitto").publishMQTT("cmnd/tasmotas/status", "5");
        }
    })
// });