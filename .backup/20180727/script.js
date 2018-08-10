// Ref: alignment: https://stackoverflow.com/questions/12744928/in-jquery-how-can-i-set-top-left-properties-of-an-element-with-position-values

// Stores all projects
var projects = 1;

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

function resizeCanvas() {

	// var canvas = document.getElementById('canvas');
    // canvas.style.height = window.innerWidth*3;

    // console.log("Canvas resized");
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
    			window.location.href = element["url"];
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
		    para.setAttribute("style", "display: none");
    		var text = document.createTextNode(element["title"]);
    		para.appendChild(text);
    		para.setAttribute("class", "asyncLoad");
    		// Wrap the image in a link
			$(para).wrap($('<a>',{ href: element["url"] }));
			// Style
			$( para ).css("position", "absolute");
    		// Add to body
    		document.body.appendChild(para);
    		// Add to object
    		element["txt"] = para;
    	});
	});

});

$( window ).on("load", function() {

	// set this ahead of time because it changes when a scroll bar is added
	var windowW = $( window ).width();
	var windowH = $( window ).height();

	// All assets have loaded
    console.log( "window loaded" );

    console.log(projects);

    var slideAmt = 0.8;

	// Fade durations
	var fadeMs = 740 * slideAmt;
	var moveMs = 750 * slideAmt;
	// Number of pixels of upward movement on loading
	var moveAmtFraction = 0.12 * slideAmt;
	// Delay img load
	var delayMs = 350;

	// var imgWidthFrac = 0.4;
	var imgAreaFrac = 0.15;


	var marginTopFrac = 0.075; // fraction of width
	var vertSpacingFrac = 0.035; // fraction of width
	var marginSideFrac = 0.085; // fraction widths

	var marginTopPx = marginTopFrac * windowW;
	var vertSpacingPx = vertSpacingFrac * windowW;
	var offsetTopPx = marginTopPx;
	// if (marginSideFrac*2+imgWidthFrac > 1) {
	// 	marginSideFrac = (1.0 - imgWidthFrac) / 2.0;
	// }

	// For each project ...
    $.each(projects, function(index, element) {

    	// Decide the horizontal location for this item
    	// var availWidth = marginSideFrac * 2.0 * $( window ).width();
    	// Math.random() * (

    	var projW, projH, projX;

    	// For the image and text ...
    	[ element["img"], element["txt"] ].forEach( function( item ) {

    		console.log(item);

    		$( item ).on(  // used to be .bind
        	"load", 
        	function () { 

        		// $(item).show();

	    		if (item.nodeName == "IMG") {

	    			// layout only changes when width is changed
					var windowArea = windowW * windowW; // *3/4?
					var desiredImgArea = windowArea * imgAreaFrac;
					var imgArea = $( item ).height() * $( item ).width();
					var linearMult = Math.sqrt(desiredImgArea / imgArea);
					projW = linearMult * $( item ).width();
					projH = linearMult * $( item ).height();
					$( item ).attr("width", projW);
					$( item ).attr("height", projH);

		   //  		var targetWidth = imgWidthFrac * windowW;
		   //  		projW = targetWidth;
					// var targetHeight = $( item ).height() * targetWidth / $( item ).width();
					// // Resize
					// $( item ).attr("width", targetWidth);
					// $( item ).attr("height", targetHeight);

					
					// Decide the horizontal location for this item
					var availWidth =  windowW * (1.0 - marginSideFrac * 2.0);
					projX = (availWidth - projW) * gaussian(4);
					projX += windowW * marginSideFrac;
					// console.log(windowW, marginSideFrac, availWidth, projW, projX);


				}

				// Find the move amount based on the screen size
				moveAmt = moveAmtFraction * windowW;

				// Set the position
				// console.log(offsetTop);
				$( item ).css("top", offsetTopPx + moveAmt);
				$( item ).css("left", projX);

				// Fade in 
				$( item ).fadeIn({queue: false, duration: fadeMs}); 

				$( item ).animate({top: "-="+moveAmt}, moveMs, "easeOutCubic");

				// if (item.nodeName == "IMG") {
				// 	console.log(targetHeight);
				// 	offsetTop += targetHeight;
				// }	

				// item.style.display = "block";

				if (item.nodeName == "IMG") {
					offsetTopPx += projH;
					// console.log(offsetTopPx, projH, vertSpacingPx);
				} else {
					offsetTopPx += vertSpacingPx;
					// offsetTopPx
				}

			});

    		// delay the loading for consecutive images
    		var thisDelay = index * delayMs;
    		// if (index < 1) {
    		// 	thisDelay = 1500 + index * delayMs;
    		// } else {
    		// 	thisDelay = 10000 + index * delayMs;
    		// }
    		
			if (item.nodeName == "IMG") {
				setTimeout( function() {
				$( item ).attr( 'src', $( item ).attr( 'src-tmp' ) );
			}, thisDelay);

			} else {
			// 	setTimeout( function() {
			// 	$( item ).style.display = "block";
			// }, thisDelay);

				// offsetTopPx
			}

			// setTimeout( function() {
			// 	$( item ).attr( 'src', $( item ).attr( 'src-tmp' ) );
			// }, thisDelay);

    	});

    	// delay for a short while to load the next one


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