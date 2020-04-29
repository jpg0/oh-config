const { items, rules, triggers } = require('ohj');
const alerteditems = require('alerteditems');
const lastupdated = require('lastupdated');
const JSJoda = require('js-joda');
const log = require('ohj').log('lost_contact');

const DATETIMETYPE_MIN = '2000-01-01T00:00:00.000+0000';
const ISO8601Formatter = JSJoda.DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSS[xxxx][xxxxx]");


rules.JSRule({
    name: "Check we have recent contact with registered zigbee devices",
    description: "Check we have recent contact with registered zigbee devices",
    triggers: [triggers.GenericCronTrigger("0 0 * * * ? *"),], //every hour
    execute: () => {
        log.debug("Checking for any devices that we have lost contact with...");
        let now = JSJoda.LocalDateTime.now();

        lastupdated.allItems().forEach( i => {
            let lastUpdatedString = lastupdated.lastUpdatedItemForItem(i).state;
            if(!lastUpdatedString || lastUpdatedString == 'NULL') {
                lastUpdatedString = DATETIMETYPE_MIN;
            }
            let lastUpdatedDate = JSJoda.LocalDateTime.parse(lastUpdatedString, ISO8601Formatter);
            let maxDurationWithoutContact = lastupdated.maxDurationWithoutContact(i);
            alerteditems.setAlerted(i, lastUpdatedDate.plus(JSJoda.Duration.parse(maxDurationWithoutContact)).isBefore(now))
        });
    }
});