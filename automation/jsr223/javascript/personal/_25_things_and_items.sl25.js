const { addToSystem } = require('thingandlink');
const logger = require('ohj').log("things_and_items")

require('mythings').all()
    .then(tais => {
        addToSystem(tais);
        logger.debug("Added all tais");
    })
    .catch(e => {
        logger.error("Failed to create all tai's " + e);
        logger.error(e.stack);
    })
    