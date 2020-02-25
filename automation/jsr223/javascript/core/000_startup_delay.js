'use strict';

var Thread = Java.type("java.lang.Thread");
var log = Java.type("org.slf4j.LoggerFactory").getLogger("jsr223.javascript.core.startup_delay");

log.debug("Checking for initialized context");

while (true) {
    try {
        let rs = require('@runtime/RuleSupport');
        if (rs.automationManager != null) {
            break;
        }
    }
    catch(err) {
        log.info("Context not initialized yet... waiting 10s before checking again");
        Thread.sleep(10000);
    }
}

//log.info("Context initialized... waiting 30s before allowing scripts to load");
//Thread.sleep(30000);
//log.info("Complete");
