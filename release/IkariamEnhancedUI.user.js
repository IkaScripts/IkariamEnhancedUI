// ==UserScript==
// @name			Enhanced UI
// @description		Enhancements for the user interface of Ikariam.
// @namespace		Tobbe
// @author			Tobbe
// @version			5.00
//
// @include			http://s*.*.ikariam.*/*
// @include			http://m*.*.ikariam.*/*
// 
// @exclude			http://support.*.ikariam.*/*
// 
// @history			5.00	Feature: Possibility to hide only the bird swarm animation. (desktop)
// @history			5.00	Feature: Easier upkeep reduction table. (mobile & desktop)
// @history			5.00	Feature: Enhanced zoom function using the Ikariam zoom function. (desktop)
// @history			5.00	Feature: Due to the use of Ikariam functions the code could be reduced.
// @history			5.00	Feature: Code enhancements for shorter code.
// 
// @history			4.02	Bugfix: Not all occurrences of hidden were changed.
// 
// @history			4.01	Bugfix: Name of a class (hidden) is used by GF.
// 
// @history			4.00	Feature: Options panel to enable/disable funtions and set settings. (mobile & desktop)
// @history			4.00	Feature: Update interval can be set. (mobile & desktop)
// @history			4.00	Feature: Manually check for updates. (mobile & desktop)
// @history			4.00	Feature: Zoom funtion without resizing the whole view. (desktop)
// @history			4.00	Feature: Move loading circle to another position. (desktop)
// @history			4.00	Feature: Show tooltip in Alliance / Military view on mouseover. (desktop)
// @history			4.00	Feature: Code better commented. More comments, so that it is easier to understand.
// @history			4.00	Bugfix: Changed *.gif to *.png.
// @history			4.00	Version numbers adjusted.
//
// @history			3.01	Feature: Support for mobile interface.
// @history			3.01	Bugfix: Fixed bug with scrollbar in finances view. (desktop)
// 
// @history			3.00	Feature: Ready for 0.5.0, but also supports 0.4.5 furthermore.
// @history			3.00	Feature: Implemented support for different languages.
// @history			3.00	Feature: Enhanced script updater.
// @history			3.00	Feature: Cleaned up code.
// @history			3.00	Feature: Rename the script to "Enhanced UI".
// @history			3.00	Feature: Change the namespace to "Tobbe".
// @history			3.00	Because of the change of namespace and name you have to delete the old script manually!
//
// @history			2.05	Bugfix: Problem with negative numbers and 0.4.2.4 fixed.
//
// @history			2.04	Feature: Own script updater.
// @history			2.04	Bugfix: Remove everything what refered to other scripts.
//
// @history			2.03	Feature: New script updater.
//
// @history			2.02	Remove the script updater (Because of the problem with Greasemonkey scripts).
//
// @history			2.01	Feature: New style of update panel.
// @history			2.01	Bugfix: Bug with ',' as seperator fixed.
//
// @history			2.00	Feature: Income in 24h added.
// @history			2.00	Feature: Cleaned up code.
//
// @history			1.01	Feature: Update check implemented.
//
// @history			1.00	Initial release.
// ==/UserScript==

/******************************************************************************************************************
*** The update function which is used in the script was developed by PhasmaExMachina and adapted by me (Tobbe). ***
******************************************************************************************************************/

/**
 * Information about the Script.
 */
const scriptInfo = {
	version:	'5.00',
	id:			74221,
	name:		'Ikariam Enhanced UI',
	author:		'Tobbe',
	debug:		false,
};

/**
 * Sets unsafeWindow to win for easier access.
 */
var win = unsafeWindow;

/**
 * Storage for the unsafeWindow.ikariam funtion.
 */
var ika;

/***********************************************
*** Start of the "debugging settings block". ***
***********************************************/

// For more information about commands that are available for the Firebug console see http://getfirebug.com/wiki/index.php/Console_API.
if(scriptInfo.debug) {
	var conTmp = win.console;
} else {
	var conTmp = {
		// Non static functions are set to 'null'.
		log:			function () { return false; },
		info:			function () { return false; },
		warn:			function () { return false; },
		error:			function () { return false; },
		debug:			function () { return false; },
		assert:			function () { return false; },
		clear:			function () { return false; },
		dir:			function () { return false; },
		dirxml:			function () { return false; },
		trace:			function () { return false; },
		group:			function () { return false; },
		groupCollapsed: function () { return false; },
		groupEnd:		function () { return false; },
		time:			function () { return false; },
		timeEnd:		function () { return false; },
		profile:		function () { return false; },
		profileEnd:		function () { return false; },
		count:			function () { return false; },
		exception:		function () { return false; },
		table:			function () { return false; }
	};
}

/**
 * Debugging console.
 */
const con		= conTmp;

/*********************************************
*** End of the "debugging settings block". ***
*********************************************/

/**
 * General functions.
 */
General = {
		/**
	 * Init the script.
	 */
	init: function() {
		// Set unsafeWindow.ikariam to ika for easier access.
		ika = unsafeWindow.ikariam;

		// Get the id of the body.
		var viewId = document.body.id;
		
		// Get the name of the view depending on the body id.
		switch(viewId) {
			case 'worldmap_iso':
				View.name = 'world';
			  break;
			
			case 'island':
				View.name = 'island';
			  break;
			
			case 'city':
				View.name = 'town';
			  break;
			
			default:
			  break;
		}
	},
	
	/**
	 * Gets the first matching child element by a query and returns it.
	 * 
	 * @param	String	query
	 *   The query for the element.
	 * @param	element	parent
	 *   The parent element. (optional, default document)
	 * 
	 * @return	element
	 *   The element.
	 */
	$: function(query, parent) {
		return this.$$(query, parent)[0];
	},
	
	/**
	 * Gets all matching child elements by a query and returns them.
	 * 
	 * @param	String	query
	 *   The query for the elements.
	 * @param	element	parent
	 *   The parent element. (optional, default document)
	 * 
	 * @return	element[]
	 *   The elements.
	 */
	$$: function(query, parent) {
		// If there is no parent set, set it to document.
		if(!parent)	parent = document;
		
		// Return the elements.
		return parent.querySelectorAll(query);
	},
	
	/**
	 * Set the general script styles.
	 */
	setStyles: function() {
		// Add the general used styles.
		GM_addStyle(
				".bottomLine					{ border-bottom: 1px dotted #CCA569; } \
				 .minimizeImg, .maximizeImg		{ background: url('skin/interface/window_control_sprite.png') no-repeat scroll 0 0 transparent; cursor: pointer; display: block; height: 18px; width: 18px; } \
				 .minimizeImg					{ background-position: -144px 0; } \
				 .minimizeImg:hover				{ background-position: -144px -19px; } \
				 .maximizeImg					{ background-position: -126px 0; } \
				 .maximizeImg:hover				{ background-position: -126px -19px; }"
			);
	},
	
	/**
	 * Parses a string number to an int value.
	 *
	 * @param	String	txt
	 *   The number to format.
	 * 
	 * @return	int
	 *   The formated value.
	 */
	getInt: function(txt) {
		// Return the formated number.
		return parseInt(txt.replace(Language.$('settings_kiloSep'), ''));
	},
	
	/**
	 * Returns the value of the selected option of a select field.
	 * 
	 * @param	String	id
	 *   The last part of the id of the element (The first part will be "script" + the script-id.).
	 * 
	 * @return	String
	 *   The value.
	 */
	getSelectValue: function(id) {
		// Get the select field.
		var select = General.$('#script' + scriptInfo.id + id);
		
		// Return the value.
		return select.options[select.selectedIndex].value;
	},
	
	/**
	 * Formats a number to that format that is used in Ikariam.
	 *
	 * @param	int		num
	 *   The number to format.
	 * 
	 * @return	String
	 *   The formated number.
	 */
	formatToIkaNumber: function(num) {
		var txt = num + '';
		
		// Set a seperator every 3 digits from the end.
		txt = txt.replace(/(\d)(?=(\d{3})+\b)/g, '$1' + Language.$('settings_kiloSep'));
		
		// If the number ist negative write it in red.
		if(num < 0) {
			txt = '<span class="red bold negative">' + txt + '</span>';
		}
		
		// Return the formated number.
		return txt;
	},
	
	/**
	 * Adds cells to a table row.
	 * 
	 * @param	String[]	cellText
	 *   Array with the text of the cells.
	 * @param	String[]	cellClassName
	 *   Array with the classes of the cells.
	 * @param	element		row
	 *   Table row where the cells should be added.
	 * @param	boolean		head
	 *   If the row is a table head row.
	 */
	createTableRow: function(cellText, cellClassName, row, head) {
		// Do this for every cell.
		for(var i = 0; i < cellText.length; i++) {
			// Add the cell.
			var cell = this.addElement(head ? 'th' : 'td', row, null, cellClassName[i]);
			
			// Set the content of the cell.
			cell.innerHTML = cellText[i];
		}
	},
	
	/**
	 * Creates a new element and adds it to a parent.
	 * 
	 * @param	String				type
	 *   The type of the new element.
	 * @param	element				parent
	 *   The parent of the new element.
	 * @param	int					id
	 *   The last part of the id of the element. The first part will be "script" + the script-id. (optional, if not set, no id will be set)
	 * @param	String || String[]	classes
	 *   The class(es) of the element. (optional, if not set, no class will be set)
	 * @param	mixed[]				style
	 *   The styles of the element. (optional, if not set, no style will be set)
	 * @param	element				nextSib
	 *   The next sibling of the element. (optional, if not set the element will be added at the end)
	 * 
	 * @return	element
	 *   The new element.
	 */
	addElement: function(type, parent, id, classes, style, nextSib) {
		// Create the new Element.
		var newElement = document.createElement(type);
		
		// If there is a id, set it.
		if(id) {
			newElement.id = 'script' + scriptInfo.id + id;
		}
		
		// Add all classes.
		if(classes && classes != '') {
			if(typeof classes == 'string') {
				newElement.classList.add(classes);
			} else {
				for(var i = 0; i < classes.length; i++) {
					newElement.classList.add(classes[i]);
				}
			}
		}
		
		if(style) {
			for(var i = 0; i < style.length; i++) {
				newElement.style[style[i][0]] = style[i][1];
			}
		}

		// If there is the next sibling defined, insert it before it.
		if(nextSib) {
			parent.insertBefore(newElement, nextSib);

		// Otherwise insert it at the end.
		} else {
			parent.appendChild(newElement);
		}
		
		// Return the new element.
		return newElement;
	},
	
	/**
	 * Creates a new checkbox and adds it to a parent.
	 * 
	 * @param	element	parent
	 *   The parent of the new checkbox.
	 * @param	String	id
	 *   The middle part of the id of the checkbox.
	 * @param	boolean	checked
	 *   If the checkbox is checked or not.
	 * @param	String	labelText
	 *   The text of the label.
	 */
	addCheckbox: function(parent, id, checked, labelText) {
		// Create the wrapper for the checkbox and the label.
		var cbWrapper	= this.addElement('div', parent, null, 'cbWrapper');

		// Create the checkbox and set the attributes.
		var cb		= this.addElement('input', cbWrapper, id + 'Cb', 'checkbox');
		cb.type		= 'checkbox';
		cb.title	= labelText;
		cb.checked	= checked ? 'checked' : '';
		
		// Replace the checkbox for better appearance.
		ika.controller.replaceCheckboxes();
	},

	/**
	 * Creates a new select field and adds it to a parent.
	 * 
	 * @param	element	parent
	 *   The parent of the new select field.
	 * @param	String	id
	 *   The last part of the id of the select field.
	 * @param	boolean	selected
	 *   The value of the selected option.
	 * @param	mixed[]	opts
	 *   An array with the names an values of the options.
	 */	
	addSelect: function(parent, id, selected, opts) {
		// Create the wrapper for the select.
		var wrapper				= this.addElement('div', parent, null, new Array('select_container', 'size175'), new Array(['position', 'relative']));
		
		// Create the select field.
		var select	= this.addElement('select', wrapper, id + 'Select', 'dropdown');
		
		// Add the Options.
		for(var i = 0; i < opts['name'].length; i++) {
			// Create an option.
			var option			= this.addElement('option', select);

			// Set the value and the name.
			option.value		= opts['value'][i];
			option.innerHTML	= opts['name'][i];

			// If the option is selected, set selected to true.
			if(option.value == selected) {
				option.selected = 'selected';
			}
		}
		
		// Replace the dropdown for better appearance.
		ika.controller.replaceDropdownMenus();
	},
		
	/**
	 * Returns if the user is logged in to the mobile version.
	 * 
	 * @return	boolean
	 *   The login-status to mobile.
	 */
	isMobileVersion: function() {
		return (top.location.href.search(/http:\/\/m/) > -1);
	},
	
	/**
	 * Shows a hint to the user (desktop).
	 * 
	 * @param	String	located
	 *   The location of the hint. Possible are all advisors, a clicked element or a committed element.
	 * @param	String	type
	 *   The type of the hint. Possible is confirm, error, neutral or follow the mouse.
	 * @param	String	msgText
	 *   The hint text.
	 * @param	String	msgBindTo
	 *   An element the tooltip is binded (only used if located = committedElement).
	 * @param	String	msgIsMinSize
	 *   If the message is minimized (only used if type = followMouse).
	 */
	showTooltip: function(located, type, msgText, msgBindTo, msgIsMinSize) {
		// Get the message location.
		switch(located) {
			case 'cityAdvisor':
				msgLocation = 1;
			  break;
			
			case 'militaryAdvisor':
				msgLocation = 2;
			  break;
			
			case 'researchAdvisor':
				msgLocation = 3;
			  break;
			
			case 'diplomacyAdvisor':
				msgLocation = 4;
			  break;
			
			case 'clickedElement':
				msgLocation = 5;
			  break;
			
			case 'committedElement':
				msgLocation = 6;
			  break;
			
			default:
				msgLocation = -1;
			  break;
		}
		
		// Get the message type.
		switch(type) {
			case 'confirm':
				msgType = 10;
			  break;
			
			case 'error':
				msgType = 11;
			  break;
			
			case 'neutral':
				msgType = 12;
			  break;
			
			case 'followMouse':
				msgType = 13;
			  break;
			
			default:
				msgType = -1;
			  break;
		}
		
		// Show the tooltip.
		ika.controller.tooltipController.bindBubbleTip(msgLocation, msgType, msgText, null, msgBindTo, msgIsMinSize);
	},
};

/**
 * Functions for event handling.
 */
EventHandling = {
	/**
	 * Events for the upkeep reduction tables.
	 */
	upkeepReductionTable: {
		/**
		 * Toggles the visibility of the reduction information rows.
		 */
		toggle: function(e) {
			// Get the element from the event.
			e = e || win.event;
			var target = e.target || e.srcElement;
			
			// If mobile version, switch the inner html.
			if(General.isMobileVersion()) {
				if(this.innerHTML == '+') {
					this.innerHTML = '-';
				} else {
					this.innerHTML = '+';
				}
			}
			
			// Switch the button picture.
			this.classList.toggle('minimizeImg');
			this.classList.toggle('maximizeImg');
			
			// Get the table rows.
			var tr = General.$$('tr', this.parentNode.parentNode.parentNode);
			
			// Toggle the visibility of all table rows except the first.
			for(var i = 1; i < tr.length; i++) {
				tr[i].classList.toggle('invisible');
			}

			// Adjust the size of the Scrollbar.
			ika.controller.adjustSizes();
		},
	},
	
	/**
	 * Events for the zoom function.
	 */
	zoomFunction: {
		/**
		 * Zoom in when clicking on the zoom in button.
		 */
		zoomIn: function(e) {
			// Get the element from the event.
			e = e || win.event;
			var target = e.target || e.srcElement;
			
			// Get the center position of the worldmap.
			var worldview	= General.$('#worldview');
			var posX		= worldview.offsetLeft + worldview.offsetWidth / 2;
			var posY		= worldview.offsetTop + worldview.offsetHeight / 2;
			
			// Get the zoom factor.
			factor = GM_getValue('zoom_' + View.name + 'Factor', 100) + ZoomFunction.zoomStep;
			
			// If the factor is too big set it to the max allowed and hide the zoom in button.
			if(factor >= ZoomFunction.maxZoom) {
				factor = ZoomFunction.maxZoom;
				this.classList.add('invisible');
			}

			// Show the zoom out button if it is invisible.
			this.nextSibling.classList.remove('invisible');
			
			// Store the zoom factor.
			GM_setValue('zoom_' + View.name + 'Factor', factor);

			// Zoom.
			ika.controller.scaleWorldMap(1, posX, posY);
		},
		
		/**
		 * Zoom out when clicking on the zoom out button.
		 */
		zoomOut: function(e) {
			// Get the element from the event.
			e = e || win.event;
			var target = e.target || e.srcElement;
			
			// Get the center position of the worldmap.
			var worldview	= General.$('#worldview');
			var posX		= worldview.offsetLeft + worldview.offsetWidth / 2;
			var posY		= worldview.offsetTop + worldview.offsetHeight / 2;
			
			// Get the zoom factor.
			factor = GM_getValue('zoom_' + View.name + 'Factor', 100) - ZoomFunction.zoomStep;
			
			// If the factor is too small set it to the min allowed and hide the zoom out button.
			if(factor <= ZoomFunction.minZoom) {
				factor = ZoomFunction.minZoom;
				this.classList.add('invisible');
			}

			// Show the zoom in button if it is invisible.
			this.previousSibling.classList.remove('invisible');
			
			// Store the zoom factor.
			GM_setValue('zoom_' + View.name + 'Factor', factor);

			// Zoom.
			ika.controller.scaleWorldMap(-1, posX, posY);
		},
	},
	
	/**
	 * Events for the option panel.
	 */
	optionPanel: {
		/**
		 * Save the settings in the option panel.
		 */
		saveSettings: function() {
			if(General.isMobileVersion()) {
				OptionPanel.saveSettingsMobile();
			} else {
				OptionPanel.saveSettings();
			}
		},
	},
	
	/**
	 * Events for loading preview.
	 */
	loadingPreview: {
		/**
		 * Is called after an attribute of loadingPreview was modified.
		 * 
		 * @param	event	e
		 *   The calling event.
		 */
		attrModified: function(e) {
			// Get the element from the event.
			e = e || win.event;
			var target = e.target || e.srcElement;

			// If the attribute was changed.
			if(e.attrChange == MutationEvent.MODIFICATION) {
				// If the style.display is set to none.
				if(e.attrName == 'style' && e.newValue == 'display: none;') {
					// Timeout to have access to GM_ funtions.
					setTimeout(EnhancedView.getPopup, 0);
				}
			}
		},
	},
};

/**
 * Functions for enhanced view.
 */
EnhancedView = {
	/**
	 * Inits the enhanced view.
	 * Decides if the version of ikariam is mobile or desktop.
	 */
	init: function() {
		// If the version is mobile.
		if(General.isMobileVersion()) {
			this.initMobile();
		
		// Otherwise; the version is desktop.
		} else {
			this.initDesktop();
		}
	},
	
	/**
	 * Inits the desktop version.
	 * Adds the event listener to the loadingPreview.
	 */
	initDesktop: function() {
		// Wait for a popup.
		General.$('#loadingPreview').addEventListener('DOMAttrModified', EventHandling.loadingPreview.attrModified, false);
		
		// Init parts which are not shown in popups.
		this.initDesktopStatic();
	},
	
	/**
	 * Inits the modifications on the website which are not shown in popups.
	 */
	initDesktopStatic: function() {
		// Move loading circle.
		if(GM_getValue('module_lcMoveActive', true))	View.moveLoadingCircle();
		
		// Hide the Bird animation.
		if(GM_getValue('module_hideBirdsActive', true))	View.hideBirds();

		// Zoom function.
		if(GM_getValue('module_zoomActive', true))		ZoomFunction.init();
	},
	
	/**
	 * Inits the mobile version.
	 */
	initMobile: function() {
		// Get the param string.
		var params = top.location.search;

		// If the view is finances.
		if(params.search(/view=finances/) > -1) {
			if(GM_getValue('module_incomeActive', true))	Balance.incomeOnTopMobile();
			if(GM_getValue('module_urtShortActive', true))	Balance.shortUpkeepReductionTable();
		}

		// If the view is game options.
		if(params.search(/view=options&page=game/) > -1) {
			OptionPanel.mobile();
		}
	},
	
	/**
	 * Calls the script module depending on the popup.
	 */
	getPopup: function() {
		// Options popup.
		if(General.$('#options_c'))	OptionPanel.desktop();
		
		// Finance popup.
		if(General.$('#finances_c')) {
			if(GM_getValue('module_incomeActive', true))								Balance.incomeOnTop();
			if(GM_getValue('module_urtShortActive', true))								Balance.shortUpkeepReductionTable();
		}

		// Military view popup.
		if(General.$('#militaryAdvisor_c') && GM_getValue('module_ttAutoActive', true))	Tooltips.autoshowInMilitaryView();
		
		// Diplomacy ally view popup.
		if(General.$('#diplomacyAlly_c') && GM_getValue('module_ttAutoActive', true))	Tooltips.autoshowInAllianceView();
		
		// Diplomacy ally view popup.
		if(General.$('#embassy_c') && GM_getValue('module_ttAutoActive', true))			Tooltips.autoshowInAllianceView();
	},
};

/**
 * Functions for the general view.
 */
View = {
	/**
	 * Storage for the name of the view.
	 */
	name: '',

	/**
	 * Move loading circle to breadcrumb.
	 */
	moveLoadingCircle: function() {
		// Add the styles.
		GM_addStyle(
				"#js_worldBread		{ margin-left: 16px !important; } \
				 #loadingPreview	{ -moz-transform: scale(0.5); msTransform: scale(0.5); -o-transform: scale(0.5); -webkit-transform: scale(0.5); transform: scale(0.5); left: 35px !important; top: 141px !important; }"
			);
	},
	
	/**
	 * Hide the bird animation but no other animation.
	 */
	hideBirds: function() {
		// Add the style.
		GM_addStyle(
				 ".bird_swarm	{ visibility: hidden !important; }"
			);
	},
};

/**
 * Functions for tooltips.
 */
Tooltips = {
	/**
	 * Show tooltips in alliance view automatically.
	 */
	autoshowInAllianceView: function() {
		// Enable toggling on mouseover / mouseout.
		this.autoshowGeneral('cityInfo');
	},
	
	/**
	 * Show tooltips in military advisor view automatically.
	 */
	autoshowInMilitaryView: function() {
		// Enable toggling on mouseover / mouseout.
		this.autoshowGeneral('spyMilitary');
	},
	
	/**
	 * Show tooltips with class name magnifierClass automatically.
	 * 
	 * @param	String	magnifierClass
	 *   The class of the tooltips to enable toggling.
	 */
	autoshowGeneral: function(magnifierClass) {
		// Get all magnifiers.
		var magnifier = General.$$('.' + magnifierClass);

		// Set the mousover and mouseout for all magnifiers.
		for(var i = 0; i < magnifier.length; i++) {
			var magOnClick = magnifier[i].onclick;
			magnifier[i].onclick = 'return false;';
			magnifier[i].addEventListener('mouseover', magOnClick, false);
			magnifier[i].addEventListener('mouseout', magOnClick, false);
		}
	},
};

/**
 * Functions for balance view.
 */
Balance = {
	/**
	 * Shows the actual income also on top of the site. (desktop)
	 */
	incomeOnTop: function() {
		// Get the table for the summary.
		var summaryTable = General.$('.table01');
		
		// Show the income on top.
		this.showIncomeOnTop(summaryTable);

		// Adjust the size of the Scrollbar.
		ika.controller.adjustSizes();
	},
	
	/**
	 * Shows the actual income also on top of the site. (mobile)
	 */
	incomeOnTopMobile: function() {
		// Get the table for the summary.
		var summaryTable = General.$('#balance');
		
		// Show the income on top.
		this.showIncomeOnTop(summaryTable);
	},
	
	/**
	 * Show the actual income on top of the site.
	 * 
	 * @param	element	summaryTable
	 *   The table for the summary.
	 */
	showIncomeOnTop: function(summaryTable) {
		// Get the actual income.
		var income = this.getIncome();

		// Create the rows for the income per day and the income per day.
		incomeRow		= General.addElement('tr', summaryTable, null, new Array('result', 'alt'));
		incomeRow24h	= General.addElement('tr', summaryTable, null, 'result');
		
		// Create the content of the table rows.
		General.createTableRow(new Array(Language.$('balance_income_perHour'), '', '', General.formatToIkaNumber(income)), new Array('sigma', ['value', 'res'], ['value', 'res'], ['value', 'res']), incomeRow, false);
		General.createTableRow(new Array(Language.$('balance_income_perDay'), '', '', General.formatToIkaNumber(income * 24)), new Array('sigma', ['value', 'res'], ['value', 'res'], ['value', 'res']), incomeRow24h, false);
	},
	
	/**
	 * Gets the actual income from the Ikariam page and returns it.
	 * 
	 * @return	int
	 *   The actual income
	 */
	getIncome: function() {
		// Get the table cell with the actual income.
		var incomeCell = General.$$('.hidden')[General.$$('.hidden').length - 1];
		
		// If the content of the cell is not just the income move one element inwards.
		while(incomeCell.firstChild.firstChild) {
			incomeCell = incomeCell.firstChild;
		}
		
		// Get the actual income.
		var txt = incomeCell.innerHTML;
		
		// Remove the thousand seperators.
		return General.getInt(txt);
	},
	
	/**
	 * Shows a short upkeep reduction table.
	 */
	shortUpkeepReductionTable: function() {
		// Get the upkeep redutcion tables.
		var uRT = General.$$('.upkeepReductionTable');
		
		if(uRT.length == 0) {
			uRT = General.$$('#upkeepReductionTable');
		}
		
		// Create an array for data storage.
		var row	= new Array();
				row.reason			= new Array();
				row.basicUpkeep		= new Array();
				row.supplyUpkeep	= new Array();
				row.result			= new Array();
		
		// Get the data for the troops and ships redution rows.
		for(var i = 0; i < 3; i++) {
			row.reason.push(Language.$('balance_upkeep_reason_' + i));
			row.basicUpkeep.push(General.getInt(General.$$('.altbottomLine td.hidden, .result td.hidden, .alt.bottomLine td.hidden, .result td.hidden', uRT[0])[i].innerHTML));
			row.supplyUpkeep.push(General.getInt(General.$$('.altbottomLine td.hidden, .result td.hidden, .alt.bottomLine td.hidden, .result td.hidden', uRT[1])[i].innerHTML));
			row.result.push(row.basicUpkeep[i] + row.supplyUpkeep[i]);
		}
		
		// Get the start income.
		var beforeReduction = General.getInt(General.$('td.hidden', uRT[2]).innerHTML);
		
		// Get the result income.
		var income = this.getIncome();
		
		// Create the table to show the 
		var shortTable = General.addElement('table', uRT[0].parentNode, null, new Array('table01', 'border', 'left'), null, uRT[0]);
		shortTable.id = 'balance';
		
		// Create the table head.
		General.createTableRow(new Array('', Language.$('balance_upkeep_basic'), Language.$('balance_upkeep_supply'), Language.$('balance_upkeep_result')), new Array('city', ['value', 'res'], ['value', 'res'], ['value', 'res']), General.addElement('tr', shortTable), true);
		
		// Create the start income row.
		var startRow = General.addElement('tr', shortTable, null, new Array('alt', 'bottomLine'));
		General.createTableRow(new Array(Language.$('balance_income_start'), '', '', General.formatToIkaNumber(beforeReduction)), new Array('city', ['value', 'res'], ['value', 'res'], ['value', 'res']), startRow, false);
		
		// Create the troops / ships redution rows.
		for(var i = 0; i < 3; i++) {
			var newRow = General.addElement('tr', shortTable, null, (i % 2 == 1) ? new Array('alt', 'bottomLine') : '');
			General.createTableRow(new Array(row.reason[i], General.formatToIkaNumber(-row.basicUpkeep[i]), General.formatToIkaNumber(-row.supplyUpkeep[i]), General.formatToIkaNumber(-row.result[i])), new Array('city', ['value', 'res'], ['value', 'res'], 'hidden'), newRow, false);
		}
		
		// Create the result row.
		var resultRow = General.addElement('tr', shortTable, null, 'result');
		General.createTableRow(new Array('<img alt="Summe" src="skin/layout/sigma.png">', '', '', General.formatToIkaNumber(income)), new Array('sigma', ['value', 'res'], ['value', 'res'], 'hidden'), resultRow, false);
		
		// Create the spacing between the tables.
		General.addElement('hr', uRT[0].parentNode, null, null, null, uRT[0]);
		
		// Hide the data rows of the tables and add the show button.
		for(var i = 0; i < uRT.length; i++) {
			// Get all rows.
			var tr = General.$$('tr', uRT[i]);
			
			// Hide all rows except the first.
			for(var k = 1; k < tr.length; k++) {
				tr[k].classList.add('invisible');
			}
			
			// Add the show button to the first row.
			var th = General.$('th', tr[0]);
			var btn = General.addElement('div', th, null, 'maximizeImg', new Array(['cssFloat', 'left']), th.firstChild);
			
			// If mobile version.
			if(General.isMobileVersion()){
				btn.innerHTML = '+';
			}

			// Add the event listener.
			btn.addEventListener('click', EventHandling.upkeepReductionTable.toggle, false);
		}
	},
};
	
/**
 * Functions for option panel.
 */
OptionPanel = {
	/**
	 * Adds the tab for the script options in the desktop version.
	 */
	desktop: function() {
		// If the tab already exists return.
		if(General.$('#tabScriptOptions')) {
			return;
		}

		// Set the styles.
		this.setStylesDesktop();

		// Add the GM tab link to the tab menu.
		var tabmenu					= General.$('.tabmenu');
		jsTabGMOptions				= General.addElement('li', tabmenu, null, 'tab');
		jsTabGMOptions.id			= 'js_tabScriptOptions';
		jsTabGMOptions.setAttribute('onclick', "switchTab('tabScriptOptions');");
		jsTabGMOptions.innerHTML	= '<b class="tabScriptOptions"> ' + Language.$('optionPanel_scripts') + ' </b>';
		
		// Add the content wrapper for the GM tab to the tab menu.
		var mainContent				= General.$('#tabGameOptions').parentNode;
		tabGMOptions				= General.addElement('div', mainContent, null, null, new Array(['display', 'none']));
		tabGMOptions.id				= 'tabScriptOptions';
		this.createTabContent(tabGMOptions);
	},
	
	/**
	 * Shows the options for the script in the mobile version.
	 */
	mobile: function() {
		// Get the mainview.
		var mainview = General.$('#mainview');
		
		// Create the options wrapper.
		var wrapper = this.createOptionsWrapper(mainview, scriptInfo.name);
		
		// Add the checkboxes for the enabling / disabling of modules.
		this.createModuleContentMobile(wrapper);
		
		// Add the options for updates.
		this.createUpdateContentMobile(wrapper);
		
		// Horizontal row.
		General.addElement('hr', wrapper);

		// Prepare placeholder for save hint.
		General.addElement('p', wrapper, 'saveHint');
		
		// Add the button to save the settings.
		this.addSaveButton(wrapper);
	},
	
	/**
	 * Sets the styles that are used for the update-panel.
	 */
	setStylesDesktop: function() {
		// Add all styles to the ikariam page.
		GM_addStyle(
				"#js_tabGameOptions, #js_tabAccountOptions, #js_tabFacebookOptions, #js_tabOpenIDOptions, #js_tabScriptOptions	{ width: 130px !important; margin-left: 5px !important; border-radius: 5px 5px 0px 0px } \
				 .cbWrapper			{ margin: 0 0 0 10px; }"
			);
	},
	
	/**
	 * Creates the content of the tab.
	 * 
	 * @param	element	tab
	 *   The tab where the content should be added.
	 */
	createTabContent: function(tab) {
		// Create the wrapper for the enabling / disabling of modules.
		var moduleContentWrapper	= this.createOptionsWrapper(tab, Language.$('optionPanel_module'));
		this.createModuleContent(moduleContentWrapper);
		
		// Create the wrapper for the update settings.
		var updateContentWrapper	= this.createOptionsWrapper(tab, Language.$('optionPanel_update'));
		this.createUpdateContent(updateContentWrapper);
		
		// Create the wrapper for the zoom settings.
		var zoomContentWrapper		= this.createOptionsWrapper(tab, Language.$('optionPanel_zoom'));
		this.createZoomContent(zoomContentWrapper);
	},
	
	/**
	 * Create a wrapper for a section on the option panel.
	 * 
	 * @param	element	tab
	 *   The tab where the wrapper should be added.
	 * @param	String	headerText
	 *   The text of the header.
	 * 
	 * @return	element
	 *   The wrapper for the content of the options.
	 */
	createOptionsWrapper: function(tab, headerText) {
		// Create the wrapper.
		var optionsWrapper	= General.addElement('div', tab, null, 'contentBox01h');
		
		// Create the header.
		var optionsHeader		= General.addElement('h3', optionsWrapper, null, 'header');
		optionsHeader.innerHTML	= headerText;
		
		// Create the content wrapper.
		var optionsWrapperContent	= General.addElement('div', optionsWrapper, null, 'content');
		
		// Create the footer.
		General.addElement('div', optionsWrapper, null, 'footer');
		
		// Return the content wrapper.
		return optionsWrapperContent;
	},
	
	/**
	 * Creates the content of the module part.
	 * 
	 * @param	element	contentWrapper
	 *   The wrapper where the content should be added.
	 */
	createModuleContent: function(contentWrapper) {
		// Create options table.
		var updateTable	= this.addOptionsTable(contentWrapper);
		
		// Get the ids.
		var id		= new Array(
				'update',
				'incomeOnTop',
				'upkeepReduction',
				'zoom',
				'loadingCircleMove',
				'tooltipsAuto',
				'hideBirds'
			);
		
		// Get the values.
		var value	= new Array(
				GM_getValue('module_updateActive', true),
				GM_getValue('module_incomeActive', true),
				GM_getValue('module_urtShortActive', true),
				GM_getValue('module_zoomActive', true),
				GM_getValue('module_lcMoveActive', true),
				GM_getValue('module_ttAutoActive', true),
				GM_getValue('module_hideBirdsActive', true)
			);
		
		// Get the labels.
		var label	= new Array(
				Language.$('optionPanel_label_updateActive'),
				Language.$('optionPanel_label_incomeOnTopActive'),
				Language.$('optionPanel_label_upkeepReductionActive'),
				Language.$('optionPanel_label_zoomActive'),
				Language.$('optionPanel_label_lcMoveActive'),
				Language.$('optionPanel_label_tooltipsAutoActive'),
				Language.$('optionPanel_label_hideBirdsActive')
			);
		
		for(var i = 0; i < id.length; i++) {
			// Create table row.
			var tr	= this.addOptionsTableRow(updateTable, true);

			// Create checkbox.
			General.addCheckbox(tr.firstChild, id[i], value[i], label[i]);
			
			// Add class for checkbox.
			tr.firstChild.classList.add('left');
		}

		// Add the button to save the settings.
		this.addSaveButton(contentWrapper);
	},
	
	/**
	 * Creates the content of the module part of the mobile version.
	 * 
	 * @param	element	contentWrapper
	 *   The wrapper where the content should be added.
	 */
	createModuleContentMobile: function(contentWrapper) {
		// Create the header.
		var moduleHeader		= General.addElement('h3', contentWrapper);
		moduleHeader.innerHTML	= Language.$('optionPanel_module');
		
		// Get the ids.
		var id		= new Array(
				'update',
				'incomeOnTop',
				'upkeepReduction'
			);
		
		// Get the values.
		var value	= new Array(
				GM_getValue('module_updateActive', true),
				GM_getValue('module_incomeActive', true),
				GM_getValue('module_urtShortActive', true)
			);
		
		// Get the labels.
		var label	= new Array(
				'&nbsp;&nbsp;' + Language.$('optionPanel_label_updateActive'),
				'&nbsp;&nbsp;' + Language.$('optionPanel_label_incomeOnTopActive'),
				'&nbsp;&nbsp;' + Language.$('optionPanel_label_upkeepReductionActive')
			);
		
		// Create the checkboxes and labels.
		for(var i = 0; i < id.length; i++) {
			// Create the checkbox wrapper.
			var p	= General.addElement('p', contentWrapper, null, null, new Array(['textAlign', 'left']));
			
			// Create the checkbox.
			var cb		= General.addElement('input', p, id[i] + 'Cb');
			cb.type		= 'checkbox';
			cb.checked	= value[i];
			
			// Create the checkbox label.
			var cbLabel			= General.addElement('label', p, id[i] + 'Label');
			cbLabel.innerHTML	= label[i];
			cbLabel.htmlFor		= 'script' + scriptInfo.id + id[i] + 'Cb';
		}
	},
	
	/**
	 * Creates the content of the update part.
	 * 
	 * @param	element	contentWrapper
	 *   The wrapper where the content should be added.
	 */
	createUpdateContent: function(contentWrapper) {
		// Create options table.
		var updateTable	= this.addOptionsTable(contentWrapper);
		var tr1			= this.addOptionsTableRow(updateTable, false);
		var tr2			= this.addOptionsTableRow(updateTable, true);

		// Create label.
		var updateIntervalLabel			= General.addElement('span', tr1.firstChild);
		updateIntervalLabel.innerHTML	= Language.$('optionPanel_label_updateInterval');

		// Array for update interval values and names.
		var opts = new Array();
		opts['value']	= new Array(
				3600,
				43200,
				86400,
				259200,
				604800,
				1209600,
				2419200
			);
		opts['name']	= new Array(
				Language.$('optionPanel_updateIntervals_hour'),
				Language.$('optionPanel_updateIntervals_hour12'),
				Language.$('optionPanel_updateIntervals_day'),
				Language.$('optionPanel_updateIntervals_day3'),
				Language.$('optionPanel_updateIntervals_week'),
				Language.$('optionPanel_updateIntervals_week2'),
				Language.$('optionPanel_updateIntervals_week4')
			);

		// Create the update interval select.
		General.addSelect(tr1.lastChild, 'updateInterval', GM_getValue('updater_updateInterval', 3600), opts);
		
		// Prepare the table row.
		tr2.firstChild.classList.add('center');
		
		// Add the link for manual updates.
		var updateLink			= General.addElement('a', tr2.firstChild);
		updateLink.href			= '#';
		updateLink.innerHTML	= Language.$('optionPanel_label_manualUpdate1') + scriptInfo.name + Language.$('optionPanel_label_manualUpdate2');
		updateLink.addEventListener('click', Updater.doManualUpdate, false);

		// Add the button to save the settings.
		this.addSaveButton(contentWrapper);
	},
	
	/**
	 * Creates the content of the update part for the mobile version.
	 * 
	 * @param	element	contentWrapper
	 *   The wrapper where the content should be added.
	 */
	createUpdateContentMobile: function(contentWrapper) {
		// Create the header.
		var updateHeader = General.addElement('h3', contentWrapper);
		updateHeader.innerHTML = Language.$('optionPanel_update');
		
		// Create the select wrapper.
		var p1	= General.addElement('p', contentWrapper, null, null, new Array(['textAlign', 'center']));

		// Create the select label.
		var selectLabel			= General.addElement('label', p1, 'updateIntervalLabel');
		selectLabel.innerHTML	= Language.$('optionPanel_label_updateInterval');
		selectLabel.htmlFor		= 'script' + scriptInfo.id + 'updateIntervalSelect';
		
		// Create the select field.
		var select	= General.addElement('select', p1, 'updateIntervalSelect');
		
		// Array for update interval values and names.
		var opts = new Array();
		opts.value	= new Array(
				3600,
				43200,
				86400,
				259200,
				604800,
				1209600,
				2419200
			);
		opts.name	= new Array(
				Language.$('optionPanel_updateIntervals_hour'),
				Language.$('optionPanel_updateIntervals_hour12'),
				Language.$('optionPanel_updateIntervals_day'),
				Language.$('optionPanel_updateIntervals_day3'),
				Language.$('optionPanel_updateIntervals_week'),
				Language.$('optionPanel_updateIntervals_week2'),
				Language.$('optionPanel_updateIntervals_week4')
			);

		// Create the select options.
		for(var i = 0; i < opts['name'].length; i++) {
			// Create new option.
			var option	= General.addElement('option', select);
			option.value	= opts['value'][i];
			option.innerHTML	= opts['name'][i];

			// If the option is the actual option, select it.
			if(opts['value'][i] == GM_getValue('updater_updateInterval', 3600)) {
				option.selected	= true;
			}
		}
		
		// Create the update link wrapper.
		var p2	= General.addElement('p', contentWrapper, null, null, new Array(['textAlign', 'center']));

		// Add the link for manual updates.
		var updateLink			= General.addElement('a', p2);
		updateLink.href			= '#';
		updateLink.innerHTML	= Language.$('optionPanel_label_manualUpdate1') + scriptInfo.name + Language.$('optionPanel_label_manualUpdate2');
		updateLink.addEventListener('click', Updater.doManualUpdate, false);
	},
	
	/**
	 * Creates the content of the zoom part.
	 * 
	 * @param	element	contentWrapper
	 *   The wrapper where the content should be added.
	 */
	createZoomContent: function(contentWrapper) {
		// Create options table.
		var zoomTable1	= this.addOptionsTable(contentWrapper);
		var tr1			= this.addOptionsTableRow(zoomTable1, false);
		var tr2			= this.addOptionsTableRow(zoomTable1, false);
		var tr3			= this.addOptionsTableRow(zoomTable1, false);
		var zoomTable2	= this.addOptionsTable(contentWrapper);
		var tr4			= this.addOptionsTableRow(zoomTable2, true);
		
		// Arrays for zoom factor values and names.
		var opts = new Array();
			opts['value']	= new Array();
			opts['name']	= new Array();
		
		// Load the arrays.
		for(var i = ZoomFunction.minZoom; i <= ZoomFunction.maxZoom; i = i + ZoomFunction.zoomStep) {
			opts.value.push(i);
			opts.name.push(i + '%');
		}
		
		// Create label for zoom world.
		var zoomWorldLabel			= General.addElement('span', tr1.firstChild);
		zoomWorldLabel.innerHTML	= Language.$('optionPanel_label_zoom_world');

		// Create the zoom world select.
		General.addSelect(tr1.lastChild, 'zoomWorld', GM_getValue('zoom_worldFactor', 100), opts);

		// Create label for zoom island.
		var zoomIslandLabel			= General.addElement('span', tr2.firstChild);
		zoomIslandLabel.innerHTML	= Language.$('optionPanel_label_zoom_island');

		// Create the zoom island select.
		General.addSelect(tr2.lastChild, 'zoomIsland', GM_getValue('zoom_islandFactor', 100), opts);

		// Create label for zoom town.
		var zoomTownLabel		= General.addElement('span', tr3.firstChild);
		zoomTownLabel.innerHTML	= Language.$('optionPanel_label_zoom_town');

		// Create the zoom town select.
		General.addSelect(tr3.lastChild, 'zoomTown', GM_getValue('zoom_townFactor', 100), opts);
		
		// Add class for checkbox.
		tr4.firstChild.classList.add('left');

		// Create checkbox.
		General.addCheckbox(tr4.firstChild, 'scaleChildren', GM_getValue('zoom_scaleChildren', true), Language.$('optionPanel_label_scaleChildren'));
		
		// Add the button to save the settings.
		this.addSaveButton(contentWrapper);
	},
	
	/**
	 * Adds a new options table.
	 * 
	 * @param	element	wrapper
	 *   The wrapper where the table should be added.
	 * 
	 * @return	element
	 *   The body of the new table.
	 */
	addOptionsTable: function(wrapper) {
		// Create table and tablebody.
		var table	= General.addElement('table', wrapper, 'moduleContent');
		var tableBody	= General.addElement('tbody', table);

		// Add classes.
		table.classList.add('table01');
		
		// Return the table body.
		return tableBody;
	},
	
	/**
	 * Adds a new table row to a options table.
	 * 
	 * @param	element	optionsTableBody
	 *   The table body where the table should be added.
	 * @param	boolean	oneCell
	 *   Decides if there is one cell or there are two cells.
	 * 
	 * @return	element
	 *   The new table row.
	 */
	addOptionsTableRow: function(optionsTableBody, oneCell) {
		// Create the new table row.
		var tr	= General.addElement('tr', optionsTableBody);

		// Create first cell.
		var td1	= General.addElement('td', tr);

		// If just ond cell.
		if(oneCell) {
			// Set width of cell to width of two cells.
			td1.colSpan = 2;
			
		// Otherwise.
		} else {
			// Create second cell.
			var td2	= General.addElement('td', tr, null, 'left');
		}

		// Return the table row.
		return tr;
	},
	
	/**
	 * Creates a commit Button and adds it to a parent.
	 * 
	 * @param	element	parent
	 *   The parent element.
	 * 
	 * @return	element
	 *   The save button.
	 */
	addSaveButton: function(parent) {
		// Create the button wrapper.
		var buttonWrapper		= General.addElement('div', parent, null, 'centerButton');
		
		// Create the button.
		var saveButton			= General.addElement('input', buttonWrapper, null, 'button');
		saveButton.type			= 'submit';
		saveButton.value		= Language.$('optionPanel_save');
		
		// Add a click action to the button.
		saveButton.addEventListener('click', EventHandling.optionPanel.saveSettings, false);
		
		return saveButton;
	},
	
	/**
	 * Save the settings.
	 */
	saveSettings: function() {
		// Save the module settings.
		GM_setValue('module_updateActive', General.$('#script' + scriptInfo.id + 'updateCb').checked);
		GM_setValue('module_incomeActive', General.$('#script' + scriptInfo.id + 'incomeOnTopCb').checked);
		GM_setValue('module_urtShortActive', General.$('#script' + scriptInfo.id + 'upkeepReductionCb').checked);
		GM_setValue('module_zoomActive', General.$('#script' + scriptInfo.id + 'zoomCb').checked);
		GM_setValue('module_lcMoveActive', General.$('#script' + scriptInfo.id + 'loadingCircleMoveCb').checked);
		GM_setValue('module_ttAutoActive', General.$('#script' + scriptInfo.id + 'tooltipsAutoCb').checked);
		GM_setValue('module_hideBirdsActive', General.$('#script' + scriptInfo.id + 'hideBirdsCb').checked);
		
		// Save the update settings.
		GM_setValue('updater_updateInterval', General.getInt(General.getSelectValue('updateIntervalSelect')));
		
		// Save the zoom function settings.
		GM_setValue('zoom_worldFactor', General.getInt(General.getSelectValue('zoomWorldSelect')));
		GM_setValue('zoom_islandFactor', General.getInt(General.getSelectValue('zoomIslandSelect')));
		GM_setValue('zoom_townFactor', General.getInt(General.getSelectValue('zoomTownSelect')));
		GM_setValue('zoom_scaleChildren', General.$('#script' + scriptInfo.id + 'scaleChildrenCb').checked);
		
		// Show success hint.
		General.showTooltip('cityAdvisor', 'confirm', Language.$('general_successful'));
	},
	
	/**
	 * Save the settings (mobile).
	 */
	saveSettingsMobile: function() {
		// Save the module settings.
		GM_setValue('module_updateActive', General.$('#script' + scriptInfo.id + 'updateCb').checked);
		GM_setValue('module_incomeActive', General.$('#script' + scriptInfo.id + 'incomeOnTopCb').checked);
		GM_setValue('module_urtShortActive', General.$('#script' + scriptInfo.id + 'upkeepReductionCb').checked);
		
		// Save the update settings.
		GM_setValue('updater_updateInterval', General.getInt(General.getSelectValue('updateIntervalSelect')));
		
		// Show success hint.
		General.$('#script' + scriptInfo.id + 'saveHint').innerHTML	= Language.$('general_successful');

		// Delete the hint after 3 seconds.
		setTimeout(OptionPanel.deleteSaveHintMobile, 3000);
	},
	
	/**
	 * Delete the save hint.
	 */
	deleteSaveHintMobile: function() {
		General.$('#script' + scriptInfo.id + 'saveHint').innerHTML	= '';
	},
};

/**
 * Functions for zooming mobile, desktop and town view.
 */
ZoomFunction = {
	/**
	 * The minimal zoom factor in percent.
	 */
	minZoom: 55,
	
	/**
	 * The maximal zoom factor in percent.
	 */
	maxZoom: 150,
	
	/**
	 * The step between two zoom factors in percent.
	 */
	zoomStep: 5,
	
	/**
	 * Init the zooming.
	 */
	init: function() {
		// Set the max and min zoom.
		this.minZoom = Math.round(ika.worldview_scale_min * 100);
		ika.worldview_scale_max = this.maxZoom / 100;
		
		// Get the scrollDiv depending on the view.
		if(View.name == 'world') {
			scrollDiv = General.$('#map1');
		} else {
			scrollDiv = General.$('#worldmap');
		}
		
		// Remove the mouse wheel listener.
		win.Event.removeListener(scrollDiv, 'DOMMouseScroll');
		win.Event.removeListener(scrollDiv, 'mousewheel');

		// Get the zooming factor.
		var factorP = GM_getValue('zoom_' + View.name + 'Factor', 100);
		
		// If the factor ist smaller than allowed, reset it to the min allowed.
		if(factorP < this.minZoom) {
			factorP = this.minZoom;
			GM_setValue('zoom_' + View.name + 'Factor', factorP);
		}
		
		// If the factor ist bigger than allowed, reset it to the max allowed.
		if(factorP > this.maxZoom) {
			factorP = this.maxZoom;
			GM_setValue('zoom_' + View.name + 'Factor', factorP);
		}

		// Get the factor as normal number, not as percentage.
		factor = factorP / 100.0;

		// Zoom.
		this.zoom(factor);

		// Scale child elements which should be scaled if enabled.
		if(GM_getValue('zoom_scaleChildren', true))	setTimeout(function() { ZoomFunction.scaleChildren(factor) }, 0);

		// Add the zoom Buttons.
		this.addZoomButtons(factorP);
	},
	
	/**
	 * Add the Buttons for zooming to the view (city and island).
	 */
	addZoomButtons: function(factorP) {
		// If it is world view, Show no buttons.
		if(View.name == 'world') {
			return;
		}
		
		// Get the help element in the GF toolbar
		gfToolbar	= General.$('#GF_toolbar');
		
		// Create the zoom buttons.
		zoomWrapper	= General.addElement('div', gfToolbar, 'zoomWrapper');
		zoomIn		= General.addElement('div', zoomWrapper, 'zoomIn', 'maximizeImg');
		zoomOut		= General.addElement('div', zoomWrapper, 'zoomOut', 'minimizeImg');
		
		// Add the event listener.
		zoomIn.addEventListener('click', EventHandling.zoomFunction.zoomIn, false);
		zoomOut.addEventListener('click', EventHandling.zoomFunction.zoomOut, false);
		
		// Hide the zoom in button if the max zoom is reached.
		if(factorP == this.maxZoom) {
			zoomIn.classList.add('invisible');
		}
		
		// Hide the zoom out button if the min zoom is reached.
		if(factorP == this.minZoom) {
			zoomOut.classList.add('invisible');
		}

		// Add the styles.
		GM_addStyle(
				"#script" + scriptInfo.id + "zoomWrapper	{ position: absolute; top: 0px; right: 0px; -moz-transform: scale(0.75); msTransform: scale(0.75); -o-transform: scale(0.75); -webkit-transform: scale(0.75); transform: scale(0.75); } \
				 #script" + scriptInfo.id + "zoomIn			{ float: left; margin-right: 20px; } \
				 #script" + scriptInfo.id + "zoomOut		{ margin-left: 20px; }"
			);
	},
	
	/**
	 * Zooms the view.
	 * 
	 * @param	float	factor
	 *   The factor which is used.
	 * @param	String	view
	 *   The name of the view.
	 */
	zoom: function(factor) {
		// Get the center position of the worldmap.
		var worldview	= General.$('#worldview');
		var posX		= worldview.offsetLeft + worldview.offsetWidth / 2;
		var posY		= worldview.offsetTop + worldview.offsetHeight / 2;
		
		// Get the game scaling factor depending on the view.
		switch(View.name) {
			case 'world':
				this.zoomWorld(factor);
				return;
			  break;
			
			case 'island':
				scale = ika.worldview_scale_island;
			  break;
			
			case 'town':
				scale = ika.worldview_scale_city;
			  break;
			
			default:
				return;
			  break;
		}
		
		// Get the number of steps to zoom.
		var stepNumber = Math.round((factor - scale) / .05);
		
		// Zoom.
		ika.controller.scaleWorldMap(stepNumber, posX, posY);
	},
	
	/**
	 * Zoom the world view.
	 * 
	 * @param	float	factor
	 *   The factor which is used.
	 */
	zoomWorld: function(factor) {
		// Get the factor the scrollcover must be moved.
		var translateXY	= (100 - 100 / factor) / 2;

		// Get the new height and width of the scrollcover.
		var heightWidth	= 100 / factor;
		
		// Add the new style.
		GM_addStyle(
				"#scrollcover { -moz-transform: scale(" + factor + ") translate(" + translateXY + "%, " + translateXY + "%); msTransform: scale(" + factor + ") translate(" + translateXY + "%, " + translateXY + "%); -o-transform: scale(" + factor + ") translate(" + translateXY + "%, " + translateXY + "%); -webkit-transform: scale(" + factor + ") translate(" + translateXY + "%, " + translateXY + "%); transform: scale(" + factor + ") translate(" + translateXY + "%, " + translateXY + "%); height: " + heightWidth + "% !important; width: " + heightWidth + "% !important; }"
			);
		
		// Get the map.
		map = General.$('#map1');
		
		// Set the new offset.
		newWmTop		= 0;
		newWmLeft		= 0;
		
		// Apply the new offset to the map.
		map.style.top	= newWmTop + 'px';
		map.style.left	= newWmLeft + 'px';
	},
	
	/**
	 * Scales the children of the worldmap / island view.
	 * 
	 * @param	float	factor
	 *   The factor which is used.
	 * @param	String	view
	 *   The name of the view.
	 */
	scaleChildren: function(factor) {
		// Which view is used?
		switch(View.name) {
			// Worldview.
			case 'world':
				GM_addStyle(
						".wonder, .tradegood, .cities, .ownerstate	{ -moz-transform: scale(" + 1 / factor + "); msTransform: scale(" + 1 / factor + "); -o-transform: scale(" + 1 / factor + "); -webkit-transform: scale(" + 1 / factor + "); transform: scale(" + 1 / factor + "); } \
						 .cities									{ bottom: 10px !important; }"
					);
			  break;
			
			// Island view.
			case 'island':
				GM_addStyle(
						".scroll_img	{ -moz-transform: scale(" + 1 / factor + "); msTransform: scale(" + 1 / factor + "); -o-transform: scale(" + 1 / factor + "); -webkit-transform: scale(" + 1 / factor + "); transform: scale(" + 1 / factor + "); }"
					);
			  break;
			
			// default do nothing.
			default:
				return;
			  break;
		}
	},
};

/**
 * Functions for updater.
 */
Updater = {
	/**
	 * Stores if the update was instructed by the user.
	 */
	manualUpdate: false,

	/**
	 * Init the Updater.
	 */
	init: function() {
		// Get the difference between now and the last check.
		var lastCheck	= GM_getValue('updater_lastUpdateCheck', 0);
		var now			= new Date();
		var millis		= now.getTime();
		var diff		= millis - lastCheck;
		
		// If the module is active and the last update is enough time before, check for updates.
		if(GM_getValue('module_updateActive', true) && diff > GM_getValue('updater_updateInterval', 3600) * 1000) {
			// No manual Update.
			this.manualUpdate = false;

			// Check for Updates.
			this.checkForUpdates();
			
			// Set the time for the last update check to now.
			GM_setValue('updater_lastUpdateCheck', millis + '');
		}
	},
	
	/**
	 * Search manually for updates.
	 */
	doManualUpdate: function() {
		// No manual Update.
		Updater.manualUpdate = true;

		// Check for Updates.
		Updater.checkForUpdates();
		
		// Set the time for the last update check to now.
		var now			= new Date();
		var millis		= now.getTime();
		GM_setValue('updater_lastUpdateCheck', millis + '');
	},

	/**
	 * Check for updates for the Script.
	 * 
	 * @return	boolean
	 *   If there is a newer version.
	 */
	checkForUpdates: function() {
		// Send a request to the userscripts.org server to get the metadata of the script to check if there is a new Update.
		var test = GM_xmlhttpRequest({
				method: 'GET',
				url: 'http://userscripts.org/scripts/source/' + scriptInfo.id + '.meta.js',
				headers: {'User-agent': 'Mozilla/5.0', 'Accept': 'text/html'},
				onload: function(response) {
					// Extract the metadata from the response.
					var metadata = Updater.formatMetadata(response.responseText);
					
					// If the installed script version is smaller than the metadata script version (= new update available).
					if(scriptInfo.version < metadata.version) {
						// Show updata dialogue.
						Updater.showUpdateInfo(metadata);

					// If there is no new update and it was a manual update show hint.
					} else if(Updater.manualUpdate)	{
						General.showTooltip('cityAdvisor', 'error', Language.$('update_noNewExist'));
					}
				},
			});
	},
	
	/**
	 * Show the update information panel.
	 * 
	 * @param	mixed[]	metadata
	 *   Array with formated metadata
	 */
	showUpdateInfo: function(metadata) {
		// Get the update history.
		var updateHistory = this.extractUpdateHistory(metadata);
		
		// Set the Updater styles.
		this.setStyles();
		
		// Create the background and the container.
		var updateBackground		= General.addElement('div', document.body, 'updateBackground');
		var updatePanelContainer	= General.addElement('div', document.body, 'updatePanelContainer');
		var updatePanel				= General.addElement('div', updatePanelContainer, 'updatePanel');
		
		// Create the update panel header.
		var updatePanelHeader		= General.addElement('div', updatePanel, 'updatePanelHeader');
		var updatePanelHeaderL		= General.addElement('div', updatePanelHeader, 'updatePanelHeaderL');
		var updatePanelHeaderR		= General.addElement('div', updatePanelHeaderL, 'updatePanelHeaderR');
		var updatePanelHeaderM		= General.addElement('p', updatePanelHeaderR, 'updatePanelHeaderM');
		
		// Create the update panel body.
		var updatePanelBody			= General.addElement('div', updatePanel, 'updatePanelBody');
		var updatePanelBodyL		= General.addElement('div', updatePanelBody, 'updatePanelBodyL');
		var updatePanelBodyR		= General.addElement('div', updatePanelBodyL, 'updatePanelBodyR');
		var updatePanelBodyM		= General.addElement('div', updatePanelBodyR, 'updatePanelBodyM');
		var updatePanelBodyMTop		= General.addElement('p', updatePanelBodyM, 'updatePanelBodyMTop');
		var updatePanelBodyMBottom	= General.addElement('div', updatePanelBodyM, 'updatePanelBodyMBottom');
		
		// Create the update panel footer.
		var updatePanelFooter		= General.addElement('div', updatePanel, 'updatePanelFooter');
		var updatePanelFooterL		= General.addElement('div', updatePanelFooter, 'updatePanelFooterL');
		var updatePanelFooterR		= General.addElement('div', updatePanelFooterL, 'updatePanelFooterR');
		var updatePanelFooterM		= General.addElement('div', updatePanelFooterR, 'updatePanelFooterM');
		
		// Create the install button.
		var updatePanelInstall		= General.addElement('input', updatePanel, 'updatePanelInstall');
		updatePanelInstall.type		= 'button';
		updatePanelInstall.value	= Language.$('update_install');
		
		// Create the close button.
		var updatePanelCB			= General.addElement('input', updatePanel, 'updatePanelCB');
		updatePanelCB.type			= 'button';
		updatePanelCB.value			= Language.$('update_close');
		
		// Insert the texts into header, body and footer.
		updatePanelHeaderM.innerHTML		= Language.$('update_header') + '<span><a><img id="script' + scriptInfo.id + 'updatePanelClose" src="skin/layout/notes_close.png"></a></span>';
		updatePanelBodyMTop.innerHTML		= Language.$('update_text1') + '<a href="http://userscripts.org/scripts/show/' + scriptInfo.id + '" target="_blank" >' + scriptInfo.name + '</a>' + Language.$('update_text2') + '.<br>' + Language.$('update_text3') + scriptInfo.version + Language.$('update_text4') + metadata.version + '.<br>&nbsp;&nbsp;<b><u>' + Language.$('update_hist') + ':</u></b>';
		updatePanelBodyMBottom.innerHTML	= this.formatUpdateHistory(updateHistory);
		updatePanelFooterM.innerHTML		= scriptInfo.name + ' v' + scriptInfo.version;
		
		// Add event listener to the buttons to close / install.
		General.$('#script' + scriptInfo.id + 'updatePanelClose').addEventListener('click', this.closeUpdatePanel, false);
		updatePanelInstall.addEventListener('click', this.installScript, false);
		updatePanelCB.addEventListener('click', this.closeUpdatePanel, false);
	},
	
	/**
	 * Set the styles that are used for the update panel.
	 */
	setStyles: function() {
		// Add all update styles to the ikariam page.
		GM_addStyle(
				"#script" + scriptInfo.id + "updateBackground			{ z-index: 1000000000000; position: fixed; visibility: visible; top: 0px; left: 0px; width: 100%; height: 100%; padding: 0; background-color: #000; opacity: .7; } \
				 #script" + scriptInfo.id + "updatePanelContainer		{ z-index: 1000000000001; position: fixed; visibility: visible; top: 100px; left: 50%; width: 500px; height: 370px; margin-left: -250px; padding: 0; text-align: left; color: #542C0F; font: 12px Arial,Helvetica,sans-serif; } \
				 #script" + scriptInfo.id + "updatePanel				{ position: relative; top: 0px; left: 0px; background-color: transparent; border: 0 none; overflow: hidden; } \
				 #script" + scriptInfo.id + "updatePanelHeader			{ height: 39px; background: none repeat scroll 0 0 transparent; font-weight: bold; line-height: 2; white-space: nowrap; } \
				 #script" + scriptInfo.id + "updatePanelHeaderL			{ height: 39px; background-image: url('skin/layout/notes_top_left.png'); background-position: left top; background-repeat: no-repeat; } \
				 #script" + scriptInfo.id + "updatePanelHeaderR			{ height: 39px; background-image: url('skin/layout/notes_top_right.png'); background-position: right top; background-repeat: no-repeat; } \
				 #script" + scriptInfo.id + "updatePanelHeaderM			{ height: 39px; margin: 0 14px 0 38px; padding: 12px 0 0; background-image: url('skin/layout/notes_top.png'); background-position: left top; background-repeat: repeat-x; color: #811709; line-height: 1.34em; } \
				 #script" + scriptInfo.id + "updatePanelHeaderM span	{ text-align: right; display: block; margin: -15px 0 0; } \
				 #script" + scriptInfo.id + "updatePanelBody			{ height: 311px; background: none repeat scroll 0 0 transparent; } \
				 #script" + scriptInfo.id + "updatePanelBodyL			{ height: 100%; background-image: url('skin/layout/notes_left.png'); background-position: left top; background-repeat: repeat-y; } \
				 #script" + scriptInfo.id + "updatePanelBodyR			{ height: 100%; background-image: url('skin/layout/notes_right.png'); background-position: right top; background-repeat: repeat-y; } \
				 #script" + scriptInfo.id + "updatePanelBodyM			{ height: 100%; background-color: #F7E7C5; background-image: none;  margin: 0 6px; padding: 0 10px; font-size: 14px; } \
				 #script" + scriptInfo.id + "updatePanelBodyMTop		{ height: 100px; line-height: 2; } \
				 #script" + scriptInfo.id + "updatePanelBodyMTop b		{ line-height: 3.5; font-size:110%; } \
				 #script" + scriptInfo.id + "updatePanelBodyM a			{ color: #811709; font-weight: bold; } \
				 #script" + scriptInfo.id + "updatePanelBodyMBottom		{ height: 170px; padding: 10px; background: url('skin/input/textfield.png') repeat-x scroll 0 0 #FFF7E1; border: 1px dotted #C0C0C0; font: 14px Arial,Helvetica,sans-serif; color: #000000; border-collapse: separate; overflow-y:auto; } \
				 #script" + scriptInfo.id + "updatePanelBodyMBottom h2	{ font-weight: bold; } \
				 .script" + scriptInfo.id + "updateTable				{ border-collapse: separate; border-spacing: 2px; } \
				 .script" + scriptInfo.id + "updateDataType				{ width: 100px; padding: 5px 0px 5px 5px; border: 1px solid #D2A860; } \
				 .script" + scriptInfo.id + "updateDataInfo				{ width: 300px; padding: 5px 5px 5px 20px; border: 1px solid #D2A860; } \
				 .script" + scriptInfo.id + "updateDataInfo ul li		{ list-style: disc outside none; } \
				 #script" + scriptInfo.id + "updatePanelFooter			{ height: 20px; background: none repeat scroll 0 0 transparent; } \
				 #script" + scriptInfo.id + "updatePanelFooterL			{ height: 100%; background-image: url('skin/layout/notes_left.png'); background-position: left top; background-repeat: repeat-y; border: 0 none; } \
				 #script" + scriptInfo.id + "updatePanelFooterR			{ height: 21px; background-image: url('skin/layout/notes_br.png'); background-position: right bottom; background-repeat: no-repeat; } \
				 #script" + scriptInfo.id + "updatePanelFooterM			{ background-color: #F7E7C5; border-bottom: 3px solid #D2A860; border-left: 2px solid #D2A860; margin: 0 23px 0 3px; padding: 5px 0 0; font-size: 77%; } \
				 #script" + scriptInfo.id + "updatePanelClose			{ cursor: pointer } \
				 #script" + scriptInfo.id + "updatePanelInstall			{ background: url('skin/input/button.png') repeat-x scroll 0 0 #ECCF8E; bottom: -4px; position: absolute; border-color: #C9A584 #5D4C2F #5D4C2F #C9A584; border-style: double; border-width: 3px; cursor: pointer; display: inline; font-weight: bold; margin: 10px auto; padding: 2px 10px; text-align: center; font-size: 12px; left: 50%; margin-left: -105px; width: 100px; } \
				 #script" + scriptInfo.id + "updatePanelInstall:hover	{ color: #FFFFFF; text-decoration: none; } \
				 #script" + scriptInfo.id + "updatePanelInstall:active	{ border-color: #5D4C2F #C9A584 #C9A584 #5D4C2F; border-style: double; border-width: 3px; padding: 3px 10px 1px; } \
				 #script" + scriptInfo.id + "updatePanelCB				{ background: url('skin/input/button.png') repeat-x scroll 0 0 #ECCF8E; bottom: -4px; position: absolute; border-color: #C9A584 #5D4C2F #5D4C2F #C9A584; border-style: double; border-width: 3px; cursor: pointer; display: inline; font-weight: bold; margin: 10px auto; padding: 2px 10px; text-align: center; font-size: 12px; left: 50%; margin-left: 5px; width: 100px; } \
				 #script" + scriptInfo.id + "updatePanelCB:hover		{ color: #FFFFFF; text-decoration: none; } \
				 #script" + scriptInfo.id + "updatePanelCB:active		{ border-color: #5D4C2F #C9A584 #C9A584 #5D4C2F; border-style: double; border-width: 3px; padding: 3px 10px 1px; }"
			);
	},
	
	/**
	 * Format the given metadata.
	 * 
	 * @param	String	metadata
	 *   The metadata to format.
	 * 
	 * @return	String[]
	 *   The formated metadata as array.
	 */
	formatMetadata: function(metadataIn) {
		// Create an array for the formated metadata.
		var metadataOut = new Array();

		// Extract the tags from the metadata.
		var innerMeta = metadataIn.match(/\/\/ ==UserScript==((.|\n|\r)*?)\/\/ ==\/UserScript==/)[0];
		
		// If there are some tags.
		if(innerMeta) {
			// Extract all tags.
			var tags = innerMeta.match(/\/\/ @(.*?)(\n|\r)/g);
			
			// Loop over all tags.
			for(var i = 0; i < tags.length; i++) {
				// Extract the data from the tag.
				var tmp = tags[i].match(/\/\/ @(.*?)\s+(.*)/);
				
				// If there is no data with this tag create a new array to store all data with this tag.
				if(!metadataOut[tmp[1]]) {
					metadataOut[tmp[1]] = new Array(tmp[2]);

				// Otherwise add the data to the existing array.
				} else {
					metadataOut[tmp[1]].push(tmp[2]);
				}
			}
		}
		
		// Return the formated metadata.
		return metadataOut;
	},
	
	/**
	 * Extract the update history from the metadata.
	 * 
	 * @param	String[]	metadata
	 *   Array with the formated metadata.
	 * 
	 * @return	mixed[]
	 *   The extracted update history.
	 */
	extractUpdateHistory: function(metadata) {
		// Create variable to store the update history.
		var updateHistory = new Array();
		
		// Loop over all update history data.
		for(var i = 0; i < metadata['history'].length; i++) {
			// Get the information from the update history data.
			var tmp = metadata['history'][i].match(/^(\S+)\s+(\S+)\s+(.*)$/);
			
			// If there is no array for this version create one.
			if(!updateHistory[tmp[1]]) {
				updateHistory[tmp[1]] = new Array();
			}
			
			// If it is a feature store it to feature in this version.
			if(tmp[2] == 'Feature:') {
				if(!updateHistory[tmp[1]]['feature']) {
					updateHistory[tmp[1]]['feature'] = new Array(tmp[3]);
				} else {
					updateHistory[tmp[1]]['feature'].push(tmp[3]);
				}

			// If it is a bugfix store it to bugfix in this version.
			} else if(tmp[2] == 'Bugfix:') {
				if(!updateHistory[tmp[1]]['bugfix']) {
					updateHistory[tmp[1]]['bugfix'] = new Array(tmp[3]);
				} else {
					updateHistory[tmp[1]]['bugfix'].push(tmp[3]);
				}
			
			// Otherwise store it to other in this version.
			} else {
				if(!updateHistory[tmp[1]]['other']) {
					updateHistory[tmp[1]]['other'] = new Array(tmp[2] + " " + tmp[3]);
				} else {
					updateHistory[tmp[1]]['other'].push(tmp[2] + " " + tmp[3]);
				}
			}
		}
		
		// Return the update history.
		return updateHistory;
	},
	
	/**
	 * Format the update history.
	 * 
	 * @param	mixed[]	updateHistory
	 *   The update history.
	 * 
	 * @return	String
	 *   The formated update history.
	 */
	formatUpdateHistory: function(updateHistory) {
		// Get the labels for the types.
		var types = {
			feature:	Language.$('update_feature'),
			bugfix:		Language.$('update_bugfix'),
			other:		Language.$('update_other'),
		};

		// Create a var for the formated update history.
		var formatedUpdateHistory = '';
		
		// Loop over all versions.
		for(var version in updateHistory) {
			// Create a headline for each version and start a table.
			formatedUpdateHistory += '<h2>v ' + version + '</h2><br><table class="script' + scriptInfo.id + 'updateTable"><tbody>';
			
			// Loop over all types.
			for(var type in updateHistory[version]) {
				// Create a table row for each type and start a list for the elements.
				formatedUpdateHistory += '<tr><td class="script' + scriptInfo.id + 'updateDataType">' + types[type] + '</td><td class="script' + scriptInfo.id + 'updateDataInfo"><ul>';
				
				// Loop over the elements and add them to the list.
				for(var i = 0 ; i < updateHistory[version][type].length; i++) {
					formatedUpdateHistory += '<li>' + updateHistory[version][type][i] + '</li>';
				}
				
				// End the list.
				formatedUpdateHistory += '</ul></td></tr>';
			}
			
			// End the table.
			formatedUpdateHistory += '</tbody></table><br>';
		}
		
		// Return the formated update history.
		return formatedUpdateHistory;
	},
	
	/**
	 * Opens the install dialogue and closes the update panel.
	 */
	installScript: function() {
		// Close the update panel.
		Updater.closeUpdatePanel();

		// Open the install dialogue
		top.location.href = 'http://userscripts.org/scripts/source/' + scriptInfo.id + '.user.js';
	},
	
	/**
	 * Removes everything of the updater from the website.
	 */
	closeUpdatePanel: function() {
		// Remove the update background.
		document.body.removeChild(General.$('#script' + scriptInfo.id + 'updateBackground'));

		// Remove the update panel.
		document.body.removeChild(General.$('#script' + scriptInfo.id + 'updatePanelContainer'));
	},
};

/**
 * Functions for language.
 */
Language = {
	/**
	 * The name of the language which is actually set.
	 */
	name: 'english',
	
	/**
	 * The text of the used language.
	 */
	text: null,
	
	/**
	 * Init the language and set the used language code.
	 */
	init: function() {
		// Split the host string.
		var lang = top.location.host.split('.');
		
		// Set the language name.
		this.setLangName(lang ? lang[1] : 'en');

		this.setText();
	},
	
	/**
	 * Set the name of the used language.
	 * 
	 * @param	String	code
	 *   The laguage code.
	 */
	setLangName: function(code) {
		// Languages which are already implemented.
		var implemented = new Array('english', 'german');
		
		// All languages.
		var languageName = {
			ae: 'arabic',		ar: 'spanish',		ba: 'bosnian',		bg: 'bulgarian',	br: 'portuguese',	by: 'russian',
			cl: 'spanish',		cn: 'chinese',		co: 'spanish',		cz: 'czech',		de: 'german',		dk: 'danish',
			ee: 'estonian',		en: 'english',		es: 'spanish',		fi: 'finish',		fr: 'french',		gr: 'greek',
			hk: 'chinese',		hr: 'bosnian',		hu: 'hungarian',	id: 'indonesian',	il: 'hebrew',		it: 'italian',
			kr: 'korean',		lt: 'lithuanian',	lv: 'latvian',		mx: 'spanish',		nl: 'dutch',		no: 'norwegian',
			pe: 'spanish',		ph: 'filipino',		pk: 'urdu',			pl: 'polish',		pt: 'portuguese',	ro: 'romanian',
			rs: 'serbian',		ru: 'russian',		se: 'swedish',		si: 'slovene',		sk: 'slovak',		tr: 'turkish',
			tw: 'chinese',		ua: 'ukranian',		us: 'english',		ve: 'spanish',		vn: 'vietnamese',	yu: 'bosnian'
		}[code];
		
		// Look up if implemented contains the language.
		for(var i = 0; i < implemented.length; i++) {
			// If the language is implemented set the name to it and return.
			if(implemented[i] == languageName) {
				this.name = languageName;
				return;
			}
		}

		// If the language is not implemented, set the language to english.
		this.name = 'english';
	},
	
	/*
	 * Set the text for the script.
	 */
	setText: function() {
		this.text = {
			// English text.
			'english': {
				settings: {
					kiloSep:	',',
					decSep:		'.',
					left2right:	true,
				},
				general: {
					successful:	'Your order has been carried out.',
					error:		'There was an error in your request.',
				},
				balance: {
					income: {
						perHour:	'Income per hour',
						perDay:		'Income per day',
						start:		'Income without reduction',
					},
					upkeep: {
						reason: {
							0:		'Troops',
							1:		'Ships',
							2:		'Troops &amp; Ships',
						},
						basic:		'Basic Costs',
						supply:		'Supply Costs',
						result:		'Total Costs',
					},
				},
				optionPanel: {
					scripts:	'Scripts',
					update:		'Update',
					module:		'Modules',
					zoom:		'Zoom function',
					save:		'Save settings!',
					label: {
						updateActive:			'Search for updates automatically',
						incomeOnTopActive:		'Show income on top in Balance view',
						upkeepReductionActive:	'Show a short version of the upkeep reduction',
						zoomActive:				'Activate zoom in world view, island view, town view',
						lcMoveActive:			'Move loading circle to position bar',
						tooltipsAutoActive:		'Show tooltips in alliance mebers view and military advisor automatically',
						hideBirdsActive:		'Hide the bird swarm.',
						updateInterval:			'Interval to search for updates:',
						manualUpdate1:			'Search for updates for "',
						manualUpdate2:			'"!',
						zoom: {
							world:	'Zoom world view:',
							island:	'Zoom island view:',
							town:	'Zoom town view:',
						},
						scaleChildren:			'Let banners and symbols in normal size when zooming world view or island view',
					},
					updateIntervals: {
						hour:	'1 hour',
						hour12:	'12 hours',
						day:	'1 day',
						day3:	'3 days',
						week:	'1 week',
						week2:	'2 weeks',
						week4:	'4 weeks',
					},
				},
				update: {
					header:		'Update available',
					text1:		'There is an update for ',
					text2:		' available',
					text3:		'At the moment there is version ',
					text4:		' installed. The newest version is ',
					hist:		'Version History',
					feature:	'Feature(s)',
					bugfix:		'Bugfix(es)',
					other:		'',
					install:	'Install',
					close:		'Close',
					noNewExist:	'There is no new version available!',
				},
			},
			// German text.
			'german': {
				settings: {
					kiloSep:	'.',
					decSep:		',',
					left2right:	true,
				},
				general: {
					successful:	'Dein Befehl wurde ausgeführt.',
					error:		'Es gab einen Fehler in deiner Anfrage!',
				},
				balance: {
					income: {
						perHour:	'Einkommen pro Stunde',
						perDay:		'Einkommen pro Tag',
						start:		'Einkommen ohne Abz&uuml;ge',
					},
					upkeep: {
						reason: {
							0:		'Truppen',
							1:		'Schiffe',
							2:		'Truppen &amp; Schiffe',
						},
						basic:		'Grundkosten',
						supply:		'Versorgungskosten',
						result:		'Gesamtkosten',
					},
				},
				optionPanel: {
					scripts:	'Scripte',
					update:		'Aktualisierungen',
					module:		'Module',
					zoom:		'Zoom Funktion',
					save:		'Einstellungen speichern!',
					label: {
						updateActive:			'Automatisch nach Updates suchen',
						incomeOnTopActive:		'Einkommen in der Bilanz auch oben anzeigen',
						upkeepReductionActive:	'Eine gekürzte Version der Einkommensreduktion anzeigen',
						zoomActive:				'Zoomen in Weltansicht, Inselansicht und Stadtansicht aktivieren',
						lcMoveActive:			'Ladekreis in Positionsleiste verschieben',
						tooltipsAutoActive:		'Tooltips in Allianzmitgliederliste und Milit&auml;rberater automatisch anzeigen',
						hideBirdsActive:		'Den Vogelschwarm nicht anzeigen.',
						updateInterval:			'In folgenden Zeitabst&auml;nden nach Updates suchen:',
						manualUpdate1:			'Nach Updates f&uuml;r "',
						manualUpdate2:			'" suchen!',
						zoom: {
							world:	'Zoom in der Weltkarte:',
							island:	'Zoom in der Inselansicht:',
							town:	'Zoom in der Stadtansicht:',
						},
						scaleChildren:			'Beschriftungen und Hinweissymbole beim Zoomen in der Weltkarte und Inselansicht in Normalgr&ouml;&szlig;e belassen',
					},
					updateIntervals: {
						hour:	'1 Stunde',
						hour12:	'12 Stunden',
						day:	'1 Tag',
						day3:	'3 Tage',
						week:	'1 Woche',
						week2:	'2 Wochen',
						week4:	'4 Wochen',
					},
				},
				update: {
					header:		'Aktualisierung verf&uuml;gbar',
					text1:		'Es ist ein Update f&uuml;r ',
					text2:		' verf&uuml;gbar',
					text3:		'Zur Zeit ist Version ',
					text4:		' installiert. Die neueste Version ist ',
					hist:		'Versionshistorie',
					feature:	'Neuerung(en)',
					bugfix:		'Bugfix(e)',
					other:		'',
					install:	'Installieren',
					close:		'Schließen',
					noNewExist:	'Keine neue Version verfügbar!',
				},
			},
		}[this.name];
	},
	
	/**
	 * Return the name of the actually used language.
	 * 
	 * @return	String
	 *   The country code.
	 */
	getLangName: function() {
		return this.name;
	},
	
	/**
	 * Synonymous function for Language.getText().
	 * 
	 * @param	String	name
	 *   The name of the placeholder.
	 * 
	 * @return	mixed
	 *   The text.
	 */
	$: function(name) {
		return this.getText(name);
	},
	
	/**
	 * Return the name of the actually used language.
	 * 
	 * @param	String	name
	 *   The name of the placeholder.
	 * 
	 * @return	mixed
	 *   The text.
	 */
	getText: function(name) {
		// Set the text to the placeholder.
		var erg = name;
		
		// Split the placeholder.
		var parts = name.split('_');
		
		// If the splitting was successful.
		if(parts) {
			// Set txt to the "next level".
			var txt = this.text[parts[0]];
			
			// Loop over all parts.
			for(var i = 1; i < parts.length; i++) {
				// If the "next level" exists, set txt to it.
				if(txt && typeof txt[parts[i]] != 'undefined') {
					txt = txt[parts[i]];
				} else {
					txt = erg;
					break;
				}
			}
			
			// If the text type is not an object, a function or undefined.
			if(typeof txt != 'object' && typeof txt != 'function' && typeof txt != 'undefined') {
				erg = txt;
			}
		}
		
		// Return the text.
		return erg;
	},
};

/**
 * The main function of the script.
 */
function main() {
	// Init the script.
	General.init();
	
	// Init the language.
	Language.init();

	// Set the general styles for the script.
	General.setStyles();

	// Call the function to check for updates.
	Updater.init();
	
	// Call the function to enhance the view.
	EnhancedView.init();
}

// Call the main function of the script.
setTimeout(main, 0);