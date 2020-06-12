const { NeoRollerTAI } = require('thingandlink').device;

class NeoRollerGroupTAI extends NeoRollerTAI {
    init(config){
        super.init({
            ...config,
            itemSuffix: config.itemSuffix || 'Roller_Group'
          });
    }
}

module.exports = [
    new NeoRollerGroupTAI({name: "Large Screens",   rfCode: "080.124-15", groups:["gUpstairsBlindGroups"]}),
    new NeoRollerGroupTAI({name: "Large Blinds",    rfCode: "061.061-15", groups:["gUpstairsBlindGroups"]}),
    new NeoRollerGroupTAI({name: "Small Blinds",    rfCode: "194.129-15", groups:["gUpstairsBlindGroups"]}),
    new NeoRollerGroupTAI({name: "Door Blinds",     rfCode: "083.130-15", groups:["gUpstairsBlindGroups"]}),
    new NeoRollerGroupTAI({name: "Door Screens",    rfCode: "113.210-15", groups:["gUpstairsBlindGroups"]}),
    
    new NeoRollerTAI({name: "Large Left Blind",   rfCode: "061.061-00", groups:["gUpstairsLargeBlinds"]}),
    new NeoRollerTAI({name: "Large Centre Blind", rfCode: "061.061-01", groups:["gUpstairsLargeBlinds"]}),
    new NeoRollerTAI({name: "Large Right Blind",  rfCode: "061.061-02", groups:["gUpstairsLargeBlinds"]}),
    
    new NeoRollerTAI({name: "Large Left Screen",   rfCode: "080.124-00", groups:["gUpstairsLargeScreens"]}),
    new NeoRollerTAI({name: "Large Centre Screen", rfCode: "080.124-01", groups:["gUpstairsLargeScreens"]}),
    new NeoRollerTAI({name: "Large Right Screen",  rfCode: "080.124-02", groups:["gUpstairsLargeScreens"]}),
    
    new NeoRollerTAI({name: "Small Left Blind",   rfCode: "194.129-00", groups:["gUpstairsSmallBlinds"]}),
    new NeoRollerTAI({name: "Small Centre Blind", rfCode: "194.129-01", groups:["gUpstairsSmallBlinds"]}),
    new NeoRollerTAI({name: "Small Right Blind",  rfCode: "194.129-02", groups:["gUpstairsSmallBlinds"]}),
    
    new NeoRollerTAI({name: "Door Left Blind",  rfCode: "083.130-00", groups:["gUpstairsDoorBlinds"]}),
    new NeoRollerTAI({name: "Door Right Blind", rfCode: "083.130-01", groups:["gUpstairsDoorBlinds"]}),

    new NeoRollerTAI({name: "Door Left Screen",  rfCode: "113.210-00", groups:["gUpstairsDoorScreens"]}),
    new NeoRollerTAI({name: "Door Right Screen", rfCode: "113.210-01", groups:["gUpstairsDoorScreens"]}),

    new NeoRollerTAI({name: "Toilet Blind", rfCode: "109.195-00", groups:["gUpstairsToiletBlinds"]}),
];