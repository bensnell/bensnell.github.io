function resizeCanvas() {

	var canvas = document.getElementById('canvas');
    canvas.style.height = window.innerWidth*3;

    console.log("Canvas resized");
}

// Document is ready but not yet loaded
$( document ).ready(function() {

	// Document Object Model (DOM) is now ready
	console.log( "window ready" );

	// Change the height of the canvas to fit all elements
	// that need to be loaded
    resizeCanvas();
 
});


$( window ).on( "load", function() {

	// All assets have loaded (?)
    console.log( "window loaded" );

    // For all objects with class "async"...
    $( '.async' ).each( function(){
        // Hide the images before they load
        // var w = $( this ).attr( "width" )
        // var h = $( this ).attr( "height" )
        $( this ).attr( "width", 400);
        $( this ).attr( "height", 400);
        $( this ).attr( "left", 40);
        // $( this ).css({left:10,top:10})
        $( this ).hide();
        // Once the image is done loading, fade it in
        $( this ).bind( 
        	"load", 
        	function () { 
        		$( this ).fadeIn( 750 ); 


        	});

        // Load the images by setting "src" to "data-src"
        $( this ).attr( 'src', $( this ).attr( 'data-src' ) );
    } );

    // var c=document.getElementById("canvas");
    // var ctx=c.getContext("2d");
    // var img=document.getElementById("scream");
    // ctx.drawImage(img, 10, 10);

    
});

$( window ).on( "resize", function() {

    console.log( "window resized" );

    resizeCanvas();

});


// // On refreshing, perform the following changes to the document
// window.onload = window.onresize = function() {

// 	// Change the height of the canvas to fit all elements
// 	// that need to be loaded
//     var canvas = document.getElementById('canvas');
//     canvas.style.height = window.innerWidth*3;


// 	// $( "a" ).fadeIn( 500 );

// 	// Draw an image
// 	// canvas.drawImage("assets/000.jpg")






// }