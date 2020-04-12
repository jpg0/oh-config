const { items, rules, triggers } = require('ohj');
const alerteditems = require('alerteditems');
const lastupdated = require('lastupdated');
const JSJoda = require('js-joda');
const log = require('ohj').log('lost_contact');

const DATETIMETYPE_MIN = '2000-01-01T00:00:00.000+0000';
const DURATION_TOO_OLD = JSJoda.Duration.ofDays(1);
const ISO8601Formatter = JSJoda.DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSS[xxxx][xxxxx]");


rules.JSRule({
    name: "Check we have recent contact with registered zigbee devices",
    description: "Check we have recent contact with registered zigbee devices",
    triggers: [triggers.GenericCronTrigger("0 0 * * * ? *"),], //every hour
    execute: () => {
        let now = JSJoda.LocalDateTime.now();

        lastupdated.allItems().forEach( i => {
            let lastUpdated = JSJoda.LocalDateTime.parse(lastupdated.lastUpdatedItemForItem(i).state || DATETIMETYPE_MIN, ISO8601Formatter);
            alerteditems.setAlerted(i, lastUpdated.plus(DURATION_TOO_OLD).isBefore(now))
        });
    }
});