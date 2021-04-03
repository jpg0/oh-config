const {     
    SitemapProvider,
    Sitemap,
    Text,
    Switch,
    Frame,
    Selection,
    Webview,
    Setpoint,
    Default,
    Group,
    Slider,
    registerSingleton } = require('sitemap');

const log = require('ohj').log('020_sitemaps');

const { items, osgi, utils } = require('ohj');
const alerteditems = require('alerteditems');

//const humanizeDuration = require('humanize-duration');

function registerSitemap() {
    let itemsNeedingAttention = alerteditems.getAlertedItems();

    let alerted = (itemsNeedingAttention == null || itemsNeedingAttention.length == 0) ?
        [] :
        [Text({label:`Needs Attention [${itemsNeedingAttention.length}]`, labelColor:["red"]}, 
            itemsNeedingAttention.map(
                i => Default({item: i.name})
            )
        )];

    registerSingleton(SitemapProvider([Sitemap({name:"default", label:"Home"}, [
            Frame({label:"Main"}, [ 
                ...alerted,
                Switch({item:'gLivingRoomLights', icon:"light"}),
                Switch({item:'gGamesRoomLights', icon:"light"}),

                Switch({item:'GarageSideDoor_Switch', label:"Garage Side Door", icon:"frontdoor", mappings:{ON:"Unlock"}, valueColor:["GarageSideDoor_Switch==ON=red","GarageSideDoor_Switch==OFF=green"]}),           
                Switch({label:"Rollers", item:'vRollersScene', mappings:{UP:"Up", DOWN:"Down", SHADE:"Shade", MORNING:"Morning"}}),
                Text({label:"A/C [%s]", item:"HVAC_House", icon:"climate"}, [ 
                    Switch({item:"HVAC_House", icon:"climate"}),
                    Switch({item:"HVAC_Mode", mappings:{cool:"Cool", heat:"Heat", auto:"Auto", fan:"Fan", dry:"Dry"}, icon:'flow'}),
                    Switch({item:"HVAC_FanSpeed", label:"Fan Speed [%s]", mappings:{1:"Low",2:"Med",3:"High"}}),
                    Setpoint({item:"HVAC_LowTemp", label:"Heat from.. [%.1f °C]", step:1, minValue:16, maxValue:30, visibility:['HVAC_Mode==heat','HVAC_Mode==auto']}),
                    Setpoint({item:"HVAC_HighTemp", label:"Cool to.. [%.1f °C]", step:1, minValue:16, maxValue:30, visibility:['HVAC_Mode==cool','HVAC_Mode==auto']}),
                    Text({item:"HVAC_AmbientTemp", label:"Ambient Temperature [%.1f °C]", icon:"temperature"}),
                    Switch({item:"KitchenDuct_Switch"}),
                    Switch({item:"GamesDuct_Switch"}),
                    Switch({item:"UpstairsDuct_Switch"}),
                    Switch({item:"KidsRoomsDuct_Switch"}),
                    Text({label:"Granny Flat"}, [ 
                        Switch({item:"HVAC2_House", icon:"climate"}),
                        Switch({item:"HVAC2_Mode", mappings:{cool:"Cool", heat:"Heat", auto:"Auto", fan:"Fan", dry:"Dry"}, icon:'flow'}),
                        Switch({item:"HVAC2_FanSpeed", label:"Fan Speed [%s]", mappings:{1:"Low",2:"Med",3:"High"}}),
                        Setpoint({item:"HVAC2_SetTemp", label:"Target Temp [%.1f °C]", step:1, minValue:16, maxValue:30}),
                        Text({item:"HVAC2_AmbientTemp", label:"Ambient Temperature [%.1f °C]", icon:"temperature"}),
                        //same as below
                        // [["GrannyFlat", require('acsystem').gf.Zone]].map(([zoneName, zoneConfig]) => Text({item: zoneConfig.temperatureItemName, label:`${zoneName}[%.1f °C]`, icon:"group", labelColor:[`vOverrideMinsRemaining${zoneName}>0=red`]}, [
                        //     Setpoint({item:`vMaxTemp${zoneName}`, label:`${zoneName} Max [%.1f °C]`, icon:"temperature_hot", step:1, minValue:16, maxValue:30}),
                        //     Setpoint({item:`vMinTemp${zoneName}`, label:`${zoneName} Min [%.1f °C]`, icon:"temperature_cold", step:1, minValue:16, maxValue:30}),
                        //     Text({item: zoneConfig.temperatureItemName, label:`${zoneName} Current [%.1f °C]`, icon:"temperature"}),
                        //     Setpoint({item:`vOverrideMinsRemaining${zoneName}`, label:`${zoneName} Override Remaining [%d Mins]`, icon:"time", step:15, minValue:0, maxValue:3600}),
                        //     Text({item:`vOverrideEnd${zoneName}`, label:`${zoneName} Override End [%1$tI:%1$tM %1$Tp]`, icon:'time'}),
                        //     //need is active item: Text({})   
                        //     Default({item: zoneConfig.openingsItemName}),
                        // ])),
                    ]),
                    Text({label:'Temperature Control', icon:"heating"}, Object.entries(require('acsystem').house.Zones).map(([zoneName, zoneConfig]) => 
                        Text({item: zoneConfig.temperatureItemName, label:`${zoneName} [%.1f °C]`, icon:"group", labelColor:[`vOverrideMinsRemaining${zoneName}>0=red`]}, [
                            Setpoint({item:`vMaxTemp${zoneName}`, label:`${zoneName} Max [%.1f °C]`, icon:"temperature_hot", step:1, minValue:16, maxValue:30}),
                            Setpoint({item:`vMinTemp${zoneName}`, label:`${zoneName} Min [%.1f °C]`, icon:"temperature_cold", step:1, minValue:16, maxValue:30}),
                            Text({item: zoneConfig.temperatureItemName, label:`${zoneName} Current [%.1f °C]`, icon:"temperature"}),
                            Setpoint({item:`vOverrideMinsRemaining${zoneName}`, label:`${zoneName} Override Remaining [%d Mins]`, icon:"time", step:15, minValue:0, maxValue:3600}),
                            Text({item:`vOverrideEnd${zoneName}`, label:`${zoneName} Override End [%1$tI:%1$tM %1$Tp]`, icon:'time'}),
                            //need is active item: Text({})   
                            Default({item: zoneConfig.openingsItemName}),
                        ])
                    ))


                ])
            ]), 
            Frame({label:"Living Room"}, [
                Default({item:"TVLight_Light", label:"TV Light", icon:"light"}),
                Default({item:"FloorLamp_Light", label:"Floor Lamp", icon:"light"}),
                Default({item:"LivingRoom_Corner_Light", label:"Corner Light", icon:"light"}),
                Default({item:"Hallway_Light", label:"Hallway Lamp"}),
                Default({item:"HallwayLights_Switch", label:"Hallway Lights"}),
                Default({item:"gLivingRoomLights", icon:"light"}),
                Default({item:"zgKitchenLeds_Light", label:"Kitchen LEDs", icon:"light"}),
                Default({item:"Flamingo_Switch", label:"Flamingo", icon:"flamingo"}),
                Text({label:"Individual Kitchen LEDs", icon:"light"}, [
                    Default({item:"KitchenLEDs_1_1_Light", label:"KitchenLEDs 1.1", icon:"light"}),
                    Default({item:"KitchenLEDs_1_2_Light", label:"KitchenLEDs 1.2", icon:"light"}),
                    Default({item:"KitchenLEDs_2_1_Light", label:"KitchenLEDs 2.1", icon:"light"}),
                    Default({item:"KitchenLEDs_2_2_Light", label:"KitchenLEDs 2.2", icon:"light"})
                ]),
                Text({label:"Doors [%s]", item:"gKitchenDoors"}, [
                    Default({item:'gKitchenDoors'})
                ])  
            ]),
            Frame({label:"Upstairs"}, [
                Text({item:'gUpstairsBedroomTemperature', icon:"temperature", label:"Bedroom [%.1f °C]"}),
                Default({item:'Bedside_1_Light'}),
                Default({item:'Bedside_2_Light'}),
                Default({item:'Upstairs_Toilet_Light'}),

                Default({item:'BedPump_Switch'}),

                Text({label:"Roller Blinds / Screens", icon:"rollershutter"},
                    items.getItem('gRoller').members.flatMap(i => [
                        Text({item:i.name}),
                        Switch({item:i.name, label:"[%s]", mappings:{UP:"Up", DOWN:"Down", FAV:"Fav", STOP:"Stop"}})
                    ])
                ),
                    
                Default({item:'Upstairs_Closet_Light'}),
                Switch({item:'UpstairsLouvresSmall_Click', label:"Small Louvres [CLOSED]",  mappings:{open:"Open",close:"Close"}, visibility:['UpstairsLouvresSmall_Contact==CLOSED']}),
                Switch({item:'UpstairsLouvresSmall_Click', label:"Small Louvres [OPEN]",  mappings:{open:"Open",close:"Close"}, visibility:['UpstairsLouvresSmall_Contact==OPEN']}),
                Switch({item:'UpstairsLouvresSmall_Click', label:"Small Louvres [UNKNOWN]", mappings:{open:"Open",close:"Close"}, visibility:['UpstairsLouvresSmall_Contact==NULL']}),
                Switch({item:'UpstairsLouvresSmall_Click', label:"Small Louvres [UNKNOWN]", mappings:{open:"Open",close:"Close"}, visibility:['UpstairsLouvresSmall_Contact==UNDEF']}),
        
                Switch({item:'UpstairsLouvresLarge_Click', label:"Large Louvres [CLOSED]",  mappings:{open:"Open",close:"Close"}, visibility:['UpstairsLouvresLarge_Contact==CLOSED']}),
                Switch({item:'UpstairsLouvresLarge_Click', label:"Large Louvres [OPEN]",  mappings:{open:"Open",close:"Close"}, visibility:['UpstairsLouvresLarge_Contact==OPEN']}),
                Switch({item:'UpstairsLouvresLarge_Click', label:"Large Louvres [UNKNOWN]", mappings:{open:"Open",close:"Close"}, visibility:['UpstairsLouvresLarge_Contact==NULL']}),
                Switch({item:'UpstairsLouvresLarge_Click', label:"Large Louvres [UNKNOWN]", mappings:{open:"Open",close:"Close"}, visibility:['UpstairsLouvresLarge_Contact==UNDEF']}),
        
                Switch({item:'UpstairsDoorLatch_Switch'}),
                Switch({item:'Upstairs_Toilet_Switch_Switch'}),
                // Switch({item:'Ooler_Switch'}),
        
                Switch({label:"Rollers", item:'vRollersScene', mappings:{UP:"Up", DOWN:"Down", SHADE:"Shade", MORNING:"Morning"}}),
                Text({label:"Windows & Doors [%s]", item:'gUpstairsOpenings'}, [
                    Default({item:'gUpstairsWindows'}),
                    Default({item:'gUpstairsDoors'})
                ])
            ]),
            Frame({label:"External"}, [
                Switch({item:'PoolPump_Switch', label:"Pool Pump", icon:"flow"}),
                Switch({item:'OutdoorLights_Switch', label:"Outdoor Lights", icon:"light"}),
                Switch({item:'GarageSideDoor_Switch', label:"Garage Side Door", icon:"frontdoor"}),
                Switch({item:'GarageLights_Switch', label:"Garage Lights", icon:"light"}),
                Default({item:'Garage_Side_Door_Occupancy', label:"Garage Occupied"}),
                
                Switch({item:'GarageCarDoor_Switch', label:"Garage Car Door [CLOSED]", mappings:{ON:"Open"}, icon:"garage", visibility:['Garage_Car_Door_Contact_Contact==CLOSED'], valueColor:["green"]}),
                Switch({item:'GarageCarDoor_Switch', label:"Garage Car Door [OPEN]", mappings:{ON:"Close"}, icon:"garage", visibility:['Garage_Car_Door_Contact_Contact==OPEN'], valueColor:["red"]}),
                Switch({item:'GarageCarDoor_Switch', label:"Garage Car Door [UNKNOWN]", mappings:{ON:"Activate"}, icon:"garage", visibility:['Garage_Car_Door_Contact_Contact==NULL'], valueColor:["red"]}),
                Text({label:"Water"}, [
                    Switch({item:'FrontGardenIrrigation_Switch', label:"Front Garden Irrigation", icon:"lawnmower"}),
                    Switch({item:'Hose_Switch', label:"Back Garden Hose", icon:"faucet"}),
                    //Switch item:OutdoorWater_Switch_1 label:"Sprinkler" icon:"lawnmower"
                    Switch({item:'OutdoorWater_Switch_2', label:"Kids Kitchen Tap", icon:"faucet"}),
                    Switch({item:'OutdoorWater_Switch_3', label:"Back Garden Irrigation", icon:"lawnmower"}),
                    Switch({item:'OutdoorWater_Switch_4', label:"Veggie Irrigation", icon:"lawnmower"}),

                ]),
                Default({item:'gWeather'}),
                Text({label:"Solar", icon:"sun_clouds"}, [
                    Default({item:"AC_Power"}),
                    Default({item:"Day_Energy"}),
                    Default({item:"Total_Energy"}),
                    Default({item:"Year_Energy"}),
                    Default({item:"FAC"}),
                    Default({item:"IAC"}),
                    Default({item:"IDC"}),
                    Default({item:"UAC"}),
                    Default({item:"UDC"}),
                    Default({item:"Grid_Power"}),
                    Default({item:"Load_Power"}),
                    Default({item:"Battery_Power"}),
                ]),
            ]), 
            Frame({label:"Other"}, [
                Switch({item:'GamesRoomRoller_Dimmer', label:"Games Room Roller [CLOSED]",  mappings:{1:"Open",100:"Close"}, visibility:['GamesRoomRoller_Dimmer==100']}),
                Switch({item:'GamesRoomRoller_Dimmer', label:"Games Room Roller [OPEN]",    mappings:{1:"Open",100:"Close"}, visibility:['GamesRoomRoller_Dimmer<100']}),
                Switch({item:'GamesRoomRoller_Dimmer', label:"Games Room Roller [UNKNOWN]", mappings:{1:"Open",100:"Close"}, visibility:['GamesRoomRoller_Dimmer==NULL']}),
                Switch({item:'GamesRoomRoller_Dimmer', label:"Games Room Roller [UNKNOWN]", mappings:{1:"Open",100:"Close"}, visibility:['GamesRoomRoller_Dimmer==UNDEF']}),
        
                // Default({item:"GamesRoomRoller_Dimmer"}),

                
                Switch({item:'Red_Hand', label:"Red Hand", icon:"light"}),
                Switch({item:'3D_Printer_Switch_Switch'}),
                Default({item:'Indis_Closet_Light_Color', label:"Indi's Closet", icon:"light"}),
                Text({label:"Sony Bravia"}, [
                    Selection({item:'Bravia_IR', mappings:{"Channel-Up":"Channel Up","Channel-Down":"Channel Down",Left:"Left"}}),
                    Switch({item:'Bravia_Power'}),
                    Slider({item:'Bravia_Volume'}),
                    Switch({item:'Bravia_AudioMute'}),
                    Selection({item:'Bravia_Channel', mappings:{'4.1':"ABC(1)", '5.1':"NBC(1)", '5.2':"NBC(2)", '13':"CBS", '50.1':"WRAL(1)", '50.2':"WRAL(2)"}}),
                    Text({item:'Bravia_TripletChannel'}),
                    Selection({item:'Bravia_InputSource', mappings:{atsct:"ATSCT", dvbt:"DVBT", dvbc:"DVBC", dvbs:"DVBS", isdbt:"ISDBT", isdbbs:"ISDBBS", isdbcs:"ISDBCS", antenna:"Antenna", cable:"Cable", isdbgt:"ISDBGT"}}),
                    Selection({item:'Bravia_Input', mappings:{TV:"TV", HDMI1:"HDMI1", HDMI2:"HDMI2"}}),
                    Switch({item:'Bravia_PictureMute'}),
                    Switch({item:'Bravia_TogglePictureMute', mappings:{ON:"Toggle"}}),
                    Switch({item:'Bravia_Pip'}),
                    Switch({item:'Bravia_TogglePip', mappings:{ON:"Toggle"}}),
                    Switch({item:'Bravia_TogglePipPosition', mappings:{ON:"Toggle"}}),
                    Text({item:'Bravia_BroadcastAddress'}),
                    Text({item:'Bravia_MacAddress'}),
                ]),
                Group({item:'gTesla'}),
                Group({item:'gVacuum'}, [
                    Switch({item:'VacuumActionControl', mappings:{vacuum:"Vacuum", pause:"Pause",spot:"Spot", dock:"Dock"}}),
                    Switch({item:'VacuumActionFan', mappings:{38:"Silent", 60:"Normal", 77:"Power",90:"Full", '-1':"Custom"}}),
                    Default({item:'VacuumStatusBat'}),
                    Default({item:'VacuumStatusArea'}),
                    Default({item:'VacuumStatusTime'}),
                    Group({item:'gVacuumStat'}),
                    Group({item:'gVacuumConsumables'}),
                    Group({item:'gVacuumDND'}),
                    Group({item:'gVacuumHistory'}),
                    //Group  item=gVacuumNetwork
                ]),
                Group({item:'gOpenings'}),
            ]),
            Frame({label:"System"}, [
                Default({item:'Z2MPermitJoin', label:"Allow Joining Zigbee"}),
                Switch({item:'vCurrent_Light_Color', label:"Reset Light Colours", mappings:{"0,0,0":"Reset"}}),
                Group({item:'gRules'}),
            ]),
            Frame({label:"All"}, [
                Switch({item:'vTimeOfDay', label:"[]", mappings:{ MORNING:"Morning", DAY:"Day", SUNSET:"Sunset", EVENING:"Evening", NIGHT:"Night"} }),
                Text({label:"Temperatures", icon:"temperature"}, [
                    ...items.getItem('gTemperature').members.map( 
                        i => Default({item: i.name, valueColor: [`${i.name.slice(0, -12)}_LastUpdated<3600="green"`, `${i.name.slice(0, -12)}_LastUpdated<10800="orange"`, `${i.name.slice(0, -12)}_LastUpdated>10800="red"`]})
                    ),
                    Text({label:"History"}, [
                            Webview({height:20, url:"http://192.168.1.10:3000/d/vLhLKOjWz/default?orgId=1&panelId=2&fullscreen"})
                    ])
                ]),
                Group({item:'gBattery', label:"Battery Levels", icon:"battery"}),
                Group({item:'gHumidity', label:"Humidity", icon:"water"}),
                Group({item:'gPressure', label:"Pressure", icon:"pressure"}),
                Group({item:'gLastUpdated'})
            ]),

        ]
    )]));
};

//todo: prevent re-registration!
alerteditems.onChanged(() => {
    log.debug("Regenerating Sitemap");
    registerSitemap()
});
registerSitemap();
 