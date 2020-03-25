function generateSelector() {
	var form,
		sublist;

	//GET
	if (request.getMethod() == 'GET') {
		//create form
		var recName = request.getParameter('NLNAME');
      	var batId = request.getParameter('batchId');
		form = nlapiCreateForm('Rate Pass Selector', false);
		//create sublist to show results
		sublist = form.addSubList('custpage_sublist_id', 'list', 'Rates List');
		//form buttons
		form.setScript('customscript_pss_rate_select_cs');
      	  //set the html container on the form
  		var ilhtml = form.addField('custpage_pss_il_html', 'inlinehtml', null, 'main');
  		//set the scripts to inject
  		var scrhtmlscripts = '';
  		scrhtmlscripts += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">';
  		scrhtmlscripts += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">';
  		scrhtmlscripts += '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>';
      	form.addField('custpage_pss_pronum', 'TEXT', 'Type or Scan ProNumber');
		form.addButton('submitForm', 'Submit', 'SubmitForm()');
		//run existing saved search
		var fil = new Array();
		fil[0] = new nlobjSearchFilter('custrecord_pss_ratepass_shipment_id', null, 'is', recName);
		fil[1] = new nlobjSearchFilter('created', null, 'on', 'today');
		fil[2] = new nlobjSearchFilter('isinactive', null, 'is', 'false');
        fil[3] = new nlobjSearchFilter('custrecord_pss_ratepass_total_cost', null, 'greaterthan', 0);
      	fil[4] = new nlobjSearchFilter('custrecord_pss_batch_id', null, 'is', batId);
		var col = new Array();
		col[0] = new nlobjSearchColumn('custrecord_pss_carrierlogo');
		col[1] = new nlobjSearchColumn('custrecord_pss_service_level_desc');
		col[2] = new nlobjSearchColumn('custrecord_pss_total_shipment_cost');
		col[3] = new nlobjSearchColumn('custrecord_pss_transit_days');
		col[4] = new nlobjSearchColumn('custrecord_pss_netcharge');
		col[5] = new nlobjSearchColumn('custrecord_pss_fuel_surcharge');
		col[6] = new nlobjSearchColumn('custrecord_pss_gross_charge');
		col[7] = new nlobjSearchColumn('internalid');
		col[8] = new nlobjSearchColumn('custrecord_pss_ratepass_selected');
      	col[9] = new nlobjSearchColumn('custrecord_pss_ratepass_carrier');
		var searchResults = nlapiSearchRecord('customrecord_pss_ratepass_line', 'customsearch_pss_ratepass_view', fil, col);
		//Add the search column names to the sublist field
		sublist.addField('custrecord_pss_ratepass_selected', 'checkbox', 'Selected');
		sublist.addField('internalid', 'TEXT', 'Id');
		sublist.addField('custrecord_pss_ratepass_carrier', 'TEXT', 'Carrier');
		sublist.addField('custrecord_pss_service_level_desc', 'TEXT', 'Service Level Description');
		sublist.addField('custrecord_pss_transit_days', 'TEXT', 'Transit Days');
		sublist.addField('custrecord_pss_total_shipment_cost', 'TEXT', 'Total Cost');
		sublist.addField('custrecord_pss_netcharge', 'TEXT', 'Net Charge');
		sublist.addField('custrecord_pss_fuel_surcharge', 'TEXT', 'Fuel Surcharge');
		//additional sublist fields

		sublist.setLineItemValues(searchResults)

		response.writePage(form);

	}
	if (request.getMethod() == 'POST') {
		var req = request.getLineItemCount('custpage_sublist_id');
		for (var i = 1; i < req + 1; i++) {
			var vals = request.getLineItemValue('custpage_sublist_id', 'custrecord_pss_ratepass_selected', i);
			if (vals == 'T') {
				var intId = request.getLineItemValue('custpage_sublist_id', 'internalid', i);
			}
		}
		nlapiLogExecution('DEBUG', 'WhasamattaU', 'Rate Line Selected is: ' + intId);
		var recordLine = nlapiLoadRecord('customrecord_pss_ratepass_line', intId);
		var shipParentId = recordLine.getFieldValue('custrecord_pss_ratepass_shipment_id');
		var serviceLevel = recordLine.getFieldValue('custrecord_pss_service_level_desc');
		var totCost = recordLine.getFieldValue('custrecord_pss_total_shipment_cost');
        var selSCAC = recordLine.getFieldValue('custrecord_pss_scac');
      	var selBatId = recordLine.getFieldValue('custrecord_pss_batch_id');
		recordLine.setFieldValue('custrecord_pss_ratepass_selected', 'T');
		nlapiSubmitRecord(recordLine);
      	nlapiLogExecution('DEBUG', 'Rate Pass Values', shipParentId + ':' + serviceLevel + ':' + totCost + ':' + selSCAC + ':' + selBatId);
        var shipPrec = nlapiLoadRecord('customrecord_pss_shipment', shipParentId);
		shipPrec.setFieldValue('custrecord_pss_selected_slevel', serviceLevel);
		shipPrec.setFieldValue('custrecord_pss_shipment_selcost', totCost);
      	shipPrec.setFieldValue('custrecord_pss_sel_rated_batch', selBatId);
      	var fil = new Array();
  		fil[0] = new nlobjSearchFilter('custentity_pss_scac', null, 'is', selSCAC);
  		var col = new Array();
  		col[0] = new nlobjSearchColumn('internalid');
  		var sResults = nlapiSearchRecord('vendor', null, fil, col);
  		for (var i=0; i < sResults.length; i++){
      		shipPrec.setFieldValue('custrecord_pss_carrier', sResults[i].getValue('internalid'));
    		}
		nlapiSubmitRecord(shipPrec);
		nlapiLogExecution('DEBUG', 'NuttinU?', 'Shipment Parent Updated: ' + shipParentId);
      	//nlapiScheduleScript('customscript_pss_clean_up_rates','customdeploy_pss_clean_up_rates');
		return true;
	}
}