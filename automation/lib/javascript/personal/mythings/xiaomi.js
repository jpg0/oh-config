const { AqaraButtonTAI, AqaraMotionTAI, AqaraContactTAI, AqaraSwitchTAI, MijiaTemperatureTAI, AqaraTemperatureTAI } = require('thingandlink').device;

module.exports = [
    new AqaraButtonTAI({ name: "Kitchen 1", zigbeeId: "0x00158d00027b8569" }),
    // new AqaraButtonTAI({ name: "Bedside X", zigbeeId: "0x00158d0002c6123c" }),
    new AqaraButtonTAI({ name: "Front Door", zigbeeId: "0x00158d000215a93e" }),
    // new AqaraButtonTAI({ name: "Bedside 2", zigbeeId: "0x00158d0001eb6262" }),
    new AqaraButtonTAI({ name: "Indis Closet", zigbeeId: "0x00158d0002c6123c" }),

    new AqaraMotionTAI({ name: "Garage Side Door", zigbeeId: "0x00158d00023d91ed" }),
    new AqaraMotionTAI({ name: "Living Room Entrance", zigbeeId: "0x00158d0002e94666", groups: ['gLivingRoom'] }),
    new AqaraMotionTAI({ name: "Living Room Rear", zigbeeId: "0x00158d0003f438c5", groups: ['gLivingRoom'] }),
    new AqaraMotionTAI({ name: "Indis Room", zigbeeId: "0x00158d0003f4262b", groups: ['gIndisRoom'] }),
    new AqaraMotionTAI({ name: "Lyras Room", zigbeeId: "0x00158d00040ffb08", groups: ['gLyrasRoom'] }),
    new AqaraMotionTAI({ name: "Felixs Room", zigbeeId: "0x00158d0003f43422", groups: ['gFelixsRoom'] }),

    new AqaraContactTAI({name: "Garage Car Door", zigbeeId: "0x00158d00041486f0"}), 
    new AqaraContactTAI({name: "Kitchen Sliding Door 1", zigbeeId: "0x00158d0003e78935", groups: ["gKitchenDoors"]}),
    new AqaraContactTAI({name: "Kitchen Sliding Door 2", zigbeeId: "0x00158d0002e24d43", groups: ["gKitchenDoors"]}),
    new AqaraContactTAI({name: "Kitchen Bifold Door", zigbeeId: "0x00158d0003f862a1", groups: ["gKitchenDoors"]}), 
    new AqaraContactTAI({name: "Kitchen Window", zigbeeId: "0x00158d00044b3b1f", groups: ["gKitchenWindows"]}), 
    new AqaraContactTAI({name: "Indi's Window", zigbeeId: "0x00158d00044b3aaa", groups: ["gKidsRoomsWindows"]}), 
    new AqaraContactTAI({name: "Indi's Window 2", zigbeeId: "0x00158d0003cd3f6f", groups: ["gKidsRoomsWindows"]}), 
    new AqaraContactTAI({name: "Lyra's Window", zigbeeId: "0x00158d0003cb3739", groups: ["gKidsRoomsWindows"]}), 
    new AqaraContactTAI({name: "Felix's Sliding Door", zigbeeId: "0x00158d00044b3aac", groups: ["gKidsRoomsDoors"]}), 
    new AqaraContactTAI({name: "Games Room Sliding Door", zigbeeId: "0x00158d0003e78950", groups: ["gGamesRoomDoors"]}), 
    new AqaraContactTAI({name: "Front Door", zigbeeId: "0x00158d000414881e", groups: ["gDoors"]}), 
    new AqaraContactTAI({name: "Granny Flat Office Door", zigbeeId: "0x00158d00044b3e4f", groups: ["gGrannyFlatDoors"]}), 
    new AqaraContactTAI({name: "Granny Flat Sliding Door", zigbeeId: "0x00158d00044b3a8b", groups: ["gGrannyFlatDoors"]}), 
    new AqaraContactTAI({name: "Upstairs Toilet Window", zigbeeId: "0x00158d0003cd5838", groups: ["gUpstairsWindows"]}), 
    new AqaraContactTAI({name: "Games Room Toilet Window", zigbeeId: "0x00158d0003cb5049", groups: ["gGamesRoomWindows"]}), 
    new AqaraContactTAI({name: "Games Room Right Window", zigbeeId: "0x00158d0003cd557c", groups: "gGamesRoomWindows"}), 
    new AqaraContactTAI({name: "Upstairs Sliding Door", zigbeeId: "0x00158d000413dce8", groups: "gUpstairsDoors"}),

    new AqaraSwitchTAI({name: "FrontGardenIrrigation", zigbeeId: "0x00158d0002482134", groups:["gOutdoor","gIrrigation"]}),
    new AqaraSwitchTAI({name: "Upstairs Toilet", zigbeeId: "0x00158d000358c895", groups:["gUpstairs"]}),
    new AqaraSwitchTAI({name: "3D Printer", zigbeeId: "0x00158d0001dad447"}),
    

    new MijiaTemperatureTAI({name: "Indi's Room", zigbeeId: "0x00158d00020ec983", groups: ["gKidsRoomsTemperature"]}),
    new AqaraTemperatureTAI({name: "Lyra's Room", zigbeeId: "0x00158d0002437c6e", groups: ["gKidsRoomsTemperature"]}),
    new AqaraTemperatureTAI({name: "Living Room 1", zigbeeId: "0x00158d0004445bd5", groups: ["gLivingRoomTemperature"]}),
    new AqaraTemperatureTAI({name: "Living Room 2", zigbeeId: "0x00158d00032142a1", groups: ["gLivingRoomTemperature"]}),
    new AqaraTemperatureTAI({name: "Upstairs Bedroom Bed", zigbeeId: "0x00158d00034d1d79", groups: ["gUpstairsBedroomTemperature"]}),
    new AqaraTemperatureTAI({name: "Office", zigbeeId: "0x00158d000245a8d7"}),
    new AqaraTemperatureTAI({name: "Outside", zigbeeId: "0x00158d00023f383f"}),
    new AqaraTemperatureTAI({name: "Outside Upstairs", zigbeeId: "0x00158d00036b66d0"}),
    new AqaraTemperatureTAI({name: "Games Room 1", zigbeeId: "0x00158d000247cb6c", groups: ["gGamesRoomTemperature"]}),
    new AqaraTemperatureTAI({name: "Games Room 2", zigbeeId: "0x00158d00022ccab7", groups: ["gGamesRoomTemperature"]}),

    new AqaraTemperatureTAI({name: "Felix's Room", zigbeeId: "0x00158d0002437c63", groups: ["gKidsRoomsTemperature"]}),
    new AqaraTemperatureTAI({name: "Granny Flat", zigbeeId: "0x00158d00023f5031"}),
    new AqaraTemperatureTAI({name: "Kid's Bathroom", zigbeeId: "0x00158d0002437c38"}),
    new AqaraTemperatureTAI({name: "Upstairs Closet", zigbeeId: "0x00158d00036bfe92"}),
    
]