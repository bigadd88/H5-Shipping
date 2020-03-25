function beforeLoad(type, form){
	// if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
	// 	var currentRecordId = nlapiGetRecordId();
	//
	//
	// }

	addCostHistoryButton(form);
	addLabSampleRecordButton(form);
	// addBrewSampleRecordButton(form);
	addTimeSampleRecordButton(form);
	addCreatePalletsButton(form);
	//addPalletLabel1Button(form);
	addPalletLabel2Button(form);
	addPalletLabelMM1Button(form);


}

function addCreatePalletsButton(form){
	form.setScript('customscript_h5_wo_blue');
	form.addButton('custpage_createpallets', 'H5-Create Pallets', 'createPallets()');
}

function createPallets() {
	var recName = nlapiGetRecordId();
	var itemId = nlapiLookupField('workorder', recName, 'item');
	var caseCount = nlapiLookupField('item', itemId, 'custitemcustitemwcr_casecountperpallet');
	if (caseCount == ""){
		alert('Item has NULL/Blank case count per pallet.  Update Item and try again.');
	}
	else {
	var url = nlapiResolveURL('SUITELET','customscript_h5_create_pallets','customdeploy_h5_create_pallets');
	url += '&recName=' + recName;
	var reqObj = nlapiRequestURL(url);
	var respObj = reqObj.getBody();
	alert(respObj);
	}
}

function addPalletLabel1Button(form){
	form.setScript('customscript_h5_wo_blue');
	form.addButton('custpage_palletlabel', 'H5-label', 'palletLabel1()');
}

function palletLabel1() {
	var recName = nlapiGetRecordId();
	var url = nlapiResolveURL('SUITELET','customscript_h5_pallet_label_1','customdeploy_h5_pallet_label_1');
	url += '&recName=' + recName;
	window.open(url);
}

function addPalletLabel2Button(form){
	form.setScript('customscript_h5_wo_blue');
	form.addButton('custpage_palletlabel2', 'Pallet Labels', 'palletLabel2()');
}

function palletLabel2() {
	var recName = nlapiGetRecordId();
	var url = nlapiResolveURL('SUITELET','customscript_h5_pallet_label_2','customdeploy_h5_pallet_label_2');
	url += '&recName=' + recName;
	window.open(url);
}

function addPalletLabelMM1Button(form){
	form.setScript('customscript_h5_wo_blue');
	form.addButton('custpage_palletlabelmm1', 'MM Label', 'palletLabelmm1()');
}

function palletLabelmm1() {
	var recName = nlapiGetRecordId();
	var url = nlapiResolveURL('SUITELET','customscript_h5_pallet_label_mm_1','customdeploy_h5_pallet_label_mm_1');
	url += '&recName=' + recName;
	window.open(url);
}

function addCostHistoryButton(form){
	form.setScript('customscript_h5_wo_blue');
	form.addButton('custpage_costhistory', 'H5-Cost History', 'AssemblyIndex()');
}

function addLabSampleRecordButton(form){
	form.setScript('customscript_h5_wo_blue');
	form.addButton('custpage_qve_labsample', 'QA 1st Layer', 'createQVELabSampleRecord()');
}

function addBrewSampleRecordButton(form){
	form.setScript('customscript_h5_wo_blue');
	form.addButton('custpage_qve_brewsample', 'H5-New Brew Sample', 'createQVEBrewSampleRecord()');
}

function addTimeSampleRecordButton(form){
	form.setScript('customscript_h5_wo_blue');
	form.addButton('custpage_qve_timesample', 'Time Interval', 'NEWcreateQVETimeSampleRecord()');
}

function AssemblyIndex(){
	var recName = nlapiGetRecordId();
	var woRec = nlapiLoadRecord('workorder',recName);
	var woID = woRec.getFieldValue('assemblyitem');
	var url = nlapiResolveURL('SUITELET', 'customscript_h5_wo_to_assembly', 'customdeploy_h5_wo_to_assembly');
	url += '&woid=' + woID;
	window.open(url);
}

function createQVELabSampleRecord(){
	nlapiLogExecution('DEBUG', 'buttonClick', 'Lab Sample Button has been Pushed!');
	var woId = nlapiGetRecordId();
	var url = nlapiResolveURL('SUITELET', 'customscript_h5_sl_create_sample', 'customdeploy_h5_sl_create_sample');
	url += '&woid=' + woId;
	var reqObj = nlapiRequestURL(url);
	var respObj = reqObj.getBody();
	var baseURL = 'https://1212003.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=321&id=';
	var url = baseURL + respObj + '&whence=&e=T';
	window.location = url;
}

function NEWcreateQVETimeSampleRecord(){
	nlapiLogExecution('DEBUG', 'buttonClick', 'Time Interval Sample Button has been Pushed!');
	var woId = nlapiGetRecordId();
	var newItemId = nlapiLookupField('workorder', woId, 'item');
	var itemDisplay = nlapiLookupField('assemblyitem',newItemId,'displayname');
	var is5lb = itemDisplay.search('5lb');
	if(is5lb != -1){
		alert('This is a 5LB bag.  James said drop a dollar on his desk, and move on down the road. No sample record will be created');
	}
	else {
		var url = nlapiResolveURL('SUITELET', 'customscript_h5_sl_create_sample_timed', 'customdeploy_h5_sl_create_sample_timed');
		url += '&woid=' + woId;
		var reqObj = nlapiRequestURL(url);
		var respObj = reqObj.getBody();
		var baseURL = 'https://1212003.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=321&id=';
		var url = baseURL + respObj + '&whence=&e=T';
		window.location = url;
	}
}

function OLDcreateQVELabSampleRecord(){
	nlapiLogExecution('DEBUG', 'buttonClick', 'Lab Sample Button has been Pushed!');
	var woId = nlapiGetRecordId();
	var pastSamples = nlapiSearchRecord("customrecord_h5_qve_sample_record",null,
		[
			["custrecord_h5_wo","anyof",woId]
		],
		[
			new nlobjSearchColumn("id").setSort(false),
			new nlobjSearchColumn("custrecord_h5_sample_type")
		]
	);
	// console.log('past sample length', pastSamples.length);
	// var recType = nlapiGetRecordType();
	var newItemId = nlapiLookupField('workorder', woId, 'item');
	// var parRec = nlapiLoadRecord(recType, woId);
	// var itemId = parRec.getFieldValue('assemblyitem');
	// var itemRec = nlapiLoadRecord('item',itemId);
	if (pastSamples != null){
		var testMasterLines = nlapiSearchRecord("customrecord_h5_qve_quality_check",null,
			[
				["custrecord_h5_qc_item_parent","anyof", newItemId],
				"AND",
				["custrecord_h5_qc_frequency","anyof","1"]
			],
			[
				new nlobjSearchColumn("id").setSort(false),
				new nlobjSearchColumn("custrecord_h5_qc_item_parent"),
				new nlobjSearchColumn("custrecord_h5_qc_name"),
				new nlobjSearchColumn("custrecord_h5_qc_target"),
				new nlobjSearchColumn("custrecord_h5_qc_frequency"),
				new nlobjSearchColumn("custrecord_h5_qv_value_type"),
				new nlobjSearchColumn("custrecord_h5_qc_uom"),
				new nlobjSearchColumn("custrecord_h5_qc_min"),
				new nlobjSearchColumn("custrecord_h5_qc_max")
			]
		);
	}
	else {
		var testMasterLines = nlapiSearchRecord("customrecord_h5_qve_quality_check",null,
			[
				["custrecord_h5_qc_item_parent","anyof", newItemId],
				"AND",
				["custrecord_h5_qc_frequency","anyof","1","2"]
			],
			[
				new nlobjSearchColumn("id").setSort(false),
				new nlobjSearchColumn("custrecord_h5_qc_item_parent"),
				new nlobjSearchColumn("custrecord_h5_qc_name"),
				new nlobjSearchColumn("custrecord_h5_qc_target"),
				new nlobjSearchColumn("custrecord_h5_qc_frequency"),
				new nlobjSearchColumn("custrecord_h5_qv_value_type"),
				new nlobjSearchColumn("custrecord_h5_qc_uom"),
				new nlobjSearchColumn("custrecord_h5_qc_min"),
				new nlobjSearchColumn("custrecord_h5_qc_max")
			]
		);
	}



	var labSample = nlapiCreateRecord('customrecord_h5_qve_sample_record');
	labSample.setFieldValue('customform', '43');
	labSample.setFieldValue('custrecord_h5_item', newItemId);
	labSample.setFieldValue('custrecord_h5_wo', woId);
	labSample.setFieldValue('custrecord_h5_item_type', nlapiLookupField('assemblyitem', newItemId, 'custitemcustitemwcr_itemtype'));
	labSample.setFieldValue('custrecord_h5_product_specs', nlapiLookupField('assemblyitem', newItemId, 'custitemwcr_productspecs'));
	labSample.setFieldValue('custrecord_h5_uom', nlapiLookupField('assemblyitem', newItemId, 'saleunit'));
	labSample.setFieldValue('custrecord_h5_sample_type', '1');
	var labSampleId = nlapiSubmitRecord(labSample);
	//now create test lines
	for (var x = 0; x < testMasterLines.length; x++){
		var sampleLine = nlapiCreateRecord('customrecord_h5_qve_sample_test');
		sampleLine.setFieldValue('custrecord_h5_sample_parent_id', labSampleId);
		sampleLine.setFieldValue('custrecord_h5_test_type', 1);
		sampleLine.setFieldValue('custrecord_h5_test', testMasterLines[x].getValue('custrecord_h5_qc_name'));
		sampleLine.setFieldValue('custrecord_h5_target', testMasterLines[x].getValue('custrecord_h5_qc_target'));
		sampleLine.setFieldValue('custrecord_h5_frequency', testMasterLines[x].getValue('custrecord_h5_qc_frequency'));
		sampleLine.setFieldValue('custrecord_h5_value_type', testMasterLines[x].getValue('custrecord_h5_qv_value_type'));
		sampleLine.setFieldValue('custrecord_h5_uom_test', testMasterLines[x].getValue('custrecord_h5_qc_uom'));
		sampleLine.setFieldValue('custrecord_h5_min', testMasterLines[x].getValue('custrecord_h5_qc_min'));
		sampleLine.setFieldValue('custrecord_h5_max', testMasterLines[x].getValue('custrecord_h5_qc_max'));
		nlapiSubmitRecord(sampleLine);
	}
	// alert('Sample Record: created with ' + testMasterLines.length + ' quality check requirements');

	var baseURL = 'https://1212003.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=321&id=';
	var url = baseURL + labSampleId + '&whence=&e=T';
	window.location = url;
}

function createQVEBrewSampleRecord(){
	nlapiLogExecution('DEBUG', 'buttonClick', 'Brew Sample Button has been Pushed!');
	var woId = nlapiGetRecordId();
	var newItemId = nlapiLookupField('workorder', woId, 'item');
	//create sample record
	var labSample = nlapiCreateRecord('customrecord_h5_qve_sample_record');
	labSample.setFieldValue('customform', '47');
	labSample.setFieldValue('custrecord_h5_item', newItemId);
	labSample.setFieldValue('custrecord_h5_wo', woId);
	labSample.setFieldValue('custrecord_h5_item_type', nlapiLookupField('assemblyitem', newItemId, 'custitemcustitemwcr_itemtype'));
	labSample.setFieldValue('custrecord_h5_product_specs', nlapiLookupField('assemblyitem', newItemId, 'custitemwcr_productspecs'));
	labSample.setFieldValue('custrecord_h5_uom', nlapiLookupField('assemblyitem', newItemId, 'saleunit'));
	labSample.setFieldValue('custrecord_h5_sample_type', '2');
	var labSampleId = nlapiSubmitRecord(labSample);
	nlapiLogExecution('DEBUG', 'sample rec created ', labSampleId);
	//now create brew test lines
	//brew master lines
	var brewMachines = [
		'Keurig 200 unit 1',
		'Keurig 200 unit 2',
		'Keurig 400 unit 1',
		'Keurig 400 unit 2',
		'Keurig K-Elite unit 1',
		'Keurig K-Elite unit 2',
		'Keurig K-Cafe unit 1',
		'Keurig K-Cafe unit 2',
		'Keurig K-Select unit 1',
		'Keurig K-Select unit 2'
	]
	for (var x = 0; x < brewMachines.length; x++){
		var sampleLine = nlapiCreateRecord('customrecord_h5_qve_brew_test');
		sampleLine.setFieldValue('custrecord_h5_brew_sample_parent', labSampleId);
		sampleLine.setFieldValue('custrecord_h5_brew_machine', brewMachines[x]);
		console.log(brewMachines[x]);
		nlapiSubmitRecord(sampleLine);
	}
	// alert('Sample Record: created with ' + testMasterLines.length + ' quality check requirements');

	var baseURL = 'https://1212003.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=321&id=';
	var url = baseURL + labSampleId + '&cf=47&whence=&e=T';
	window.location = url;
}

function createQVETimeSampleRecord(){
	nlapiLogExecution('DEBUG', 'buttonClick', 'Lab Sample Button has been Pushed!');
	var woId = nlapiGetRecordId();
	var newItemId = nlapiLookupField('workorder', woId, 'item');
	var testMasterLines = nlapiSearchRecord("customrecord_h5_qve_quality_check",null,
		[
			["custrecord_h5_qc_item_parent","anyof", newItemId],
			"AND",
			["custrecord_h5_qc_frequency","anyof","3"]
		],
		[
			new nlobjSearchColumn("id").setSort(false),
			new nlobjSearchColumn("custrecord_h5_qc_item_parent"),
			new nlobjSearchColumn("custrecord_h5_qc_name"),
			new nlobjSearchColumn("custrecord_h5_qc_target"),
			new nlobjSearchColumn("custrecord_h5_qc_frequency"),
			new nlobjSearchColumn("custrecord_h5_qv_value_type"),
			new nlobjSearchColumn("custrecord_h5_qc_uom"),
			new nlobjSearchColumn("custrecord_h5_qc_min"),
			new nlobjSearchColumn("custrecord_h5_qc_max")
		]
	);
	var labSample = nlapiCreateRecord('customrecord_h5_qve_sample_record');
	labSample.setFieldValue('customform', '43');
	labSample.setFieldValue('custrecord_h5_item', newItemId);
	labSample.setFieldValue('custrecord_h5_wo', woId);
	labSample.setFieldValue('custrecord_h5_item_type', nlapiLookupField('assemblyitem', newItemId, 'custitemcustitemwcr_itemtype'));
	labSample.setFieldValue('custrecord_h5_product_specs', nlapiLookupField('assemblyitem', newItemId, 'custitemwcr_productspecs'));
	labSample.setFieldValue('custrecord_h5_uom', nlapiLookupField('assemblyitem', newItemId, 'saleunit'));
	labSample.setFieldValue('custrecord_h5_sample_type', '3');
	var labSampleId = nlapiSubmitRecord(labSample);
	//now create test lines
	for (var x = 0; x < testMasterLines.length; x++){
		var sampleLine = nlapiCreateRecord('customrecord_h5_qve_sample_test');
		sampleLine.setFieldValue('custrecord_h5_sample_parent_id', labSampleId);
		sampleLine.setFieldValue('custrecord_h5_test_type', 3);
		sampleLine.setFieldValue('custrecord_h5_test', testMasterLines[x].getValue('custrecord_h5_qc_name'));
		sampleLine.setFieldValue('custrecord_h5_target', testMasterLines[x].getValue('custrecord_h5_qc_target'));
		sampleLine.setFieldValue('custrecord_h5_frequency', testMasterLines[x].getValue('custrecord_h5_qc_frequency'));
		sampleLine.setFieldValue('custrecord_h5_value_type', testMasterLines[x].getValue('custrecord_h5_qv_value_type'));
		sampleLine.setFieldValue('custrecord_h5_uom_test', testMasterLines[x].getValue('custrecord_h5_qc_uom'));
		sampleLine.setFieldValue('custrecord_h5_min', testMasterLines[x].getValue('custrecord_h5_qc_min'));
		sampleLine.setFieldValue('custrecord_h5_max', testMasterLines[x].getValue('custrecord_h5_qc_max'));
		nlapiSubmitRecord(sampleLine);
	}
	// alert('Sample Record: created with ' + testMasterLines.length + ' quality check requirements');

	var baseURL = 'https://1212003.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=321&id=';
	var url = baseURL + labSampleId + '&whence=&e=T';
	window.location = url;
}
