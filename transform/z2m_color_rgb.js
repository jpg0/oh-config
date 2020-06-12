function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

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

        var rgb = HSVtoRGB(Number(hsb[0]) / 360, Number(hsb[1]) / 100, 1);

		return JSON.stringify({
			"brightness": Math.round(hsb[2] / 100 * 254),
			"color": {
					r: rgb.r,
                    g: rgb.g,
                    b: rgb.b
			}
		});
	}
})(input)
