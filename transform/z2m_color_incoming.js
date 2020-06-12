(function(json_payload) {

	var cie_to_rgb = function(x, y, brightness)
	{
		//Set to maximum brightness if no custom value was given (Not the slick ECMAScript 6 way for compatibility reasons)
		if (brightness === undefined) {
			brightness = 254;
		}

		var z = 1.0 - x - y;
		var Y = (brightness / 254).toFixed(2);
		var X = (Y / y) * x;
		var Z = (Y / y) * z;

		//Convert to RGB using Wide RGB D65 conversion
		var red 	=  X * 1.656492 - Y * 0.354851 - Z * 0.255038;
		var green 	= -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
		var blue 	=  X * 0.051713 - Y * 0.121364 + Z * 1.011530;

		//If red, green or blue is larger than 1.0 set it back to the maximum of 1.0
		if (red > blue && red > green && red > 1.0) {

			green = green / red;
			blue = blue / red;
			red = 1.0;
		}
		else if (green > blue && green > red && green > 1.0) {

			red = red / green;
			blue = blue / green;
			green = 1.0;
		}
		else if (blue > red && blue > green && blue > 1.0) {

			red = red / blue;
			green = green / blue;
			blue = 1.0;
		}

		//Reverse gamma correction
		red 	= red <= 0.0031308 ? 12.92 * red : (1.0 + 0.055) * Math.pow(red, (1.0 / 2.4)) - 0.055;
		green 	= green <= 0.0031308 ? 12.92 * green : (1.0 + 0.055) * Math.pow(green, (1.0 / 2.4)) - 0.055;
		blue 	= blue <= 0.0031308 ? 12.92 * blue : (1.0 + 0.055) * Math.pow(blue, (1.0 / 2.4)) - 0.055;


		//Convert normalized decimal to decimal
		red 	= Math.round(red * 255);
		green 	= Math.round(green * 255);
		blue 	= Math.round(blue * 255);

		if (isNaN(red))
			red = 0;

		if (isNaN(green))
			green = 0;

		if (isNaN(blue))
			blue = 0;


		return [red, green, blue];
	}

	var rgbToHsv = function(r, g, b) {
		r /= 255, g /= 255, b /= 255;
	
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, v = max;
	
		var d = max - min;
		s = max == 0 ? 0 : d / max;
	
		if (max == min) {
		h = 0; // achromatic
		} else {
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
	
		h /= 6;
		}
	
		return [ h, s, v ];
	}
  
    var json = JSON.parse(json_payload);

    var rgb = cie_to_rgb(json.color.x, json.color.y, json.brightness)

    var hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);

    return parseInt(hsv[0] * 360) + "," + parseInt(hsv[1] * 100) + "," + parseInt(hsv[2] * 100)

})(input)
