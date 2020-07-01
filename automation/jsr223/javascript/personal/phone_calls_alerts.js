const { fluent, items } = require('ohj');
const http = require('jhttp');
const log = require('ohj').log("phone-call-alerts");

let placeCall = (toNumber, messageToSend) => () => {
    log.info("Calling {} to say {}", toNumber, messageToSend);
    let url = `http://api.callmebot.com/start.php?source=openHAB&user=${toNumber}&text=${encodeURIComponent(messageToSend)}&lang=en-GB-Standard-B`;
    log.debug("Hitting URL {}", url);
    return http.get2(url);
}

try {     
    with(fluent.withToggle) {
        //Close the upstairs!
        when(cron("0 15 20 * * ? *"))
            .if(() => items.getItem('gUpstairsOpenings').state === "OPEN")
            .then(placeCall(require('secret').phoneNumbers.cierra, "Please close the upstairs door and window"), inGroup("Calls"));
    }
} catch(e) {
    log.error("Registering call rule failed", e);
}