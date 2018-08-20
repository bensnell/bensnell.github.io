// TODO
// DONE - remove extra footer space on home when loaded from loadURL

// DONE - add functionality to flip through image sets
// optional: show same images on back button, add custom cursor, fade-in arrows to suggest slideshow
// DONE - add captions to project images

// - layout about, inquire
// - add about blurb on home
// - create about page
// - create inquire page or link

// - fix font sizes on mobile, tablet
// - fix layout on tablet for project
// - fix layout on mobile for project, home
// - make all text black on mobile

// - extend clickable project icon across image and text (close the gap between them)

// - on resizeCanvas, change the layout

// - add instagram button

// - keep images in memory to load previously visited paged faster
// - OR, on back button, load images closest to window viewport first

// - access archive by scrolling down to bottom, then up to top, then back down to bottom

// Photos:
// - burn edges

// ==============================================


// Ref: alignment: https://stackoverflow.com/questions/12744928/in-jquery-how-can-i-set-top-left-properties-of-an-element-with-position-values

// fonts: Aver, Neris, Lato, 
// title serif: Andale, Baskerville, Batang*, Bell MT, Bookman Old Style, CAllisto MT, Cochin*, Consolas, Didot
// body serif: Cambria, Cochin*, Century, Garamond

var mainURL = "http://bensnell.io";
var domainKey = "bensnell";	// used to check if we're in my domain

// window parameters
var w = new Params();

// Stores all projects for home
var projects;
// Dict of pageID : { projectID : #, scrollTop : #, pageHeight : # }
var dict = {};
// Stores images for a project
var project = {};
// NOTE: jsons CANNOT have commas at the end of their last element (otherwise they will not be parsed)
// arrows for animating image sets
// var arrows = {};

// Stores the logo at the top of the page
var menu = {};
var bKeepMenu = true;
//				     ID 		TEXT 			URL_SUFFIX 		HEX_COLOR
var menuElems = [ 	["logo", 	"Ben Snell", 	"", 			w.dark],
					["about", 	"\\ about", 	"about", 		w.medium],
					["inquire", "\\ inquire", 	"inquire", 		w.medium] ];

// Fonts we're using
// var fonts["title"] = "Didot";
var fonts = {	"title": "Didot",
				"body": "Garamond",
				"menu" : "Didot_i" };
// Fonts available
// 					NAME 			FILENAME
var fontLib = [ [	"Cochin",		"cochin.ttc"	],
				[	"Batang",		"batang.ttf"	],
				[	"Consolas",		"consolas.ttf"	],
				[	"Didot",		"didot.ttc"		],
				[	"Baskerville", 	"baskerville.ttc"],
				[ 	"Garamond", 	"garamond.ttf"],
				[ 	"Playfair_r",	"playfair/PlayfairDisplay-Regular.ttf"],
				[ 	"Playfair_ri",	"playfair/PlayfairDisplay-Italic.ttf"],
				[ 	"Playfair_b",	"playfair/PlayfairDisplay-Bold.ttf"],
				[ 	"Playfair_bi",	"playfair/PlayfairDisplay-BoldItalic.ttf"],
				[ 	"Playfair_k",	"playfair/PlayfairDisplay-Black.ttf"],
				[ 	"Playfair_ki",	"playfair/PlayfairDisplay-BlackItalic.ttf"],
				[	"Didot_i",		"didot_italic.ttf"] 
				];

				


stopScrollRestoration();

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

	var elems = bKeepMenu ? $( ".async" ) : $( ".async, .menu" );

	elems.each( function(index, element) {
		// Fade them out
		$( element ).fadeOut( fadeOutMs );
		// Delete them after this much time
		setTimeout( function() { $( element ).remove(); }, fadeOutMs );
	});
	var fadeOutDone = $.Deferred();
	setTimeout( function() { fadeOutDone.resolve(); }, fadeOutMs );
	return fadeOutDone;
}

function loadFonts() {	
	// should this include a deferred promise to ensure font is loaded? (what if the font isn't accessible?)
	var usedFonts = getDictValues(fonts);
	$.each(fontLib, function(index, element) {

		if (usedFonts.includes(element[0])) {
			var font = new FontFace( element[0], "url(" + pathPrefix() + "/_fonts/" + element[1] + ")", {} );
			document.fonts.add( font );
			font.load();
		}
	}); 
	return null;
}

// parse reference data to use later on
function parseHomeData(data) {

	if (!emptyDict(dict)) return;

	// Save projects
	projects = data["projects"];

	// Parse projects into an accessible dictionary
	$.each(projects, function(index, element) {
		dict[ getPage(element["url"]) ] = { "projectID" : element["projectID"] }
	});
	// also add home and menu items (minus logo)
	$.each( menuElems, function(index, element) {
		dict[ element[0]=="logo" ? "home" : element[0] ] = {};
	});

	// Set all scroll positions initially to 0
	$.each( dict, function(index, element) {
		element["scrollTop"] = 0;
	});
}


// Prepare images and text to be displayed
// function initArrows() {

// 	arrows.push( { "left" : getImageElement("left", pathPrefix()+"_assets/misc/arrow_left.png", "", ["async"], false) });
// 	arrows.push( { "right" : getImageElement("right", pathPrefix()+"_assets/misc/arrow_right.png", "", ["async"], false) });
// }
function initMenuItems() {

	$.each(menuElems, function(index, element) {

		// if (!elementExists(element[0])) {
		if (!bKeepMenu || !elementExists(element[0])) {
			var para = getTextElement(	element[0],
										element[1],
										mainURL + (element[2]=="" ? "" : "/"+element[2]),
										element[0]=="logo" ? fonts["title"] : fonts["menu"],
										element[3],
										["menu"]);
			menu[ element[0] ] = para;
		}
	});
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
    		element["img"] = getImageElement( element["imgID"], imgPath, element["url"], ["async"]);

		    // Text
			element["txtID"] = "txt" + element["projectID"];
			element["txt"] = getTextElement( element["txtID"], element["title"], element["url"], fonts["body"], w.light, ["async"]);
    	});
	};

	// Parse the JSON with home's layout data
	var jsonPath = pathPrefix()+"_json/home.json";
	var def = $.Deferred();
    $.get(jsonPath, loadHomeItems).done( function() { def.resolve(); });
	return def;
}
function initAbout() {

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

    	console.log(dict);
    	var projectID = dict[pageID]["projectID"];
    	var projectJsonPath = pathPrefix() + "_json/" + projectID + ".json";
    	var loadProjectJson = function(data) { 

    		// store all image ids
    		project["images"] = data["images"].map(function(e) { 
    			if (isArray(e)) return e.map(function(e) { return pad(e, data["numDigits"], "0"); });
    			else { return pad(e, data["numDigits"], "0"); }
    		});

    		// store all image paths
    		project["images"] = project["images"].map(function(e) { 
    			if (isArray(e)) return e.map(function(e) { return {"id" : e, "path" : (pathPrefix()+"_assets/"+projectID+"/"+e+"."+data["globalExt"])}; });
    			else return {"id" : e, "path" : (pathPrefix()+"_assets/"+projectID+"/"+e+"."+data["globalExt"])}; 
    		}); 

    		// store text
    		project["text"] = [ {"id" : "title", "content" : data["title"]}, 
					    		{"id" : "dimensions", "content" : data["dimensions"]},
					    		{"id" : "material", "content" : data["material"]},
					    		{"id" : "date", "content" : data["date"]},
    							{"id" : "description", "content" : data["description"]}
    							];

    		// store the captions
			project["captions"] = {};
    		if (data["captions"]) project["captions"] = data["captions"];
    	};

    	// load the json
		$.get(projectJsonPath, loadProjectJson).done( function() { projectJsonLoaded.resolve(); });    	
	});

	// When the json entry is retrieved, initialize its entries
	var elementsLoaded = $.Deferred();
	$.when( projectJsonLoaded ).done( function() {

		// create project description
		$.each(project["text"], function(index, element) {
			element["txt"] = getTextElement(element["id"], element["content"], "", fonts["body"], "#000000", ["async"]);
		});

		// create images
		$.each(project["images"], function(index, element) {
			if (isArray(element)) {
				$.each(element, function(i, e) {
					e["img"] = getImageElement(e["id"], e["path"], "", ["async"], false);
				});
			} else {
				element["img"] = getImageElement(element["id"], element["path"], "", ["async"], false);
			}
		});

		// create captions where available and associate with their images
		$.each( project["images"], function(index, element) {
			var tmp = isArray(element) ? element : [element];
			$.each( tmp, function(i, e) {
				var captionKey = parseInt(e["id"]).toString();
				if (project["captions"][captionKey]) e["caption"] = getTextElement(e["id"]+"_caption", project["captions"][captionKey], "", fonts["body"], w.medium, ["async"]);
			});
		});

		elementsLoaded.resolve();
	});

	return elementsLoaded;
}
function initPageSpecificItems(pageID) {
	if (pageID == "home") {
		return initHome();
	} else if (pageID == "about") {
		return initAbout();
	} else {
		return initProject(pageID);
	}
	return null;
}
function init(pageID, promise) {
	var defs = [];
	// defs.push(loadFonts()); // should only happen once, not every time something is initialized
	defs.push(initMenuItems());
	defs.push(initPageSpecificItems(pageID));
	$.when(... defs).done( function() { promise.resolve(); });
}

// Scrolling and Height Utilities
function saveThisScrollTop() {

	dict[ getThisPage() ]["scrollTop"] = $( window ).scrollTop();
}
function saveThisPageHeight() {

	dict[ getThisPage() ]["pageHeight"] = $( document.body ).height();
}
function setPageHeight(height) {

	$( document.body ).css("height", height);

	// Then save the page height
	saveThisPageHeight();
}
function setFooterHeight(height) {

	setPageHeight( getElemsHeight() + height );
}
function setScrollTop(scrollTop) {

	$( window ).scrollTop(scrollTop);
}
function previouslyVisited(pageID="") {

	return dict[ (pageID=="" ? getThisPage() : pageID) ]["pageHeight"] != undefined; // should also be scrollTop?
}
function anticipatePageHeightAndScroll() {

	// If we've loaded this page before, set the page height
	if ( dict[ getThisPage() ]["pageHeight"] != undefined ) {
		setPageHeight( dict[ getThisPage() ]["pageHeight"] );
		// setFooterHeight( w.f2p(w.footerFrac) );
	}

	// scroll to the correct location
	if ( dict[ getThisPage() ]["scrollTop"] != undefined ) {
		setScrollTop(dict[ getThisPage() ]["scrollTop"]);
	}
}
function markPageUnvisited(pageID) {

	dict[pageID]["scrollTop"] = 0;
	dict[pageID]["pageHeight"] = undefined;
}

// Display Images and Text
function showMenuItems() {

	// If we're keeping the menu, don't change it
	if (bKeepMenu && $( "#"+menuElems[0][0] ).is(":visible")) return;

	// call this when the first image is shown
	var logo = menu["logo"];
	$( logo ).css("font-size", w.titleSizePx);
	$( logo ).css("letter-spacing", (w.titleLetterSpacing*w.titleSizePx) + "px"); // .1993
	$( logo ).css("line-height", w.titleLineHeight);
	// $( logo ).css("top", -w.titleSizePx*(1-w.titleTopOffset)); // top
	$( logo ).css("top", w.titleSizePx*w.titleTopOffset); // top
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
	for (var i = 0; i < menuItems.length; i++) {
		var item = menu[menuItems[i]];
		// $( item ).css("text-align", "right");
		$( item ).css("font-size", w.titleSizePx * w.menuSizeFrac);
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
}
function showHome() {

	anticipatePageHeightAndScroll();

	// Create the foundation for an image layout
	var colWidth = (1 - (w.marginSideFrac*2+w.marginBetweenFrac)) * w.windowW / 2.0;
	var layout = new ColumnLayout(2, colWidth, w.marginBetweenPx, 1);

	// For each project ...
	var prevDoneAnimating = null;
	var prevDoneLayout = null;
    $.each(projects, function(index, element) {

    	// Make promises 
    	var thisDoneLoading = $.Deferred();
    	$( element["img"] ).on( "load", function () { thisDoneLoading.resolve(); });

    	var thisDoneLayout = $.Deferred();
    	var moveAmtPx = previouslyVisited() ? 0 : w.moveAmtPx;
    	var delayFrac = previouslyVisited() ? 0.7 : 1.0;
		var layoutImage = function() {

			var origRect = layout.getImagePosition($( element["img"] ).width(), $( element["img"] ).height());
			var thisRect = origRect.getCopy();
			// transform this rectangle into the screen's coordinate system
			thisRect.transform(w.windowL + w.marginSidePx, w.marginTopPx);

			// Set the image attributes
			$( element["img"] ).attr("width", thisRect.w);
			$( element["img"] ).attr("height", thisRect.h);				
			$( element["img"] ).css("top", thisRect.y + moveAmtPx);
			$( element["img"] ).css("left", thisRect.x); 
			$( element["img"] ).css("z-index", 0);

			// Set the text attributes
			$( element["txt"] ).css("font-size", w.fontSizePx);
			$( element["txt"] ).css("letter-spacing", (w.titleLetterSpacing/2*w.fontSizePx) + "px"); // .1993
			$( element["txt"] ).css("z-index", 0);
			// set position
			setTxtPosDim( 
				$( element["txt"] ), 
				thisRect.x, 
				thisRect.b() + w.fontSizePx*0.55 + moveAmtPx, 
				colWidth);

			// On hovering over the image, show the text below it
			// (this has been extensively tested -- this works really well!)
			var hoverQueueName = "hover";
			var sensorIDs = "#" + element["img"]["id"] + ", " + "#" + element["txt"]["id"];
			var timeoutMs = 0; // 2500
			var fadeFrac = 0.5;
			$( sensorIDs ).mouseenter( function() {
				if (element["timeout"]) {
		    		for (var i = 0; i < element["timeout"].length; i++) clearTimeout(element["timeout"][i]);
		    		element["timeout"] = [];
		    	} else element["timeout"] = [];
				$( element["txt"] ).stop(hoverQueueName, true, false).animate({color: w.dark}, {queue: hoverQueueName, duration: w.fadeMs*fadeFrac}).dequeue(hoverQueueName);
		    });
		    $( sensorIDs ).mouseleave( function() {
		    	if (element["timeout"]) {
		    		for (var i = 0; i < element["timeout"].length; i++) clearTimeout(element["timeout"][i]);
		    		element["timeout"] = [];
		    	} else element["timeout"] = [];
		    	var to = setTimeout( function() {
		    		$( element["txt"] ).stop(hoverQueueName, true, false).animate({color: w.light}, {queue: hoverQueueName, duration: w.fadeMs*fadeFrac}).dequeue(hoverQueueName);
				}, timeoutMs);
				element["timeout"].push(to);
		    });

		    // flag layout as complete
		    thisDoneLayout.resolve(); 
		};

		var thisDoneAnimating = $.Deferred();
		var animateImage = function() {

			// at the end of fading in, save the page height
			$( element["img"] ).fadeIn({queue: false, duration: w.fadeMs});
			$( element["img"] ).animate({top: "-="+moveAmtPx}, {duration: w.moveMs, easing: "easeOutCubic"});

			// $( element["txt"] ).css("opacity", 0.5);
			$( element["txt"] ).fadeIn({queue: false, duration: w.fadeMs}); 
			// $( element["txt"] ).animate({opacity: 0.5}, {queue: false, duration: w.fadeMs});
			$( element["txt"] ).animate({top: "-="+moveAmtPx}, {duration: w.moveMs, easing: "easeOutCubic"});

			// Load logo text
			if (index == 0) {
				showMenuItems();
			}

			setTimeout( function() { thisDoneAnimating.resolve(); }, Math.max(w.moveMs, w.fadeMs));
		};

		// When this image is done loading and the previous image is done laying out, lay this out
		$.when( thisDoneLoading, prevDoneLayout ).done( layoutImage ).promise();

		// When this image is done laying out, animate it after a brief pause
		$.when( thisDoneLayout ).done( function() { setTimeout( animateImage, w.delayDisplayMs*delayFrac ); }).promise();

		// When the final image is done animating, set the height of the body a little bit higher
		if (index == projects.length-1) {
			$.when( thisDoneAnimating ).done( function() { return setFooterHeight( w.f2p(w.footerFrac) ); }).promise();
		}

		// Stagger image loading so everything loads faster
		var startLoading = function() { $( element["img"] ).attr( 'src', $( element["img"] ).attr( 'src-tmp' ) ); };
    	setTimeout( startLoading, index * w.delayLoadingMs * delayFrac);

    	// Save these promises
	    prevDoneLayout = thisDoneLayout;
	    prevDoneAnimating = thisDoneAnimating;
    });
}
function showAbout() {
}
function showProject() {

	anticipatePageHeightAndScroll();

	// Choose whether to load the next image set once the entire previous 
	// image set is loaded, or only once the first image in the previous 
	// image set has loaded
	// var bWaitForEntireSet = true;

	var bAnimate = false;
	var moveFrac = 0.6; // compared to home
	var delayFrac = 0.7;
	var delayTextMs = 120;


	// Determine how wide to make the images and how wide to make the text
	var img2textWidthFrac = 0.6;
	var marginFrac = 0.025;
	var imgVertMarginFrac = 0.025;
	
	var imgWidthFrac = (1-(w.marginSideFrac*2+marginFrac)) * img2textWidthFrac;
	var textWidthFrac = (1-(w.marginSideFrac*2+marginFrac)) * (1-img2textWidthFrac);
	var imgWidthPx = w.f2p( imgWidthFrac );
	var textWidthPx = w.f2p( textWidthFrac );
	var marginPx = w.f2p( marginFrac );
	var imgVertMarginPx = w.f2p( imgVertMarginFrac );
	var delayLoadingMs = w.delayLoadingMs * delayFrac;
	var delayDisplayMs = w.delayDisplayMs * delayFrac;

	// Draw all images and load text with the first image set
	var prevDoneAnimating = null;
	var prevDoneLayout = null;
	var topOffsets = [0]; // offsets (not including the top margin) for each image set
	// var topOffset = 0; // doesn't include top margin
	$.each(project["images"], function(index, _element) {

		var element = isArray(_element) ? _element : [_element];

		// Loading promises
		var thisDoneLoading = [];
		$.each(element, function(i, e) {
			var def = $.Deferred(); thisDoneLoading.push(def);
			$( e["img"] ).on("load", function() { def.resolve(); });
		});
		
		// Layout promises
		var thisDoneLayout = $.Deferred();
		$.each(element, function(i, e) {

			var layoutImage = function() {

				// Set the x, y, w, h
				var ix = w.windowL + w.marginSidePx;
				var iy = topOffsets[index] + w.marginTopPx + (bAnimate ? w.moveAmtPx : 0);
				var iw = imgWidthPx;
				var ih = $(e["img"]).height() / $(e["img"]).width() * iw;

				$( e["img"] ).css("left", ix); 
				$( e["img"] ).css("top", iy);
				$( e["img"] ).attr("width", iw);
				$( e["img"] ).attr("height", ih);

				// Lastly, set the priority of sets overlapping (higher numbers = further above)
				$( e["img"] ).css("z-index", 0);

				// At the first image in a set, make the set flippable
				if (element.length > 1 && i == 0) {

					// First, create clickable divs
					var rct = new rect(ix, iy, iw, ih); 
					var divR = getDivElement(index + "_rightButton", "", ["async"], "e-resize");
					setTxtPosDim( $(divR), rct.x + rct.w/3*2, rct.y, rct.w/3, rct.h);
					var divL = getDivElement(index + "_leftButton", "", ["async"], "w-resize");
					setTxtPosDim( $(divL), rct.x, rct.y, rct.w/3, rct.h);
					
					// Then, on click of these divs:
					// imgSet: 
					// offset: -1 is left, +1 is right
					var showNextImage = function(imgSet, imgOffset) {

						// First, find the image in this set that's visible
						var visImg = null;
						var visImgIndex = -1;
						for (var i = 0; i < imgSet.length; i++) {

							if ($(imgSet[i]["img"]).is(":visible")) {
								visImg = imgSet[i]["img"];
								visImgIndex = i;
								break;
							}
						}
						if (visImg == null) return;

						// Set the z-index of this image to 0
						$( visImg ).css("z-index", 0);

						// Find the next image
						var nextImgIndex = (visImgIndex+imgOffset+imgSet.length)%imgSet.length;
						var nextImg = imgSet[nextImgIndex]["img"];

						// Set the z-index of the next image to something lower
						$( nextImg ).css("z-index", -1);

						// Show the next image
						var queueName = "flip";
						var flipMs = 200;
						$( nextImg ).stop(true, false).fadeIn({queue: queueName, duration: flipMs}).dequeue(queueName);
						// Fade out the top image
						$( visImg ).stop(true, false).fadeOut({queue: queueName, duration: flipMs}).dequeue(queueName);
					};
					onTapFn( divR,  function() { return showNextImage(element, 1)});
					onTapFn( divL,  function() { return showNextImage(element, -1)});
				}

				// If it's the first, set a promise
				if (i == 0) {
					
					// If there are captions, set their layout here
					var captionOffset = 0;
					var layoutCaption = function() {
						var caption = null;
						$.each(element, function(ii, ee) {
							if (ee["caption"]) caption = ee["caption"];
						});
						if (caption != null) {

							$(caption).css("font-size", w.fontSizePx*0.9);
							$(caption).css("letter-spacing", (w.titleLetterSpacing/2*w.fontSizePx*0.8) + "px"); // .1993
							$(caption).css("line-height", (w.fontSizePx * 1.4) + "px"); // .1993

							setTxtPosDim( $(caption), ix+iw/2-$(caption).width()/2, iy+ih);
							captionOffset += $(caption).height();
						}
					}
					layoutCaption();

					// Store the offset for this image
					topOffsets.push( topOffsets[topOffsets.length-1] + ih + imgVertMarginPx + captionOffset );

					// set the title, date, description location
					if (index == 0) {
						var tx = ix + iw + w.f2p( marginFrac );
						var ty = iy;
						var tw = textWidthPx;

						// title
						var title = $( project["text"][0]["txt"] );
						title.css("font-size", w.titleSizePx * w.subheadingSizeFrac);
						title.css("letter-spacing", (w.titleLetterSpacing/2*w.fontSizePx) + "px"); // .1993
						setTxtPosDim(title, tx, ty, tw, null);
						ty += title.height() + w.fontSizePx * 0.1;

						// dimensions
						var dims = $( project["text"][1]["txt"] );
						dims.css("font-size", w.titleSizePx * w.subheadingSizeFrac * 0.7);
						dims.css("letter-spacing", (w.titleLetterSpacing/2*w.fontSizePx * 0.7) + "px");
						setTxtPosDim(dims, tx, ty, tw, null);
						ty += dims.height() + w.fontSizePx * 0.1;

						// material
						var mat = $( project["text"][2]["txt"] );
						mat.css("font-size", w.titleSizePx * w.subheadingSizeFrac * 0.7);
						mat.css("letter-spacing", (w.titleLetterSpacing/2*w.fontSizePx * 0.7) + "px");
						setTxtPosDim(mat, tx, ty, tw, null);
						ty += mat.height() + w.fontSizePx * 0.1;

						// date
						var date = $( project["text"][3]["txt"] );
						date.css("font-size", w.titleSizePx * w.subheadingSizeFrac * 0.7);
						date.css("letter-spacing", (w.titleLetterSpacing/2*w.fontSizePx * 0.7) + "px");
						setTxtPosDim(date, tx, ty, tw, null);
						ty += date.height() + w.fontSizePx * 1.4;

						// description
						var desc = $( project["text"][4]["txt"] );
						desc.css("font-size", w.fontSizePx);
						desc.css("letter-spacing", (w.titleLetterSpacing/2*w.fontSizePx*0.8) + "px"); // .1993
						desc.css("line-height", (w.fontSizePx * 1.4) + "px"); // .1993
						setTxtPosDim(desc, tx, ty, tw, null);
					}

					// resolve promise
					thisDoneLayout.resolve();
				}
			}
			
			var promises = [ thisDoneLoading[i], (i==0 ? prevDoneLayout : thisDoneLayout) ];
			$.when( ... promises ).done( layoutImage ).promise();
		});
		
		// Animation Promises
		var thisDoneAnimating = $.Deferred();
		var animateFirstImage = function() {

			// animate the image
			$( element[0]["img"] ).fadeIn({queue: false, duration: w.fadeMs*moveFrac}); 
			if (bAnimate) $( element[0]["img"] ).animate({top: "-="+w.moveAmtPx}, w.moveMs*moveFrac, "easeOutCubic");

			if (index == 0) {
				// animate the text
				var showText = function() {
					$.each(project["text"], function(i, e) {
						$( e["txt"] ).fadeIn({queue: false, duration: w.fadeMs*moveFrac}); 
						if (bAnimate) $( e["txt"] ).animate({top: "-="+w.moveAmtPx}, w.moveMs*moveFrac, "easeOutCubic");
					});

				}
				setTimeout(showText, delayTextMs);
			}

			// If there's a caption, animate it, too
			var animateCaption = function() {
				var caption = null;
				$.each(element, function(ii, ee) {
					if (ee["caption"]) caption = ee["caption"];
				});
				if (caption != null) {
					$(caption).fadeIn({queue: false, duration: w.fadeMs*moveFrac});
				}
			}
			animateCaption();


			// resolve this promise
			setTimeout( function() { thisDoneAnimating.resolve(); }, Math.max(w.moveMs*moveFrac, w.fadeMs*moveFrac));
		};
		$.when( thisDoneLayout ).done( function() { setTimeout( animateFirstImage, delayDisplayMs ); }).promise();

		if (index == 0) {
			$.when( thisDoneLayout ).done( function() { setTimeout( showMenuItems, Math.max(delayDisplayMs-delayTextMs,0) ); }).promise();
		}

		if (index == project["images"].length-1) {
			$.when( thisDoneAnimating ).done( function() { return setFooterHeight( w.f2p(w.footerFrac) ); }).promise();
		}

		// setTimeout( function() { console.log( $(document.body).children().filter(":visible") ) }, 2000);

		// Set Looping
		// $.when( thisDoneLayout ).done( function() {
			// if (element.length > 1) {
			// 	// Create clickable divs
			// 	console.log( element[0]["img"].offsetLeft );
			// 	// var rectImg = new rect(); rectImg.setFromImage( element[0]["img"] ); rectImg.transform(console.log(rectImg);
			// 	var divR = getDivElement(index + "_rightButton", "", ["async"], true);
			// 	// setTxtPosDim(divR, element[0].
			// 	// $(divR).show();
			// 	var divL = getDivElement(index + "_leftButton", "", ["async"], true);
			// 	// $(divL).show();
			// }
		// });

		// Stagger image loading so everything loads faster
		$.each(element, function(i, e) {
			var startLoading = function() { $( e["img"] ).attr( 'src', $( e["img"] ).attr( 'src-tmp' ) ); };
			setTimeout( startLoading, index*delayLoadingMs + i*delayLoadingMs/(element.length+1) );
		});

    	// Save these promises
	    prevDoneLayout = thisDoneLayout;
	    prevDoneAnimating = thisDoneAnimating;
	});
}
function showAllItems(pageID) {
	if (pageID == "home") {
		showHome();
	} else if (pageID == "about") {
		showAbout();
	} else {
		showProject();
	}
}
function show(pageID) {

	// recompute all parameters
	w.recompute();

	// show all items
	showAllItems(pageID);
}

// load a specific page within this domain (no fadeout!)
function loadPage(pageID="", fadeOutDone=null) {

	// Get the pageID if not specified
	if (pageID=="") pageID = getThisPage();

	// First, initialize all elements
	var initDone = $.Deferred();
	init(pageID, initDone);

	// When all items have been initialized, show all items
	$.when( initDone, fadeOutDone ).done( function(){ return show(pageID);} ).promise();
}

// exit current page and load a new one (pageID);
function exitAndLoad(pageID) {

	// fade out and delete all elements
	var fadeOutDone = fadeOut();

	// load the new page
	loadPage(pageID, fadeOutDone);
}

function loadURL(toUrl) {

	// Check if new page is within this domain
	if (toUrl.includes(domainKey)) {
		// Get the page ID
		var pageID = getPage(toUrl);

		// Reset the scrollTop
		markPageUnvisited(pageID);

		// Change the state of the page
		if (getThisPage() == "home") {
			if (pageID == "home") return;
			else history.pushState( {}, "", pageID );
		} else {
			if (pageID == "home") history.pushState( {}, "", "../");
			else history.pushState( {}, "", "../"+pageID);
		}
		exitAndLoad( pageID );

	} else {
		// fade out
		fadeOut();
		// load an external url
		window.location.href = toUrl;		
	}
}

var windowReady = $.Deferred();
$( document ).ready(function() { 
	windowReady.resolve(); 
});

var windowLoaded = $.Deferred();
$( window ).on("load", function() { 
	windowLoaded.resolve(); 
});

// When the window is ready, initialize fonts and load the page
$.when( windowReady, windowLoaded ).done( loadFonts, loadPage ).promise();

// load new page if the forward or back button is pressed
$( window ).on('popstate', function() {

	// setScrollTop(

	// Get the current url
	var url = window.location.href;
	// Parse the specific page
	var pageID = getPage(url);
	// todo: Check if this page exists
	
	exitAndLoad( pageID );
});








$( window ).scroll( function() {

	saveThisScrollTop();
});

// $( window ).on( "resize", function() {


//     // resizeCanvas();

// });