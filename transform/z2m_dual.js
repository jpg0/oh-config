(function(hsb_string) { //278,70,100

	var hsb = hsb_string.split(",");

	var rv = {};

	var ww_h = 45;
	var ww_s = 70;
	var WW_ROUNDING_HUE = 3;
	var WW_ROUNDING_SAT = 2;

	if (hsb.length == 1) { //dimmer only
		if (!isNaN(hsb_string)) { //dimmer
			rv.brightness = Math.round(hsb_string / 100 * 254);
		} else {
			rv.state = hsb_string;
		}
	} else if(hsb.length == 3) {
		rv.brightness = Math.round(hsb[2] / 100 * 254);

		if(rv.brightness > 1) { // only add color if we are actually ON
			var hue = Number(hsb[0]);
			var sat = Number(hsb[1]);

			var isWarmWhite = Math.abs(hue - ww_h) < WW_ROUNDING_HUE && Math.abs(sat - ww_s) < WW_ROUNDING_SAT;

			if(isWarmWhite) { // use warm white
				rv.color_temp = 2200;
			} else { // use rgb strip (via hsb)
				rv.color = {
					hue: hue,
					saturation: sat
				}
			};	
		}
	}

	return JSON.stringify(rv);
})(input)
