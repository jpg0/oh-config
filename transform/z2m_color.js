(function(hsb_string) { //278,70,100
	var hsb = hsb_string.split(",");

	if (hsb.length == 1) { //dimmer only
		if (!isNaN(hsb_string)) { //dimmer
			return JSON.stringify({
        	                "brightness": Math.round(hsb_string / 100 * 255)
			});
		} else { 
			return JSON.stringify({
				"state": hsb_string
			});
		}
	} else if(hsb.length == 3) {

		return JSON.stringify({
			"brightness": Math.round(hsb[2] / 100 * 254),
			"color": {
					hue: Number(hsb[0]),
					saturation: Number(hsb[1])
			}
		});

		// return JSON.stringify({
		// 		"color": {
		// 			"hsb": hsb_string
		// 		}
		// 	});
	}
})(input)
