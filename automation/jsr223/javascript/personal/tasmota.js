'use strict';

var log = require('ohj').log("tasmota");
var { rules, triggers, actions } = require('ohj');
var http = require('http');

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

        http.download("http://" + ipAddress + "/dl", "/var/backups/tasmota/" + hostname);
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