// Ref: alignment: https://stackoverflow.com/questions/12744928/in-jquery-how-can-i-set-top-left-properties-of-an-element-with-position-values

// fonts: Aver, Neris, Lato, 
// title serif: Andale, Baskerville, Batang*, Bell MT, Bookman Old Style, CAllisto MT, Cochin*, Consolas, Didot
// body serif: Cambria, Cochin*, Century, Garamond

var mainURL = "http://ben-snell.com";
var domainKey = "ben-snell";	// used to check if we're in my domain

// Stores all projects for home
var projects;
// Stores a dictionary of pageID's  and projectID's
var dict = {};
// Stores images for a project
var project = {};

// Stores the logo at the top of the page
var menu = {};
//				     ID 		TEXT 			URL_SUFFIX 		HEX_COLOR
var menuElems = [ 	["logo", 	"Ben Snell", 	"", 			"#000000"],
					["about", 	"\\ about", 	"about", 		"#999999"],
					["inquire", "\\ inquire", 	"inquire", 		"#999999"] ];

// Fonts we're using
var fontTitle = "Didot";
var fontBody = "Garamond";
// Fonts available
// 					NAME 			FILENAME
var fonts = [ 	[	"Cochin",		"cochin.ttc"	],
				[	"Batang",		"batang.ttf"	],
				[	"Consolas",		"consolas.ttf"	],
				[	"Didot",		"didot.ttc"		],
				[	"Baskerville", 	"baskerville.ttc"],
				[ 	"Garamond", 	"garamond.ttf"] ];

// window parameters
var w = new Params();


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

// Fadeout all async elements
function fadeOut() {
	var fadeOutMs = 200;
	$( ".asyncLoad" ).each( function(index, element) {
		// Fade them out
		$( element ).fadeOut( fadeOutMs );
		// Delete them after this much time
		setTimeout( function() { $( element ).remove(); }, fadeOutMs );
	});
}

function loadFonts() {	
	// should this include a deferred promise to ensure font is loaded? (what if the font isn't accessible?)
	$.each(fonts, function(index, element) {

		if (element[0] == fontTitle || element[0] == fontBody) {
			var font = new FontFace( element[0], "url(" + pathPrefix() + "/_fonts/" + element[1] + ")", {} );
			document.fonts.add( font );
			font.load();
		}
	}); 
	console.log("fonts loaded");
	return null;
}

// parse reference data to use later on
function parseHomeData(data) {

	if (!emptyDict(dict)) return;

	// Save projects
	projects = data["projects"];

	// Parse projects into an accessible dictionary
	$.each(projects, function(index, element) {
		dict[ getPage(element["url"]) ] = element["projectID"];
	});
}

// Prepare images and text to be displayed
function initMenuItems() {
	$.each(menuElems, function(index, element) {
		var para = getTextElement(	element[0],
									element[1],
									mainURL + (element[2]=="" ? "" : "/"+element[2]),
									fontTitle,
									element[3]);
		menu[ element[0] ] = para;
	});
	console.log("menu items init");
	return null;
}
function initHome() {

	var loadHomeItems = function(data) {
    	
    	// parse and store this data
    	parseHomeData(data);

    	// Iterate through all projects to create an image and text box for each one
    	$.each(projects, function(index, element) {

    		// Image
    		element["imgID"] = "img" + element["projectID"];
    		var imgPath = pathPrefix() + data["homeFolderName"] + "/" + element["projectID"] + "." + data["imgExt"];
    		element["img"] = getImageElement( element["imgID"], imgPath, element["url"] );

		    // Text
			element["txtID"] = "txt" + element["projectID"];
			element["txt"] = getTextElement( element["txtID"], element["title"], element["url"], fontBody, "#000000");

			console.log("project image and text added for: " + element["projectID"]);
    	});
	};

	// Parse the JSON with home's layout data
	var jsonPath = pathPrefix()+"_json/home.json";
	var def = $.Deferred();
    $.get(jsonPath, loadHomeItems).done( function() { def.resolve(); });
	console.log("home init");
	return def;
}
function initAbout() {

	console.log("about init");
	return null;
}
function initProject(pageID) {

	// Make sure the dictionary is loaded
	var loadDict = function(data) { parseHomeData(data); };
	var jsonPath = pathPrefix()+"_json/home.json";
	var dictLoaded = $.Deferred();
    $.get(jsonPath, loadDict).done( function() { dictLoaded.resolve(); });

    // When it's loaded, then get the projectID and load the json entry for that project
    var projectJsonLoaded = $.Deferred();
    $.when( dictLoaded ).done( function() {

    	console.log("dict has been loaded!!!!!");
    	var projectID = dict[pageID];
    	console.log(dict);
    	var projectJsonPath = pathPrefix() + "_json/" + projectID + ".json";
    	console.log(projectJsonPath);
    	
    	var loadProjectJson = function(data) { 

    		// store all image ids
    		project["imgIDs"] = data["images"].map(function(e) { return pad(e, data["numDigits"], "0"); });

    		// store all image paths
    		project["imgPaths"] = project["imgIDs"].map(function(e) { return pathPrefix()+"_assets/"+projectID+"/"+e+"."+data["globalExt"]; }); 

    		// store text
    		project["title"] = data["title"];
    		project["description"] = data["description"];
    		project["date"] = data["date"];

    		console.log(project);
    	};

    	// load the json
		$.get(projectJsonPath, loadProjectJson).done( function() { console.log("hereeee"); projectJsonLoaded.resolve(); });    	
	});

	// When the json entry is retrieved, initialize its entries
	// $.when( projectJsonLoaded ).done( function() {








	// });







	console.log("project init");
	return null;
}
function initPageSpecificItems(pageID) {
	if (pageID == "home") {
		return initHome();
	} else if (pageID == "about") {
		return initAbout();
	} else {
		return initProject(pageID);
	}
	// console.log("page specific items init");
	return null;
}
function init(pageID, promise) {
	var defs = [];
	// defs.push(loadFonts()); // should only happen once, not every time something is initialized
	defs.push(initMenuItems());
	defs.push(initPageSpecificItems(pageID));
	$.when(... defs).done( function() { console.log("promise"); promise.resolve(); });
	console.log("init complete");
}

// Display Images and Text
function showMenuItems() {

	// call this when the first image is shown
	var logo = menu["logo"];
	$( logo ).css("font-size", w.titleSizePx);
	$( logo ).css("letter-spacing", (w.titleLetterSpacing*w.titleSizePx) + "px"); // .1993
	$( logo ).css("line-height", w.titleLineHeight);
	$( logo ).css("top", -w.titleSizePx*(1-w.titleTopOffset)); // top
	// $( logo ).css("top", windowH/2 - $(logo).height()/2 * 4); // center
	$( logo ).css("left", w.windowL + w.windowW/2 - $( logo ).width()/2); // center
	// $( logo ).css("left", windowL + titleSizePx*titleLeftOffset);
	// $( logo ).css("left", windowL + marginSideFrac*windowW);
	$( logo ).css("z-index", w.bTitleAbove * 2 -1);
	// $( logo ).style.textAlign = "center";
	// $( logo ).css("text-align", "center");
	$( logo ).css("position", "absolute");
	// $( logo ).css("position", "fixed");
	$( logo ).fadeIn({queue: false, duration: w.fadeMs}); 

	var menuItems = ["about", "inquire"]
	var menuSizeFraction = 0.4;
	for (var i = 0; i < menuItems.length; i++) {
		var item = menu[menuItems[i]];
		// $( item ).css("text-align", "right");
		$( item ).css("font-size", w.titleSizePx * menuSizeFraction);
		// $( item ).css("bottom", -titleSizePx * 0.1);
		$( item ).css("top", $(menu["logo"]).offset().top + $(menu["logo"]).height() - w.titleSizePx*0.3 + $(item).height() * i); //-titleSizePx*(1-titleTopOffset)); //+ 10 + $( item ).height()*i
		var scrollBarWidth = 15;
		// $( item ).css("left", origWindowW - scrollBarWidth - $(item).width() - titleSizePx*titleLeftOffset/2);
		// $( item ).css("left", $( window ).width() * 0.7);
		$( item ).css("left", w.windowL + w.marginSideFrac*w.windowW);
		$( item ).css("z-index", w.bTitleAbove * 2 -1);
		// $( item ).css("position", "fixed");
		$( item ).css("position", "absolute");
		$( item ).css("line-height", w.titleLineHeight);
		$( item ).fadeIn({queue: false, duration: w.fadeMs}); 
	}

	console.log("menu items show");
};
function showHome() {

	// Create the foundation for an image layout
	console.log(w.marginSideFrac, w.marginBetweenFrac, w.windowW, (1 - (w.marginSideFrac*2+w.marginBetweenFrac)) * w.windowW / 2.0);
	var layout = new ColumnLayout(2, (1 - (w.marginSideFrac*2+w.marginBetweenFrac)) * w.windowW / 2.0, w.marginBetweenPx, 1);

	// For each project ...
	var prevDoneAnimating = null;
	var prevDoneLayout = null;
    $.each(projects, function(index, element) {

    	console.log("project loading: " + element["projectID"]);

    	// Make promises 
    	var thisDoneLoading = $.Deferred();
    	$( element["img"] ).on( "load", function () { thisDoneLoading.resolve(); });

    	var thisDoneLayout = $.Deferred();
		var layoutImage = function() {

			console.log("laying out: " + element["projectID"]);

			var origRect = layout.getImagePosition($( element["img"] ).width(), $( element["img"] ).height());
			var thisRect = origRect.getCopy();
			// transform this rectangle into the screen's coordinate system
			thisRect.transform(w.windowL + w.marginSidePx, w.marginTopPx);

			// Set the image attributes
			$( element["img"] ).attr("width", thisRect.w);
			$( element["img"] ).attr("height", thisRect.h);				
			$( element["img"] ).css("top", thisRect.y + w.moveAmtPx);
			$( element["img"] ).css("left", thisRect.x); 
			$( element["img"] ).css("z-index", 0);

			// Set the text attributes
			$( element["txt"] ).css("font-size", w.fontSizePx);
			$( element["txt"] ).css("top", thisRect.b() - w.fontSizePx*0.5);
			$( element["txt"] ).css("left", thisRect.x);
			$( element["txt"] ).css("letter-spacing", (w.titleLetterSpacing/2*w.fontSizePx) + "px"); // .1993
			$( element["txt"] ).css("z-index", 0);

			// On hovering over the image, show the text below it
			// (this has been extensively tested -- this works really well!)
			$( element["img"] ).mouseenter( function() {
				if (element["timeout"]) {
		    		for (var i = 0; i < element["timeout"].length; i++) clearTimeout(element["timeout"][i]);
		    		element["timeout"] = [];
		    	} else element["timeout"] = [];
				$( element["txt"] ).stop(true, false).fadeIn({queue: false, duration: w.fadeMs*0.8});
		    });
		    $( element["img"] ).mouseleave( function() {
		    	if (element["timeout"]) {
		    		for (var i = 0; i < element["timeout"].length; i++) clearTimeout(element["timeout"][i]);
		    		element["timeout"] = [];
		    	} else element["timeout"] = [];
		    	var to = setTimeout( function() {
		    		$( element["txt"] ).stop(true, false).fadeOut({queue: false, duration: w.fadeMs});
				}, 2500);
				element["timeout"].push(to);
		    });

		    // flag layout as complete
		    thisDoneLayout.resolve(); 
		};

		var thisDoneAnimating = $.Deferred();
		var animateImage = function() {

			$( element["img"] ).fadeIn({queue: false, duration: w.fadeMs}); 
			$( element["img"] ).animate({top: "-="+w.moveAmtPx}, w.moveMs, "easeOutCubic");

			// $( element["txt"] ).fadeIn({queue: false, duration: fadeMs}); 
			// $( element["txt"] ).animate({top: "-="+moveAmtPx}, moveMs, "easeOutCubic");

			// Load logo text
			if (index == 0) {
				showMenuItems();
			}

			thisDoneAnimating.resolve(); 
		};

		// When this image is done loading and the previous image is done laying out, lay this out
		$.when( thisDoneLoading, prevDoneLayout ).done( layoutImage ).promise();

		// When this image is done laying out, animate it after a brief pause
		$.when( thisDoneLayout ).done( function() { setTimeout( animateImage, w.delayDisplayMs ); }).promise();

		// Stagger image loading so everything loads faster
		var startLoading = function() { $( element["img"] ).attr( 'src', $( element["img"] ).attr( 'src-tmp' ) ); };
    	setTimeout( startLoading, index * w.delayLoadingMs);

    	// Save these promises
	    prevDoneLayout = thisDoneLayout;
	    prevDoneAnimating = thisDoneAnimating;
    });

	console.log("home show");
};
function showAbout() {

	console.log("about show");
};
function showProject() {

	console.log("project show");
};
function showAllItems(pageID) {
	if (pageID == "home") {
		showHome();
	} else if (pageID == "about") {
		showAbout();
	} else {
		showProject();
	}
	console.log("all items show");
};
function show(pageID) {

	// recompute all parameters
	w.recompute();
	console.log(w.windowW, w.windowL);

	// show all items
	showAllItems(pageID);

	console.log("show complete");
};

// load a specific page within this domain (no fadeout!)
function loadPage(pageID="") {

	// Get the pageID if not specified
	if (pageID=="") pageID = getThisPage();
	console.log("this pageID is: " + pageID);

	// First, initialize all elements
	var initDone = $.Deferred();
	init(pageID, initDone);

	// When all items have been initialized, show all items
	$.when( initDone ).done( function(){console.log("initDone is complete"); return show(pageID);} ).promise();

	console.log("Loading page " + pageID);
}

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

var windowReady = $.Deferred();
$( document ).ready(function() { console.log("window ready"); windowReady.resolve(); });

var windowLoaded = $.Deferred();
$( window ).on("load", function() { windowLoaded.resolve(); console.log("window loaded"); });

// When the window is ready, initialize fonts and load the page
$.when( windowReady, windowLoaded ).done( loadFonts, loadPage ).promise();

// load new page if the forward or back button is pressed
$( window ).on('popstate', function() {
	// Get the current url
	var url = window.location.href;
	// Parse the specific page
	var pageID = getPage(url);
	console.log("History changed to " + pageID);
	// todo: Check if this page exists
	// Fadeout and delete all elements
	fadeOut();
	// Load this page
	loadPage(pageID);
});





// $( window ).scroll( function() {

// 	// var hiddenFrac = 0.05;

// 	// var hiddenPx = hiddenFrac * w.windowW;
//     // if ( $(window).scrollTop() > hiddenPx/4 && $( menu["logo"] ).is(":visible") && !$(menu["logo"]).is(':animated') ) {
//     //     // Fade out
//     //     $( menu["logo"] ).fadeOut({queue: false, duration: 300}); 
//     // }
//     // if ( $(window).scrollTop() <= hiddenPx && $( menu["logo"] ).is(":hidden") && !$(menu["logo"]).is(':animated') ) {
//     //     // Fade in
//     //     $( menu["logo"] ).fadeIn({queue: false, duration: 800}); 
//     // }
// });

// $( window ).on( "resize", function() {

//     console.log( "window resized" );

//     // resizeCanvas();

// });