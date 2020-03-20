'use strict';

const log = require('ohj').log("rollers");
const { rules, triggers, items } = require('ohj');
const rollerssystem = require('rollerssystem');

const rollersToControl = items.getItem('gRoller').members;

const sceneMapping = {
    "UP": rollersToControl.map(i => ({name: i.name, op:"up"})),
    "DOWN": rollersToControl.map(i => {
        return {name: i.name, op:(!i.name.endsWith("Screen_Roller")) ? "down" : "up"};
    }),
    "SHADE": rollersToControl.map(i => {
        return {name: i.name, op:(i.name.endsWith("Screen_Roller")) ? "down" : "up"}
    }),
    "MORNING": rollersToControl.map(i => {
        return {name: i.name, op:["Door_Right_Blind_Roller"].includes(i.name) ? "fav" : "up"}
    })
};

//create a rule to handle scenes
rules.JSRule({
    name: "Roller Scenes",
    description: "Applies selected scenes to Rollers",
    triggers: [
        triggers.ItemStateChangeTrigger('vRollersScene')
    ],
    execute: function () {
        let scene = items.getItem('vRollersScene').state;

        if (scene != "UNDEF") {
            log.info("Setting scene for rollers: {}", scene);

            let desiredState = sceneMapping[scene];
            rollerssystem.setState(desiredState);
        }
    }
});
 