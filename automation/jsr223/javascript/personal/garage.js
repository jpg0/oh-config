const { fluent, items } = require('ohj');

with(fluent.withToggle) {
    when(item('Garage_Side_Door_Motion_Occupancy').changed().from('CLOSED').to('OPEN')).
        then(sendOn().toItem('GarageSideDoor_Switch'), inGroup('Garage'));

    when(timeOfDay('NIGHT')).if(stateOfItem('Garage_Car_Door_Contact_Contact').is('OPEN')).
        then(sendOn().toItem('GarageCarDoor_Switch'), inGroup('Garage'))
 
    when(item('Garage_Car_Door_Contact_Contact').changed().from('OPEN').to('CLOSED')).
        or(item('Garage_Side_Door_Occupancy').changed().to('CLOSED')).
        then(sendOff().toItem('GarageLights_Switch'));

    when(item('Garage_Car_Door_Contact_Contact').changed().from('CLOSED').to('OPEN')).
        or(item('Garage_Side_Door_Motion_Occupancy').changed().from('CLOSED').to('OPEN')).
        if(stateOfItem('vTimeOfDay').in('NIGHT', 'SUNSET')). //todo: fluent statement
        then(sendOn().toItem('GarageLights_Switch'));
}