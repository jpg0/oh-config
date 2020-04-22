const { HVACZone, UpstairsHVACZone, SLEEP_TIME_END, SLEEP_TIME_START } = require('./hvaczone');
const { ZoneTemperatureBounds } = require('./zonetemperature');

module.exports = {
    SLEEP_TIME_END,
    SLEEP_TIME_START,
    Zones: {
        "Living": new HVACZone(
            "Living Room",
            "gLivingRoomTemperature",
            "KitchenDuct_Switch",
            "gKitchenOpenings",
            new ZoneTemperatureBounds("Living", [
                ["06:30", "21:00", 19, 30]
            ])
        ),
        "Kids": new HVACZone(
            "Kids Rooms",
            "gKidsRoomsTemperature",
            "KidsRoomsDuct_Switch",
            "gKidsRoomsOpenings",
            new ZoneTemperatureBounds("Kids", [ //heatup rate of 0.2C/min
                ["06:15", "07:15", 20, 30],
                ["18:15", "19:45", 20, 23],
                ["19:45", "06:15", 15, 23]
            ])
        ),
        "Games": new HVACZone(
            "Games Room",
            "gGamesRoomTemperature",
            "GamesDuct_Switch",
            "gGamesRoomOpenings",
            new ZoneTemperatureBounds("Games", [
                ["18:30", "21:30", 20, 27]
            ])
        ),
        "Upstairs": new UpstairsHVACZone(
            "Upstairs",
            "gUpstairsBedroomTemperature",
            "UpstairsDuct_Switch",
            "gUpstairsOpenings",
            new ZoneTemperatureBounds("Upstairs", [
                ["06:15", "07:45", 18, 24],
                ["20:00", "21:30", 15, 20],
                ["21:30", "06:15", 15, 20, true] //true -> ventilate if possible
            ],
            [
                ["08:15", "20:00", 18, 35] //passive HVAC desires
            ])
        )
    }
};


