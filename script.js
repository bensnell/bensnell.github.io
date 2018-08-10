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

function gaussian(nVals) {

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
	var text = document.createTextNode("Ben\nSnell");
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
	// Add to body
	document.body.style = "white-space: pre;"
	document.body.appendChild(para);
	// Add to object
	menu["logo"] = para;

});

$( window ).on("load", function() {

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
	var marginTopFrac = 0.13; // 0.075
	var vertSpacingFrac = 0.050;
	var marginSideFrac = 0.085;

	// Image sizes
	var minImgArea = 0.25; 	// desktop, 0.25
	var maxImgArea = 0.5;	// mobile, 0.5

	// Body font
	var fontSizeFrac = 0.015; // .015 // 0.018
	var minFontSize = 10;
	var bodyTopOffset = 0.2; // 0.35

	// Title font
	var titleSizeFrac = 0.09; // 0.075
	var minTitleSize = 40;
	var titleTopOffset = 0.65; // 0.7
	var titleLeftOffset = 0.5; // 0.37
	var bTitleAbove = true;
	var titleLineHeight = 1.25;

	// ========================
	// ======= COMPUTE ========
	// ========================

	// set this ahead of time because it changes when a scroll bar is added
	var windowW = $( window ).width();
	var windowH = $( window ).height();
	// Clamp the window width
	windowW = Math.min(windowW, maxWindowW);
	// Get the left offset of all items
	windowL = ($( window ).width() - windowW) / 2.0

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

	var imgAreaFrac = map(windowW, minWidth, maxWidth, maxImgArea, minImgArea, true, 1)
	// console.log(imgAreaFrac);

	var marginTopPx = marginTopFrac * windowW;
	var vertSpacingPx = vertSpacingFrac * windowW;
	var offsetTopPx = marginTopPx;

	var fontSizePx = Math.max(fontSizeFrac * windowW, minFontSize);

	var titleSizePx = Math.max(titleSizeFrac * windowW, minTitleSize);

	// ========================
	// ==== LOAD PROJECTS =====
	// ========================

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

    			// First, find the height and width of the image
				var windowArea = windowW * windowW;
				var desiredImgArea = windowArea * imgAreaFrac;
				var imgArea = $( element["img"] ).height() * $( element["img"] ).width();
				var linearMult = Math.sqrt(desiredImgArea / imgArea);
				var imgW = linearMult * $( element["img"] ).width();
				var imgH = linearMult * $( element["img"] ).height();
				$( element["img"] ).attr("width", imgW);
				$( element["img"] ).attr("height", imgH);

				$( element["txt"] ).css("font-size", fontSizePx);

				// Then, find the horizontal position
				var availWidth =  windowW * (1.0 - marginSideFrac * 2.0);
				// var imgX = (availWidth - imgW) * 0.5;
				// imgX += windowW * marginSideFrac;



				// var imgX = (availWidth - imgW) * gaussian(1);
				// imgX += windowW * marginSideFrac;

				var imgX = (availWidth - imgW) * map(Math.sin(offsetTopPx/windowW*7), -1, 1, 0, 1, true)
				imgX += windowW * marginSideFrac;

				// Set the position of the image
				$( element["img"] ).css("top", offsetTopPx + moveAmtPx);
				$( element["img"] ).css("left", windowL + imgX);
				$( element["img"] ).css("z-index", 0);
				// Set the position of the text
				$( element["txt"] ).css("top", offsetTopPx + moveAmtPx + imgH - fontSizePx + fontSizePx*bodyTopOffset);
				// $( element["txt"] ).css("left", windowL + imgX + imgW/2 - $( element["txt"] ).width()/2);
				$( element["txt"] ).css("left", windowL + imgX);
				$( element["txt"] ).css("z-index", 0);

				// Fade in the image and text and animate them
				$( element["img"] ).fadeIn({queue: false, duration: fadeMs}); 
				$( element["img"] ).animate({top: "-="+moveAmtPx}, moveMs, "easeOutCubic");
				// $( element["txt"] ).fadeIn({queue: false, duration: fadeMs}); 
				// $( element["txt"] ).animate({top: "-="+moveAmtPx}, moveMs, "easeOutCubic");


    			// Load logo text
    			if (index == 0) {
    				var logo = menu["logo"];
    				$( logo ).css("font-size", titleSizePx);
    				$( logo ).css("top", -titleSizePx*(1-titleTopOffset));
    				// $( logo ).css("left", windowL + windowW/2 - $( logo ).width()/2 * 1.14);
    				// $( logo ).css("left", windowL + titleSizePx*titleLeftOffset);
    				$( logo ).css("left", titleSizePx*titleLeftOffset);
    				$( logo ).css("z-index", bTitleAbove * 2 -1);
					// $( logo ).style.textAlign = "center";
    				// $( logo ).css("text-align", "center");
    				$( logo ).css("position", "fixed");
    				$( logo ).css("line-height", titleLineHeight);
    				$( logo ).fadeIn({queue: false, duration: fadeMs}); 
    			}

    			// Increment the offset amount
    			offsetTopPx += imgH + vertSpacingPx;
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

$( window ).on( "resize", function() {

    console.log( "window resized" );

    // resizeCanvas();

});