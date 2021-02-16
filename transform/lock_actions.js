(function(i) {

	var msg = JSON.parse(i);

	if('action' in msg) {
        var action = msg.action;

        if(action == 'manual_lock') {
            return "ON"
        } else if (action == 'manual_unlock') {
            return "OFF";
        }

	} else {
		return null;
	}
})(input)
