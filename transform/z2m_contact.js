(function(msg) {
    var data = JSON.parse(msg)
	if (data == null || data.contact == null) {
		return null;
	} else if (data.contact) {
		return 'CLOSED';
	} else {
		return 'OPEN';
	}
})(input)