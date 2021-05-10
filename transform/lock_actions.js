(function(i) {

	var msg = JSON.parse(i);

	// if('action' in msg) {
    //     var action = msg.action;

    //     if(action == 'manual_lock') {
    //         return "ON"
    //     } else if (action == 'manual_unlock') {
    //         return "OFF";
    //     }

    if('state' in msg) {
        var state = msg.state;

        if(state == 'LOCK') {
            return "ON"
        } else if (state == 'UNLOCK') {
            return "OFF";
        }

	} else {
		return null;
	}
})(input)