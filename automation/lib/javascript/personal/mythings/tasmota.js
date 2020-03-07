const { TasmotaTAI, FourChannelTasmotaTAI } = require('thingandlink').device;

class HallwayLightsTAI extends TasmotaTAI {
    constructor() {
        super({
            name: 'HallwayLights', 
            mqttId: 'sonoff-2DDA40'
        });
    }
    
    buildSwitchChannel() {
        return this.withNewMQTTChannel('POWER', 'Switch', 'switch', {
            stateTopic: `stat/${this.mqttId}/lights`, 
            commandTopic: `cmnd/${this.mqttId}/POWER1`,
            on:"TOGGLE",
            off:"TOGGLE",
            transformationPattern:"MAP:numberToOnOff.map"
        });
    }
}

module.exports = [
    new TasmotaTAI({name: 'Ooler', mqttId: 'sonoff-6E29EB', groups:['gUpstairs']}),
    new TasmotaTAI({name: 'GarageCarDoor', mqttId: 'sonoff-095C5F', groups:['gGarage']}),
    new TasmotaTAI({name: 'GarageLights', mqttId: 'sonoff-14FA0A', groups:['gGarage']}),
    new TasmotaTAI({name: 'OutdoorLights', mqttId: 'sonoff-66A06B'}),
    new TasmotaTAI({name: 'GarageSideDoor', mqttId: 'sonoff-14FA37'}),
    new TasmotaTAI({name: 'Flamingo', mqttId: 'sonoff-3B47B7'}),
    new TasmotaTAI({name: 'Unused', mqttId: 'sonoff-3B4A56'}),
    new TasmotaTAI({name: 'PoolPump', mqttId: 'sonoff-3ED374', groups:['gGarage']}),
    new TasmotaTAI({name: 'UpstairsDoorLatch', mqttId: 'sonoff-3B4127', groups:["gUpstairs"]}),
    new HallwayLightsTAI(),
    
    new FourChannelTasmotaTAI({name: "ACDucts", mqttId: "sonoff-CAA8AF"}),
    new FourChannelTasmotaTAI({name: "OutdoorWater", mqttId: "sonoff-DB52A6", groups:["gOutdoor"]}),
];