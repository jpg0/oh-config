const chroma = require('chroma-js');
const log = require('ohj').log('color');

module.exports = {
    transform(HSB, fn) { // let newColor = process(myColor, c => c.darken());
        return this.hsb(fn(this.create(HSB)))
    },
    create: function(HSB) {
        // log.debug("Creating new color from {} ({})", HSB, typeof HSB);
        let [ h, s, b ] = typeof HSB === 'number' ? [0,0,HSB] : HSB.split(',');
        return chroma.hsv(h, s / 100, b / 100);
    },
    hsb: function(chromaObject) {
        let  [ h, s, v ] = chromaObject.hsv();
        // log.debug(`Returning ${chromaObject} as [${h},${s},${v}] = ${h || 0},${Math.round(s*100)},${Math.round(v*100)}`);
        return `${h || 0},${Math.round(s*100)},${Math.round(v*100)}`;
    },

    //convenience transforms
    setBrightness: b => c => chroma.hsv(c.hsv()[0], c.hsv()[2], b),

}