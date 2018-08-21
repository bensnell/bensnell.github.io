function Params() {

	// ============================
	// ====== SET VARIABLES =======
	// ============================

	// Max window width
	this.maxWindowW = 1042;

    // Amount of slide
    this.slideAmt = 0.7;
    // Consecutive delay of img loading
	this.delayLoadingMs = 250; // 350 // 250
	this.delayDisplayMs = 150; // 200 // 150

	// Margin Sizes (fractions of width)
	this.marginTopFrac = 0.19; // 0.075 // 0.13 // 0.169 // 0.146 // 0.17
	this.vertSpacingFrac = 0.050;
	this.marginSideFracOrig = 0.085;
	this.marginBetweenFrac = 0.05;

	// Image sizes
	this.minImgArea = 0.25; 	// desktop, 0.25
	this.maxImgArea = 0.5;	// mobile, 0.5

	// Body font
	this.fontSizeFrac = 0.015; // .015 // 0.018
	this.minFontSize = 10;
	this.bodyTopOffset = 0.2; // 0.35

	// Title font
	this.titleSizeFrac = 0.065; // 0.075 // 0.09 // 0.055
	this.minTitleSize = 40;
	this.titleTopOffset = 0.6; // 0.7 // 0.5
	this.titleLeftOffset = 0.5; // 0.37
	this.bTitleAbove = true;
	this.titleLineHeight = 1.1; // 1.25
	this.titleLetterSpacing = 0.14;

	// layout params
	this.columnOffset = 1;

	this.menuSizeFrac = 0.35;
	this.subheadingSizeFrac = 0.3;

	this.footerFrac = 0.05;

	// text color params
	this.dark = "#000000";
	this.medium = "#999999";
	this.light = "#BBBBBB";
	this.lighter = "#DDDDDD";
	


	// ========================
	// ======= COMPUTE ========
	// ========================

	this.origWindowW = null;
	this.windowW = null;
	this.windowH = null;
	this.windowL = null;
	this.fadeMs = null;
	this.moveMs = null;
	this.moveAmtPx = null;
	this.marginSidePx = null;
	this.marginBetweenPx = null;
	this.marginTopPx = null;
	this.vertSpacingPx = null;
	this.offsetTopPx = null;
	this.fontSizePx = null;
	this.titleSizePx = null;
	this.marginSideFrac = null;

	// fraction (in terms of windowW) to pixels
	this.f2p = function(f) { return f*this.windowW; };
	// pixels to fraction (in terms of windowW)
	this.p2f = function(p) { return p/this.windowW; };

	this.recompute = function() {

		var t = this;

		// set this ahead of time because it changes when a scroll bar is added
		t.origWindowW = $( window ).width();
		t.windowW = t.origWindowW;
		t.windowH = $( window ).height();
		// Clamp the window width
		t.windowW = Math.min(t.windowW, t.maxWindowW);
		// Get the left offset of all items
		t.windowL = ($( window ).width() - t.windowW) / 2.0;

		// Fade durations
		t.fadeMs = 740 * t.slideAmt;
		t.moveMs = 750 * t.slideAmt;
		// Number of pixels of upward movement on loading
		var moveAmtFrac = 0.12 * t.slideAmt;
		t.moveAmtPx = moveAmtFrac * t.windowW;

		// Change the margin depending on the window size
		var minWidth = 375;
		var maxWidth = 1042;
		t.marginSideFrac = t.marginSideFracOrig * map(t.windowW, minWidth, maxWidth, 0, 1, true);
		t.marginSideFrac = Math.max(t.marginSideFrac, 0.01);
		t.marginSidePx = t.windowW * t.marginSideFrac;
		t.marginBetweenPx = t.windowW * t.marginBetweenFrac;

		// var imgAreaFrac = map(windowW, minWidth, maxWidth, maxImgArea, minImgArea, true, 1)

		// Compute the maring sizes
		t.marginTopPx = t.marginTopFrac * t.windowW;
		t.vertSpacingPx = t.vertSpacingFrac * t.windowW;
		t.offsetTopPx = t.marginTopPx;

		// Get the font sizes
		t.fontSizePx = Math.max(t.fontSizeFrac * t.windowW, t.minFontSize);
		t.titleSizePx = Math.max(t.titleSizeFrac * t.windowW, t.minTitleSize);
	}

	// compute all variables when this class is initialized
	this.recompute();
}



