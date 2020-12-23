try {
    with(require('ohj').fluent.withToggle) {

        //Irrigation schedule
        when(cron("0 0 4 ? * 1/7 *")) .then(sendOn(). toItem("OutdoorWater_Switch_3", inGroup("Irrigation")));
        when(cron("0 20 4 ? * 1/7 *")).then(sendOff().toItem("OutdoorWater_Switch_3", inGroup("Irrigation")));

        when(cron("0 20 4 ? * 1/7 *")) .then(sendOn(). toItem("OutdoorWater_Switch_4", inGroup("Irrigation")));
        when(cron("0 00 5 ? * 1/7 *")).then(sendOff().toItem("OutdoorWater_Switch_4", inGroup("Irrigation")));
        when(cron("0 20 20 ? * 1/7 *")) .then(sendOn(). toItem("OutdoorWater_Switch_4", inGroup("Irrigation")));
        when(cron("0 00 21 ? * 1/7 *")).then(sendOff().toItem("OutdoorWater_Switch_4", inGroup("Irrigation")));

        when(cron("0 0 05 ? * 1/2 *")) .then(sendOn(). toItem("FrontGardenIrrigation_Switch", inGroup("Irrigation")));
        when(cron("0 20 05 ? * 1/2 *")).then(sendOff().toItem("FrontGardenIrrigation_Switch", inGroup("Irrigation")));

        //garden hose logic
        when(item('Hose_Switch').changed().to('ON')).then(send('ON').toItem('Hose_Motor'));
        when(item('Hose_Contact').changed()).then(copyState().fromItem('Hose_Contact').toItem('Hose_Switch'));
    }

} catch(e) {
    require('ohj').log("water").error(""+e);
} 