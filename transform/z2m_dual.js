(function(hsb_string) { //278,70,100

	var hsb = hsb_string.split(",");

	var rv = {};

	if (hsb.length == 1) { //dimmer only
		if (!isNaN(hsb_string)) { //dimmer
			rv.brightness = Math.round(hsb_string / 100 * 254);
		} else {
			rv.state = hsb_string;
		}
	} else if(hsb.length == 3) {
		rv.brightness = Math.round(hsb[2] / 100 * 254);

		if(rv.brightness > 1) { // only add color if we are actually ON
			if(hsb[0] == "47" && hsb[1] == "72") { // use warm white
				rv.color_temp = 2200;
			} else { // use rgb strip (via hsb)
				rv.color = {
					hue: Number(hsb[0]),
					saturation: Number(hsb[1])
				}
			};	
		}
	}

	return JSON.stringify(rv);
})(input)
