// Ref: alignment: https://stackoverflow.com/questions/12744928/in-jquery-how-can-i-set-top-left-properties-of-an-element-with-position-values

// fonts: Aver, Neris, Lato, 
// title serif: Andale, Baskerville, Batang*, Bell MT, Bookman Old Style, CAllisto MT, Cochin*, Consolas, Didot
// body serif: Cambria, Cochin*, Century, Garamond

// Stores all projects
var projects;
// Stores the logo at the top of the page
var menu = {};

var fontTitle = "Didot";
var fontBody = "Garamond";


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

function resizeCanvas() {

	// var canvas = document.getElementById('canvas');
    // canvas.style.height = window.innerWidth*3;

    // console.log("Canvas resized");
}

function fadeOutPage(toUrl) {

	// Fade out all async elements
	$( ".asyncLoad" ).each( function(index, element) {

		$( element ).fadeOut(200);

	});

	// Go to the new page
	window.location.href = toUrl;
}

// Document is ready but not yet loaded
$( document ).ready(function() {

	// Document Object Model (DOM) is now ready
	console.log( "window ready" );

	// Change the height of the canvas to fit all elements
	// that need to be loaded
    // resizeCanvas();

    // Parse the JSON with home's layout data
    $.get('json/home.json', function(data) {
    	// Store the json data for later use
    	projects = data["projects"];

    	// Iterate through all projects to create an image and text box for each one
    	$.each(projects, function(index, element) {

			// Assign an image ID
			var imgID = "img" + element["projectID"];
			element["imgID"] = imgID;
			// get the image path
			var imgPath = data["homeFolderName"] + "/" + element["projectID"] + "." + data["imgExt"];
			// create the element
			var img = document.createElement("IMG");
		    img.setAttribute("id", imgID);
		    img.setAttribute("src-tmp", imgPath);
		    img.setAttribute("class", "asyncLoad");
		    // Wrap the image in a link
			$(img).wrap($('<a>',{ href: element["url"] }));
			$(img).click(function() {
    			fadeOutPage(element["url"]);
			});
			$(img).hover(function() {
        		$(img).css('cursor','pointer');
		    });
			// Style
			$( img ).css("display", "none"); // styles
			$( img ).css("position", "absolute");
		    // Add the element to the body
		    document.body.appendChild(img);
		    // add the element to the object
		    element["img"] = img;

		    // Assign a text ID
			var txtID = "txt" + element["projectID"];
			element["txtID"] = txtID;
			// Create the element
		    var para = document.createElement("P");
		    para.setAttribute("id", txtID);
		    para.setAttribute("style", "display: none; font-family: " + fontBody);
    		var text = document.createTextNode(element["title"]);
    		para.appendChild(text);
    		para.setAttribute("class", "asyncLoad");
    		// Wrap the image in a link
			$(para).wrap($('<a>',{ href: element["url"] }));
			$(para).click(function() {
				fadeOutPage(element["url"]);
			});
			$(para).hover(function() {
        		$(para).css('cursor','pointer');
		    });
			// Style
			$( para ).css("position", "absolute");
			$(para).css('color','#000000');
    		// Add to body
    		document.body.appendChild(para);
    		// Add to object
    		element["txt"] = para;


    	});
	});

	// Create and set the logo
	// Create the element
    var para = document.createElement("P");
    para.setAttribute("id", "logo");
    para.setAttribute("style", "display: none; font-family: " + fontTitle);
	var text = document.createTextNode("Ben Snell");
	para.appendChild(text);
	para.setAttribute("class", "asyncLoad");
	// Wrap the image in a link
	$(para).wrap($('<a>',{ href: "http://ben-snell.com" }));
	$(para).click(function() {
		fadeOutPage("http://ben-snell.com");
	});
	$(para).hover(function() {
		$(para).css('cursor','pointer');
    });
	// Style
	$( para ).css("position", "absolute");
	// $( para ).css("color", "white");
	// $( para ).css("text-shadow", "-1px -1px 0 #000, 1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000");
	// Add to body
	document.body.style = "white-space: pre;"
	document.body.appendChild(para);
	// Add to object
	menu["logo"] = para;


	// Create and set the about
    para = document.createElement("P");
    para.setAttribute("id", "about");
    para.setAttribute("style", "display: none; font-family: " + fontTitle);
	var text = document.createTextNode("\\ about");
	para.appendChild(text);
	para.setAttribute("class", "asyncLoad");
	$(para).wrap($('<a>',{ href: "http://ben-snell.com/about" }));
	$(para).click(function() { fadeOutPage("http://ben-snell.com/about"); });
	$(para).hover(function() { $(para).css('cursor','pointer'); });
	$( para ).css("position", "absolute");
	$( para ).css('color','#999999');
	document.body.style = "white-space: pre;"
	document.body.appendChild(para);
	menu["about"] = para;

	// Create and set the contact
    para = document.createElement("P");
    para.setAttribute("id", "inquire");
    para.setAttribute("style", "display: none; font-family: " + fontTitle);
	var text = document.createTextNode("\\ inquire");
	para.appendChild(text);
	para.setAttribute("class", "asyncLoad");
	$(para).wrap($('<a>',{ href: "http://ben-snell.com/inquire" }));
	$(para).click(function() { fadeOutPage("http://ben-snell.com/inquire"); });
	$(para).hover(function() { $(para).css('cursor','pointer'); });
	$( para ).css("position", "absolute");
	$( para ).css('color','#999999');
	document.body.style = "white-space: pre;"
	document.body.appendChild(para);
	menu["inquire"] = para;

});

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

function ColumnLayout(nCols, colWidth, colMargin, indexOffset) {

    this.nCols = nCols;
    this.colWidth = colWidth;
    this.colMargin = colMargin;
    this.indexOffset = indexOffset;

    // Define a few global variables
    this.imgCounter = -1;
    // this.avgOverlap = 0;
    this.rects = [];


    // ===== Parameters ======

    this.maxLandscapeMult = 1.5; // mult of the col radius

    this.maxIters = 1;
    this.nSamples = 10;
    this.searchRadiusMult = 1.5; // mult of the col radius

    // Inhibitors 
    // 1 = full inhibition
    this.intersectionInhibitor = 1;
    this.containmentInhibitor = 1; 
    this.edgeStDevMult = 0.08; // as a function of column width

    // Bounds on acceptable amounts of white space
    this.spaceLoMeanMult = 0.3;
    this.spaceLoStdevMult = 0.1;
    this.spaceHiMeanMult = 1.6;
    this.spaceHiStdevMult = 0.1;

    // amount of intersection to set 
    this.intersectionThreshold = 0.5;




    // ===== Calculations ======

    this.edgeStDevPx = this.edgeStDevMult * this.colWidth;
    this.spaceLoMeanPx = this.spaceLoMeanMult * this.colWidth;
    this.spaceLoStdevPx = this.spaceLoStdevMult * this.colWidth;
    this.spaceHiMeanPx = this.spaceHiMeanMult * this.colWidth;
    this.spaceHiStdevPx = this.spaceHiStdevMult * this.colWidth;



    this.getLikelihood = function(thisRect) {

	  	like = 1;

	  	// Anything off the edge of the page is unacceptable
	  	if (thisRect.y < 0) {
	  		like *= 0;
	  	}


	  	// Intersecting images are not likely
	  	for (var i = 0; i < this.rects.length; i++) {
	  		if (this.rects[i].intersects(thisRect)) {
	  			// console.log(this.rects[i], thisRect);
	  			like *= (1 - this.intersectionInhibitor);
	  			break;
	  		}
	  	}

	  	// Images contained within each other vertically are not likely
	  	// todo: only check the most recent ones
	  	for (var i = 0; i < this.rects.length; i++) {
	  		if ( this.rects[i].inx(thisRect, "AandB", 1, "self") == 1 || thisRect.inx(this.rects[i], "AandB", 1, "self") == 1 ) {
	  			like *= (1 - this.containmentInhibitor);
	  			break;
	  		}
	  	}
	  	// console.log(like);

	  	// Don't let edges of neighboring images come close
	  	// Calculate the likelihood for all edges of last 2 images
	  	// todo: make faster by checking distances
	  	var calcLast = 2;
		for (var i = Math.max(this.rects.length-1,-1); i >= Math.max(this.rects.length-1-calcLast,0); i--) {

			// compare tops and bottoms
			like *= (1 - gaussian(this.rects[i].y, thisRect.y, this.edgeStDevPx, true));
			like *= (1 - gaussian(this.rects[i].y, thisRect.b(), this.edgeStDevPx, true));
			like *= (1 - gaussian(this.rects[i].b(), thisRect.y, this.edgeStDevPx, true));
			like *= (1 - gaussian(this.rects[i].b(), thisRect.b(), this.edgeStDevPx, true));
	  	}	  	
	  	// console.log(like, "after edges");
	  	
	  	// Impose bounds on the largest and smallest amount of white space
	  	// First, find the distance to the nearest image
	  	var bottom = 0;
	  	for (var i = Math.max(this.rects.length-1, -1); i >= 0; i--) {
	  		if (this.rects[i].inx(thisRect, "AandB", 0, "self") >= this.intersectionThreshold) {
	  			// rectangles are stacked
	  			bottom = this.rects[i].b();
	  			break;
	  		}
	  	}
	  	// console.log(thisRect, this.rects.length, bottom);



	  	// if (this.rects.length != 0) bottom = this.rects[this.rects.length-1].b();
	  	// Apply the inhibitors
	  	var diff = thisRect.y - bottom;
	  	// console.log(diff, bottom);
	  	// Lower bound on the white space -- only applied if bottom != 0
	  	if (bottom != 0) {
	  		// console.log(like);
	  		// var tmp = like;
		  	like *= (1 - logisticSimple(diff, this.spaceLoMeanPx, this.spaceLoStdevPx, false));
		  	// if (like != tmp) console.log("diff", thisRect.y, bottom, diff, this.spaceLoMeanPx, this.spaceLoStdevPx);
		  	// console.log("\t", tmp, like);
		  	// console.log(like, "after lo bound");
		}

	  	// Higher bound on the white space
	  	// var tmp = like;
	  	like *= (1 - logisticSimple(diff, this.spaceHiMeanPx, this.spaceHiStdevPx, true));
	  	// if (like != tmp) console.log("diff", tmp, like);
	  	// console.log(like, "after hi bound");

	  	


	  	// If an image has no neighbors above, push it higher upwards





	  	// If there has been a lot of overlap, make room with some white space (?)




	  	return like;
	};



 	// Return a rect describing the image location within the column matrix
 	this.getImagePosition = function(imgW, imgH) {

	  	// Increment the counters
	  	this.imgCounter += 1;

	  	// Create the variables that will be output
	  	var x, y, w, h;

	  	// Set the final width and height
	  	w = imgW;
	  	h = imgH;
	  	// Adjust to fit within the column
	  	var mult = this.colWidth / imgW;
	  	if (w/h > 1.01) {
	  		// If the image is landscape, increase its width so the
	  		// area is more reasonably comparable
	  		mult *= this.maxLandscapeMult;
	  	}
	  	w *= mult;
  		h *= mult;

	  	// Find the x location
	  	var col = (this.imgCounter + this.indexOffset) % this.nCols;
	  	x = col * (this.colWidth + this.colMargin);
	  	if (w > this.colWidth) {

	  		// If the image is on the right, switch it
	  		// If the image is in the middle, randomly choose a side
	  		if (col == (this.nCols - 1) || (col > 0 && Math.random() < 0.5) ) {
	  			x -= (w-this.colWidth);
	  		}
	  	}

	  	var iters = 0
	  	var center = 0;
  		if (this.rects.length != 0) {
  			var lastRect = this.rects[this.rects.length-1];
  			center = lastRect.y + lastRect.h;
  		}
	  	var radius = this.searchRadiusMult * this.colWidth;
	  	while (iters <= this.maxIters) {

	  		// Choose n samples and find the likelihood at each
	  		// The radius is relative to the last offset
	  		var searchRadius = (this.searchRadiusMult * this.colWidth) * Math.pow(0.25, iters)
	  		var yLo = center - searchRadius;
	  		var yHi = center + searchRadius;
	  		var yLocs = rangeVals(yLo, yHi, this.nSamples);

	  		// For each location, find the overall likelihood
	  		var likes = []
	  		var self = this;
	  		$.each(yLocs, function(index, element) {

	  			// Add the likelihood
	  			var thisRect = new rect(x, element, w, h);
	  			var thisLike = self.getLikelihood( thisRect );
	  			likes.push( [ thisRect, thisLike ]);
	  		});

	  		// Sort to find the highest likelihood
			likes.sort( function(a,b) { return a[1] < b[1]; } );
			// console.log(likes);

			// Save the y value of the highest rated location
			center = likes[0][0].y

			// increment the iteration
	  		iters += 1;
	  	}
	  	y = center;
	  	var outRect = new rect(x, y, w, h)

	  	this.rects.push(outRect);

	  	return outRect;
	};
	
};

var windowW = $( window ).width();

$( window ).on("load", function() {

	// console.log( $(window).scrollTop() );

	// var a = new rect(0, 141, 283, 425);
	// var b = new rect(315, 330, 283, 283);
	// console.log(a.intersects(b));

	// for (var i = 0; i < 3; i += 0.1) {
	// 	console.log(i, logisticSimple(i, 3, 1, true));
	// }

	// var a = new rect(0, 0, 10, 10);
	// var b = new rect(0, 3, 10, 10);
	// console.log(a.inx(b, "AnotB", 1, "self"));

	// var c = [ [0, 0], [2, 2], [1, 1]];
	// c.sort( function(a,b) { return a[0] > b[0]; } );
	// console.log(c);

	// All assets have loaded
    console.log( "window loaded" );

    // ========================
	// ====== VARIABLES =======
	// ========================

	// Max window width
	var maxWindowW = 1042;

    // Amount of slide
    var slideAmt = 0.7;
    // Consecutive delay of img loading
	var delayMs = 350;

	// Margin Sizes (fractions of width)
	var marginTopFrac = 0.13; // 0.075 // 0.13 // 0.169
	var vertSpacingFrac = 0.050;
	var marginSideFrac = 0.085;
	var marginBetweenFrac = 0.05;

	// Image sizes
	var minImgArea = 0.25; 	// desktop, 0.25
	var maxImgArea = 0.5;	// mobile, 0.5

	// Body font
	var fontSizeFrac = 0.015; // .015 // 0.018
	var minFontSize = 10;
	var bodyTopOffset = 0.2; // 0.35

	// Title font
	var titleSizeFrac = 0.065; // 0.075 // 0.09 // 0.055
	var minTitleSize = 40;
	var titleTopOffset = 0.55; // 0.7
	var titleLeftOffset = 0.5; // 0.37
	var bTitleAbove = true;
	var titleLineHeight = 1.1; // 1.25
	var titleLetterSpacing = 0.14;

	var columnOffset = 1;

	// ========================
	// ======= COMPUTE ========
	// ========================

	// set this ahead of time because it changes when a scroll bar is added
	var origWindowW = $( window ).width();
	windowW = origWindowW;
	var windowH = $( window ).height();
	// Clamp the window width
	windowW = Math.min(windowW, maxWindowW);
	// Get the left offset of all items
	windowL = ($( window ).width() - windowW) / 2.0;

	// Fade durations
	var fadeMs = 740 * slideAmt;
	var moveMs = 750 * slideAmt;
	// Number of pixels of upward movement on loading
	var moveAmtFrac = 0.12 * slideAmt;
	var moveAmtPx = moveAmtFrac * windowW;

	// Change the margin depending on the window size
	var minWidth = 375;
	var maxWidth = 1042;
	marginSideFrac *= map(windowW, minWidth, maxWidth, 0, 1, true);
	marginSideFrac = Math.max(marginSideFrac, 0.01);
	var marginSidePx = windowW * marginSideFrac;
	var marginBetweenPx = windowW * marginBetweenFrac;

	var imgAreaFrac = map(windowW, minWidth, maxWidth, maxImgArea, minImgArea, true, 1)

	var marginTopPx = marginTopFrac * windowW;
	var vertSpacingPx = vertSpacingFrac * windowW;
	var offsetTopPx = marginTopPx;

	var fontSizePx = Math.max(fontSizeFrac * windowW, minFontSize);

	var titleSizePx = Math.max(titleSizeFrac * windowW, minTitleSize);

	// ========================
	// ==== LOAD PROJECTS =====
	// ========================

	// var lastBottom = 0;
	// var lastHeight = 0;
	// var lastW2H = 1;



	var layout = new ColumnLayout(2, (1 - (marginSideFrac*2+marginBetweenFrac)) * windowW / 2.0, marginBetweenPx, 1);

	// For each project ...
    $.each(projects, function(index, element) {

    	// Decide the horizontal location for this item
    	// var availWidth = marginSideFrac * 2.0 * $( window ).width();
    	// Math.random() * (

    	// var projW, projH, projX;

    	// console.log($(element["txt"]).width());


		// percentage of increase
		// var d = 0.05

  //   	$( element["img"] ).mouseenter(
  //   		function () {

  //   			var neww = $( this ).width() * (d + 1.0);
  //   			var newh = $( this ).height() * (d + 1.0);
  //   			var dw = neww - $( this ).width();
  //   			var dh = newh - $( this ).height();
  //   			var dl = -dw/2.0
  //   			var dt = -dh/2.0
  //   			$( this ).animate({width: "+="+dw, height: "+="+dh, left: "+="+dl, top: "+="+dt}, 100, "easeOutCubic");
  //   		});


  //   	$( element["img"] ).mouseleave(
  //   		function () {

  //   			var neww = $( this ).width() * 1.0 / (d + 1.0);
  //   			var newh = $( this ).height() * 1.0 / (d + 1.0);
  //   			var dw = neww - $( this ).width();
  //   			var dh = newh - $( this ).height();
  //   			var dl = -dw/2.0
  //   			var dt = -dh/2.0
  //   			$( this ).animate({width: "+="+dw, height: "+="+dh, left: "+="+dl, top: "+="+dt}, 100, "easeOutCubic");
  //   		});






    	// As soon as the image is loaded, fade it and its text in
    	$( element["img"] ).on(
    		"load",
    		function () {

				var origRect = layout.getImagePosition($( element["img"] ).width(), $( element["img"] ).height());
				var thisRect = origRect.getCopy();
				// transform this rectangle into the screen's coordinate system
				thisRect.transform(windowL + marginSidePx, marginTopPx);


				$( element["img"] ).attr("width", thisRect.w);
				$( element["img"] ).attr("height", thisRect.h);				




				// Set the size of the text
				$( element["txt"] ).css("font-size", fontSizePx);

				// Then, find the horizontal position
				// var availWidth =  windowW * (1.0 - marginSideFrac * 2.0);
				// var imgX = (availWidth - imgW) * 0.5;
				// imgX += windowW * marginSideFrac;



				// var imgX = (availWidth - imgW) * gaussianRandom(1);
				// imgX += windowW * marginSideFrac;

				// var imgX = (availWidth - imgW) * map(Math.sin(offsetTopPx/windowW*7), -1, 1, 0, 1, true)
				// imgX += windowW * marginSideFrac;

				// var imgX = marginSidePx + column * (marginBetweenPx + imgW);
				// console.log(imgX);


				// Set the position of the image
				$( element["img"] ).css("top", thisRect.y + moveAmtPx);
				$( element["img"] ).css("left", thisRect.x); 
				$( element["img"] ).css("z-index", 0);
				// Set the position of the text
				// $( element["txt"] ).css("top", offsetTopPx + moveAmtPx + thisRect.h - fontSizePx + fontSizePx*bodyTopOffset);
				// $( element["txt"] ).css("left", windowL + imgX + imgW/2 - $( element["txt"] ).width()/2);
				// $( element["txt"] ).css("left", windowL + thisRect.x);
				$( element["txt"] ).css("top", thisRect.b() - fontSizePx*0.5);
				$( element["txt"] ).css("left", thisRect.x);
				$( element["txt"] ).css("letter-spacing", (titleLetterSpacing/2*fontSizePx) + "px"); // .1993

				$( element["txt"] ).css("z-index", 0);

				// On hovering over the image, show the text below it
				$( element["img"] ).mouseenter( function() {
					// $( element["txt"] ).stop(true, false);
					$( element["txt"] ).fadeIn({queue: false, duration: fadeMs*0.8});
					// console.log("in");
			    });
			    $( element["img"] ).mouseleave( function() {
			    	setTimeout( function() {
			    		// $( element["txt"] ).stop(true, false);
						$( element["txt"] ).fadeOut({queue: false, duration: fadeMs});
					}, 2500);
					// console.log("out");
			    });

				// Fade in the image and text and animate them
				$( element["img"] ).fadeIn({queue: false, duration: fadeMs}); 
				$( element["img"] ).animate({top: "-="+moveAmtPx}, moveMs, "easeOutCubic");
				// $( element["txt"] ).fadeIn({queue: false, duration: fadeMs}); 
				// $( element["txt"] ).animate({top: "-="+moveAmtPx}, moveMs, "easeOutCubic");


    			// Load logo text
    			if (index == 0) {
    				var logo = menu["logo"];
    				$( logo ).css("font-size", titleSizePx);
    				$( logo ).css("letter-spacing", (titleLetterSpacing*titleSizePx) + "px"); // .1993
    				$( logo ).css("line-height", titleLineHeight);
    				$( logo ).css("top", -titleSizePx*(1-titleTopOffset)); // top
    				// $( logo ).css("top", windowH/2 - $(logo).height()/2 * 4); // center
    				$( logo ).css("left", windowL + windowW/2 - $( logo ).width()/2 * 1.14); // center
    				// $( logo ).css("left", windowL + titleSizePx*titleLeftOffset);
    				// $( logo ).css("left", windowL + marginSideFrac*windowW);
    				$( logo ).css("z-index", bTitleAbove * 2 -1);
					// $( logo ).style.textAlign = "center";
    				// $( logo ).css("text-align", "center");
    				$( logo ).css("position", "absolute");
    				// $( logo ).css("position", "fixed");
    				$( logo ).fadeIn({queue: false, duration: fadeMs}); 
    			}
    			// if (index == 0) {
    			// 	var item = menu["about"];
    			// 	$( item ).css("text-align", "right");
    			// 	$( item ).css("font-size", titleSizePx/2);
    			// 	$( item ).css("top", -titleSizePx/2 + windowH * 0.666);
    			// 	var scrollBarWidth = 15;
    			// 	$( item ).css("left", origWindowW - scrollBarWidth - $(item).width() - titleSizePx*titleLeftOffset/2 );
    			// 	$( item ).css("z-index", bTitleAbove * 2 -1);
    			// 	$( item ).css("position", "fixed");
    			// 	$( item ).css("line-height", titleLineHeight);
    			// 	$( item ).fadeIn({queue: false, duration: fadeMs}); 
    			// }
    			// if (index == 0) {
    			// 	var menuItems = ["about", "inquire"]
    			// 	var menuSizeFraction = 0.4;
    			// 	for (var i = 0; i < menuItems.length; i++) {
    			// 		var item = menu[menuItems[i]];
	    		// 		// $( item ).css("text-align", "right");
	    		// 		$( item ).css("font-size", titleSizePx * menuSizeFraction);
	    		// 		// $( item ).css("bottom", -titleSizePx * 0.1);
	    		// 		console.log();
	    		// 		$( item ).css("top", $(menu["logo"]).offset().top + $(menu["logo"]).height() - titleSizePx*0.3 + $(item).height() * i); //-titleSizePx*(1-titleTopOffset)); //+ 10 + $( item ).height()*i
	    		// 		var scrollBarWidth = 15;
	    		// 		// $( item ).css("left", origWindowW - scrollBarWidth - $(item).width() - titleSizePx*titleLeftOffset/2);
	    		// 		// $( item ).css("left", $( window ).width() * 0.7);
	    		// 		$( item ).css("left", windowL + marginSideFrac*windowW);
	    		// 		$( item ).css("z-index", bTitleAbove * 2 -1);
	    		// 		// $( item ).css("position", "fixed");
	    		// 		$( item ).css("position", "absolute");
	    		// 		$( item ).css("line-height", titleLineHeight);
	    		// 		$( item ).fadeIn({queue: false, duration: fadeMs}); 
    			// 	}
    			// }

    			// Increment the offset amount
    			// offsetTopPx += imgH + vertSpacingPx;
		});

		// Now, load the image on a timeout
    	setTimeout( function() {
				$( element["img"] ).attr( 'src', $( element["img"] ).attr( 'src-tmp' ) );
			}, index * delayMs);

    });

    // Now, create functions to delay the loading 

    // console.log(item);
			// $( item ).attr( 'src', $( item ).attr( 'src-tmp' ) );





	// Now, set the jquery attributes to fade in on loading
	// $( '.asyncLoad' ).each( function(){

	// 	// Fade durations
	// 	var fadeMs = 740;
	// 	var moveMs = 750;
	// 	// Number of pixels of upward movement on loading
	// 	var moveAmtFraction = 0.12;
		
	// 	// Set attributes
		

	// 	// Once the image is done loading...
	// 	$( this ).bind( 
 //        	"load", 
 //        	function () { 

        		// Get the size
    //     		var targetWidth = 0.5 * $( window ).width();
				// var targetHeight = $( this ).attr("height") * targetWidth / $( this ).attr("width");
				// // Resize
				// $( this ).attr("width", targetWidth);
				// $( this ).attr("height", targetHeight);


				// // Find the move amount based on the screen size
				// moveAmt = moveAmtFraction * $( window ).width();

				// // Set the position
				// $( this ).css("top", 100 + moveAmt);
				// $( this ).css("left", 100);


				// // Fade in 
				// $( this ).fadeIn({queue: false, duration: fadeMs}); 

				// And animate
				// $( this ).animate({top: "-="+moveAmt}, moveMs, "easeOutCubic");
				
        	// }
        // );		

        // Load the images by setting "src" to "data-src"
        // $( this ).attr( 'src', $( this ).attr( 'src-tmp' ) );
    // } );
    
});

$( window ).scroll( function() {

	var hiddenFrac = 0.05;


	var hiddenPx = hiddenFrac * windowW;
    // if ( $(window).scrollTop() > hiddenPx/4 && $( menu["logo"] ).is(":visible") && !$(menu["logo"]).is(':animated') ) {
    //     // Fade out
    //     $( menu["logo"] ).fadeOut({queue: false, duration: 300}); 
    // }
    // if ( $(window).scrollTop() <= hiddenPx && $( menu["logo"] ).is(":hidden") && !$(menu["logo"]).is(':animated') ) {
    //     // Fade in
    //     $( menu["logo"] ).fadeIn({queue: false, duration: 800}); 
    // }
});

$( window ).on( "resize", function() {

    console.log( "window resized" );

    // resizeCanvas();

});