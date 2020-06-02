const { DahuaCamTAI } = require('thingandlink').device;

module.exports = [
    new DahuaCamTAI({name: "Garden", host: "192.168.101.200"}),
    new DahuaCamTAI({name: "Drive", host: "192.168.101.199"}),
    new DahuaCamTAI({name: "Front", host: "192.168.101.197"}),
    new DahuaCamTAI({name: "Side", host: "192.168.101.196"}),
]