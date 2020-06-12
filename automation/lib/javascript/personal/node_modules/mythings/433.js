const { Button433TAI } = require('thingandlink').device;


module.exports = [
    new Button433TAI({name: "Doorbell", rfCode: "F11042", groups: ['gNoRestore']}),
    new Button433TAI({name: "Red Hand", rfCode: "600601"}),
    //new Relay433TAI({name: "Red Hand", rfCode: "600601"}),
]