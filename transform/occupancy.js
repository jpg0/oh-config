(function(msg) {
    var data = JSON.parse(msg)
	if (data == null || data.occupancy == null) {
		return null;
	} else if (data.occupancy) {
		return 'OPEN';
	} else {
		return 'CLOSED';
	}
})(input)