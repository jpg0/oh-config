const { addToSystem } = require('thingandlink');
const logger = require('ohj').log("things_and_items")

require('mythings').all()
    .then(addToSystem)
    .catch(logger.error)