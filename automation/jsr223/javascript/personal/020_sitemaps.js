const {     
    CallbackSitemapProvider,
    Sitemap,
    Text,
    Switch,
    Frame,
    Selection,
    Webview,
    Setpoint,
    Default,
    Group,
    Slider } = require('sitemap');

const { items } = require('ohj');
 
new CallbackSitemapProvider(Sitemap({name:"default", label:"Home"}, [
        Frame({label:"Main"}, [ 
            Switch({item:'vTimeOfDay', label:"[]", mappings:{ MORNING:"Morning", DAY:"Day", SUNSET:"Sunset", EVENING:"Evening", NIGHT:"Night"} }),
            Switch({item:'gLivingRoom', icon:"light"}),
            Text({label:"A/C [%s]", item:"HVAC_House", icon:"climate"}, [ 
                Switch({item:"HVAC_House", icon:"climate"}),
                Switch({item:"HVAC_Mode", mappings:{cool:"Cool", heat:"Heat", auto:"Auto", fan:"Fan", dry:"Dry"}, icon:'flow'}),
                Switch({item:"HVAC_FanSpeed", label:"Fan Speed [%s]", mappings:["Low","Med","High"]}),
                Setpoint({item:"HVAC_LowTemp", label:"Heat from.. [%.1f °C]", step:1, minValue:16, maxValue:30, visibility:['HVAC_Mode==heat','HVAC_Mode==auto']}),
                Setpoint({item:"HVAC_HighTemp", label:"Cool to.. [%.1f °C]", step:1, minValue:16, maxValue:30, visibility:['HVAC_Mode==cool','HVAC_Mode==auto']}),
                Text({item:"HVAC_AmbientTemp", label:"Ambient Temperature [%.1f °C]", icon:"temperature"}),
                Switch({item:"KitchenDuct_Switch"}),
                Switch({item:"GamesDuct_Switch"}),
                Switch({item:"UpstairsDuct_Switch"}),
                Switch({item:"KidsRoomsDuct_Switch"}),
            ])
        ]), 
        Frame({label:"Living Room"}, [
            Default({item:"TVLight_Light", label:"TV Light", icon:"light"}),
            Default({item:"FloorLamp_Light", label:"Floor Lamp", icon:"light"}),
            Default({item:"LivingRoom_Corner_Light", label:"Corner Light", icon:"light"}),
            Default({item:"Hallway_Light", label:"Hallway Lamp"}),
            Default({item:"HallwayLights_Switch", label:"Hallway Lights"}),
            Default({item:"gLivingRoom", icon:"light"}),
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
        Frame({label:"External"}, [
            Switch({item:'PoolPump_Switch', label:"Pool Pump", icon:"flow"}),
            Switch({item:'OutdoorLights_Switch', label:"Outdoor Lights", icon:"light"}),
            Switch({item:'GarageSideDoor_Switch', label:"Garage Side Door", icon:"frontdoor"}),
            Switch({item:'GarageLights_Switch', label:"Garage Lights", icon:"light"}),
            Default({item:'Garage_Side_Door_Occupancy', label:"Garage Occupied"}),
            
            Switch({item:'GarageCarDoor_Switch', label:"Garage Car Door [CLOSED]", mappings:{ON:"Open"}, icon:"garage", visibility:['Garage_Car_Door_Contact==CLOSED'], valueColor:["green"]}),
            Switch({item:'GarageCarDoor_Switch', label:"Garage Car Door [OPEN]", mappings:{ON:"Close"}, icon:"garage", visibility:['Garage_Car_Door_Contact==OPEN'], valueColor:["red"]}),
            Switch({item:'GarageCarDoor_Switch', label:"Garage Car Door [UNKNOWN]", mappings:{ON:"Activate"}, icon:"garage", visibility:['Garage_Car_Door_Contact==NULL'], valueColor:["red"]}),
            Text({label:"Water"}, [
                Switch({item:'FrontGardenIrrigation_Switch', label:"Front Garden Irrigation", icon:"lawnmower"}),
                Switch({item:'Hose_Switch', label:"Back Garden Hose", icon:"faucet"}),
                //Switch item:OutdoorWater_Switch_1 label:"Sprinkler" icon:"lawnmower"
                Switch({item:'OutdoorWater_Switch_2', label:"Kids Kitchen Tap", icon:"faucet"}),
                Switch({item:'OutdoorWater_Switch_3', label:"Back Garden Irrigation", icon:"lawnmower"}),
            ]),
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
        
        Frame({label:"Upstairs"}, [
            Text({item:'gUpstairsBedroomTemperature', icon:"temperature", label:"Bedroom [%.1f °C]"}),
            Default({item:'Bedside_1_Light'}),
            Default({item:'Bedside_2_Light'}),
            Default({item:'Upstairs_Toilet_Light'}),
            // {{!-- Text label="Roller Blinds / Screens" icon="rollershutter" {
            //     {{#each data.items}}
            //         {{#ifeq type "neo_roller"}}
            //             Text item={{safe ctx}}_Roller
            //             Switch item={{safe ctx}}_Roller label="[%s]" mappings=[UP="Up", DOWN="Down",FAV="Fav", STOP="Stop"]
            //         {{/ifeq}}
            //     {{/each}}
            // } --}}
    
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
            Switch({item:'Upstairs_Toilet_Switch'}),
            Switch({item:'Ooler_Switch'}),
    
            Switch({label:"Rollers", item:'vRollersScene', mappings:{UP:"Up", DOWN:"Down", SHADE:"Shade", MORNING:"Morning"}}),
            Text({label:"Windows & Doors [%s]", item:'gUpstairsOpenings'}, [
                Default({item:'gUpstairsWindows'}),
                Default({item:'gUpstairsDoors'})
            ])
        ]),
        Frame({label:"Other"}, [
            Default({item:'Indis_Closet_Light', label:"Indi's Closet", icon:"light"}),
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
        ]),
        Frame({label:"System"}, [
            Default({item:'Z2MPermitJoin', label:"Allow Joining Zigbee"}),
            Switch({item:'vCurrent_Light_Color', label:"Reset Light Colours", mappings:{"0,0,0":"Reset"}}),
            Group({item:'gRules'}),
        ]),
        Frame({label:"All"}, [
            Text({label:"Temperatures", icon:"temperature"}, [
                ...items.getItem('gTemperature').members.map( 
                    i => Default({item: i.name, valueColor: [`${i.name.slice(0, -12)}_LastUpdated<3600="green"`, `${i.name.slice(0, -12)}_LastUpdated<10800="orange"`, `${i.name.slice(0, -12)}_LastUpdated>10800="red"`]})
                    ),
                    // {{#each data.items}}
                    //     {{#ifeq type "xiaomi_zigbee_switch"}}
                    //         Default item={{safe ctx}}_Switch_Temperature
                    //     {{/ifeq}}
                    // {{/each}}
                
                Text({label:"History"}, [
                        Webview({height:20, url:"http://192.168.1.10:3000/d/D_K9e0RRk/default?orgId=1&panelId=2&fullscreen&kiosk"})
                ]),
                Group({item:'gLastUpdated'}),
            ]),
            Group({item:'gBattery', label:"Battery Levels", icon:"battery"}),
            Group({item:'gHumidity', label:"Humidity", icon:"water"}),
            Group({item:'gPressure', label:"Pressure", icon:"pressure"}),
        ]),
    ]
)).register(); 