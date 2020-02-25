(function(percent) {
	if (percent == 0 || percent == "OFF") {
		return '{"state":"OFF"}';
	} else if (percent == "ON" ) {
		return '{"state":"ON"}';
	} else {
		var asByte = Math.round((percent * 255) / 100)
		return '{"state":"ON","brightness": ' + asByte + '}'
	}
})(input)
