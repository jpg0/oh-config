module.exports = {
    all: [
        ...require('./tasmota'),
        ...require('./zigbee'),
        ...require('./roller'),
        ...require('./433.js'),
        ...require('./xiaomi.js'),
    ]
}