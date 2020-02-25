let at = function(starthour, endhour, optionalInterval = 5){
    return new Monitor(`*/${optionalInterval} ${starthour}-${endhour} * * *`);
}

class Monitor {
    constructor(cronExpression) {
        this.cronExpression = cronExpression;
    }

    if(callbackConf) {
        this.callbackConf = callbackConf;
    }

    then(operationConf) {
        this.operationConf = operationConf;
        this._activate();
    }

    _activate() {
        when
    }
}

module.exports = {
    at
}