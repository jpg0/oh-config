let cachedComms = null;
let loadComms = function(){
    if(cachedComms === null) {
        cachedComms = require('comms');
    }

    return cachedComms;
}

module.exports = {
    forLevel: level => {
        let comms = loadComms();

        switch(level){
            case "error":
                return {
                    logAt: (level, msg) => comms.notify(`ERROR: ${msg}`, comms.SYSTEM)
                }
            default:
                return null;
        }
    }
};