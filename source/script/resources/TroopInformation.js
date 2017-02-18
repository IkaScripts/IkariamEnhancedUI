// Troop information.
	(function() {
		/**
		 * Provider for data storages.
		 * 
		 * @type	{object}
		 */
		var _go_storageProvider = new function() {
			/**
			 * Constructor for troop list.
			 */
			var _lf_troopList = function() {
				/**
				 * Storage for troop information.
				 * 
				 * @type	{lf_troop[]}
				 */
				var la_troopList = [];
				
				/**
				 * Troop information storage.
				 * 
				 * @param	{string}	is_name
				 *   The name of the troop.
				 * @param	{int}		ii_number
				 *   The number of the troop.
				 */
				var lf_troop = function(is_name, ii_number) {
					var ls_name		= is_name;
					var li_number	= ii_number;
					
					this.toString = function() {
						return '\n' + ls_name + ': ' + li_number;
					};
				};
				
				/**
				 * If the troop list contains no entries.
				 * 
				 * @return	{boolean}
				 *   If the troop list is empty.
				 */
				this.__defineGetter__('isEmpty', function() {
					return la_troopList.length < 1;
				});
				
				/**
				 * Add a new troop to the troop list.
				 * 
				 * @param	{string}	is_name
				 *   The name of the troop.
				 * @param	{int}		ii_number
				 *   The number of the troop.
				 */
				this.addTroop = function(is_name, ii_number) {
					la_troopList.push(new lf_troop(is_name, ii_number));
				};
				
				/**
				 * Transform the troop list to a string.
				 * 
				 * @return	{string}
				 *   The string representation of the troop list.
				 */
				this.toString = function() {
					return la_troopList.join('');
				};
			};
			
			/**
			 * Constructor for troop list of foreign player.
			 * 
			 * @param	{string}	is_playerName
			 *   The name of the player who owns the troops.
			 */
			var _lf_foreignTroopList = function(is_playerName) {
				/**
				 * The name of the player who owns the troops.
				 * 
				 * @type	{string}
				 */
				var ls_playerName = is_playerName;
				
				/**
				 * Storage for troop information.
				 * 
				 * @type	{_lf_troopList[]}
				 */
				var lo_troopList	= new _lf_troopList();
				
				/**
				 * If the troop list contains no entries.
				 * 
				 * @return	{boolean}
				 *   If the troop list is empty.
				 */
				this.__defineGetter__('isEmpty', function() {
					return lo_troopList.isEmpty;
				});
				
				/**
				 * Add a new troop to the troop list.
				 * 
				 * @param	{string}	is_name
				 *   The name of the troop.
				 * @param	{int}		ii_number
				 *   The number of the troop.
				 */
				this.addTroop = function(is_name, ii_number) {
					lo_troopList.addTroop(is_name, ii_number);
				};
				
				/**
				 * Transform the troop list to a string.
				 * 
				 * @return	{string}
				 *   The string representation of the troop list.
				 */
				this.toString = function() {
					return '\n* ' + ls_playerName + ' *' + lo_troopList;
				};
			};
			
			/**
			 * Storage for multiple troop lists.
			 * 
			 * @param	{string}	is_type
			 *   The type of the troops (units / ships)
			 * @param	{string}	is_status
			 *   The status of the troops (own / friends / enemies)
			 */
			var _lf_troopListStorage = function(is_type, is_status) {
				/**
				 * The type of the troops (units / ships).
				 * 
				 * @type	{string}
				 */
				var ls_type = is_type;
				
				/**
				 * The status of the troops (own / friends / enemies).
				 * 
				 * @type	{string}
				 */
				var ls_status = is_status;
				
				/**
				 * The troop lists.
				 * 
				 * @type	{(_lf_troopList||_lf_foreignTroopList)[]}
				 */
				var la_troopLists = [];
				
				/**
				 * The status of the troop lists (own / friends / enemies).
				 * 
				 * @return	{boolean}
				 *   The status of the lists.
				 */
				this.__defineGetter__('status', function() {
					return ls_status;
				});
				
				/**
				 * Add a new troop list to the storage.
				 * 
				 * @param	{_lf_troopList||_lf_foreignTroopList}	io_troopList
				 *   The troop list to add.
				 */
				this.addTroopList = function(io_troopList) {
					la_troopLists.push(io_troopList);
				};
				
				/**
				 * Transform the troop list storage to a string.
				 * 
				 * @return	{string}
				 *   The string representation of the troop list storage.
				 */
				this.toString = function() {
					return '\n--- ' + IC.Language.$('troopInformation.' + ls_type + '.' + ls_status) + ' ---' + la_troopLists.join('\n');
				};
			};
			
			/**
			 * Storage for data of all troops of one type.
			 * 
			 * @param	{string}	is_type
			 *   The type of the troops (units / ships)
			 */
			var _lf_troopData = function(is_type) {
				/**
				 * The type of the troops (units / ships).
				 * 
				 * @type	{string}
				 */
				var ls_type = is_type;
				
				/**
				 * The troop list storages.
				 * 
				 * @type	{_lf_troopListStorage[]}
				 */
				var la_listStorages	= [];
				
				/**
				 * If the troop list contains no entries.
				 * 
				 * @return	{boolean}
				 *   If the troop list is empty.
				 */
				this.__defineGetter__('isEmpty', function() {
					return la_listStorages.length < 1;
				});
				
				/**
				 * Add a new troop list to the storage.
				 * 
				 * @param	{string}	is_status
				 *   The status of the troop list.
				 * @param	{_lf_troopList||_lf_foreignTroopList}	io_troopList
				 *   The troop list to add.
				 */
				this.addTroopList = function(is_status, io_troopList) {
					for(var i = 0; i < la_listStorages.length; i++) {
						if(la_listStorages[i].status === is_status) {
							la_listStorages[i].addTroopList(io_troopList);
							return;
						}
					}
					
					var lo_listStorage = new _lf_troopListStorage(ls_type, is_status);
					lo_listStorage.addTroopList(io_troopList);
					la_listStorages.push(lo_listStorage);
				};
				
				/**
				 * Transform the troop data to a string.
				 * 
				 * @param	{string}	is_townInformation
				 *   The information about the town for which the troop data is displayed.
				 * 
				 * @return	{string}
				 *   The string representation of the troop data.
				 */
				this.getString = function(is_townInformation) {
					return '===== ' + IC.Language.$('troopInformation.' + ls_type + '.label', [is_townInformation]) + ' =====' + la_listStorages.join('\n\n');
				};
			};
			
			/**
			 * Get a new troop list representation for own troops.
			 * 
			 * @return	{_lf_troopList}
			 *   The troop list.
			 */
			this.ownTroopList = function() {
				return new _lf_troopList();
			};
			
			/**
			 * Get a new troop list representation for foreign troops.
			 * 
			 * @param	{string}	is_playerName
			 *   The name of the player who owns the troops.
			 * 
			 * @return	{_lf_foreignTroopList}
			 *   The troop list.
			 */
			this.foreignTroopList = function(is_playerName) {
				return new _lf_foreignTroopList(is_playerName);
			};
			
			/**
			 * Get a new troop data storage representation for all troops of one type.
			 * 
			 * @param	{string}	is_type
			 *   The type of the troops (units / ships).
			 * 
			 * @return	{_lf_troopData}
			 *   The troop data storage.
			 */
			this.troopData = function(is_type) {
				return new _lf_troopData(is_type);
			};
		};
		
		/**
		 * Storage for the dta extraction functions.
		 * 
		 * @type	{object}
		 */
		var _go_dataExtractor = new function() {
			/**
			 * Extract own troops from a wrapper.
			 * 
			 * @param	{element}	ie_wrapper
			 *   The wrapper to extract the troops from.
			 * 
			 * @return	{_go_storageProvider.ownTroopList[]}
			 *   The extracted troops.
			 */
			var _lf_extractOwnTroops = function(ie_wrapper) {
				var la_nameCells	= IC.myGM.$$('.table01 .title_img_row th .tooltip', ie_wrapper);
				var la_numberCells	= IC.myGM.$$('.table01 .count td', ie_wrapper);
				
				var ro_troops = _go_storageProvider.ownTroopList();
				
				for(var i = 0; i < la_nameCells.length; i++) {
					var li_number = IC.Ikariam.getInt(la_numberCells[i].innerHTML);
					
					if(li_number > 0)
						ro_troops.addTroop(la_nameCells[i].innerHTML, li_number);
				}
				
				return ro_troops;
			};
			
			/**
			 * Extract foreign troops from a wrapper.
			 * 
			 * @param	{element}	ie_wrapper
			 *   The wrapper to extract the troops from.
			 * 
			 * @return	{_go_storageProvider.foreignTroopList[]}
			 *   The extracted troops.
			 */
			var _lf_extractForeignTroops = function(ie_wrapper) {
				var la_nameCells	= IC.myGM.$$('.table01 .title_img_row th:not(:first-child) .tooltip', ie_wrapper);
				var la_numberRows	= IC.myGM.$$('.table01 tr:not(.title_img_row)', ie_wrapper);
				var lo_numberCells	= {};
				
				for(var i = 0; i < la_numberRows.length; i++) {
					var ls_playerName = IC.myGM.$('td a', la_numberRows[i]).innerHTML.trim();
					
					if(!lo_numberCells[ls_playerName]) {
						lo_numberCells[ls_playerName] = [];
					}
					
					lo_numberCells[ls_playerName] = lo_numberCells[ls_playerName].concat(IC.myGM.$$('td:not(:first-child)', la_numberRows[i]));
				}
				
				var ra_troops = [];
				
				IC.myGM.forEach(lo_numberCells, function (is_playerName, ia_numberCells) {
					var lo_playerTroops = _go_storageProvider.foreignTroopList(is_playerName);
					
					for(var i = 0; i < la_nameCells.length; i++) {
						var li_number = IC.Ikariam.getInt(ia_numberCells[i].innerHTML);
						
						if(li_number > 0)
							lo_playerTroops.addTroop(la_nameCells[i].innerHTML, li_number);
					}
					
					if(lo_playerTroops.isEmpty === false)
						ra_troops.push(lo_playerTroops);
				});
				
				return ra_troops;
			};
			
			/**
			 * Extract all troop of one type.
			 * 
			 * @param	{string}	is_type
			 *   The type of the troops to extract (units / ships).
			 * @param	{string}	is_wrapperTabId
			 *   The id of the tab which contains the wrappers.
			 * 
			 * @return	{_go_storageProvider.troopData}
			 *   The extracted data.
			 */
			var _lf_extractTroops = function(is_type, is_wrapperTabId) {
				var ro_return = _go_storageProvider.troopData(is_type);
				
				var la_wrappers	= IC.myGM.$$('#' + is_wrapperTabId + ' .contentBox01h');
				
				var lo_ownTroops	= _lf_extractOwnTroops(la_wrappers[0]);
				if(lo_ownTroops.isEmpty === false)
					ro_return.addTroopList('own', lo_ownTroops);
				
				var la_foreignStatus = ['friends', 'enemies'];
				
				for(var i = 0; i < la_foreignStatus.length; i++) {
					var la_foreignTroops = _lf_extractForeignTroops(la_wrappers[i + 2]);
					
					for(var j = 0; j < la_foreignTroops.length; j++) {
						ro_return.addTroopList(la_foreignStatus[i], la_foreignTroops[j]);
					}
				}
				
				return ro_return;
			};
			
			/**
			 * Extract all troop from the popup.
			 * 
			 * @return	{object}
			 *   All extracted troops.
			 *   Signature: { units: <_go_storageProvider.troopData>, ships: <_go_storageProvider.troopData> }
			 */
			this.extract = function() {
				return {
					units:	_lf_extractTroops('units', 'tabUnits'),
					ships:	_lf_extractTroops('ships', 'tabShips')
				};
			};
		};
		
		/**
		 * Storage for the troop information functions.
		 * 
		 * @type	{object}
		 */
		var _go_troopInformation = new function() {
			/**
			 * Show the troop information popup.
			 * 
			 * @param	{object}	io_data
			 *   All extracted troop.
			 *   Signature: { units: <_go_storageProvider.troopData>, ships: <_go_storageProvider.troopData> }
			 */
			var _ls_showPopup = function(io_data) {
				var la_output = [];
				var ls_townInformation = (function() {
					var lo_allTowns		= IC.ika.getModel().relatedCityData;
					var lo_selectedTown	= lo_allTowns[lo_allTowns.selectedCity];
					
					return lo_selectedTown.name + ' ' + lo_selectedTown.coords;
				})();
				
				if(!!io_data === true) {
					if(!!io_data.units.isEmpty === false)
						la_output.push(io_data.units.getString(ls_townInformation));
					if(!!io_data.ships.isEmpty === false)
						la_output.push(io_data.ships.getString(ls_townInformation));
				}
				
				var ls_output = la_output.join('\n\n-------------------------------------------------------------------------------------\n\n');
				
				if(ls_output.length === 0)
					ls_output = IC.Language.$('troopInformation.noTroops', [ls_townInformation]);
				
				var lo_text = {
					header:	IC.Language.$('troopInformation.header', [ls_townInformation]),
					body:	ls_output
				};
				
				IC.myGM.notification(lo_text, null, { textarea: true, readonly: true, autoselect: true });
			};
			
			/**
			 * Extract the data and show the popup.
			 */
			var _lf_showInformation = function() {
				_ls_showPopup(_go_dataExtractor.extract());
			};
			
			/**
			 * Show the troop information link.
			 */
			var _lf_doShowTroopInformationLink = function() {
				var le_button	= IC.myGM.addButton(IC.myGM.$('#cityMilitary_c .buildingDescription'), IC.Language.$('troopInformation.button'), _lf_showInformation, true);
				var la_cssRules	= [['position', 'absolute'], ['top', '5px'], ['right', '20px']];
				
				for(var i = 0; i < la_cssRules.length; i++) {
					le_button.style[la_cssRules[i][0]] = la_cssRules[i][1];
				}
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_enableTroopInformation
			 *   If the user selected the checkbox to show the troop information.
			 */
			this.updateSettings = function(ib_enableTroopInformation) {
				if(ib_enableTroopInformation === true) {
					IC.RefreshHandler.add('cityMilitary', 'troopInformation', _lf_doShowTroopInformationLink);
					return;
				}
				
				IC.RefreshHandler.remove('cityMilitary', 'troopInformation');
			};
		};
		
		/**
		 * Storage for the link barracks and shipyard functions.
		 * 
		 * @type	{object}
		 */
		var _go_linkBarrackShipyard = new function() {
			/**
			 * Adds a link to the container.
			 * 
			 * @param	{String}	is_type
			 *   The link type (units / fleet).
			 * @param	{Element}	ie_container
			 *   The element which should be container for the link.
			 */
			var _lf_addLink = function(is_type, ie_container) {
				var lo_data = IC.ika.getScreen().data;
				
				var ls_linkText = is_type === 'units' ? IC.Language.$('troopInformation.link.gotoBarracks') : IC.Language.$('troopInformation.link.gotoShipyard');
				ls_linkText = '(' + ls_linkText + ')';
				
				var ls_buildingType = is_type === 'units' ? 'barracks' : 'shipyard';
				
				var li_position = -1;
				for(var i = 0; i < lo_data.position.length; i++) {
					if(lo_data.position[i].building === ls_buildingType) {
						li_position = i;
						break;
					}
				}
				
				if(li_position >= 0) {
					var ls_href = '?view=%building%&cityId=%cityId%&position=%position%'
											.replace(/%building%/gi, ls_buildingType)
											.replace(/%cityId%/gi, lo_data.id)
											.replace(/%position%/gi, li_position);
					
					IC.myGM.addElement('a', ie_container, {
						innerHTML:	ls_linkText,
						href:		ls_href,
						onclick:	'ajaxHandlerCall(this.href);return false;',
						style:		[['margin-left', '5px']]
					});
				}
			};
			
			/**
			 * Link barack and shipyard from troop overview screen.
			 */
			var _lf_doLinkBarrackShipyardOverview = function() {
				var le_container = IC.myGM.$('.header', IC.myGM.$('#tabUnits'));
				_lf_addLink('units', le_container);
				
				le_container = IC.myGM.$('.header', IC.myGM.$('#tabShips'));
				_lf_addLink('fleet', le_container);
			};
			
			/**
			 * Link barrack and shipyard in dismiss units screen.
			 */
			var _lf_doLinkBarrackShipyardDismiss = function() {
				var ls_type = IC.myGM.$('#js_garrisonEditForm input[name=function]').value.replace(/fire/gi, '').toLowerCase();
				var le_container = IC.myGM.$('#js_garrisonEditForm .header');
				
				_lf_addLink(ls_type, le_container);
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_linkBarrackShipyard
			 *   If the user selected the checkbox to link barrackand shipyard.
			 */
			this.updateSettings = function(ib_linkBarrackShipyard) {
				if(ib_linkBarrackShipyard === true) {
					IC.RefreshHandler.add('cityMilitary', 'linkBarrackShipyardOverview', _lf_doLinkBarrackShipyardOverview);
					IC.RefreshHandler.add('garrisonEdit', 'linkBarrackShipyardDismiss', _lf_doLinkBarrackShipyardDismiss);
					return;
				}
				
				IC.RefreshHandler.remove('cityMilitary', 'linkBarrackShipyardOverview');
				IC.RefreshHandler.remove('garrisonEdit', 'linkBarrackShipyardDismiss');
			};
		};
		
		IC.Options.addCheckbox('showTroopInformation', 'diverseOptions', 1, true, IC.Language.$('troopInformation.options.show'), { changeCallback: _go_troopInformation.updateSettings });
		IC.Options.addCheckbox('linkBarrackShipyard', 'diverseOptions', 1, true, IC.Language.$('troopInformation.options.linkBarrackShipyard'), { changeCallback: _go_linkBarrackShipyard.updateSettings });
	})();