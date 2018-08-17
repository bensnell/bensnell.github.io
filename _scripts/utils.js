// Utility functions

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function gaussianRandom(nVals) {

	var sum = 0;
	for (var i = 0; i < nVals; i++) {
		sum += Math.random();
	}
	return sum / nVals;
}

function clamp(val, min, max) {
	var mi = min;
	var ma = max;
	if (mi > ma) {
		var tmp = mi;
		mi = ma;
		ma = tmp;
	}
	return Math.max(Math.min(val, ma), mi);
}

function map(val, minIn, maxIn, minOut, maxOut, bClamp, power=1) {

	var tmp = (val-minIn)/(maxIn-minIn);
	tmp = Math.pow(tmp, power);
	tmp = tmp * (maxOut-minOut) + minOut;
	if (bClamp) {
		tmp = clamp(tmp, minOut, maxOut);
	}
	return tmp;
}

function gaussian(value, mean, stdev, bScaled) {
    
    var out = (1.0/(stdev*Math.sqrt(2.0*3.141592)))*Math.exp(-((value-mean)*(value-mean))/(2.0*stdev*stdev));
    if (bScaled) out /= gaussian(mean, mean, stdev, false);
    return out;
}

// 0 	-> 0
// 0.5 	-> 0.5
// 1 	-> 1

function logistic(value, center, intensity, scaleToRange) {
    
    center = clamp(center, 0, 1);
    var outValue = 1.0 / (1 + Math.exp(-intensity * (value - center)));
    if (scaleToRange) {
        outValue = map(outValue, logistic(0, center, intensity, false), logistic(1, center, intensity, false), 0, 1);
    }
    outValue = clamp(outValue, 0, 1);
    return outValue;
}


//              ________  	1
//            /
//           /
//  _ _ _ _ /				0
//          
//             ^ center
// left tail
function logisticSimple(value, mean, stdev, bLeftTail) {

	var intensity = 3.0/stdev * (bLeftTail ? -1 : 1);
	return 1.0 / (1 + Math.exp( intensity * (value-mean) - 4.5 ) );
}

function strip(str, chr) {

	out = str;
	while (out.length > 0 && out.slice(0, 1) == chr) {
		out = out.slice(1);
	}
	while (out.length > 0 && out.slice(-1) == chr) {
		out = out.slice(0, -1);
	}
	return out;
}

function rangeStep(start, end, step) {
	out = []
	for (var i = start; i <= end; i += step) out.push(i);
	return out;
};

function rangeVals(start, end, nVals) {
	out = []
	for (var i = 0; i < nVals; i += 1 ) out.push( map(i, 0, nVals-1, start, end, true) );
	return out;
};

function rect(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.getCopy = function() {
		var tmp = new rect();
		tmp.x = this.x;
		tmp.y = this.y;
		tmp.w = this.w;
		tmp.h = this.h;
		return tmp;
	}

	// get bottom
	this.b = function() {
		return this.y + this.h;
	};

	// get right
	this.r = function() {
		return this.x + this.w;
	};

	this.transform = function(dx, dy) {
		this.x += dx;
		this.y += dy;
	}

	// Check if intersects with other rectangle
	this.intersects = function(b) {
		var a = this;
		return !(a.r() < b.x || a.x > b.r() || a.b() < b.y || a.y > b.b());
	};

	// Check containment percentage along an axis
	// x axis = 0
	// x axis = 1
	// scope = {"total", "self"} // conditionality
	this.inx = function(b, type, axis, scope) {
		var a1 = (axis == 0) ? this.x : this.y;
		var a2 = (axis == 0) ? this.x+this.w : this.y+this.h;
		if (a1 > a2) {
			var tmp = a2;
			a2 = a1;
			a1 = tmp;
		}
		var b1 = (axis == 0) ? b.x : b.y;
		var b2 = (axis == 0) ? b.x+b.w : b.y+b.h;
		if (b1 > b2) {
			var tmp = b2;
			b2 = b1;
			b1 = tmp;
		}

		var range = 0;
		if (scope == "total") {
			range = Math.max(a2, b2) - Math.min(a1, b1);
		} else if (scope == "self") {
			range = a2 - a1;
		}
		if (type == "AandB") {

			var lo = Math.max(a1, b1);
			var hi = Math.min(a2, b2);
			return (hi-lo) / range;

		} else if (type == "AnotB") {

			var lo = Math.max(a1, b1);
			var hi = Math.min(a2, b2);
			return ((a2-a1) - (hi-lo)) / range;

		} else if (type == "BnotA") {

			// doesn't work for self
			var lo = Math.max(a1, b1);
			var hi = Math.min(a2, b2);
			return (scope == "self") ? 0 : ((b2-b1) - (hi-lo)) / range;
			
		} else if (type == "AorB") {

			// doesn't work for self
			return 1;

		} else if (type == "AxorB") {

			// doesn't work for self
			var lo = Math.max(a1, b1);
			var hi = Math.min(a2, b2);
			if (scope == "self") {
				// same as AnotB
				return ((a2-a1) - (hi-lo)) / range;
			} else {
				return 1 - (hi-lo) / range;
			}

		} else {
			return 1;
		}
	};

};

function onTap(element, url) {
	if (url != "") {
		var load = function() { loadURL( url ); };
		$( element ).click( load );
		$( element ).on("touchstart", load );
	}
}

function getTextElement(id, text, url, font, color) {
	var para = document.createElement( "P" );
	para.setAttribute( "id", id );
	para.setAttribute( "style", "display: none; font-family: " + font );
	var _text = document.createTextNode( text );
	para.appendChild(_text);
	para.setAttribute("class", "asyncLoad");
	onTap( para, url );
	// if (url != "") $( para ).click( function() { loadURL( url ); });
	// if (url != "") $( para ).on("touchstart", function() { loadURL( url ); });
	$( para ).hover( function() { $( para ).css('cursor','pointer'); });
	$( para ).css("position", "absolute");
	$( para ).css('color', (color=="" ? "#000000" : color) );
	document.body.style = "white-space: pre;"
	document.body.appendChild(para);
	return para;
}

function getImageElement(id, path, url) {
	var img = document.createElement("IMG");
    img.setAttribute("id", id);
    img.setAttribute("src-tmp", path);
    img.setAttribute("class", "asyncLoad");
    onTap( img, url );
	// if (url != "") $( img ).click( function() { loadURL( url ); });
	// if (url != "") $( img ).on("touchstart", function() { loadURL( url ); });
	$( img ).hover( function() { $( img ).css('cursor','pointer'); });
	$( img ).css("display", "none");
	$( img ).css("position", "absolute");
    document.body.appendChild(img);
    return img;
}