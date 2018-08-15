// Ref: alignment: https://stackoverflow.com/questions/12744928/in-jquery-how-can-i-set-top-left-properties-of-an-element-with-position-values

// fonts: Aver, Neris, Lato, 
// title serif: Andale, Baskerville, Batang*, Bell MT, Bookman Old Style, CAllisto MT, Cochin*, Consolas, Didot
// body serif: Cambria, Cochin*, Century, Garamond

var mainURL = "http://ben-snell.com";
var domainKey = "ben-snell";	// used to check if we're in my domain

// Stores all projects
var projects;
// Stores the logo at the top of the page
var menu = {};

var fontTitle = "Didot";
var fontBody = "Garamond";

// Get the specific page given a url (doesn't check if in domain)
function getPage(url) {
	var tmpUrl = strip(url, "/");
	var elems = tmpUrl.split("/");
	var pageID = "home";
	if (elems.length != 0) {
		var page = elems[elems.length-1];
		pageID = (page.includes(domainKey) || page.includes("localhost")) ? "home" : page;
	}
	return pageID;
}

function getThisPage() {
	return getPage(window.location.href);
}

// Get the prefix for any path in the relative directory
function pathPrefix() {
	return getThisPage()=="home" ? "" : "../";
}

// load a specific page within this domain (no fadeout!)
function loadPage(pageID) {

	console.log("Loading page " + pageID);

}

// Fadeout all async elements
function fadeOut() {
	// For all async elements
	$( ".asyncLoad" ).each( function(index, element) {
		// Fade them out
		$( element ).fadeOut(200);
		// Delete them after this much time
		setTimeout( function() { $( element ).remove(); }, 200);
	});
}

// load new page if the forward or back button is pressed
$( window ).on('popstate', function() {

	// Get the current url
	var url = window.location.href;
	// Parse the specific page
	var pageID = getPage(url);
	console.log("History changed to " + pageID);
	// todo: Check if this page exists
	// Fadeout
	fadeOut();
	// Load this page
	loadPage(pageID);
});

function loadURL(toUrl) {

	// Check if new page is within this domain
	if (toUrl.includes(domainKey)) {
		// Get the page ID
		var pageID = getPage(toUrl);
		// Change the state of the page
		console.log("From " + getThisPage() + " --> " + pageID);
		if (getThisPage() == "home") {
			if (pageID == "home") return;
			else history.pushState( {}, "", pageID );
		} else {
			if (pageID == "home") history.pushState( {}, "", "../");
			else history.pushState( {}, "", "../"+pageID);
		}
		console.log("Page changed to " + pageID);
		// Fade out
		fadeOut();
		// Load this page 
		loadPage(pageID);

	} else {
		// fade out
		fadeOut();
		// load an external url
		window.location.href = toUrl;		
	}
}

// function resizeCanvas() {
//     console.log("Canvas resized");
// }

// Document is ready but not yet loaded
$( document ).ready(function() {

	// Document Object Model (DOM) is now ready
	console.log( "window ready" );

	// Load fonts we're using
	// 					NAME 			FILENAME
	var fonts = [ 	[	"Cochin",		"cochin.ttc"	],
					[	"Batang",		"batang.ttf"	],
					[	"Consolas",		"consolas.ttf"	],
					[	"Didot",		"didot.ttc"		],
					[	"Baskerville", 	"baskerville.ttc"],
					[ 	"Garamond", 	"garamond.ttf"] ];
	$.each(fonts, function(index, element) {
		if (element[0] == fontTitle || element[0] == fontBody) {
			var font = new FontFace( element[0], "url(" + pathPrefix() + "/_fonts/" + element[1] + ")", {} );
			document.fonts.add( font );
			font.load();
		}
	});

	// ========== COMMON SITE ELEMENTS ===========

	//				     ID 		TEXT 			URL_SUFFIX 		HEX_COLOR
	var menuElems = [ 	["logo", 	"Ben Snell", 	"", 			"#000000"],
						["about", 	"\\ about", 	"about", 		"#999999"],
						["inquire", "\\ inquire", 	"inquire", 		"#999999"] ];
	$.each(menuElems, function(index, element) {
		var para = getTextElement(	element[0],
									element[1],
									mainURL + (element[2]=="" ? "" : "/"+element[2]),
									fontTitle,
									element[3]);
		menu[ element[0] ] = para;
	});

	// Change the height of the canvas to fit all elements
	// that need to be loaded
    // resizeCanvas();

    // ========== PAGE-SPECIFIC ELEMENTS ===========

    // Parse the JSON with home's layout data
    $.get(pathPrefix()+"_json/home.json", function(data) {
    	// Store the json data for later use
    	projects = data["projects"];

    	// Iterate through all projects to create an image and text box for each one
    	$.each(projects, function(index, element) {

			// Assign an image ID
			var imgID = "img" + element["projectID"];
			element["imgID"] = imgID;
			// get the image path
			var imgPath = pathPrefix() + data["homeFolderName"] + "/" + element["projectID"] + "." + data["imgExt"];
			// create the element
			var img = document.createElement("IMG");
		    img.setAttribute("id", imgID);
		    img.setAttribute("src-tmp", imgPath);
		    img.setAttribute("class", "asyncLoad");
		    // Wrap the image in a link
			// $(img).wrap($('<a>',{ href: element["url"] }));
			$(img).click(function() { loadURL(element["url"]); });
			$(img).hover(function() { $(img).css('cursor','pointer'); });
			// Style
			$( img ).css("display", "none"); // styles
			$( img ).css("position", "absolute");
		    // Add the element to the body
		    document.body.appendChild(img);
		    // add the element to the object
		    element["img"] = img;



		    // Text
			element["txtID"] = "txt" + element["projectID"];
			element["txt"] = getTextElement( element["txtID"], element["title"], element["url"], fontBody, "#000000");
    	});
	});

});



var windowW = $( window ).width();

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


	var layout = new ColumnLayout(2, (1 - (marginSideFrac*2+marginBetweenFrac)) * windowW / 2.0, marginBetweenPx, 1);

	// For each project ...
    $.each(projects, function(index, element) {

    	// As soon as the image is loaded, fade it and its text in
    	$( element["img"] ).on(
    		"load",
    		function () {

				var origRect = layout.getImagePosition($( element["img"] ).width(), $( element["img"] ).height());
				var thisRect = origRect.getCopy();
				// transform this rectangle into the screen's coordinate system
				thisRect.transform(windowL + marginSidePx, marginTopPx);

				// Set the image attributes
				$( element["img"] ).attr("width", thisRect.w);
				$( element["img"] ).attr("height", thisRect.h);				
				$( element["img"] ).css("top", thisRect.y + moveAmtPx);
				$( element["img"] ).css("left", thisRect.x); 
				$( element["img"] ).css("z-index", 0);

				// Set the text attributes
				$( element["txt"] ).css("font-size", fontSizePx);
				$( element["txt"] ).css("top", thisRect.b() - fontSizePx*0.5);
				$( element["txt"] ).css("left", thisRect.x);
				$( element["txt"] ).css("letter-spacing", (titleLetterSpacing/2*fontSizePx) + "px"); // .1993
				$( element["txt"] ).css("z-index", 0);

				// On hovering over the image, show the text below it
				// (this has been extensively tested -- this works really well!)
				$( element["img"] ).mouseenter( function() {
					if (element["timeout"]) {
			    		for (var i = 0; i < element["timeout"].length; i++) clearTimeout(element["timeout"][i]);
			    		element["timeout"] = [];
			    	} else element["timeout"] = [];
					$( element["txt"] ).stop(true, false).fadeIn({queue: false, duration: fadeMs*0.8});
			    });
			    $( element["img"] ).mouseleave( function() {
			    	if (element["timeout"]) {
			    		for (var i = 0; i < element["timeout"].length; i++) clearTimeout(element["timeout"][i]);
			    		element["timeout"] = [];
			    	} else element["timeout"] = [];
			    	var to = setTimeout( function() {
			    		$( element["txt"] ).stop(true, false).fadeOut({queue: false, duration: fadeMs});
					}, 2500);
					element["timeout"].push(to);
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
    			if (index == 0) {
    				var menuItems = ["about", "inquire"]
    				var menuSizeFraction = 0.4;
    				for (var i = 0; i < menuItems.length; i++) {
    					var item = menu[menuItems[i]];
	    				// $( item ).css("text-align", "right");
	    				$( item ).css("font-size", titleSizePx * menuSizeFraction);
	    				// $( item ).css("bottom", -titleSizePx * 0.1);
	    				console.log();
	    				$( item ).css("top", $(menu["logo"]).offset().top + $(menu["logo"]).height() - titleSizePx*0.3 + $(item).height() * i); //-titleSizePx*(1-titleTopOffset)); //+ 10 + $( item ).height()*i
	    				var scrollBarWidth = 15;
	    				// $( item ).css("left", origWindowW - scrollBarWidth - $(item).width() - titleSizePx*titleLeftOffset/2);
	    				// $( item ).css("left", $( window ).width() * 0.7);
	    				$( item ).css("left", windowL + marginSideFrac*windowW);
	    				$( item ).css("z-index", bTitleAbove * 2 -1);
	    				// $( item ).css("position", "fixed");
	    				$( item ).css("position", "absolute");
	    				$( item ).css("line-height", titleLineHeight);
	    				$( item ).fadeIn({queue: false, duration: fadeMs}); 
    				}
    			}

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