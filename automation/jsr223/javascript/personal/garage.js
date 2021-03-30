const { fluent, items } = require('ohj');
const { epl } = require('epllib');

with(fluent.withToggle) {

    //close garage door at night if left open
    when(timeOfDay('NIGHT')).if(stateOfItem('Garage_Car_Door_Contact_Contact').is('OPEN')).
        then(sendOn().toItem('GarageCarDoor_Switch'), inGroup('Garage'))
 
    //turn on lights when motion detected or door opened, at night    
    when(item('Garage_Car_Door_Contact_Contact').changed().from('CLOSED').to('OPEN')).
        or(item('Garage_Side_Door_Motion_Occupancy').changed().from('CLOSED').to('OPEN')).
        if(stateOfItem('vTimeOfDay').in('NIGHT', 'SUNSET')). //todo: fluent statement
        then(sendOn().toItem('GarageLights_Switch'));

    //turn off lights when no motion detected for 10 mins
    when(epl("select * from pattern [every ItemStateEvent(itemName='Garage_Side_Door_Motion_Occupancy', itemState.toFullString()='CLOSED') ->\
    (timer:interval(10 min) and not ItemStateEvent(itemName='Garage_Side_Door_Motion_Occupancy', itemState.toFullString()='OPEN'))\
    ]")).then(sendOff().toItem('GarageLights_Switch'));
}
