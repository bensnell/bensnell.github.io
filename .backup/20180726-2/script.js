// Ref: alignment: https://stackoverflow.com/questions/12744928/in-jquery-how-can-i-set-top-left-properties-of-an-element-with-position-values

// Specify information for the available images
imgFolder = "assets/home"
imgExt = "jpg"
nImages = 1
nDigits = 3

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
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

    // Create an IMG element for each image
    for (i = 0; i < nImages; i++) {
    	// Create the identifiers
    	padID = pad(nImages - i, 3);
	    imgID = "img" + padID;
	    imgPath = imgFolder + "/" + padID + "." + imgExt;
	    // Create the element
	    var thisImg = document.createElement("IMG");
	    thisImg.setAttribute("id", imgID);
	    thisImg.setAttribute("data-src", imgPath);
	    thisImg.setAttribute("class", "async");
	    // Add the element to the body
	    document.body.appendChild(thisImg);

	    // Also create the title
	}
 
});

$( window ).on( "load", function() {

	// All assets have loaded
    console.log( "window loaded" );

	// Now, set the jquery attributes to fade in on loading
	$( '.async' ).each( function(){

		// Fade durations
		var fadeMs = 740;
		var moveMs = 750;
		// Number of pixels of upward movement on loading
		var movePx = 120;
		
		// Set attributes
		$( this ).css("display", "none"); // styles
		$( this ).css("position", "absolute");
		
	    $( this ).attr( "width", 400);
        $( this ).attr( "height", 400);

		$( this ).css("top", 100 + movePx);
		$( this ).css("left", 100);

        // Once the image is done loading, fade it in

        $( this ).bind( 
        	"load", 
        	function () { 
        		$( this ).fadeIn({queue: false, duration: fadeMs}); 
        	});

        $( this ).bind( 
        	"load", 
        	function () { 
        		$( this ).animate({top: "-="+movePx}, moveMs, "easeOutCubic");
        	});

        // Load the images by setting "src" to "data-src"
        // $( this ).attr( 'src', $( this ).attr( 'data-src' ) );
        $( this ).attr( 'src', $( this ).attr( 'data-src' ) );
    } );
    
});

$( window ).on( "resize", function() {

    console.log( "window resized" );

    // resizeCanvas();

});