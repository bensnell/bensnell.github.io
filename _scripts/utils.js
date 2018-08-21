// Utility functions

function stopScrollRestoration() {

	if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
}

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

	this.setFromImage = function(img) {
		this.x = $(img).offset().left;
		this.y = $(img).offset().top;
		this.w = $(img).attr("width");
		this.h = $(img).attr("height");
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

function emptyDict(_dict) {
	return Object.keys(_dict).length === 0;
}

function isArray(a){
	return Array.isArray(a);
}

// Log dragging to check if a touchend if a drag or a tap
var bDrag = false;
$( window ).on("touchstart", function(){ bDrag = false; });
$( window ).on("touchmove", function(){ bDrag = true; });

function onTap(element, url) {
	if (url != "") {
		$( element ).on("click", function() { 
			loadURL( url ); 
		});
		$( element ).on("touchend", function() { 
			if (!bDrag) loadURL( url ); 
			bDrag = false; 
		});
	}
}
function onTapFn(element, fn) {
	// Taps will prevent double events when there is a touchscreen
	var debounceTimeMs = 1000;
	if ( !element["taps"] ) element["taps"] = [];

	$( element ).on("click", function() {

		if ( element["taps"].length > 0) {
			var lastTap = element["taps"][element["taps"].length-1];
			if (lastTap[0] == "touch" && Math.abs(lastTap[1]-getTimeMs()) < debounceTimeMs) return;
		}

		element["taps"].push( ["click", getTimeMs()] );
		fn();
	});
	$( element ).on("touchend", function() { 

		if ( element["taps"].length > 0) {
			var lastTap = element["taps"][element["taps"].length-1];
			if (lastTap[0] == "click" && Math.abs(lastTap[1]-getTimeMs()) < debounceTimeMs) return;
		}

		if (!bDrag) {
			element["taps"].push( ["touch", getTimeMs()] );
			fn(); 
		}
		bDrag = false; 
	});
}

function getTimeMs() {
	return (new Date).getTime();
}

function elementExists(id) {
	return document.getElementById(id) != null;
}

function getTextElement(id, text, url, font, color, classes = []) {
	var para = document.createElement( "P" );
	para.setAttribute( "id", id );
	para.setAttribute( "style", "display: none; font-family: " + font );
	var _text = document.createTextNode( text );
	para.appendChild(_text);
	$.each(classes, function(index, element) { para.classList.add(element); });
	onTap( para, url );
	if (url != "") $( para ).hover( function() { $( para ).css('cursor','pointer'); });
	$( para ).css("position", "absolute");
	$( para ).css('color', (color=="" ? "#000000" : color) );
	$( para ).css("margin", 0); // removes strange offsets
	// document.body.style = "white-space: pre;"
	document.body.style = "white-space: pre-wrap;"
	// see: https://stackoverflow.com/questions/4413015/browser-compatible-word-wrap-and-whitespace-pre
	document.body.appendChild(para);
	return para;
}

function getImageElement(id, path, url, classes = [], bCursorOnHover = true) {
	var img = document.createElement("IMG");
    img.setAttribute("id", id);
    img.setAttribute("src-tmp", path);
    $.each(classes, function(index, element) { img.classList.add(element); });
    onTap( img, url );
	if (bCursorOnHover) $( img ).hover( function() { $( img ).css('cursor','pointer'); });
	$( img ).css("display", "none");
	$( img ).css("position", "absolute");
    document.body.appendChild(img);
    return img;
}

function getDivElement(id, url, classes = [], cursorType = "") {
	var div = document.createElement("div");
    div.setAttribute("id", id);
    $.each(classes, function(index, element) { div.classList.add(element); });
    onTap( div, url );
	if (cursorType != "") $( div ).hover( function() { $( div ).css('cursor',cursorType); });
	// $( div ).css("display", "none");
	$( div ).css("position", "absolute");
    document.body.appendChild(div);
    return div;
}

function getVimeoPath(vidID) {
	return "https://player.vimeo.com/video/" + vidID.split("_")[0] + "?color=ffffff&amp;title=0&amp;byline=0&amp;portrait=0";
}

function getVimeoElement(id, vidID, classes=[], bCursorOnHover=true) {

	var url = "https://player.vimeo.com/video/" + vidID.split("_")[0] + "?color=ffffff&amp;title=0&amp;byline=0&amp;portrait=0";
	return getiFrameElement(id, url, parseInt(vidID.split("_")[1]), parseInt(vidID.split("_")[2]), classes, bCursorOnHover);
}

// Video element
function getiFrameElement(id, url, width, height, classes=[], bCursorOnHover=true) {
	var vid = document.createElement("iframe");
	vid.setAttribute("id", id);
	vid.setAttribute("src-tmp", url);
	$.each(classes, function(index, element) { vid.classList.add(element); });
	if (bCursorOnHover) $( vid ).hover( function() { $( vid ).css('cursor','pointer'); });
	$( vid ).css("display", "none");
	$( vid ).css("position", "absolute");

	vid.setAttribute("frameborder", 0);

	vid.setAttribute("width", width);
	vid.setAttribute("height", height);
	
	vid.setAttribute("webkitallowfullscreen", "");
	vid.setAttribute("mozallowfullscreen", "");
	vid.setAttribute("allowfullscreen", "");

	// Set width/height with style ($( ).css)

	document.body.appendChild(vid);
	return vid;
}

// set the position and dimensions of a jquery document element
function setTxtPosDim(el, x=null, y=null, w=null, h=null) {
	if (x != null) el.css("left", x);
	if (y != null) el.css("top", y);
	if (w != null) el.css("width", w);
	if (h != null) el.css("height", h);
}

function setImgPosDim(el, x=null, y=null, w=null, h=null) {
	if (x != null) el.css("left", x);
	if (y != null) el.css("top", y);
	if (w != null) el.attr("width", w);
	if (h != null) el.attr("height", h);
}

// Get the lowest position (y) of all of the elements on the page (within in the body)
function getElemsHeight() {
	var lowestY = 0;
	$(document.body).children().each( function(index, element) {
		var bottom = $( element ).offset().top + $( element ).height();
		if (bottom > lowestY) lowestY = bottom;
	});
	return lowestY;
}

function getDictValues(dct) {
	return Object.keys(dct).map(function(key){ return dct[key]; });
}

// turn a non-array into an array
function makeArray(element) {
	return isArray(element) ? element : [element];
}

// each function provided will be called consecutively
// each function should accept a promise as an argument, which finishes within the function once complete
// once the final function has finished, the returned promise will resolve
function consecCall(fnArray) {
	
	var prevDef = null;
	$.each(fnArray, function(index, fn) {
		var def = $.Deferred();
		$.when( prevDef ).done( function() { return fn(def); });
		prevDef = def;
	});
	return prevDef;
}

function beginLoadingImg(img) {
	$( img ).attr( 'src', $( img ).attr( 'src-tmp' ) );
}

function getNewImageHeight(img, toWidth) {
	return $(img).height() / $(img).width() * toWidth;
}

function isString(a) {
	return (typeof a) == "string";
}