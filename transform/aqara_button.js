(function(i) {

	var msg = JSON.parse(i);

	if('action' in msg) {
		return msg.action;
	} else if ('click' in msg) {
		return msg.click;
	} else {
		return null;
	}
})(input)
