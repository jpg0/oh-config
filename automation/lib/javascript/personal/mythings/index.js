module.exports = {
    all: () => Promise.all([
            ...require('./tasmota'),
            ...require('./zigbee'),
            ...require('./roller'),
            ...require('./433'),
            ...require('./xiaomi'),
            ...require('./dahua'),
        ].map(x => x.create()))
}