try {
    require('ohj').log("schedules").info("Inserting schedules");
     
    with(require('ohj').fluent.withToggle) {

        //Pool Pump
        when(cron("0 0 9 * * ?")) .then(sendOn(). toItem("PoolPump_Switch", inGroup("Pool Pump")));
        when(cron("0 0 11 * * ?")).then(sendOff().toItem("PoolPump_Switch", inGroup("Pool Pump")));
        when(cron("0 0 15 * * ?")) .then(sendOn(). toItem("PoolPump_Switch", inGroup("Pool Pump")));
        when(cron("0 0 17 * * ?")).then(sendOff().toItem("PoolPump_Switch", inGroup("Pool Pump")));

        //Living Room Lights
        when(timeOfDay("PRESUNSET")).then(sendOn().toItem("gLivingRoom"), inGroup("LivingRoom Lights"));
        when(cron("0 20 21 * * ?")).then(sendOff().toItem("gLivingRoom"), inGroup("LivingRoom Lights"));

        //Bedside Lights
        when(timeOfDay("SUNSET")).then(sendOn().toItem("Bedside_1_Light"), inGroup("Bedside Lights"));
        when(cron("0 0 22 ? * * *")).then(sendOff().toItem("Bedside_1_Light"), inGroup("Bedside Lights"));

        //Hallway Lights
        when(timeOfDay("SUNSET")).then(sendOn().toItem("Hallway_Light"), inGroup("Hallway Lights"));
        when(timeOfDay("MORNING")).then(sendOff().toItem("Hallway_Light"), inGroup("Hallway Lights"));

        //Flamingo Light
        when(timeOfDay("SUNSET")).then(sendOn().toItem("Flamingo_Switch"), inGroup("Flamingo"));
        when(cron("0 0 22 ? * * *")).then(sendOff().toItem("Flamingo_Switch"), inGroup("Flamingo"));


        //Indi's Closet Light
        when(cron("0 30 16 * * ? *")).then(send("300,100,100").toItem("Indis_Closet_Light"), inGroup("Kids Rooms Lights"));
        when(cron("0 15 19 * * ? *")).then(send("300,100,25" ).toItem("Indis_Closet_Light"), inGroup("Kids Rooms Lights"));
        when(cron("0 00 07 * * ? *")).then(sendOff().          toItem("Indis_Closet_Light"), inGroup("Kids Rooms Lights"));

        //Upstairs Toilet
        when(cron("0 00 21 * * ? *")).then(sendOff().toItem("Upstairs_Toilet_Switch"), inGroup("Upstairs Toilet"));
        when(cron("0 00 8 * * ? *")).then(sendOn().toItem("Upstairs_Toilet_Switch"), inGroup("Upstairs Toilet"));
        when(item('UpstairsBathroomLight_Switch').changed())
            .if(() => new Date().getHours() == 7)
            .then(sendOn().toItem("Upstairs_Toilet_Switch"), inGroup("Upstairs Toilet"));

        //
        when(cron("0 30 20 * * ? *")).then(sendOff().toItem("gXmasLights"), inGroup("Xmas Lights"));
        when(cron("0 00 7 * * ? *")).then(sendOn().toItem("gXmasLights"), inGroup("Xmas Lights"));

        when(cron("0 00 20 * * ? *")).then(sendOn().toItem("Ooler_Switch"), inGroup("Ooler"));
        when(cron("0 00 4 * * ? *")).then(sendOff().toItem("Ooler_Switch"), inGroup("Ooler"));
        
    }
} catch(e) {
    require('ohj').log("schedules").error(""+e);
} 