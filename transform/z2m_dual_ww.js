(function(onoff_or_percent_string) { //state or brightness

	if (!isNaN(onoff_or_percent_string)) { //dimmer
		return JSON.stringify({
       	                "brightness": Math.round(onoff_or_percent_string / 100 * 255),
			"color_temp": 2200
		});
	} else { //on or off
		return JSON.stringify({
			"state": onoff_or_percent_string
		});
	}

})(input)
