const { rules, triggers } = require('ohj');
const GFHVAC = require('acsystem').gf;

rules.SwitchableJSRule({
    name: "GF-AC-Manager",
    description: "Manages GF HVAC system",
    triggers: [
        triggers.GenericCronTrigger("0 */5 * * * *") //every 5 mins
        //TimerTrigger("0/15 * * * * ?") //every 15 secs
    ],
    execute: GFHVAC.processHvac
});