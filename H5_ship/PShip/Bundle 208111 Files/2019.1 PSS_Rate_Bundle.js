function Before_Load(type, form) {
	if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
		//AddPackagesButton(form);
		AddRateButton(form);
		AddP44RatesButton(form);
		AddCerRatesButton(form);
		AddCerasisDispatchButton(form);
		AddCHRobinsonButton(form);
		//AddQuickRateButton(form);
		AddPrintBOLButton(form);
		AddLabelButton(form);
		AddBillButton(form);
		AddDispatchButton(form);
		AddTrackLTLButton(form);
		AddDATPostButton(form);
		//AddDATUpdateButton(form);
		AddDATDeleteButton(form);
		//AddMapButton(form);
		//AddTestButton(form);
		AddEmailBrokerButton(form);
		//AddCustomsButton(form);
		AddintlCommercialInvoiceButton(form);
		AddVGMButton(form);
		AddSLIButton(form);
		insertHTML(form, rateObj);
	}
}

function getPRO(){   //testing pro generation api
	var recId = nlapiGetRecordId();
	//generate Base64 credential key
	// var creds = 'priority.prod@p-44.com:Prirate18';
	var creds = 'andy.reeder@priority-logistics.com:Leftfoot5510!';
	var enCreds = nlapiEncrypt(creds, 'base64');
	//p44 endPoint URL for Rating
	var url = 'https://test.p-44.com/api/v3/shipments/pronumbers/query';
	//setting request headers
	var headers = new Array();
	headers['Authorization'] = 'Basic ' + enCreds;
	headers['Content-Type'] = 'application/json';
	headers['Accept'] = 'application/json';
	var parentShipment = nlapiLoadRecord('customrecord_pss_shipment', recId);
	var carrierEnt = parentShipment.getFieldValue('custrecord_pss_carrier');
	var selSCAC = nlapiLookupField('vendor', carrierEnt, 'custentity_pss_scac');
	var jPayload = {
		"capacityProviderAccountGroup":{
			"code": "Default",
			"accounts": [
				{
					"code": selSCAC
				}
			]
		},
		"apiConfiguration": {
			"fallBackToDefaultAccountGroup": false
		}
	}
	var strPayload = JSON.stringify(jPayload);
	nlapiLogExecution('DEBUG', 'Payload', strPayload);
	var response = nlapiRequestURL(url, strPayload, headers, 'POST');
	nlapiLogExecution('DEBUG', 'Response', response.getBody());
	var obj = response.getBody();
	var respObj = JSON.parse(obj);


}

function AddPackagesButton(form){
	form.setScript('customscript_pss_rate_shipment_bttn');
	form.addButton('custpage_addpackages', 'DIM Freight', 'addPackages()');
}

function addPackages(){
	var reqURL = nlapiGetRecordId();
	var url = nlapiResolveURL('SUITELET','customscript_pss_package_form','customdeploy_pss_package_form');
	url += '&reqURL=' + reqURL;
	var apTitle = 'Add Packages';
	nlExtOpenWindow(url, '', '800', '480', '', null, apTitle);
}

function AddCustomsButton(form){
	form.setScript('customscript_pss_rate_shipment_bttn');
	form.addButton('custpage_AddCustomsButton', 'Customs', 'addCustoms()');
}

function addCustoms() {
	var recName = nlapiGetRecordId();
	var url = nlapiResolveURL('SUITELET','customscript_pss_customs','customdeploy_pss_customs');
	url += '&recName=' + recName,
		window.open(url);
}

function AddintlCommercialInvoiceButton(form){
	form.setScript('customscript_pss_rate_shipment_bttn');
	form.addButton('custpage_AddintlCommercialInvoiceButton', 'Intl Comm Inv', 'intlCommercialInvoice()');
}

function AddVGMButton(form){
	form.setScript('customscript_pss_rate_shipment_bttn');
	form.addButton('custpage_AddVGMButton', 'VGM', 'vgmForm()');
}
function vgmForm() {
	var recName = nlapiGetRecordId();
	var url = nlapiResolveURL('SUITELET','customscript_pss_vgm','customdeploy_pss_vgm');
	url += '&recName=' + recName,
		window.open(url);
}

function AddSLIButton(form){
	form.setScript('customscript_pss_rate_shipment_bttn');
	form.addButton('custpage_AddSLIButton', 'SLI', 'sliForm()');
}
function sliForm() {
	var recName = nlapiGetRecordId();
	var url = nlapiResolveURL('SUITELET','customscript_pss_sli','customdeploy_pss_sli');
	url += '&recName=' + recName,
		window.open(url);
}

function intlCommercialInvoice() {
	var recName = nlapiGetRecordId();
	var url = nlapiResolveURL('SUITELET','customscript_pss_intlcommercialinvoice','customdeploy_pss_intlcommercialinvoice');
	url += '&recName=' + recName,
		window.open(url);
}

function preRateHUD(){
	var currentRecordId = nlapiGetRecordId();
	var recType = nlapiGetRecordType();
	var shipRec = nlapiLoadRecord(recType, currentRecordId);
	//building quick rate request data
	var destZip = shipRec.getFieldValue('custrecord_pss_shipper_zip');
	var orgZip = shipRec.getFieldValue('custrecord_pss_consignee_zip');
	var shipWeight = shipRec.getFieldValue('custrecord_pss_total_weight');
	var shipClass = '60';
	var palletCount = shipRec.getFieldValue('custrecord_pss_total_packages');
	var shipDate = shipRec.getFieldValue('custrecord_pss_ship_date');
	//building quick rate URL
	var url = "http://ec2-52-33-148-2.us-west-2.compute.amazonaws.com/api/Rates?";
	url += "originZip=" + orgZip;
	url += "&orginCity='null'";
	url += "&destinationZip=" + destZip;
	url += "&destinationCity='null'";
	url += "&weight=" + shipWeight;
	url += "&shipmentClass=" + shipClass;
	url += "&profileCode=" + 'SC70R';
	url += "&clientCode=" + 'SC705';
	url += "&shipmentDate=" + shipDate;
	url += "&accessorials=";
	url += "&palletCount=" + palletCount;
	var rateResp = nlapiRequestURL(url);
	var rateObj = rateResp.getBody();
	console.log(rateObj);
	//return rateObj;
}

function insertHTML(form, rateObj){
	var rateLines = new Array();
	var p44RateLines = new Array();
	var jsonObj = JSON.parse(rateObj);
	for (i = 0; i < parseInt(jsonObj.length); i++) {
		var carrier = jsonObj[i].CarrierName;
		var TotalShipmentCost = jsonObj[i].TotalShipmentCost;
		var FuelSurcharge = jsonObj[i].FuelSurcharge;
		var ServiceLevelDescription = jsonObj[i].ServiceLevelDescription;
		var TransitDays = jsonObj[i].TransitDays;
		rateLines += '<tr><td align="left">' + carrier + '</td><td align="left">' + TransitDays + '</td><td align="left">' + ServiceLevelDescription + '</td><td align="left">' + FuelSurcharge + '</td><td align="left">' + TotalShipmentCost + '</td></tr>'
	}
	var jsonp44 = getRatesP44();
	for (x = 0; x < jsonp44.rateQuotes.length; x++){
		var p44SCAC = jsonp44.rateQuotes[x].carrierCode;
		var p44cpQuoteNum = jsonp44.rateQuotes[x].capacityProviderQuoteNumber;
		var p44srvLvl = jsonp44.rateQuotes[x].serviceLevel.description;
		var p44tranDays = jsonp44.rateQuotes[x].transitDays;
		var p44totCost = jsonp44.rateQuotes[x].rateQuoteDetail.total;
		p44RateLines += '<tr><td align="left">' + p44SCAC + '</td><td align="left">' + p44tranDays + '</td><td align="left">' + p44srvLvl + '</td><td align="left">' + p44cpQuoteNum + '</td><td align="left">' + p44totCost + '</td></tr>'
	}
	//set the html container on the form
	var ilhtml = form.addField('custpage_pss_il_html', 'inlinehtml', null, 'main');
	//set the scripts to inject
	var scrhtmlscripts = '';
	scrhtmlscripts += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">';
	scrhtmlscripts += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">';
	scrhtmlscripts += '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>';
	//set the QR Response Table
	var qrtable = '<table class="table table-hover" id="pss-main-qr-table" style="width:100%;font-size:10pt;margin-top: 10px;">';
	qrtable += '<thead>';
	qrtable += '<tr>';
	qrtable += '<th style="text-align:left">Carrier</th>';
	qrtable += '<th style="padding: 4px 4px;text-align:left">Transit Days</th>';
	qrtable += '<th style="padding: 4px 4px;text-align:left">Service Level</th>';
	qrtable += '<th style="padding: 4px 4px;text-align:left">Fuel Surcharge</th>';
	qrtable += '<th style="padding: 4px 4px;text-align:left">Total Cost</th>';
	qrtable += '</tr>';
	qrtable += '</thead>';
	qrtable += rateLines;
	qrtable += '</table>';
	//set the p44 Response Table
	var p44table = '<table class="table table-hover" id="pss-main-p44-table" style="width:100%;font-size:10pt;margin-top: 10px;">';
	p44table += '<thead>';
	p44table += '<tr>';
	p44table += '<th style="text-align:left">Carrier</th>';
	p44table += '<th style="padding: 4px 4px;text-align:left">Transit Days</th>';
	p44table += '<th style="padding: 4px 4px;text-align:left">Service Level</th>';
	p44table += '<th style="padding: 4px 4px;text-align:left">Fuel Surcharge</th>';
	p44table += '<th style="padding: 4px 4px;text-align:left">Total Cost</th>';
	p44table += '</tr>';
	p44table += '</thead>';
	p44table += p44RateLines;
	p44table += '</table>';
	//set the hud menus
	var scrhtml = "<div id='pss_div' class='alert alert-primary' role='alert' style='position: fixed; bottom: 150px; color: #000000;opacity: 0.7; height: auto; z-index: 1000;width: auto;margin: 0 auto;'>";
	scrhtml += '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
	scrhtml += '<div class="panel panel-default" style="background:#000000; color:#00c1f7">';
	scrhtml += '<div class="panel-heading" style="background:#000000; color:#00c1f7" role="tab" id="headingOne">';
	scrhtml += '<h4 class="panel-title" style="background:#000000; color:#00c1f7">';
	scrhtml += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Priority Ship Help</a></h4></div>';
	scrhtml += '<div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">';
	scrhtml += '<div class="panel-body" style="background:#000000; color:#00c1f7">';
	scrhtml += 'This text is designed to show a welcome message to the Priority Ship Heads Up Display for Available Rates.</br>';
	scrhtml += 'Please click on a link below to see the available rates for this shipment.';
	scrhtml += '</div>';
	scrhtml += '</div>';
	scrhtml += '</div>';
	scrhtml += '<div class="panel panel-default" style="background:#000000; color:#00c1f7">';
	scrhtml += '<div class="panel-heading" role="tab" id="headingTwo" style="background:#000000; color:#00c1f7">';
	scrhtml += '<h4 class="panel-title" style="background:#000000; color:#00c1f7">';
	scrhtml += '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">';
	scrhtml += 'Quick Rates';
	scrhtml += '</a>';
	scrhtml += '</h4>';
	scrhtml += '</div>';
	scrhtml += '<div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">';
	scrhtml += '<div class="panel-body" style="background:#000000; color:#00c1f7">';
	scrhtml += qrtable;
	scrhtml += '</div>';
	scrhtml += '</div>';
	scrhtml += '</div>';
	scrhtml += '<div class="panel panel-default" style="background:#000000; color:#00c1f7">';
	scrhtml += '<div class="panel-heading" role="tab" id="headingThree" style="background:#000000; color:#00c1f7">';
	scrhtml += '<h4 class="panel-title" style="background:#000000; color:#00c1f7">';
	scrhtml += '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">';
	scrhtml += 'P44 Rates';
	scrhtml += '</a>';
	scrhtml += '</h4>';
	scrhtml += '</div>';
	scrhtml += '<div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree" style="background:#000000; color:#00c1f7">';
	scrhtml += '<div class="panel-body" style="background:#000000; color:#00c1f7">';
	scrhtml += p44table;
	scrhtml += '</div>';
	scrhtml += '</div>';
	scrhtml += '</div>';
	//scrhtml += '</div>';
	scrhtml += "</div>";
	var totHTML = scrhtmlscripts += scrhtml;
	form.setFieldValues({custpage_pss_il_html : totHTML});
	nlapiLogExecution('DEBUG', 'We set HTML inline', 'Success!');
}

function AddRateButton(form) {
	form.setScript('customscript_pss_rate_shipment_bttn');
	form.addButton('custpage_setrate', 'Priority Rates', 'newGetRates()');
}
function newGetRates() {
	var recName = nlapiGetRecordId();
	var batId = Date.now();
	var url = nlapiResolveURL('SUITELET','customscript_pss_retriever','customdeploy_pss_retriever');
	url += '&reqURL=' + recName;
	url += '&batchId=' + batId;
	setTimeout(nlapiRequestURL(url), 100);
	var listUrl = nlapiResolveURL('SUITELET','customscript_pss_rate_selector_ss1','customdeploy_pss_rate_selector_ss1');
	listUrl += '&NLNAME=' + recName;
	listUrl += '&batchId=' + batId;
	var width = '900';
	var height = '500';
	var title = 'Select Available Rates';
	nlExtOpenWindow(listUrl, '', width, height, '', null, title);
}

function AddCHRobinsonButton(form) {
	form.setScript('customscript_pss_rate_shipment_bttn');
	form.addButton('custpage_chrobinsonbttn', 'CHR Rates', 'callCHRRater()');
}
function callCHRRater() {
	var recId = nlapiGetRecordId();
	var batId = Date.now();
	var rateReqURL = nlapiResolveURL('SUITELET','customscript_pss_chr_retriever','customdeploy_pss_chr_retriever');
	rateReqURL += '&requrl=' + recId;
	rateReqURL += '&batid=' + batId;
	var reqObj = nlapiRequestURL(rateReqURL);
	var respObj = reqObj.getBody();
	console.log('end of client call, response is ' + respObj);
	//now pop selector window
	var listUrl = nlapiResolveURL('SUITELET','customscript_pss_rate_selector_ss1','customdeploy_pss_rate_selector_ss1');
	listUrl += '&NLNAME=' + recId;
	listUrl += '&batchId=' + batId;
	var width = '900';
	var height = '500';
	var title = 'Select Available Rates';
	nlExtOpenWindow(listUrl, '', width, height, '', null, title);
}

function AddP44RatesButton(form) {
	form.setScript('customscript_pss_rate_shipment_bttn');
	form.addButton('custpage_setrate', 'Contract Rates', 'callP44Rater()');
}
function callP44Rater() {
	var recId = nlapiGetRecordId();
	var batId = Date.now();
	var rateReqURL = nlapiResolveURL('SUITELET','customscript_pss_p44_retriever','customdeploy_pss_p44_ret');
	rateReqURL += '&requrl=' + recId;
	rateReqURL += '&batid=' + batId;
	var reqObj = nlapiRequestURL(rateReqURL);
	var respObj = reqObj.getBody();
	console.log('end of client call, response is ' + respObj);
	//now pop selector window
	var listUrl = nlapiResolveURL('SUITELET','customscript_pss_rate_selector_ss1','customdeploy_pss_rate_selector_ss1');
	listUrl += '&NLNAME=' + recId;
	listUrl += '&batchId=' + batId;
	var width = '900';
	var height = '500';
	var title = 'Select Available Rates';
	nlExtOpenWindow(listUrl, '', width, height, '', null, title);
}

function AddPrintBOLButton(form) {
	form.setScript('customdeploy_pss_req_rates');
	form.addButton('custpage_settest', 'Print BOL', 'printBOL()');
}

function printBOL() {
	var recName = nlapiGetRecordId();
	var url = nlapiResolveURL('SUITELET','customscript_pss_xml_pdf_bol','customdeploy_pss_xml_pdf_bol');
	url += '&recName=' + recName,
		window.open(url);
}

function AddQuickRateButton(form){
	form.setScript('customdeploy_pss_rate_shipment_bttn');
	form.addButton('custpage_setqrate', 'Quick Rate', 'quickRate()');
}

function quickRate(){
	var parentId = nlapiGetRecordId();
	var url = nlapiResolveURL('SUITELET', 'customscript_pss_quick_rate_form', 'customdeploy_pss_quick_rate_form');
	url += '&parentid=' + parentId;
	var qrtitle = 'Quick Rate App';
	nlExtOpenWindow(url, '', '700', '400', '', null, qrtitle);
}

function AddTestButton(form){
	form.setScript('customdeploy_pss_rate_shipment_bttn');
	form.addButton('custpage_testform', 'Rate Direct', 'getSassyRateSelect()');
}

function AddEmailBrokerButton(form) {
	form.setScript('customdeploy_pss_req_rates');
	form.addButton('custpage_setemail', 'Email Brokers', 'emailBroker()');
}

function emailBroker() {
	var rec1 = [];
	var emailAddr = [];
	var person = [];
	var phoneNum = [];
	var brokerCompany = [];
	var results = nlapiSearchRecord('contact',63);
	//for ( var i = 0; results != null && i < results.length; i++){
	for ( var i = 0;i < results.length; i++){
		var rec1 = results[ i ];
		emailAddr.push(results[i].getValue('email'));
		person.push(results[i].getValue('entityid'));
		phoneNum.push(results[i].getValue('phone'));
		brokerCompany.push(results[i].getValue('company'));
		var shipRecId = nlapiGetRecordId();
		var record = nlapiLoadRecord('customrecord_pss_shipment', shipRecId, null, null);
		//window.alert("Shipment number " + shipRecId + " has been loaded");
		var recNum = record.getFieldValue('name');
		var emailSubject = "Please quote load #" + recNum;
		var baseURL = 'https://forms.netsuite.com/app/site/crm/externalcustrecordpage.nl?compid=TSTDRV1555031&formid=5&h=AACffht_C67TfdIDHCHtABFuFrbixLo60rg&custrecord_pss_bid2shipment_link=' + encodeURIComponent(shipRecId) + '&custrecord_pss_bid_contactname=' + encodeURIComponent(person[i]) + '&custrecord_pss_bid_contactphone=' + encodeURIComponent(phoneNum[i]) + '&custrecord_pss_bid_contactemail=' + encodeURIComponent(emailAddr[i])+ '&custrecord_pss_broker_vendorid=' + encodeURIComponent(brokerCompany[i]);
		var shipDate = record.getFieldValue('custrecord_pss_ship_date');
		var refatpickup = record.getFieldValue('custrecord_pss_reference_pickup');
		if (refatpickup === null){refatpickup = '';}
		var refatdelivery = record.getFieldValue('custrecord_pss_reference_delivery');
		if (refatdelivery === null){refatdelivery = '';}
		var shipperAddressee = record.getFieldValue('custrecord_pss_shipper_addressee');
		var shipperAddr1 = record.getFieldValue('custrecord_pss_shipper_addr_1');
		var shipperAddr2 = record.getFieldValue('custrecord_pss_shipper_addr_2');
		if (shipperAddr2 === null){shipperAddr2 = '';}
		var shipperCity = record.getFieldValue('custrecord_pss_shipper_city');
		var shipperState = record.getFieldValue('custrecord_pss_shipper_state');
		var shipperZip = record.getFieldValue('custrecord_pss_shipper_zip');
		var shipperCountry = record.getFieldValue('custrecord_pss_shipper_country');
		var consigneeAddressee = record.getFieldValue('custrecord_pss_consignee_addree');
		var consigneeAddr1 = record.getFieldValue('custrecord_pss_consignee_addr1');
		var consigneeAddr2 = record.getFieldValue('custrecord_pss_consignee_addr2');
		if (consigneeAddr2 === null){consigneeAddr2 = '';}
		var consigneeCity = record.getFieldValue('custrecord_pss_consignee_city');
		var consigneeState = record.getFieldValue('custrecord_pss_consignee_state');
		var consigneeZip = record.getFieldValue('custrecord_pss_consignee_zip');
		var consigneeCountry = record.getFieldValue('custrecord_pss_consignee_country');
		var splitSIMS = record.getFieldValue('custrecord_pss_special_instructions');
		if (splitSIMS === null){splitSIMS = '';}
		var ownerId = record.getFieldValue('custrecord_pss_custservteamlead');
		//var selAccNamesPrnt = '';
		var selAccessorials = record.getFieldValue('custrecord_pss_accessorials');
		console.log('Accessorials seleted: ' + selAccessorials);
		if (selAccessorials != null) {
			var selAccNamesPrnt = new Array();
			var accFil = new Array();
			accFil[0] = new nlobjSearchFilter('internalid', null, 'anyof', selAccessorials);
			var accCol = new Array();
			accCol[0] = new nlobjSearchColumn('name');
			var selAccNames = nlapiSearchRecord('customrecord_pss_accessorials', null, accFil, accCol);
			for (var j = 0; j < selAccNames.length; j++){
				selAccNamesPrnt += selAccNames[j].getValue('name') + '<br />';
			}
		} else {selAccNamesPrnt = '';}
		console.log('Accessorials print string: ' + selAccNamesPrnt);
		var specInstMSP = [];
		nlapiLogExecution('DEBUG', 'variables', 'shipperAddressee ' + shipperAddressee);
		nlapiLogExecution('DEBUG', 'variables2', 'consigneeAddressee ' + consigneeAddressee);
		nlapiLogExecution('DEBUG', 'variables3', 'consigneeCountry ' + consigneeCountry);
		nlapiLogExecution('DEBUG', 'variables4', 'shipperCountry ' + shipperCountry);
		//get shipment lines information for template - ajr
		var linHazmat = [];
		var linPicCount = [];
		var linType = [];
		var linNum = [];
		var linDesc = [];
		var linNMFC = [];
		var linLength = [];
		var linWidth = [];
		var linHeight = [];
		var linWeight = [];
		var items = [];
		var totLPC = 0;
		var totLPic = 0;
		var totWeight = 0;
		var pkgcount = [];
		var fil = [];
		fil[0] = new nlobjSearchFilter('custrecord_pss_shipment_parent', null, 'is', shipRecId);
		var col = [];
		col[0] = new nlobjSearchColumn('custrecord_pss_hazmat');
		col[1] = new nlobjSearchColumn('custrecord_pss_nmfc_number');
		col[2] = new nlobjSearchColumn('custrecord_pss_ship_line_item_desc');
		col[3] = new nlobjSearchColumn('custrecord_pss_packagetype');
		col[4] = new nlobjSearchColumn('custrecord_pss_pkgnumber');
		col[5] = new nlobjSearchColumn('custrecord_pss_weight');
		col[6] = new nlobjSearchColumn('custrecord_pss_nmfc_number_line');
		col[7] = new nlobjSearchColumn('custrecord_pss_freight_class_value');
		col[8] = new nlobjSearchColumn('custrecord_pss_piece_count');
		col[9] = new nlobjSearchColumn('custrecord_pss_length');
		col[10] = new nlobjSearchColumn('custrecord_pss_width');
		col[11] = new nlobjSearchColumn('custrecord_pss_height');
		var packages = nlapiSearchRecord('customrecord_pss_shipment_line', null, fil, col);
		for (var x = 0; x < packages.length; x++){
			pkgcount.push(packages[x].getValue('custrecord_pss_piece_count'));
			var linHazmat = packages[x].getValue('custrecord_pss_hazmat');
			var linPicCount = packages[x].getValue('custrecord_pss_nmfc_number');
			var linType = packages[x].getText('custrecord_pss_packagetype');
			var linNum = packages[x].getValue('custrecord_pss_piece_count');
			var linDesc = packages[x].getValue('custrecord_pss_ship_line_item_desc');
			var linWeight = packages[x].getValue('custrecord_pss_weight');
			var linLength = packages[x].getValue('custrecord_pss_length');
			var linWidth = packages[x].getValue('custrecord_pss_Width');
			var linHeight = packages[x].getValue('custrecord_pss_Height');
			var linNMFC = packages[x].getValue('custrecord_pss_freight_class_value');
			//totLPic += Number(linNum);
			totWeight += Number(linWeight);
			items += '<tr><td align="center">' + linNum + '</td><td align="left">' + linType + '</td><td align="left">' + linHazmat + '</td><td align="left">' + linDesc + '</td><td align="left">' + linPicCount + '</td><td align="left">' + linNMFC + '</td><td align="left">' + linLength + '</td><td align="left">' + linWidth + '</td><td align="left">' + linHeight + '</td><td align="left">' + linWeight + '</td></tr>';
		}
		//var pkgcnt = pkgcount.reduce(getSum);
		var pkgcnt = packages.length;
		//var pkgcnt = Math.max.apply(null,pkgcount);
		var hotTots = '<tr><td>Total Package Count:' + '</td><td font-size: 14pt>' + pkgcnt + '</td><td>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td><td>' + 'Total Weight:' + '</td><td font-size: 14pt>' + totWeight + ' lbs' + '</td></tr>';
		nlapiLogExecution('DEBUG','Line Item Count', 'We counted: ' + items + ' lines!!!');
		//begin template well formed HTML
		var emailBody = '<body style="width: 400px">';
		emailBody += '<table><tr>';
		emailBody += '<td><img src="http://shopping.netsuite.com/core/media/media.nl?id=146&c=TSTDRV1555031&h=cf09ea366f1f1827d66e"/></td>';
		emailBody += '<td font-size: 14pt;><b><a href=' + baseURL + '>Bid Online Now</a></b></td>';
		emailBody += '<td><b>BOL Number:&nbsp; ' + shipRecId + ' </b></td>';
		emailBody += '</tr></table>';
		//start of upper main table
		emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
		emailBody += '<td valign="top">';
		//start of ship from table - ajr
		emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
		emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">Ship From</th>';
		emailBody += '</tr>';
		emailBody += '<tr><td valign="left">' + 'Priority Suite' + '<br />';
		emailBody += '<tr><td valign="left">' + shipperAddressee + '<br />';
		emailBody += '<tr><td valign="left">' + shipperAddr1 + '<br />';
		emailBody += '<tr><td valign="left">' + shipperAddr2 + '<br />';
		emailBody += shipperCity + ', ' + shipperState + ' ' + shipperZip + '<br />';
		emailBody += '<tr><td valign="left">' + shipperCountry + '<br />';
		emailBody += '</td>';
		emailBody += '</tr></table>';
		//start of ship to table - ajr
		emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
		emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">Ship To</th>';
		emailBody += '</tr>';
		emailBody += '<tr><td valign="left">' + consigneeAddressee + '<br />';
		emailBody += '<tr><td valign="left">' + consigneeAddr1 + '<br />';
		emailBody += '<tr><td valign="left">' + consigneeAddr2 + '<br />';
		emailBody += consigneeCity + ', ' + consigneeState + ' ' + consigneeZip + '<br />';
		emailBody += '<tr><td valign="left">' + consigneeCountry + '<br />';
		emailBody += '</td>';
		emailBody += '</tr></table>';
		emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
		emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">References</th>';
		emailBody += '</tr>';
		emailBody += '<tr>';
		emailBody += '<td>Origin Reference #:&nbsp;' + refatpickup + '</td>';
		emailBody += '</tr>';
		emailBody += '<tr>';
		emailBody += '<td>Destination Reference #:&nbsp;' + refatdelivery + '</td>';
		emailBody += '</tr>';
		emailBody += '<tr>';
		emailBody += '<td></td>';
		emailBody += '</tr></table>';
		//start of Accessorials table - ajr
		emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
		emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">Accessorials</th>';
		emailBody += '</tr>';
		emailBody += '<tr>';
		emailBody += '<td>' + selAccNamesPrnt + '</td>';
		emailBody += '';
		emailBody += '</tr></table>';
		//end of upper main table
		emailBody += '</td>';
		emailBody += '</tr></table>';
		//start of special instructions table
		emailBody += '<table style="width: 100%; height:50px; font-size: 10pt;border:1px"><tr>';
		emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">SPECIAL INSTRUCTIONS:</th>';
		emailBody += '<td valign="top"><b>' + splitSIMS + '</b><br /></td>';
		emailBody += '</tr>';
		emailBody += '<tr><td>TOTAL WEIGHT: '+ totWeight +'</td></tr>';
		emailBody += '<tr><td>TOTAL PIECES: '+ pkgcnt +'</td></tr>';
		emailBody += '</table>';
		//start of line items table
		emailBody += '<table style="width:100%;font-size:8pt;margin-top: 10px;">';
		emailBody += '<thead>';
		emailBody += '<tr>';
		emailBody += '<th align="center" valign="middle" style="text-align:left">Package</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">Type</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">HM</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">Description</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">NMFC</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">Class</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">L</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">W</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">H</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">Weight</th>';
		emailBody += '</tr>';
		emailBody += '</thead>';
		emailBody += items;
		emailBody += '<tr style="width:100%;border:1px"><td></td></tr>';
		//emailBody += hotTots;
		emailBody += '</table></body>';
		var rec = new Array();
		rec['recordtype']='customrecord_pss_shipment'; //script id of the custom record type
		rec['record'] = nlapiGetRecordId(); //internal id of the custom record
		//rec['activity'] = '380';// internal id of the case or campaign record
		//rec['transaction'] = '580';// internal id of the transaction record
		//rec['entity'] = '480';// internal id of the entity record
		nlapiSendEmail(250,emailAddr[i],emailSubject,emailBody,null,null,rec,null,'true');
	}
	record.setFieldValue('custrecord_pss_shipment_status',7);
	nlapiSubmitRecord(record);
	location.reload();
}

function emailBroker1218old() {
	var rec1 = [];
	var emailAddr = [];
	var person = [];
	var phoneNum = [];
	var results = nlapiSearchRecord('contact',1009);
	//for ( var i = 0; results != null && i < results.length; i++){
	for ( var i = 0;i < results.length; i++){
		var rec1 = results[ i ];
		emailAddr.push(results[i].getValue('email'));
		person.push(results[i].getValue('entityid'));
		phoneNum.push(results[i].getValue('phone'));
		var shipRecId = nlapiGetRecordId();
		var record = nlapiLoadRecord('customrecord_pss_shipment', shipRecId, null, null);
		//window.alert("Shipment number " + shipRecId + " has been loaded");
		var recNum = record.getFieldValue('name');
		var locationId = record.getFieldValue('custrecord_pss_location');
		//var locationName = record.getFieldText('custrecord_pss_location');
		//var locationRecord = nlapiLoadRecord('location', locationId, null, null);
		//var locationAddr1 = locationRecord.fields.addr1;
		//var locationAddr2 = locationRecord.fields.addr2;
		/*var locationAddr1 = locationRecord.getFieldValue('addr1');
        var locationAddr2 = locationRecord.getFieldValue('addr2');
        var locationCity = nlapiLookupField('location', locationId, 'city');
        var locationState = nlapiLookupField('location', locationId, 'state');
        var locationZip = nlapiLookupField('location', locationId, 'zip');
        var locationCountry = nlapiLookupField('location', locationId, 'country');*/
		var emailSubject = "Please quote load #" + recNum;
		var baseURL = 'https://forms.na3.netsuite.com/app/site/crm/externalcustrecordpage.nl?compid=3496142&formid=6&h=AACffht_-ttRtcS_t3VThFzb6cshX56j1-k&redirect_count=1&did_javascript_redirect=T&custrecord_pss_bid2shipment_link=' + encodeURIComponent(shipRecId) + '&custrecord_pss_bid_contactname=' + encodeURIComponent(person[i]) + '&custrecord_pss_bid_contactphone=' + encodeURIComponent(phoneNum[i]) + '&custrecord_pss_bid_contactemail=' + encodeURIComponent(emailAddr[i]);
		//var ShipperEnt = record.getFieldValue('custrecord_pss_shipper');
		//var ShipperEntType = nlapiLookupField('entity', ShipperEnt, 'type');
		//if (ShipperEntType === 'CustJob'){ShipperEntType = 'customer';}
		var ConsEnt = record.getFieldValue('custrecord_pss_consignee');
		var ConsType = nlapiLookupField('entity', ConsEnt, 'type');
		if (ConsType === 'CustJob'){ConsType = 'customer';}
		var BillToEnt = record.getFieldValue('custrecord_pss_freight_bill_to');
		var BillToType = nlapiLookupField('entity', BillToEnt, 'type');
		if (BillToType === 'CustJob'){BillToType = 'customer';}
		//var carrierEnt = record.getFieldValue('custrecord_pss_carrier');
		//var carrierName = nlapiLookupField('vendor', carrierEnt, 'companyname');
		//var prntCarName = carrierName.replace('&','&amp;');
		var shipDate = record.getFieldValue('custrecord_pss_ship_date');
		var refatpickup = record.getFieldValue('custrecord_pss_reference_pickup');
		if (refatpickup === null){refatpickup = '';}
		var refatdelivery = record.getFieldValue('custrecord_pss_reference_delivery');
		if (refatdelivery === null){refatdelivery = '';}
		//var carQuoteNum = record.getFieldValue('custrecord_pss_sel_car_quote_num');
		//if (carQuoteNum === null){carQuoteNum = '';}
		//var shipper = nlapiLoadRecord(ShipperEntType, ShipperEnt);
		//var prntShipName = shipper.getFieldValue('companyname');
		//var shipperAddr1 = record.getFieldValue('custrecord_pss_shipper_addr_1');
		//var shipperAddr2 = record.getFieldValue('custrecord_pss_shipper_addr_2');
		//if (shipperAddr2 === null){shipperAddr2 = '';}
		//var shipperCity = record.getFieldValue('custrecord_pss_shipper_city');
		//var shipperState = record.getFieldValue('custrecord_pss_shipper_state');
		//var shipperZip = record.getFieldValue('custrecord_pss_shipper_zip')
		var consignee = nlapiLoadRecord(ConsType, ConsEnt);
		var prntConsName = consignee.getFieldValue('companyname');
		var consigneeAtten = record.getFieldValue('custrecord_pss_consignee_attn');
		if (consigneeAtten === null){consigneeAtten = '';}
		var consigneeAddree = record.getFieldValue('custrecord_pss_consignee_addree');
		if (consigneeAddree === null){consigneeAddree = '';}
		var consigneeAddr1 = record.getFieldValue('custrecord_pss_consignee_addr1');
		var consigneeAddr2 = record.getFieldValue('custrecord_pss_consignee_addr2');
		if (consigneeAddr2 === null){consigneeAddr2 = '';}
		var consigneeCity = record.getFieldValue('custrecord_pss_consignee_city');
		var consigneeState = record.getFieldValue('custrecord_pss_consignee_state');
		var consigneeZip = record.getFieldValue('custrecord_pss_consignee_zip');
		var billToRec = nlapiLoadRecord(BillToType, BillToEnt);
		var prntBTName = billToRec.getFieldValue('companyname');
		var billToAddr1 = billToRec.getFieldValue('shipaddr1');
		var billToAddr2 = billToRec.getFieldValue('shipaddr2');
		if (billToAddr2 === null){billToAddr2 = '';}
		var billToCity = billToRec.getFieldValue('shipcity');
		var billToState = billToRec.getFieldValue('shipstate');
		var billToZip = billToRec.getFieldValue('shipzip');
		var splitSIMS = record.getFieldValue('custrecord_pss_special_instructions');
		if (splitSIMS === null){splitSIMS = '';}
		var specInstMSP = [];
		//nlapiLogExecution('DEBUG', 'Addresing Complete', 'Bill To Zip is ' + billToZip);
		//get shipment lines information for template - ajr
		var linHazmat = [];
		var linPicCount = [];
		var linType = [];
		var linNum = [];
		var linDesc = [];
		var linNMFC = [];
		var linLength = [];
		var linWidth = [];
		var linHeight = [];
		var linWeight = [];
		var items = [];
		var totLPC = 0;
		var totLPic = 0;
		var totWeight = 0;
		var pkgcount = [];
		var fil = [];
		fil[0] = new nlobjSearchFilter('custrecord_pss_shipment_parent', null, 'is', shipRecId);
		var col = [];
		col[0] = new nlobjSearchColumn('custrecord_pss_hazmat');
		col[1] = new nlobjSearchColumn('custrecord_pss_nmfc_number');
		col[2] = new nlobjSearchColumn('custrecord_pss_ship_line_item_desc');
		col[3] = new nlobjSearchColumn('custrecord_pss_packagetype');
		col[4] = new nlobjSearchColumn('custrecord_pss_pkgnumber');
		col[5] = new nlobjSearchColumn('custrecord_pss_weight');
		col[6] = new nlobjSearchColumn('custrecord_pss_nmfc_number_line');
		col[7] = new nlobjSearchColumn('custrecord_pss_freight_class_value');
		col[8] = new nlobjSearchColumn('custrecord_pss_piece_count');
		col[9] = new nlobjSearchColumn('custrecord_pss_length');
		col[10] = new nlobjSearchColumn('custrecord_pss_width');
		col[11] = new nlobjSearchColumn('custrecord_pss_height');
		var packages = nlapiSearchRecord('customrecord_pss_shipment_line', null, fil, col);
		for (var x = 0; x < packages.length; x++){
			pkgcount.push(packages[x].getValue('custrecord_pss_piece_count'));
			var linHazmat = packages[x].getValue('custrecord_pss_hazmat');
			var linPicCount = packages[x].getValue('custrecord_pss_nmfc_number');
			var linType = packages[x].getText('custrecord_pss_packagetype');
			var linNum = packages[x].getValue('custrecord_pss_piece_count');
			var linDesc = packages[x].getValue('custrecord_pss_ship_line_item_desc');
			var linWeight = packages[x].getValue('custrecord_pss_weight');
			var linLength = packages[x].getValue('custrecord_pss_length');
			var linWidth = packages[x].getValue('custrecord_pss_Width');
			var linHeight = packages[x].getValue('custrecord_pss_Height');
			var linNMFC = packages[x].getValue('custrecord_pss_freight_class_value');
			//totLPic += Number(linNum);
			totWeight += Number(linWeight);
			items += '<tr><td align="center">' + linNum + '</td><td align="left">' + linType + '</td><td align="left">' + linHazmat + '</td><td align="left">' + linDesc + '</td><td align="left">' + linPicCount + '</td><td align="left">' + linNMFC + '</td><td align="left">' + linLength + '</td><td align="left">' + linWidth + '</td><td align="left">' + linHeight + '</td><td align="left">' + linWeight + '</td></tr>';
		}
		//var pkgcnt = pkgcount.reduce(getSum);
		var pkgcnt = packages.length;
		//var pkgcnt = Math.max.apply(null,pkgcount);
		var hotTots = '<tr><td>Total Package Count:' + '</td><td font-size: 14pt>' + pkgcnt + '</td><td>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td><td>' + 'Total Weight:' + '</td><td font-size: 14pt>' + totWeight + ' lbs' + '</td></tr>';
		nlapiLogExecution('DEBUG','Line Item Count', 'We counted: ' + items + ' lines!!!');
		//begin template well formed HTML
		var emailBody = '<body style="width: 400px">';
		emailBody += '<table><tr>';
		emailBody += '<td font-size: 14pt;><b><a href=' + baseURL + '>Bid Online Now</a></b></td>';
		emailBody += '<td><b>BOL Number:&nbsp; ' + recNum + ' </b></td>';
		emailBody += '</tr></table>';
		//start of upper main table
		emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
		emailBody += '<td valign="top">';
		//start of ship from table - ajr
		emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
		emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">Ship From</th>';
		emailBody += '</tr>';
		emailBody += '<tr><td valign="left">' + 'Pliteq Inc.' + '<br />';
		emailBody += 'c/o  ' + locationAddr1 + '<br/>' + locationAddr2 + '<br />';
		emailBody += locationCity + ', ' + locationState + ' ' + locationZip + '<br />';
		emailBody += '</td>';
		emailBody += '</tr></table>';
		//start of ship to table - ajr
		emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
		emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">Ship To</th>';
		emailBody += '</tr>';
		emailBody += '<tr><td valign="left">' + consigneeAddree + '<br />' + consigneeAtten + '<br />';
		emailBody += consigneeAddr1 + ' ' + consigneeAddr2 + '<br />';
		emailBody += consigneeCity + ', ' + consigneeState + ' ' + consigneeZip + '<br />';
		emailBody += '</td>';
		emailBody += '</tr></table>';
		/*start of bill to table - ajr
        emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
        emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">BILL 3rd PARTY PREPAID TO:</th>';
        emailBody += '</tr>';
        emailBody += '<tr><td>' + prntBTName + '<br />' + billToAddr1 + ' ' + billToAddr2 + '<br />' + billToCity + ', ' + billToState + ' ' + billToZip + '</td>';
        emailBody += '</tr></table>';
        emailBody += '</td>';
        //start of carrier info table - ajr
        emailBody += '<td valign="top">';
        emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
        emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">Carrier Information:</th>';
        emailBody += '</tr>';
        emailBody += '<tr><td><b>' + prntCarName + '</b></td></tr>';
        emailBody += '<tr><td>Pickup Date: ' + shipDate + '</td></tr>';
        emailBody += '</table>';
        */
		//start of references table - ajr
		emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
		emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">References</th>';
		emailBody += '</tr>';
		emailBody += '<tr>';
		emailBody += '<td>Origin Reference #:&nbsp;' + refatpickup + '</td>';
		emailBody += '</tr>';
		emailBody += '<tr>';
		emailBody += '<td>Destination Reference #:&nbsp;' + refatdelivery + '</td>';
		emailBody += '</tr>';
		emailBody += '<tr>';
		emailBody += '<td>Carrier Quote #:&nbsp;' + carQuoteNum + '</td>';
		emailBody += '</tr></table>';
		//start of Accessorials table - ajr
		emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
		emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">Accessorials</th>';
		emailBody += '</tr>';
		emailBody += '<tr>';
		//emailBody += '<td>' + selAccNamesPrnt + '</td>';
		emailBody += '';
		emailBody += '</tr></table>';
		//end of upper main table
		emailBody += '</td>';
		emailBody += '</tr></table>';
		//start of special instructions table
		emailBody += '<table style="width: 100%; height:50px; font-size: 10pt;border:1px"><tr>';
		emailBody += '<td valign="top"><b>SPECIAL INSTRUCTIONS: &nbsp;' + splitSIMS + '</b><br /></td>';
		emailBody += '</tr>';
		emailBody += '</table>';
		//start of line items table
		emailBody += '<table style="width:100%;font-size:8pt;margin-top: 10px;">';
		emailBody += '<thead>';
		emailBody += '<tr>';
		emailBody += '<th align="center" valign="middle" style="text-align:left">Package</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">Type</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">HM</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">Description</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">NMFC</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">Class</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">L</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">W</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">H</th>';
		emailBody += '<th style="padding: 4px 4px;text-align:left">Weight</th>';
		emailBody += '</tr>';
		emailBody += '</thead>';
		emailBody += items;
		emailBody += '<tr style="width:100%;border:1px"><td></td></tr>';
		emailBody += hotTots;
		emailBody += '</table></body>';
		var rec = new Array();
		rec['recordtype']='customrecord_pss_shipment'; //script id of the custom record type
		rec['record'] = nlapiGetRecordId(); //internal id of the custom record
		//rec['activity'] = '380';// internal id of the case or campaign record
		//rec['transaction'] = '580';// internal id of the transaction record
		//rec['entity'] = '480';// internal id of the entity record
		nlapiSendEmail(1160,emailAddr[i],emailSubject,emailBody,null,null,rec,null,'true');
	}
	location.reload();
}

function AddBillButton(form){
	form.setScript('customdeploy_pss_rate_shipment_bttn');
	form.addButton('custpage_billbutton', 'Create Bill', 'generateVendorBill()');
}

function AddLabelButton(form){
	form.setScript('customdeploy_pss_rate_shipment_bttn');
	form.addButton('custpage_labelButton', 'Print Label', 'print4x6Label()');
}

function print4x6Label(){
	var recName = nlapiGetRecordId();
	var url = nlapiResolveURL('SUITELET', 'customscript_pss_4x6label', 'customdeploy_pss_4x6label');
	url += '&recName=' + recName,
		window.open(url);
}

function AddDispatchButton(form){
	form.setScript('customdeploy_pss_rate_shipment_bttn');
	form.addButton('custpage_DispatchButton', 'Dispatch', 'dispatchShipment()');
}
//dispatch shipment to P44
function dispatchShipment(){
	var recId = nlapiGetRecordId();
	//generate Base64 credential key
	var creds = 'andy.reeder@priority-logistics.com:Leftfoot5510!';
	var enCreds = nlapiEncrypt(creds, 'base64');
	//p44 endPoint URL for Rating
	var url = 'https://test.p-44.com/api/v3/shipments';
	//setting request headers
	var headers = new Array();
	headers['Authorization'] = 'Basic ' + enCreds;
	headers['Content-Type'] = 'application/json';
	headers['Accept'] = 'application/json';
	var parentShipment = nlapiLoadRecord('customrecord_pss_shipment', recId);
	var shipmentName = parentShipment.getFieldValue('name');
	var shipperAddressee = parentShipment.getFieldValue('custrecord_pss_shipper_addressee');
	var shipperAddr1 = parentShipment.getFieldValue('custrecord_pss_shipper_addr_1');
	var shipperAddr2 = parentShipment.getFieldValue('custrecord_pss_shipper_addr_2');
	var shipperState = parentShipment.getFieldValue('custrecord_pss_shipper_state');
	var shipperCity = parentShipment.getFieldValue('custrecord_pss_shipper_city');
	var shipperZip = parentShipment.getFieldValue('custrecord_pss_shipper_zip');
	var shipperCountry = parentShipment.getFieldValue('custrecord_pss_shipper_country');
	var shipperPhone = '1-800-555-5555';
	var shipperEmail = 'april.withers@priority-logistics.com';
	var consigneeAddressee = parentShipment.getFieldValue('custrecord_pss_consignee_addree');
	var consigneeAttn = parentShipment.getFieldValue('custrecord_pss_consignee_attn');
	var consigneeAddr1 = parentShipment.getFieldValue('custrecord_pss_consignee_addr1');
	var consigneeAddr2 = parentShipment.getFieldValue('custrecord_pss_consignee_addr2');
	var consigneeCity = parentShipment.getFieldValue('custrecord_pss_consignee_city');
	var consigneeState = parentShipment.getFieldValue('custrecord_pss_consignee_state');
	var consigneeZip = parentShipment.getFieldValue('custrecord_pss_consignee_zip');
	var consigneeCountry = parentShipment.getFieldValue('custrecord_pss_consignee_country');
	var consigneePhone = '1-800-555-5555';
	var consigneeEmail = 'april.withers@priority-logistics.com';
	var shipmentDate = parentShipment.getFieldValue('custrecord_pss_ship_date');
	var tempShipDate = new Date(shipmentDate);
	var formedShipDate = new Date(tempShipDate).format('Y-m-d');
	var carrierEnt = parentShipment.getFieldValue('custrecord_pss_carrier');
	var carrierName = nlapiLookupField('vendor', carrierEnt, 'entityid');
	var carrierPhone = nlapiLookupField('vendor', carrierEnt, 'phone');
	var selSCAC = nlapiLookupField('vendor', carrierEnt, 'custentity_pss_scac');
	var shipDate = parentShipment.getFieldValue('custrecord_pss_ship_date');
	var deliveryDate = parentShipment.getFieldValue('custrecord_pss_delivery_date');
	var tempDeliveryDate = new Date(deliveryDate);
	var formedDeliveryDate = new Date(tempDeliveryDate).format('Y-m-d');
	var lineItems = [];
	var packageItem = [];
	var packageWeight = [];
	var packageQty = [];
	var packageFrtClass = [];
	var packageHeight = [];
	var packageLength = [];
	var packageWidth = [];
	for (var j = 1; j <= parentShipment.getLineItemCount('recmachcustrecord_pss_shipment_parent'); j++){
		packageItem.push(parentShipment.getLineItemValue('recmachcustrecord_pss_shipment_parent', 'custrecord_pss_ship_line_item_desc', j));
		packageQty.push(parentShipment.getLineItemValue('recmachcustrecord_pss_shipment_parent', 'custrecord_pss_piece_count', j));
		packageFrtClass.push(parentShipment.getLineItemValue('recmachcustrecord_pss_shipment_parent', 'custrecord_pss_freight_class_value', j));
		packageWeight.push(parentShipment.getLineItemValue('recmachcustrecord_pss_shipment_parent', 'custrecord_pss_weight', j));
		packageHeight.push(parentShipment.getLineItemValue('recmachcustrecord_pss_shipment_parent', 'custrecord_pss_height', j));
		packageLength.push(parentShipment.getLineItemValue('recmachcustrecord_pss_shipment_parent', 'custrecord_pss_length', j));
		packageWidth.push(parentShipment.getLineItemValue('recmachcustrecord_pss_shipment_parent', 'custrecord_pss_width', j));
	}
	for (var k = 0; k < packageItem.length; k++){
		lineItems.push({"freightClass": packageFrtClass[k], "totalWeight": packageWeight[k], "totalPackages": 1, "totalPieces": packageQty[k], "nmfcItemCode": "150650", "packageDimensions": {"length": packageLength[k], "width": packageWidth[k], "height": packageHeight[k]}});
	}
	var jPayload = {
		"capacityProviderAccountGroup":{
			"code": "43384",
			"accounts": [
				{
					"code": selSCAC
				}
			]
		},
		"originLocation": {
			"address": {
				"postalCode": shipperZip,
				"addressLines": [
					shipperAddr1 + ' ' + shipperAddr2
				],
				"city": shipperCity,
				"state": shipperState,
				"country": shipperCountry
			},
			"contact": {
				"companyName": shipperAddressee,
				"contactName": shipperAddressee,
				"phoneNumber": shipperPhone,
				"email": shipperEmail
			}
		},
		"destinationLocation": {
			"address": {
				"postalCode": consigneeZip,
				"addressLines": [
					consigneeAddr1 + ' ' + consigneeAddr2
				],
				"city": consigneeCity,
				"state": consigneeState,
				"country": consigneeCountry
			},
			"contact": {
				"companyName": consigneeAddressee,
				"contactName": consigneeAddressee,
				"phoneNumber": consigneePhone,
				"email": consigneeEmail
			}
		},
		"requesterLocation": {
			"address": {
				"postalCode": shipperZip,
				"addressLines": [
					shipperAddr1 + ' ' + shipperAddr2
				],
				"city": shipperCity,
				"state": shipperState,
				"country": shipperCountry
			},
			"contact": {
				"companyName": "Priority Logistics Inc",
				"contactName": "Customer Service",
				"phoneNumber": "1-913-754-2065",
				"email": "april.withers@priority-logistics.com"
			}
		},
		"lineItems": lineItems,
		"pickupWindow": {
			"date": formedShipDate,
			"startTime": '08:00',
			"endTime": '16:00'
		},
		"deliveryWindow": {
			"date": formedDeliveryDate,
			"startTime": '08:00',
			"endTime": '16:00'
		},

		"carrierCode": selSCAC,
		"shipmentIdentifiers": [{
			"type": "BILL_OF_LADING",
			"value": shipmentName}],
		"weightUnit": "LB",
		"lengthUnit": "IN",
		"apiConfiguration": {
			"noteConfiguration": {
				"enableTruncation": false,
				"noteSections": [
					{
						"name": "PICKUP_NOTE"
					}
				]
			},
			"allowUnsupportedAccessorials": false,
			"enableUnitConversion": false,
			"fallBackToDefaultAccountGroup": false,
			"preScheduledPickup": false
		}
	}

	var strPayload = JSON.stringify(jPayload);

	nlapiLogExecution('DEBUG', 'Payload', strPayload);

	var response = nlapiRequestURL(url, strPayload, headers, 'POST');
	nlapiLogExecution('DEBUG', 'Response', response.getBody());
	var obj = response.getBody();
	var respObj = JSON.parse(obj);
	if (respObj.hasOwnProperty('httpStatusCode')){
		var errMessage = respObj.errorMessage;
		alert('Shipment did not dispatch.  Please call '+carrierName+' at '+carrierPhone+' directly');
		nlapiSendEmail(250,'robert.regnier@priority-logistics.com','Customer Deploy Dispatch Failure on '+ shipmentName,errMessage);
		console.log(errMessage);
	} else {
		var pickupNum = respObj.shipmentIdentifiers[0].value;
		parentShipment.setFieldValue('custrecord_pss_shipment_status', 1);
		parentShipment.setFieldValue('custrecord_pss_car_pu_num', pickupNum);
		nlapiSubmitRecord(parentShipment);
		var baseURL = 'https://system.netsuite.com/app/common/custom/custrecordentry.nl?rectype=15&id=';
		var url = baseURL + recId + '&whence=';
		window.location = url;
	}
}

function cancelDispatch(){
	var recId = nlapiGetRecordId();
	nlapiLogExecution('DEBUG', 'Cancel Dispatch Started for ', recId);
	//generate Base64 credential key
	var creds = 'andy.reeder@priority-logistics.com:Leftfoot5510!';
	var enCreds = nlapiEncrypt(creds, 'base64');
	//p44 endPoint URL for Rating
	var url = 'https://cloud.p-44.com/api/v3/shipments/cancellations';
	//setting request headers
	var headers = new Array();
	headers['Authorization'] = 'Basic ' + enCreds;
	headers['Content-Type'] = 'application/json';
	headers['Accept'] = 'application/json';
	nlapiLogExecution('DEBUG', 'creds and headers ', enCreds + '  -  '+headers);
	var parentShipment = nlapiLoadRecord('customrecord_pss_shipment', recId);
	var shipmentName = parentShipment.getFieldValue('name');
	nlapiLogExecution('DEBUG', 'shipmentName ', shipmentName);
	//get Origin Info
	var origEnt = parentShipment.getFieldValue('custrecord_pss_shipper');
	var origRec = nlapiLoadRecord('customer', origEnt);
	var origAddree = origRec.getFieldValue('shipaddressee');
	var origAtten = origRec.getFieldValue('shipattention');
	var origAddr1 = origRec.getFieldValue('shipaddr1');
	var origAddr2 = origRec.getFieldValue('shipaddr2');
	var origCity = origRec.getFieldValue('shipcity');
	var origState = origRec.getFieldValue('shipstate');
	var origCountry = origRec.getFieldValue('shipcountry');
	var origPhone = origRec.getFieldValue('phone');
	var origEmail =origRec.getFieldValue('email');
	var originZip = parentShipment.getFieldValue('custrecord_pss_shipper_zip');
	var shipmentDate = parentShipment.getFieldValue('custrecord_pss_ship_date');
	var origPickupNum = parentShipment.getFieldValue('custrecord_pss_car_pu_num');
	var carrierEnt = parentShipment.getFieldValue('custrecord_pss_carrier');
	var carrierName = nlapiLookupField('vendor',carrierEnt,'companyname');
	var carrierPhone = nlapiLookupField('vendor',carrierEnt,'phone');
	var selSCAC = nlapiLookupField('vendor', carrierEnt, 'custentity_pss_scac');
	//nlapiLogExecution('DEBUG', 'var - carrierName = ', carrierName);
	var jPayload = {
		"capacityProviderAccountGroup": {
			"code": "43384",
			"accounts": [
				{
					"code": selSCAC
				}
			]
		},
		"originAddress": {
			"postalCode": originZip,
			"addressLines": [
				origAddr1 + ' ' + origAddr2
			],
			"city": origCity,
			"state": origState,
			"country": origCountry
		},
		"shipmentIdentifiers": [
			{
				"type": "BILL_OF_LADING",
				"value": shipmentName
			}
		],
		"apiConfiguration": {
			"fallBackToDefaultAccountGroup": false
		}
	}
	var strPayload = JSON.stringify(jPayload);
	nlapiLogExecution('DEBUG', 'Payload', strPayload);
	var response = nlapiRequestURL(url, strPayload, headers, 'POST');
	nlapiLogExecution('DEBUG', 'Response', response.getBody());
	var obj = response.getBody();
	var respObj = JSON.parse(obj);
	if (respObj.hasOwnProperty('httpStatusCode')){
		var errMessage = respObj.errors;
		nlapiLogExecution('DEBUG', 'Response', errMessage);
		alert('Shipment could not be canceled. Please call '+carrierName+' at '+carrierPhone+' directly to cancel pickup request# '+origPickupNum+'.');
		//alert('Shipment could not be cancelled.  Please call '+carrierEnt+' to stop the pickup.');
		console.log(errMessage);
		nlapiSendEmail(3873,'april.withers@priority-logistics.com','Paper Roll Cancel Dispatch Failure',errMessage);
	} else {
		var pickupNum = respObj.shipmentIdentifiers[0].value;
		parentShipment.setFieldValue('custrecord_pss_shipment_status', 1);
		parentShipment.setFieldValue('custrecord_pss_car_pu_num', pickupNum);
		nlapiSubmitRecord(parentShipment);
		var baseURL = 'https://system.na2.netsuite.com/app/common/custom/custrecordentry.nl?rectype=49&id=';
		var url = baseURL + recId + '&whence=';
		nlapiSendEmail(3873,'april.withers@priority-logistics.com','Paper Roll Cancel Dispatch Success',strPayload);
		window.location = url;
	}
}

function AddTrackLTLButton(form){
	form.setScript('customdeploy_pss_rate_shipment_bttn');
	form.addButton('custpage_TrackLTLButton', 'Track', 'trackPassLTL()');
}
function trackPassLTL() {
	//get parent record
	//var recId = request.getParameter('requrl');
	//var recId = '123457065';
	var recId = nlapiGetRecordId();
	var parentShipment = nlapiLoadRecord('customrecord_pss_shipment', recId);
	var carrier = parentShipment.getFieldValue('custrecord_pss_carrier');
	var carrierSCAC = nlapiLookupField('vendor',carrier,'custentity_pss_scac');
	var carrierPRO = parentShipment.getFieldValue('custrecord_pss_carrier_pro');
	var creds = 'robert.regnier@priority-logistics.com:Priority1!';
	var enCreds = nlapiEncrypt(creds, 'base64');
	var url = 'https://test.p-44.com/api/v3/statuses/query';
	var headers = [];
	headers['Authorization'] = 'Basic ' + enCreds;
	headers['Content-Type'] = 'application/json';
	headers['Accept'] = 'application/json';
	//nlapiLogExecution('DEBUG', 'BeforeRequestSent', 'Requesting Record ID: ' + recId);
	var jPayload =
		{
			"capacityProviderAccountGroup": {
				"code": 43384,
				"accounts": [
					{
						"code": carrierSCAC
					}
				]
			},
			"shipmentIdentifiers": [
				{
					"type": "PRO",
					"value": carrierPRO
				}
			],
			"apiConfiguration": {
				"fallBackToDefaultAccountGroup": false
			}
		}
	var strPayload = JSON.stringify(jPayload);
	var response = nlapiRequestURL(url, strPayload, headers, 'POST');
	nlapiLogExecution('DEBUG', 'Response', response.getBody());
	var obj = response.getBody();
	var respObj = JSON.parse(obj);
	var code = respObj.statusUpdateHistory[1].code;
	var description = respObj.statusUpdateHistory[1].description;
	var timestamp = respObj.statusUpdateHistory[1].timestamp;
	var retrievalDateTime = respObj.statusUpdateHistory[1].retrievalDateTime;
	var trackPassLine = nlapiCreateRecord('customrecord_pss_trackpass_line');
	trackPassLine.setFieldValue('custrecord_pss_tpass_shipment_id', recId);
	trackPassLine.setFieldValue('custrecord_pss_tpass_statusraw', code);
	trackPassLine.setFieldValue('custrecord_pss_tpass_carriernotes', description);
	trackPassLine.setFieldValue('custrecord_pss_tpass_timestampraw', timestamp);
	trackPassLine.setFieldValue('custrecord_pss_tpass_retrievaldatetime', retrievalDateTime);
	nlapiSubmitRecord(trackPassLine);
	parentShipment.setFieldValue('custrecord_pss_last_trace_time',timestamp);
	parentShipment.setFieldValue('custrecord_pss_last_trace_status',code);
	nlapiSubmitRecord(parentShipment);
	var baseURL = 'https://system.netsuite.com/app/common/custom/custrecordentry.nl?rectype=15&id=';
	var url = baseURL + recId + '&whence=';
	window.location = url;
}

function AddDATPostButton(form){
	form.setScript('customdeploy_pss_rate_shipment_bttn');
	form.addButton('custpage_DATPostButton', 'DAT-Post', 'postDAT()');
}
function postDAT() {
	var recId = nlapiGetRecordId();
	//var recId = 101103;
	nlapiLogExecution('DEBUG', 'postDAT', 'starting postDAT function on shipment ' + recId);
	var parentShipment = nlapiLoadRecord('customrecord_pss_shipment', recId);
	var shipmentName = parentShipment.getFieldValue('name');
	var employeeId = parentShipment.getFieldValue('custrecord_pss_custservteamlead');
	var primaryDAT = nlapiLookupField('employee', employeeId, 'custentity_pss_dat_primary_key');
	var secondaryDAT = nlapiLookupField('employee', employeeId, 'custentity_pss_dat_secondary_key');
	var equipTypeId = parentShipment.getFieldValue('custrecord_pss_equip_type');
	var equipType = nlapiLookupField('customrecord_pss_equip_types',equipTypeId,'custrecord_pss_equiptype_datid');
	var fullOrPartial = parentShipment.getFieldValue('custrecord_pss_dat_fullorpartial');
	if (fullOrPartial === "1") {fullOrPartial = 'false';} else {fullOrPartial = 'true';}
	var lengthInFeet = parentShipment.getFieldValue('custrecord_pss_dat_length');
	var weight = parentShipment.getFieldValue('custrecord_pss_dat_weight');
	var originCity = parentShipment.getFieldValue('custrecord_pss_shipper_city');
	var originState = parentShipment.getFieldValue('custrecord_pss_shipper_state');
	var originCountry = parentShipment.getFieldValue('custrecord_pss_shipper_country');
	var originZip = parentShipment.getFieldValue('custrecord_pss_shipper_zip');
	var consigneeCity = parentShipment.getFieldValue('custrecord_pss_consignee_city');
	var consigneeState = parentShipment.getFieldValue('custrecord_pss_consignee_state');
	var consigneeCountry = parentShipment.getFieldValue('custrecord_pss_consignee_country');
	var consigneeZip = parentShipment.getFieldValue('custrecord_pss_consignee_zip');
	var shipDate = parentShipment.getFieldValue('custrecord_pss_ship_date');
	var rawDate1 = new Date(shipDate);
	var rawDatePST = rawDate1.setHours(10);
	var isoShipDate = new Date(rawDatePST).toISOString();
	var comments1 = parentShipment.getFieldValue('custrecord_pss_dat_comments1');
	var comments2 = parentShipment.getFieldValue('custrecord_pss_dat_comments2');
	var url = 'http://cnx.dat.com:8000/TfmiRequest';
	var soapenv = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tcor="http://www.tcore.com/TcoreHeaders.xsd" xmlns:tcor1="http://www.tcore.com/TcoreTypes.xsd" xmlns:tfm="http://www.tcore.com/TfmiFreightMatching.xsd">';
	soapenv += '<soapenv:Header>';
	soapenv += '<tcor:sessionHeader>';
	soapenv += '<tcor:sessionToken>';
	soapenv += '<tcor1:primary>'+primaryDAT+'</tcor1:primary>';
	soapenv += '<tcor1:secondary>'+secondaryDAT+'</tcor1:secondary>';
	soapenv += '</tcor:sessionToken></tcor:sessionHeader>';
	soapenv += '<tcor:applicationHeader soapenv:mustUnderstand="0">';
	soapenv += '<tcor:application>PriorityShipTMS</tcor:application>';
	soapenv += '<tcor:applicationVersion>2019.01</tcor:applicationVersion>';
	soapenv += '</tcor:applicationHeader>';
	soapenv += '</soapenv:Header>';
	soapenv += '<soapenv:Body>';
	soapenv += '<tfm:postAssetRequest>';
	soapenv += '<tfm:postAssetOperations>';
	soapenv += '<tfm:shipment>';
	soapenv += '<tfm:equipmentType>'+equipType+'</tfm:equipmentType>';
	soapenv += '<tfm:origin>';
	soapenv += '<tfm:cityAndState>';
	soapenv += '<tfm:city>'+originCity+'</tfm:city>';
	soapenv += '<tfm:stateProvince>'+originState+'</tfm:stateProvince>';
	soapenv += '</tfm:cityAndState>';
	soapenv += '</tfm:origin>';
	soapenv += '<tfm:destination>';
	soapenv += '<tfm:cityAndState>';
	soapenv += '<tfm:city>'+consigneeCity+'</tfm:city>';
	soapenv += '<tfm:stateProvince>'+consigneeState+'</tfm:stateProvince>';
	soapenv += '</tfm:cityAndState>';
	soapenv += '</tfm:destination>';
	//soapenv += '<tfm:rate>';
	//soapenv += '<tfm:baseRateDollars>1</tfm:baseRateDollars>';
	//soapenv += '<tfm:rateBasedOn>Flat</tfm:rateBasedOn>';
	//soapenv += '<tfm:rateMiles>1</tfm:rateMiles>';
	//soapenv += '</tfm:rate>';
	soapenv += '</tfm:shipment>';
	soapenv += '<tfm:postersReferenceId>'+shipmentName+'</tfm:postersReferenceId>';
	soapenv += '<tfm:ltl>'+fullOrPartial+'</tfm:ltl>';
	soapenv += '<tfm:comments>'+comments1+'</tfm:comments>';
	soapenv += '<tfm:comments>'+comments2+'</tfm:comments>';
	soapenv += '<tfm:dimensions>';
	soapenv += '<tfm:lengthFeet>'+lengthInFeet+'</tfm:lengthFeet>';
	soapenv += '<tfm:weightPounds>'+weight+'</tfm:weightPounds>';
	soapenv += '</tfm:dimensions>';
	soapenv += '<tfm:availability>';
	soapenv += '<tfm:earliest>'+isoShipDate+'</tfm:earliest>';
	soapenv += '</tfm:availability>';
	soapenv += '</tfm:postAssetOperations>';
	soapenv += '</tfm:postAssetRequest>';
	soapenv += '</soapenv:Body>';
	soapenv += '</soapenv:Envelope>';
	var xmlAssetPost = soapenv;
	console.log(xmlAssetPost);
	nlapiLogExecution('DEBUG', 'postDAT', 'DAT post xml ' + xmlAssetPost);
	message2 = nlapiRequestURL(url,xmlAssetPost, null, null);
	var respObj2 = message2.getBody();
	console.log(respObj2);
	nlapiLogExecution('DEBUG', 'postDAT', 'DAT response ' + respObj2);
	var xmlDoc2 = nlapiStringToXML(respObj2);
	var successData = nlapiSelectNode(xmlDoc2, "//*[name()='tfm:postAssetSuccessData']");
	var assetId = nlapiSelectValue(successData, "//*[name()='tfm:assetId']");
	parentShipment.setFieldValue('custrecord_pss_dat_asset_id', assetId);
	parentShipment.setFieldValue('custrecord_pss_dat_is_posted', "T");
	parentShipment.setFieldValue('custrecord_pss_shipment_status', "8");
	nlapiSubmitRecord(parentShipment);
	nlapiLogExecution('DEBUG', 'postDAT', 'DAT Success ' + recId);
	alert("Load successfully posted to DAT.  Asset ID is  " + assetId);
	location.reload();
}

function AddDATUpdateButton(form){
	form.setScript('customdeploy_pss_rate_shipment_bttn');
	form.addButton('custpage_DATPostButton', 'DAT-U', 'updateDAT()');
}
function updateDAT() {
	var recId = nlapiGetRecordId();
	//var recId = 123457063;
	var parentShipment = nlapiLoadRecord('customrecord_pss_shipment', recId);
	var shipmentName = parentShipment.getFieldValue('name');
	var assetId = parentShipment.getFieldValue('custrecord_pss_dat_asset_id');
	var employeeId = parentShipment.getFieldValue('custrecord_pss_custservteamlead');
	var primaryDAT = nlapiLookupField('employee', employeeId, 'custentity_pss_dat_primary_key');
	var secondaryDAT = nlapiLookupField('employee', employeeId, 'custentity_pss_dat_secondary_key');
	var equipTypeId = parentShipment.getFieldValue('custrecord_pss_equip_type');
	var equipType = nlapiLookupField('customrecord_pss_equip_types',equipTypeId,'custrecord_pss_equiptype_datid');
	var fullOrPartial = parentShipment.getFieldValue('custrecord_pss_dat_fullorpartial');
	if (fullOrPartial === 1) {fullOrPartial = 'true';} else {fullOrPartial = 'false';}
	var lengthInFeet = parentShipment.getFieldValue('custrecord_pss_dat_length');
	var weight = parentShipment.getFieldValue('custrecord_pss_dat_weight');
	var originCountry = parentShipment.getFieldValue('custrecord_pss_shipper_country');
	var originZip = parentShipment.getFieldValue('custrecord_pss_shipper_zip');
	var consigneeCountry = parentShipment.getFieldValue('custrecord_pss_consignee_country');
	var consigneeZip = parentShipment.getFieldValue('custrecord_pss_consignee_zip');
	var shipDate = parentShipment.getFieldValue('custrecord_pss_ship_date');
	var isoShipDate = new Date(shipDate).toISOString();
	var url = 'http://cnx.dat.com:8000/TfmiRequest';
	var soapenv = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tcor="http://www.tcore.com/TcoreHeaders.xsd" xmlns:tcor1="http://www.tcore.com/TcoreTypes.xsd" xmlns:tfm="http://www.tcore.com/TfmiFreightMatching.xsd">';
	soapenv += '<soapenv:Header>';
	soapenv += '<tcor:sessionHeader>';
	soapenv += '<tcor:sessionToken>';
	soapenv += '<tcor1:primary>'+primaryDAT+'</tcor1:primary>';
	soapenv += '<tcor1:secondary>'+secondaryDAT+'</tcor1:secondary>';
	soapenv += '</tcor:sessionToken></tcor:sessionHeader>';
	soapenv += '<tcor:applicationHeader soapenv:mustUnderstand="0">';
	soapenv += '<tcor:application>PriorityShipTMS</tcor:application>';
	soapenv += '<tcor:applicationVersion>2019.01</tcor:applicationVersion>';
	soapenv += '</tcor:applicationHeader>';
	soapenv += '</soapenv:Header>';
	soapenv += '<soapenv:Body>';
	soapenv += '<tfm:updateAssetRequest>';
	soapenv += '<tfm:updateAssetOperation>';
	soapenv += '<tfm:assetId>'+assetId+'</tfm:assetId>';
	soapenv += '<tfm:shipmentUpdate>';
	soapenv += '<tfm:ltl>'+fullOrPartial+'</tfm:ltl>';
	soapenv += '<tfm:comments>comment1</tfm:comments>';
	soapenv += '<tfm:comments>comment2</tfm:comments>';
	soapenv += '<tfm:dimensions>';
	soapenv += '<tfm:lengthFeet>'+lengthInFeet+'</tfm:lengthFeet>';
	soapenv += '<tfm:weightPounds>'+weight+'</tfm:weightPounds>';
	soapenv += '</tfm:dimensions>';
	soapenv += '<tfm:availability>';
	soapenv += '<tfm:earliest>'+isoShipDate+'</tfm:earliest>';
	soapenv += '</tfm:availability>';
	//soapenv += '<tfm:rate>';
	//soapenv += '<tfm:baseRateDollars>1</tfm:baseRateDollars>';
	//soapenv += '<tfm:rateBasedOn>Flat</tfm:rateBasedOn>';
	//soapenv += '<tfm:rateMiles>1</tfm:rateMiles>';
	//soapenv += '</tfm:rate>';
	soapenv += '</tfm:shipmentUpdate>';
	soapenv += '</tfm:updateAssetOperation>';
	soapenv += '</tfm:updateAssetRequest>';
	soapenv += '</soapenv:Body>';
	soapenv += '</soapenv:Envelope>';
	var xmlAssetPost = soapenv;
	console.log(xmlAssetPost);
	message2 = nlapiRequestURL(url,xmlAssetPost, null, null);
	console.log(message2);
	alert("Load successfully Updated to DAT.  Asset ID is  " + assetId);
	location.reload();
}

function AddDATDeleteButton(form){
	form.setScript('customdeploy_pss_rate_shipment_bttn');
	form.addButton('custpage_DATDeleteButton', 'DAT-Delete', 'deleteDAT()');
}
function deleteDAT() {
	var recId = nlapiGetRecordId();
	nlapiLogExecution('DEBUG', 'deleteDAT', 'starting deleteDAT function on shipment ' + recId);
	var parentShipment = nlapiLoadRecord('customrecord_pss_shipment', recId);
	var employeeId = parentShipment.getFieldValue('custrecord_pss_custservteamlead');
	var primaryDAT = nlapiLookupField('employee', employeeId, 'custentity_pss_dat_primary_key');
	var secondaryDAT = nlapiLookupField('employee', employeeId, 'custentity_pss_dat_secondary_key');
	var assetId = parentShipment.getFieldValue('custrecord_pss_dat_asset_id');
	var url = 'http://cnx.dat.com:8000/TfmiRequest';
	var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tcor="http://www.tcore.com/TcoreHeaders.xsd" xmlns:tcor1="http://www.tcore.com/TcoreTypes.xsd" xmlns:tfm="http://www.tcore.com/TfmiFreightMatching.xsd">';
	xml += '<soapenv:Header>';
	xml += '<tcor:sessionHeader soapenv:mustUnderstand="1">';
	xml += '<tcor:sessionToken>';
	xml += '<tcor1:primary>'+primaryDAT+'</tcor1:primary>';
	xml += '<tcor1:secondary>'+secondaryDAT+'</tcor1:secondary>';
	xml += '</tcor:sessionToken>';
	xml += '</tcor:sessionHeader>';
	xml += '</soapenv:Header>';
	xml += '<soapenv:Body>';
	xml += '<tfm:deleteAssetRequest>';
	xml += '<tfm:deleteAssetOperation>';
	xml += '<tfm:deleteAssetsByAssetIds>';
	xml += '<tfm:assetIds>'+assetId+'</tfm:assetIds>';
	xml += '</tfm:deleteAssetsByAssetIds>';
	xml += '</tfm:deleteAssetOperation>';
	xml += '</tfm:deleteAssetRequest>';
	xml += '</soapenv:Body>';
	xml += '</soapenv:Envelope>';
	message = nlapiRequestURL(url, xml, null, null);
	parentShipment.setFieldValue('custrecord_pss_dat_asset_id', '');
	parentShipment.setFieldValue('custrecord_pss_dat_is_posted', "F");
	nlapiSubmitRecord(parentShipment);
	nlapiLogExecution('DEBUG', 'deleteDAT', 'deleteDAT Success ' + recId);
	alert("Load successfully removed from DAT.");
	location.reload();
}

function AddMapButton(form){
	form.setScript('customdeploy_pss_rate_shipment_bttn');
	form.addButton('custpage_DispatchButton', 'Show Map', 'mapPop()');
}

function pssShipGenInit(){
	var tranType = nlapiGetRecordType();
	var tranId = nlapiGetRecordId();
	var batId = Date.now();
	//var conText = nlapigetContext();
	var location = nlapiLookupField('estimate',tranId,'location');
	//if (location == null){
	//  alert('Shipment Creation Requires a Location');
	//}
	//else {
	var shipRecURL = nlapiResolveURL('SUITELET', 'customscript_pss_ship_rec', 'customdeploy_pss_ship_rec_gen');
	shipRecURL += '&reqURL=' + tranId;
	shipRecURL += '&batchId=' + batId;
	shipRecURL += '&recType=' + tranType;
	var shipRec = nlapiRequestURL(shipRecURL);
	var shipRecId = shipRec.getBody();
	var fixedShipRecId = shipRecId.substr(0, 9);
	alert("Created shipment ID#" + fixedShipRecId + ".   Click OK to be redirected to this shipment.");
	var baseURL = 'https://system.netsuite.com/app/common/custom/custrecordentry.nl?rectype=15&id=';
	var url = baseURL + fixedShipRecId + '&whence=';
	window.location = url;
	//}
}

function updateShipmentParent(){}

function estimateGetRates() {
	var recName = nlapiGetRecordId();
	var batId = Date.now();
	var url = nlapiResolveURL('SUITELET','customscript_pss_retriever','customdeploy_pss_retriever');
	url += '&reqURL=' + recName;
	url += '&batchId=' + batId;
	setTimeout(nlapiRequestURL(url), 100);
	var listUrl = nlapiResolveURL('SUITELET','customscript_pss_rate_selector_ss1','customdeploy_pss_rate_selector_ss1');
	listUrl += '&NLNAME=' + recName;
	listUrl += '&batchId=' + batId;
	var width = '900';
	var height = '500';
	var title = 'Select Available Rates';
	nlExtOpenWindow(listUrl, '', width, height, '', null, title);
}

function getRatesP44() {
	//get parent record
	var recId = nlapiGetRecordId();
	//generate Base64 credential key
	var creds = 'andy.reeder@priority-logistics.com:Leftfoot5510!';
	var enCreds = nlapiEncrypt(creds, 'base64');
	//p44 endPoint URL for Rating
	var url = 'https://test.p-44.com/api/v3/quotes/rates/query';
	//setting request headers
	var headers = new Array();
	headers['Authorization'] = 'Basic ' + enCreds;
	headers['Content-Type'] = 'application/json';
	headers['Accept'] = 'application/json';

	var parentShipment = nlapiLoadRecord('customrecord_pss_shipment', recId);
	var originZip = parentShipment.getFieldValue('custrecord_pss_consignee_zip');
	var destinationZip = parentShipment.getFieldValue('custrecord_pss_shipper_zip');
	var shipmentDate = '08/31/2018';
	//Get any shipments
	//var shipments = GetShipmentLinesByShipmentID(recId);
	//Now build the strings to pass
	var weights = '';
	var classes = '';
	//weights = CreateStringFromArray(shipments, 'Weight');
	//classes = CreateStringFromArray(shipments, 'Class');


	var jPayload = {
		"originAddress": {
			"postalCode": originZip
		},
		"destinationAddress": {
			"postalCode": destinationZip
		},
		"lineItems": [
			{
				"freightClass": "70",
				"totalWeight": 10,
				"packageDimensions": {
					"length": 40,
					"width": 40,
					"height": 30
				}
			}
		]
	}

	var strPayload = JSON.stringify(jPayload);

	nlapiLogExecution('DEBUG', 'Payload', strPayload);

	var response = nlapiRequestURL(url, strPayload, headers, 'POST');
	nlapiLogExecution('DEBUG', 'Response', response.getBody());
	var obj = response.getBody();
	var respObj = JSON.parse(obj);
	return respObj;
}

function getSassyRateSelect(){
	var recId = nlapiGetRecordId();
	var batId = Date.now();
	var rateLineId = getSassy(batId);
	var listUrl = nlapiResolveURL('SUITELET','customscript_pss_rate_selector_ss1','customdeploy_pss_rate_selector_ss1');
	listUrl += '&NLNAME=' + recId;
	listUrl += '&batchId=' + batId;
	var width = '900';
	var height = '500';
	var title = 'Select Available Rates';
	nlExtOpenWindow(listUrl, '', width, height, '', null, title);
}

function getSassy(batId){
	var recId = nlapiGetRecordId();
	//var batId = Date.now();
	var scacCodes = new Array();
	var carriername = new Array();
	var shipRate = new Array();
	var transDays = new Array();
	var sassyRateResp = getSaaSRatesNow(batId);
	var sassyRespXML = nlapiStringToXML(sassyRateResp);
	var carriers = sassyRespXML.getElementsByTagName('a:LTLRatingResponse2');
	for(i=0;i < carriers.length; i++){
		scacCodes.push(carriers[i].childNodes[46].textContent);
		carriername.push(carriers[i].childNodes[1].textContent);
		shipRate.push(carriers[i].childNodes[50].textContent);
		transDays.push(carriers[i].childNodes[51].textContent);
	}
	for(x=0; x < scacCodes.length; x++){
		var rateLine = nlapiCreateRecord('customrecord_pss_ratepass_line');
		rateLine.setFieldValue('custrecord_pss_batch_id', batId);
		rateLine.setFieldValue('custrecord_pss_ratepass_shipment_id', recId);
		rateLine.setFieldValue('custrecord_pss_ratepass_id', x + 1);
		rateLine.setFieldValue('custrecord_pss_scac', scacCodes[x]);
		rateLine.setFieldValue('custrecord_pss_total_shipment_cost', shipRate[x]);
		rateLine.setFieldValue('custrecord_pss_transit_days', transDays[x]);
		rateLine.setFieldValue('custrecord_pss_ratepass_carrier', carriername[x]);
		nlapiSubmitRecord(rateLine);
	}
	return rateLine;
}

function OLDxxxRenderBOL(request, response) {
	if (request.getMethod() == 'GET') {
		var recId = request.getParameter('NLNAME');
		var record = nlapiLoadRecord('customrecord_pss_shipment', recId, null, null);
		var file = nlapiLoadFile(106);
		var contents = file.getValue();
		response.write(contents);
		nlapiLogExecution('DEBUG', 'HTML Rendered', 'Success!');
	}
}

function portletHTML(portlet, column){
	portlet.setTitle(column != 2 ? "Bill Audit List" : "Vendor Bill List")
	var col = portlet.addColumn('tranid','text', 'Number', 'LEFT');
	col.setURL(nlapiResolveURL('RECORD','vendorbill'));
	col.addParamToURL('id','id', true);
	portlet.addColumn('trandate','date', 'Date', 'LEFT');
	portlet.addColumn('entity_display','text', 'Customer', 'LEFT');
	if ( column == 2 )
	{
		portlet.addColumn('salesrep_display','text', 'Sales Rep', 'LEFT');
		portlet.addColumn('amount','currency', 'Amount', 'RIGHT');
	}
	var returncols = new Array();
	returncols[0] = new nlobjSearchColumn('trandate');
	returncols[1] = new nlobjSearchColumn('tranid');
	returncols[2] = new nlobjSearchColumn('entity');
	returncols[3] = new nlobjSearchColumn('salesrep');
	returncols[4] = new nlobjSearchColumn('amount');
	var results = nlapiSearchRecord('estimate', null, new
	nlobjSearchFilter('mainline',null,'is','T'), returncols);
	for ( var i = 0; i < Math.min((column != 2 ? 5 : 15 ),results.length); i++ )
		portlet.addRow( results[i] )
}

function clientFieldChanged(type, name, linenum){
	console.log('You changed a field');
	if(type == 'recmachcustrecord_pss_shipment_parent'){ //checks if the field changed is under sublist 'Lines'
		if(name == 'custrecord_pss_height'){ //checks if the field changed is 'Account'
			var index = nlapiGetCurrentLineItemIndex('recmachcustrecord_pss_shipment_parent');
			console.log('Current line index: ' + index);
			var weight = nlapiGetCurrentLineItemValue('recmachcustrecord_pss_shipment_parent', 'custrecord_pss_weight');
			console.log('Weight is: ' + weight);
			var len = nlapiGetCurrentLineItemValue('recmachcustrecord_pss_shipment_parent', 'custrecord_pss_length');
			console.log('Length is: ' + len);
			var wid = nlapiGetCurrentLineItemValue('recmachcustrecord_pss_shipment_parent', 'custrecord_pss_width');
			console.log('Width is: ' + wid);
			var hgt = nlapiGetCurrentLineItemValue('recmachcustrecord_pss_shipment_parent', 'custrecord_pss_height');
			console.log('Height is: ' + hgt);
			var cubicFt = (len * wid * hgt) / 1728;
			console.log('Cubic Feet is: ' + cubicFt);
			var calcPCF = Number(weight / cubicFt);
			var finalPCF = round(calcPCF, 1);
			console.log('PCF is: ' + finalPCF);
			nlapiSetCurrentLineItemValue('recmachcustrecord_pss_shipment_parent', 'custrecord_pss_pcf', finalPCF);
			//nlapiCommitLineItem('recmachcustrecord_pss_shipment_parent');
			return true;
		}
	}
	if(name == 'shipmethod' && nlapiGetFieldValue('shipmethod') == '818'){
		console.log('You changed the Ship Method field');
		var respLTLRate = comboSaaS();
		console.log('Rate Returned is: ' + respLTLRate);
		nlapiSetFieldValue('shippingcost', respLTLRate);
	}
	if(name == 'shipmethod' && nlapiGetFieldValue('shipmethod') == '816'){
		console.log('You changed the Ship Method field');
		var respBestRate = getShippoRates();
		console.log('Rate Returned is: ' + respBestRate);
		nlapiSetFieldValue('shippingcost', respBestRate);
	}
	if(name == 'shipmethod' && nlapiGetFieldValue('shipmethod') == '817'){
		console.log('You changed the Ship Method field');
		var respParcRate = getShippoRates();
		console.log('Rate Returned is: ' + respBestRate);
		var respLTLRate = comboSaaS();
		console.log('Rate Returned is: ' + respLTLRate);
		nlapiSetFieldValue('custbody_pss_parcel_cost', respParcRate);
		nlapiSetFieldValue('custbody_pss_ltl_cost', respLTLRate);
	}
	else return true;
}

function shipmentOnSave(){
	type = nlapiGetRecordType();
	recId = nlapiGetRecordId();
	shipment = nlapiLoadRecord(type, recId);
	var shipperAddress = shipment.getFieldValue('custrecord_pss_shipper_addr_1');
	var shipperCity = shipment.getFieldValue('custrecord_pss_shipper_city');
	var shipperState = shipment.getFieldValue('custrecord_pss_shipper_state');
	var shipperAddrForGoogle = (shipperAddress + " " + shipperCity + " " + shipperState);
	var shipperFinalAddr = shipperAddrForGoogle.replace(/ /g, '+');
	var googleURLbase = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
	var googleURLkey = '&key=AIzaSyD7zgGRz9SGftLzqgJqY9JYPllgbVUaeJk';
	var finalGoogleURL = (googleURLbase + shipperFinalAddr + googleURLkey);
	var response = nlapiRequestURL(finalGoogleURL, null, null, 'GET');
	var obj = response.getBody();
	var respObj = JSON.parse(obj);
	var loc1 = respObj.results;
	var shipperLat = loc1[0].geometry.location.lat;
	var shipperLng = loc1[0].geometry.location.lng;
	var consigneeAddress = shipment.getFieldValue('custrecord_pss_consignee_addr_1');
	var consigneeCity = shipment.getFieldValue('custrecord_pss_consignee_city');
	var consigneeState = shipment.getFieldValue('custrecord_pss_consignee_state');
	var consigneeAddrForGoogle = (consigneeAddress + " " + consigneeCity + " " + consigneeState);
	var consigneeFinalAddr = consigneeAddrForGoogle.replace(/ /g, '+');
	var googleURLbase = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
	var googleURLkey = '&key=AIzaSyD7zgGRz9SGftLzqgJqY9JYPllgbVUaeJk';
	var finalGoogleURL = (googleURLbase + consigneeFinalAddr + googleURLkey);
	var response = nlapiRequestURL(finalGoogleURL, null, null, 'GET');
	var obj = response.getBody();
	var respObj = JSON.parse(obj);
	var loc1 = respObj.results;
	var consigneeLat = loc1[0].geometry.location.lat;
	var consigneeLng = loc1[0].geometry.location.lng;
	shipment.setFieldValue('custrecord_pss_shipper_lat', shipperLat);
	shipment.setFieldValue('custrecord_pss_shipper_lng', shipperLng);
	shipment.setFieldValue('custrecord_pss_consignee_lat', consigneeLat);
	shipment.setFieldValue('custrecord_pss_consignee_lng', consigneeLng);
	nlapiSubmitRecord(shipment);

		return true;
}

function AddCerasisDispatchButton(form){
	form.setScript('customdeploy_pss_rate_shipment_bttn');
	form.addButton('custpage_DispatchButton', 'Cerasis Dispatch', 'dispatchCerasisShipment()');
}
function dispatchCerasisShipment(){
	var recName = nlapiGetRecordId();
	var batId = Date.now();
	var shipRecProNum = [];
	var shipRecBillNum = [];
	var shipRecRate = [];
	var shipRecBOL = '';
	var cerProcResp = cerProcShipRec(batId);
	var cerRespDoc = nlapiStringToXML(cerProcResp);
	var shipResp = cerRespDoc.getElementsByTagName('ShippingResponse');
	for(i=0;i < shipResp.length; i++){
		shipRecProNum.push(shipResp[i].childNodes[4].textContent);
		shipRecBillNum.push(shipResp[i].childNodes[3].textContent);
		shipRecRate.push(shipResp[i].childNodes[2].textContent);
		shipRecBOL = shipResp[i].childNodes[10].textContent;
	}
	var shipRec = nlapiLoadRecord('customrecord_pss_shipment', recName, null, null);
	shipRec.setFieldValue('custrecord_pss_shipment_status', 3);
	shipRec.setFieldValue('custrecord_pss_carrier_pro', shipRecProNum);
	shipRec.setFieldValue('custrecord_pss_shiprec_cer_conf_rate', shipRecRate);
	shipRec.setFieldValue('custrecord_pss_shiprec_cer_bill_num', shipRecBillNum);
	shipRec.setFieldValue('custrecord_pss_shiprec_cer_bol_str', shipRecBOL);
	nlapiSubmitRecord(shipRec);
	setTimeout(printCerBOL(), 100);
	//window.location.reload('true');
}
function AddCerRatesButton(form) {
	form.setScript('customscript_pss_rate_shipment_bttn');
	form.addButton('custpage_setrate', 'Rate with Cerasis', 'getCerRatesSelect()');
}
function getCerRatesSelect(){
	var recId = nlapiGetRecordId();
	var batId = Date.now();
	nlapiLogExecution('debug', 'before getCerasisRates', recId + batId);
	var rateLineId = getCerasisRates(batId);
	var listUrl = nlapiResolveURL('SUITELET','customscript_pss_rate_selector_ss1','customdeploy_pss_rate_selector_ss1');
	listUrl += '&NLNAME=' + recId;
	listUrl += '&batchId=' + batId;
	var width = '900';
	var height = '500';
	var title = 'Select Available Rates';
	nlExtOpenWindow(listUrl, '', width, height, '', null, title);
}

//the getCerasisRates function gets the xml envelop, parses, and writes the RatePass records
function getCerasisRates(batId){
	var recId = nlapiGetRecordId();
	//var batId = Date.now();
	var btEnt = '119';
	var scacCodes = new Array();
	var carriername = new Array();
	var shipRate = new Array();
	var transDays = new Array();
	var lolnew = new Array();
	var lolused = new Array();
	var guarprice = new Array();
	var guartime = new Array();
	var rateResp = cerasisRetriever(batId);
	nlapiLogExecution('debug', 'returnedXML', rateResp);
	var cerRespXML = nlapiStringToXML(rateResp);
	var carriers = cerRespXML.getElementsByTagName('Carrier');
	for(i=0;i < carriers.length; i++){
		scacCodes.push(carriers[i].childNodes[0].textContent);
		carriername.push(carriers[i].childNodes[1].textContent);
		shipRate.push(carriers[i].childNodes[2].textContent);
		transDays.push(carriers[i].childNodes[4].textContent);
		lolnew.push(carriers[i].childNodes[5].textContent);
		lolused.push(carriers[i].childNodes[6].textContent);
		guarprice.push(carriers[i].childNodes[7].textContent);
		guartime.push(carriers[i].childNodes[8].textContent);
	}
	for(x=0;x < scacCodes.length; x++){
		var rateLine = nlapiCreateRecord('customrecord_pss_ratepass_line');
		rateLine.setFieldValue('custrecord_pss_batch_id', batId);
		rateLine.setFieldValue('custrecord_pss_ratepass_shipment_id', recId);
		rateLine.setFieldValue('custrecord_pss_ratepass_id', x + 1);
		rateLine.setFieldValue('custrecord_pss_scac', scacCodes[x]);
		rateLine.setFieldValue('custrecord_pss_total_shipment_cost', shipRate[x]);
		rateLine.setFieldValue('custrecord_pss_ratepass_total_cost', shipRate[x]);
		rateLine.setFieldValue('custrecord_pss_transit_days', transDays[x]);
		rateLine.setFieldValue('custrecord_pss_ratepass_carrier', carriername[x]);
		rateLine.setFieldValue('custrecord_pss_ratepass_guar_cost', guarprice[x]);
		rateLine.setFieldValue('custrecord_pss_ratepass_guar_time', guartime[x]);
		rateLine.setFieldValue('custrecord_pss_lane_name', 'Cerasis');
		rateLine.setFieldValue('custrecord_pss_ratepass_bt_ent', btEnt);
		nlapiSubmitRecord(rateLine);
	}
	return rateLine;
}
function cerasisRetriever(batId) {
	var recName = nlapiGetRecordId();
	//var usrCont = nlapiGetContext();
	var usrOrigLoc = 5;
	nlapiLogExecution('debug', 'begin cerasisRetriever', recName + usrOrigLoc);
	//var usrOrigLoc = usrCont.location;
	var usrOrigZip = nlapiLookupField('location', usrOrigLoc, 'zip');
	var locCerAcctNum = nlapiLookupField('location', usrOrigLoc, 'custrecord_pss_cer_acct_num');
	var locCerUserName = nlapiLookupField('location', usrOrigLoc, 'custrecord_pss_cer_user_name');
	var locCerPassword = nlapiLookupField('location', usrOrigLoc, 'custrecord_pss_cer_pw');
	var locCerAccKey = nlapiLookupField('location', usrOrigLoc, 'custrecord_pss_cer_acc_key');
	var uOrigAddr1 = nlapiLookupField('location', usrOrigLoc, 'address1');
	var uOrigAddr2 = nlapiLookupField('location', usrOrigLoc, 'address2');
	var uOrigCity = nlapiLookupField('location', usrOrigLoc, 'city');
	var uOrigState = nlapiLookupField('location', usrOrigLoc, 'state');
	//var batId = Date.now();
	//collect shipment record data
	var parentShipment = nlapiLoadRecord('customrecord_pss_shipment', recName);
	var pkgcount = [];
	var pkgType = [];
	var linQty = [];
	var linNMFC = [];
	var linFrClass = [];
	var linWeight = [];
	var linHeight = [];
	var linWidth = [];
	var linLeng = [];
	var totWeight = 0;
	var fil = [];
	fil[0] = new nlobjSearchFilter('custrecord_pss_shipment_parent', null, 'is', recName);
	var col = [];
	col[0] = new nlobjSearchColumn('custrecord_pss_hazmat');
	col[1] = new nlobjSearchColumn('custrecord_pss_nmfc_number');
	col[2] = new nlobjSearchColumn('custrecord_pss_freight_class_value');
	col[3] = new nlobjSearchColumn('custrecord_pss_packagetype');
	col[4] = new nlobjSearchColumn('custrecord_pss_pkgnumber');
	col[5] = new nlobjSearchColumn('custrecord_pss_weight');
	col[6] = new nlobjSearchColumn('custrecord_pss_height');
	col[7] = new nlobjSearchColumn('custrecord_pss_width');
	col[8] = new nlobjSearchColumn('custrecord_pss_length');
	col[9] = new nlobjSearchColumn('custrecord_pss_nmfc_number_line');
	col[10] = new nlobjSearchColumn('custrecord_pss_inventoryunits');
	var packages = nlapiSearchRecord('customrecord_pss_shipment_line', null, fil, col);
	for (var x = 0; x < packages.length; x++) {
		pkgcount.push(packages[x].getValue('custrecord_pss_pkgnumber'));
		pkgType.push(packages[x].getText('custrecord_pss_packagetype'));
		linWeight.push(Number(packages[x].getValue('custrecord_pss_weight')));
		linHeight.push(Number(packages[x].getValue('custrecord_pss_height')));
		linWidth.push(Number(packages[x].getValue('custrecord_pss_width')));
		linLeng.push(Number(packages[x].getValue('custrecord_pss_length')));
		linFrClass.push(packages[x].getValue('custrecord_pss_freight_class_value'));
		linNMFC.push(packages[x].getValue('custrecord_pss_nmfc_number'));
		linQty.push(Number(packages[x].getValue('custrecord_pss_inventoryunits')));
	}
	var totWeight = linWeight.reduce(function(acc, val) { return acc + val; });
	var pkgcnt = Math.max.apply(null, pkgcount);
	console.log('Package Types: ' + pkgType);
	var message = '';
	var origZip = parentShipment.getFieldValue('custrecord_pss_shipper_zip');
	var consigneeZip = parentShipment.getFieldValue('custrecord_pss_consignee_zip');
	var shipmentDate = parentShipment.getFieldValue('custrecord_pss_ship_date');
	//collect destination info
	var consignee = parentShipment.getFieldValue('custrecord_pss_consignee');
	var consigneeEmail = 'robert.regnier@priority-logistics.com';
	var consigneeAddree = parentShipment.getFieldValue('custrecord_pss_consignee_addree');
	var consigneeAddr1 = parentShipment.getFieldValue('custrecord_pss_consignee_addr1');
	var consigneeAddr2 = parentShipment.getFieldValue('custrecord_pss_consignee_addr2');
	var consigneeCity = parentShipment.getFieldValue('custrecord_pss_consignee_city');
	var consigneeState = parentShipment.getFieldValue('custrecord_pss_consignee_state');
	var consigneeCountry = parentShipment.getFieldValue('custrecord_pss_consignee_country');
	var formDate = new Date(shipmentDate).toISOString();
	//basic auth elements
	var url = 'https://cerasis.ltlship.com/API/Rating/V1/Rating.asmx';
	// var shipperid = uOCerID; //'13xx'
	// var username = uOCerUN; //'wsaccess'
	// var pword = uOCerPW; //'yYCd7qne'
	// var acckey = uOCerAcc; //'8268ab93-c3b1-4d73-a54b-4d7266747ed2'
	//start well formed xml object
	var xmlEnvelope = '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" ';
	xmlEnvelope += 'SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">';
	xmlEnvelope += '<SOAP-ENV:Body>';

	var xmlhead = '<RateShipment xmlns="http://cerasis.ltlship.com/API/Rating/V1/Rating/"><RateRequest><AccessRequest>';
	xmlhead += '<ShipperID>' + locCerAcctNum + '</ShipperID>';
	xmlhead += '<Username>' + locCerUserName + '</Username>';
	xmlhead += '<Password>' + locCerPassword + '</Password>';
	xmlhead += '<AccessKey>' + locCerAccKey + '</AccessKey>';
	xmlhead += '</AccessRequest>'

	var requestxml = '<Request>';
	requestxml += '<Direction>' + 'Outbound' + '</Direction>';
	requestxml += '<BillingType>' + 'Prepaid' + '</BillingType>';
	requestxml += '<Carrier>' + 'Rateshop' + '</Carrier>';
	requestxml += '<ShipDate>' + formDate + '</ShipDate>';
	requestxml += '<TotalPallets>' + pkgcnt + '</TotalPallets>';
	//requestxml += '<Accessorials>';
	//requestxml += '<Accessorial>';
	//requestxml += '<AccessorialCode>' + accessorialCode[i] + '</AccessorialCode>';
	//requestxml += '</Accessorial>';
	//requestxml += '</Accessorials>';

	var destinationxml = '<Destination>';
	destinationxml += '<Name>' + consigneeAddree + '</Name>';
	destinationxml += '<Address1>' + consigneeAddr1 + '</Address1>';
	destinationxml += '<Address2>' + 'null' + '</Address2>';
	destinationxml += '<Address3>' + 'null' + '</Address3>';
	destinationxml += '<City>' + consigneeCity + '</City>';
	destinationxml += '<State>' + consigneeState + '</State>';
	destinationxml += '<PostalCode>' + consigneeZip + '</PostalCode>';
	destinationxml += '<Country>' + consigneeCountry + '</Country>';
	destinationxml += '<Contact>' + consigneeAddree + '</Contact>';
	destinationxml += '<EmailAddress>' + consigneeEmail + '</EmailAddress>';
	destinationxml += '<Fax>' + 'null' + '</Fax>';
	destinationxml += '<Phone>' + '18009991345' + '</Phone>';
	destinationxml += '<Reference>' + recName + '</Reference>';
	destinationxml += '<ResidentialDelivery>false</ResidentialDelivery>';
	//destinationxml += '<EmergencyContactName>' + destemergencyname + '</EmergencyContactName>';
	//destinationxml += '<EmergencyContactNumber>' + destemergencyphone + '</EmergencyContactNumber>';
	//destinationxml += '<EmergencyAgentContractNumber>' + emergencyagentphone + '</EmergencyAgentContractNumber>';
	destinationxml += '</Destination>';

	var Originxml = '<Origin>';
	Originxml += '<Name>' + 'Hole Products' + '</Name>';
	Originxml += '<Address1>' + uOrigAddr1 + '</Address1>';
	Originxml += '<Address2>' + uOrigAddr2 + '</Address2>';
	Originxml += '<Address3>' + 'null' + '</Address3>';
	Originxml += '<City>' + uOrigCity + '</City>';
	Originxml += '<State>' + uOrigState + '</State>';
	Originxml += '<PostalCode>' + usrOrigZip + '</PostalCode>';
	Originxml += '<Country>' + 'US' + '</Country>';
	Originxml += '<Contact>' + 'Hole Products' + '</Contact>';
	Originxml += '<EmailAddress>' + 'info@holeproducts.com' + '</EmailAddress>';
	Originxml += '<Fax>' + 'null' + '</Fax>';
	Originxml += '<Phone>' + '18009991345' + '</Phone>';
	Originxml += '<Reference>' + recName + '</Reference>';
	Originxml += '<ResidentialDelivery>false</ResidentialDelivery>';
	//Originxml += '<EmergencyContactName>' + origemergencyname + '</EmergencyContactName>';
	//Originxml += '<EmergencyContactNumber>' + origemergencyphone + '</EmergencyContactNumber>';
	//Originxml += '<EmergencyAgentContractNumber>' + emergencyagentphone + '</EmergencyAgentContractNumber>';
	Originxml += '</Origin>';

	var detailsxml = '';
	detailsxml += '<Details>';
	for (var y = 0; y < linWeight.length; y++){
		detailsxml += '<Detail>';
		detailsxml += '<Class>' + linFrClass[y] + '</Class>';
		detailsxml += '<Weight>' + linWeight[y] + '</Weight>';
		detailsxml += '<Quantity>' + linQty[y] + '</Quantity>';
		detailsxml += '<Height>' + linHeight[y] + '</Height>';
		detailsxml += '<Length>' + linLeng[y] + '</Length>';
		detailsxml += '<Width>' + linWidth[y] + '</Width>';
		detailsxml += '<Unit>' + 'Pallet' + '</Unit>';
		detailsxml += '<Hazmat>false</Hazmat>';
		detailsxml += '<Commodity>';
		detailsxml += '<Description>' + 'Pallet' + '</Description>';
		detailsxml += '<NMFCCode>' + 'null' + '</NMFCCode>';
		detailsxml += '<Class>' + linFrClass[y] + '</Class>';
		detailsxml += '<HazardousMaterial>false</HazardousMaterial>';
		detailsxml += '<HazmatDescription1>' + 'null' + '</HazmatDescription1>';
		detailsxml += '<HazmatDescription2>' + 'null' + '</HazmatDescription2>';
		detailsxml += '<HazmatDescription3>' + 'null' + '</HazmatDescription3>';
		detailsxml += '<HazmatClass>' + 'null' + '</HazmatClass>';
		detailsxml += '<HazmatSubClass>' + 'null' + '</HazmatSubClass>';
		detailsxml += '<HazMatPackagingClass>' + 'null' + '</HazMatPackagingClass>';
		detailsxml += '<HazmatTechnicalName>' + 'null' + '</HazmatTechnicalName>';
		detailsxml += '<HazmatZone>' + 'null' + '</HazmatZone>';
		detailsxml += '<HazmatDetailDescription>' + 'null' + '</HazmatDetailDescription>';
		detailsxml += '<HazmatSpecialProvision>' + 'null' + '</HazmatSpecialProvision>';
		detailsxml += '<HazmatSpecialProvExpDate>' + 'null' + '</HazmatSpecialProvExpDate>';
		detailsxml += '<UNIdentificationNumber>' + 'null' + '</UNIdentificationNumber>';
		detailsxml += '<ERGGuidePage>' + 'null' + '</ERGGuidePage>';
		detailsxml += '<ContactName>' + 'null' + '</ContactName>';
		detailsxml += '<ContactNumber>' + 'null' + '</ContactNumber>';
		detailsxml += '<BolDescription1>' + 'Test Pallet' + '</BolDescription1>';
		detailsxml += '<BolDescription2>' + 'null' + '</BolDescription2>';
		detailsxml += '<BolDescription3>' + 'null' + '</BolDescription3>';
		detailsxml += '</Commodity>';
		detailsxml += '</Detail>';
	}
	detailsxml += '</Details>';

	/*var dimsxml = '<Dimensions>';
    dimsxml += '<Dimension>';
    dimsxml += '<Quantity>' + '1' + '</Quantity>';
    dimsxml += '<Height>' + '12' + '</Height>';
    dimsxml += '<Width>' + '12' + '</Width>';
    dimsxml += '<Length>' + '12' + '</Length>';
    dimsxml += '</Dimension>';
    dimsxml += '<Dimension>';
    dimsxml += '<Quantity>' + '1' + '</Quantity>';
    dimsxml += '<Height>' + '12' + '</Height>';
    dimsxml += '<Width>' + '12' + '</Width>';
    dimsxml += '<Length>' + '12' + '</Length>';

    dimsxml += '</Dimension>';
    dimsxml += '</Dimensions>';
    dimsxml += '';*/

	var closurexml = '</Request></RateRequest></RateShipment></SOAP-ENV:Body></SOAP-ENV:Envelope>'

	//compile all xml elements
	var finalxml = xmlEnvelope + xmlhead + requestxml + Originxml + destinationxml + detailsxml + closurexml;

	nlapiLogExecution('DEBUG', 'GetRates', 'Send Request: ' + url);
	message = nlapiRequestURL(url, finalxml, null, null); //calling the service
	nlapiLogExecution('DEBUG', 'BeforeRequestSent', 'Request XML: ' + finalxml);
	var respObj = message.getBody();
	nlapiLogExecution('DEBUG', 'Response String', 'Response String: ' + respObj);
	return respObj;
}
function cerProcShipRec(batId) {
	var recName = nlapiGetRecordId();
	var usrCont = nlapiGetContext();
	var usrOrigLoc = usrCont.location;
	var usrOrigZip = nlapiLookupField('location', usrOrigLoc, 'zip');
	var uOCerID = nlapiLookupField('location', usrOrigLoc, 'custrecordpss_cer_acct_num');
	var uOCerUN = nlapiLookupField('location', usrOrigLoc, 'custrecord_pss_cer_user_name');
	var uOCerPW = nlapiLookupField('location', usrOrigLoc, 'custrecord_pss_cer_pw');
	var uOCerAcc = nlapiLookupField('location', usrOrigLoc, 'custrecord_pss_cer_acc_key');
	var uOrigAddr1 = nlapiLookupField('location', usrOrigLoc, 'address1');
	var uOrigAddr2 = nlapiLookupField('location', usrOrigLoc, 'address2');
	var uOrigCity = nlapiLookupField('location', usrOrigLoc, 'city');
	var uOrigState = nlapiLookupField('location', usrOrigLoc, 'state');
	//var batId = Date.now();
	//collect shipment record data
	var parentShipment = nlapiLoadRecord('customrecord_pss_shipment', recName);
	var pkgcount = [];
	var pkgType = [];
	var linNmfcId = [];
	var linQty = [];
	var linNMFC = [];
	var linFrClass = [];
	var linWeight = [];
	var linHeight = [];
	var linWidth = [];
	var linLeng = [];
	var linDesc = [];
	var isDimmed = [];
	var totWeight = 0;
	var fil = [];
	fil[0] = new nlobjSearchFilter('custrecord_pss_shipment_parent', null, 'is', recName);
	var col = [];
	col[0] = new nlobjSearchColumn('custrecord_pss_hazmat');
	col[1] = new nlobjSearchColumn('custrecord_pss_nmfc_number');
	col[2] = new nlobjSearchColumn('custrecord_pss_freight_class_value');
	col[3] = new nlobjSearchColumn('custrecord_pss_packagetype');
	col[4] = new nlobjSearchColumn('custrecord_pss_pkgnumber');
	col[5] = new nlobjSearchColumn('custrecord_pss_weight');
	col[6] = new nlobjSearchColumn('custrecord_pss_height');
	col[7] = new nlobjSearchColumn('custrecord_pss_width');
	col[8] = new nlobjSearchColumn('custrecord_pss_length');
	col[9] = new nlobjSearchColumn('custrecord_pss_nmfc_number_line');
	col[10] = new nlobjSearchColumn('custrecord_pss_inventoryunits');
	col[11] = new nlobjSearchColumn('custrecord_pss_piece_count');
	var packages = nlapiSearchRecord('customrecord_pss_shipment_line', null, fil, col);
	for (var x = 0; x < packages.length; x++) {
		pkgcount.push(packages[x].getValue('custrecord_pss_pkgnumber'));
		pkgType.push(packages[x].getText('custrecord_pss_packagetype'));
		linDesc.push(packages[x].getText('custrecord_pss_nmfc_number_line'));
		linNmfcId.push(packages[x].getValue('custrecord_pss_nmfc_number_line'))
		linWeight.push(Number(packages[x].getValue('custrecord_pss_weight')));
		linHeight.push(Number(packages[x].getValue('custrecord_pss_height')));
		linWidth.push(Number(packages[x].getValue('custrecord_pss_width')));
		linLeng.push(Number(packages[x].getValue('custrecord_pss_length')));
		linFrClass.push(packages[x].getValue('custrecord_pss_freight_class_value'));
		linNMFC.push(packages[x].getValue('custrecord_pss_nmfc_number'));
		linQty.push(Number(packages[x].getValue('custrecord_pss_inventoryunits')));
		//linDesc.push(packages[x].getValue('custrecord_pss_piece_count'));
	}
	var totWeight = linWeight.reduce(function(acc, val) { return acc + val; });
	var pkgcnt = Math.max.apply(null, pkgcount);
	for (var z = 0; z < linNmfcId.length; z++){
		isDimmed.push(nlapiLookupField('customrecord_pss_nmfc_classification', linNmfcId[z], 'custrecord_pss_dim_item'));
	}
	var message = '';
	var origZip = parentShipment.getFieldValue('custrecord_pss_shipper_zip');
	var destZip = parentShipment.getFieldValue('custrecord_pss_consignee_zip');
	var shipmentDate = parentShipment.getFieldValue('custrecord_pss_ship_date');
	var custPoRef = parentShipment.getFieldValue('custrecord_pss__reference_delivery');
	//collect destination info
	var destParent = parentShipment.getFieldValue('custrecord_pss_so_parent_id');
	var destParType = nlapiLookupField('transaction', destParent, 'type');
	if(destParType === 'SalesOrd'){destParType = 'salesorder';}
	console.log('Parent Transaction Type is ' + destParType);
	var destRec = nlapiLoadRecord(destParType, destParent);
	var destEmail = destRec.getFieldValue('email');
	var destAddressee = destRec.getFieldValue('shipaddressee');
	var destAddee = destAddressee.replace('&', '&amp;');
	var destAddr1 = destRec.getFieldValue('shipaddr1');
	var destAddr2 = destRec.getFieldValue('shipaddr2');
	if (destAddr2 === null){destAddr2 = '';}
	var destCity = destRec.getFieldValue('shipcity');
	var destState = destRec.getFieldValue('shipstate');
	var destCountry = destRec.getFieldValue('shipcountry');
	var formDate = new Date(shipmentDate).toISOString();
	var carrierSCAC = parentShipment.getFieldValue('custrecord_pss_sel_scac_code');
	var specInst = parentShipment.getFieldValue('custrecord_pss_special_instructions');
	if(specInst == null){specInst = '';}
	//basic auth elements
	var url = 'https://cerasis.ltlship.com/API/Shipping/V1/Shipping.asmx';
	var shipperid = uOCerID;
	var username = uOCerUN;
	var pword = uOCerPW;
	var acckey = uOCerAcc;
	//start well formed xml object
	var xmlEnvelope = '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" ';
	xmlEnvelope += 'SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">';
	xmlEnvelope += '<SOAP-ENV:Body>';

	var xmlhead = '<ProcessShipment xmlns="http://cerasis.ltlship.com/API/Shipping/V1/Shipping/"><ProcessShipment><AccessRequest>';
	xmlhead += '<ShipperID>' + shipperid + '</ShipperID>';
	xmlhead += '<Username>' + username + '</Username>';
	xmlhead += '<Password>' + pword + '</Password>';
	xmlhead += '<AccessKey>' + acckey + '</AccessKey>';
	xmlhead += '</AccessRequest>'

	var requestxml = '<ShippingRequest>';
	requestxml += '<Direction>' + 'Outbound' + '</Direction>';
	requestxml += '<BillingType>' + 'Prepaid' + '</BillingType>';
	requestxml += '<Carrier>' + carrierSCAC + '</Carrier>';
	requestxml += '<ShipDate>' + formDate + '</ShipDate>';
	requestxml += '<BOLType>' + 'inline' + '</BOLType>';
	requestxml += '<TotalPallets>' + pkgcnt + '</TotalPallets>';
	requestxml += '<SpecialInstructions>' + specInst + '</SpecialInstructions>';
	//requestxml += '<Accessorials>';
	//requestxml += '<Accessorial>';
	//requestxml += '<AccessorialCode>' + accessorialCode[i] + '</AccessorialCode>';
	//requestxml += '</Accessorial>';
	//requestxml += '</Accessorials>';

	var billingxml = '<ThirdPartyInformation>';
	billingxml += '<Name>' + 'Cerasis' + '</Name>';
	billingxml += '<Address1>';
	billingxml += '<Address2>';
	billingxml += '<Address3>';
	billingxml += '<City>';
	billingxml += '<State>';
	billingxml += '<PostalCode>';
	billingxml += '<AdditionalInformation>';
	billingxml += '<AccountNumber>';
	billingxml += '<Country>';
	billingxml += '</ThirdPartyInformation>';

	var destinationxml = '<Destination>';
	destinationxml += '<Name>' + destAddee + '</Name>';
	destinationxml += '<Address1>' + destAddr1 + '</Address1>';
	destinationxml += '<Address2>' + destAddr2 + '</Address2>';
	//destinationxml += '<Address3>' + 'null' + '</Address3>';
	destinationxml += '<City>' + destCity + '</City>';
	destinationxml += '<State>' + destState + '</State>';
	destinationxml += '<PostalCode>' + destZip + '</PostalCode>';
	destinationxml += '<Country>' + destCountry + '</Country>';
	destinationxml += '<Contact>' + '' + '</Contact>';
	destinationxml += '<EmailAddress>' + destEmail + '</EmailAddress>';
	//destinationxml += '<Fax>' + 'null' + '</Fax>';
	//destinationxml += '<Phone>' + '18009991345' + '</Phone>';
	destinationxml += '<Reference>' + custPoRef + '</Reference>';
	destinationxml += '<ResidentialDelivery>false</ResidentialDelivery>';
	destinationxml += '</Destination>';

	var Originxml = '<Origin>';
	Originxml += '<Name>' + 'Hole Products' + '</Name>';
	Originxml += '<Address1>' + uOrigAddr1 + '</Address1>';
	Originxml += '<Address2>' + uOrigAddr2 + '</Address2>';
	//Originxml += '<Address3>' + 'null' + '</Address3>';
	Originxml += '<City>' + uOrigCity + '</City>';
	Originxml += '<State>' + uOrigState + '</State>';
	Originxml += '<PostalCode>' + usrOrigZip + '</PostalCode>';
	Originxml += '<Country>' + 'US' + '</Country>';
	Originxml += '<Contact>' + 'Hole Products' + '</Contact>';
	Originxml += '<EmailAddress>' + 'info@holeproducts.com' + '</EmailAddress>';
	//Originxml += '<Fax>' + 'null' + '</Fax>';
	Originxml += '<Phone>' + '18009991345' + '</Phone>';
	Originxml += '<Reference>' + recName + '</Reference>';
	Originxml += '<ResidentialDelivery>false</ResidentialDelivery>';
	Originxml += '</Origin>';

	var detailsxml = '';
	detailsxml += '<Details>';
	for (var y = 0; y < linWeight.length; y++){
		detailsxml += '<Detail>';
		detailsxml += '<Class>' + linFrClass[y] + '</Class>';
		detailsxml += '<Weight>' + linWeight[y] + '</Weight>';
		detailsxml += '<Quantity>' + linQty[y] + '</Quantity>';
		if (isDimmed[y] === 'T'){
			//detailsxml += '<Height>' + linHeight[y] + '</Height>';
			//detailsxml += '<Length>' + linLeng[y] + '</Length>';
			//detailsxml += '<Width>' + linWidth[y] + '</Width>';
		} else {}
		detailsxml += '<Unit>' + pkgType[y] + '</Unit>';
		detailsxml += '<Hazmat>false</Hazmat>';
		detailsxml += '<Commodity>';
		detailsxml += '<Description>' + linDesc[y] + '</Description>';
		detailsxml += '<NMFCCode>' + linNMFC[y] + '</NMFCCode>';
		detailsxml += '<Class>' + linFrClass[y] + '</Class>';
		detailsxml += '<HazardousMaterial>false</HazardousMaterial>';
		detailsxml += '<HazmatDescription1>' + 'null' + '</HazmatDescription1>';
		detailsxml += '<HazmatDescription2>' + 'null' + '</HazmatDescription2>';
		detailsxml += '<HazmatDescription3>' + 'null' + '</HazmatDescription3>';
		detailsxml += '<HazmatClass>' + 'null' + '</HazmatClass>';
		detailsxml += '<HazmatSubClass>' + 'null' + '</HazmatSubClass>';
		detailsxml += '<HazMatPackagingClass>' + 'null' + '</HazMatPackagingClass>';
		detailsxml += '<HazmatTechnicalName>' + 'null' + '</HazmatTechnicalName>';
		detailsxml += '<HazmatZone>' + 'null' + '</HazmatZone>';
		detailsxml += '<HazmatDetailDescription>' + 'null' + '</HazmatDetailDescription>';
		detailsxml += '<HazmatSpecialProvision>' + 'null' + '</HazmatSpecialProvision>';
		detailsxml += '<HazmatSpecialProvExpDate>' + 'null' + '</HazmatSpecialProvExpDate>';
		detailsxml += '<UNIdentificationNumber>' + 'null' + '</UNIdentificationNumber>';
		detailsxml += '<ERGGuidePage>' + 'null' + '</ERGGuidePage>';
		detailsxml += '<ContactName>' + 'null' + '</ContactName>';
		detailsxml += '<ContactNumber>' + 'null' + '</ContactNumber>';
		detailsxml += '<BolDescription1>' + linDesc[y] + '</BolDescription1>';
		detailsxml += '</Commodity>';
		detailsxml += '</Detail>';
	}
	detailsxml += '</Details>';

	var dimsxml = '<Dimensions>';
	for (var i = 0; i < linWeight.length; i++){
		dimsxml += '<Dimension>';
		dimsxml += '<Quantity>' + '1' + '</Quantity>';
		dimsxml += '<Height>' + linHeight[i] + '</Height>';
		dimsxml += '<Width>' + linLeng[i] + '</Width>';
		dimsxml += '<Length>' + linWidth[i] + '</Length>';
		dimsxml += '</Dimension>';
	}
	dimsxml += '</Dimensions>';

	var closurexml = '</ShippingRequest></ProcessShipment></ProcessShipment></SOAP-ENV:Body></SOAP-ENV:Envelope>'

	//compile all xml elements
	var finalxml = xmlEnvelope + xmlhead + requestxml + Originxml + destinationxml + detailsxml + dimsxml + closurexml;

	nlapiLogExecution('DEBUG', 'GetRates', 'Send Request: ' + url);
	message = nlapiRequestURL(url, finalxml, null, null); //calling the service
	nlapiLogExecution('DEBUG', 'BeforeRequestSent', 'Request XML: ' + finalxml);
	var respObj = message.getBody();
	nlapiLogExecution('DEBUG', 'Response String', 'Response String: ' + respObj);
	return respObj;
}
function printCerBOL(){
	var recName = nlapiGetRecordId();
	//var recType = 'customrecord_pss_shipment';
	//var shipRec = nlapiLoadRecord(recType,recName);
	//var shipRecBOL = shipRec.getFieldValue('custrecord_pss_shiprec_cer_bol_str');
	var rcbURL = nlapiResolveURL('SUITELET', 'customscript_pss_render_cer_bol_sl','customdeploy_pss_render_cer_bol_sl');
	rcbURL += '&recname=' + recName;
	var slresp = nlapiRequestURL(rcbURL);
	window.location.reload(true);
}
function RenderBOL(request, response) {
	if (request.getMethod() == 'GET') {
		//var recId = request.getParameter('NLNAME');
		var recId = nlapiGetRecordId();
		var rec = nlapiLoadRecord('customrecord_pss_shipment', recId, null, null);
		var bolObj = rec.getFieldValue('custrecord_pss_shiprec_cer_bol_str');
		//var file = nlapiLoadFile(106);
		//var contents = file.getValue();
		response.write(bolObj);
		nlapiLogExecution('DEBUG', 'HTML Rendered', 'Success!');
	}
}




function GenerateAWSResponse(response) {
	var json = JSON.parse(response.getBody());
	nlapiLogExecution('DEBUG', 'dataIn', json)
	var rec = nlapiGetNewRecord('customrecord_pss_response_repo');
	var loadRec = nlapiCreateRecord('customrecord_pss_response_repo', rec.getId());
	loadRec.setFieldValue('custrecord_pss_rr_shipmentid', 'AJRTestAWSPost');
	loadRec.setFieldValue('custrecord_pss_rr_message', json);
	nlapiSubmitRecord(loadRec);
	nlapiLogExecution('DEBUG', 'RatePass Created!', 'Success!!');
}

function generateVendorBill() {
	//read shipment and get values
	var shipmentId = nlapiGetRecordId();
	var shipmentRec = nlapiLoadRecord('customrecord_pss_shipment',shipmentId);
	var shipmentStatus = shipmentRec.getFieldValue('custrecord_pss_shipment_status');
	var isBilled = shipmentRec.getFieldValue('custrecord_pss_billed');
	var proNum = shipmentRec.getFieldValue('custrecord_pss_carrier_pro');
	if ( shipmentStatus == 3 && isBilled == 'F' && proNum != 'null'){
		var shipVen = shipmentRec.getFieldValue('custrecord_pss_carrier');
		var shipDate = shipmentRec.getFieldValue('custrecord_pss_ship_date');
		var shipCost = shipmentRec.getFieldValue('custrecord_pss_shipment_selcost');
		var shipSOParent = shipmentRec.getFieldValue('custrecord_pss_so_parent_id');
		//get shipment lines information for template - ajr
		var lineType = new Array();
		var lineNum = new Array();
		var lineDesc = new Array();
		var lineWeight = new Array();
		var lineWeightPerc = new Array();
		var lineFreightAllo = new Array();
		var lineDept = new Array();
		var lineClass = new Array();
		var lineCnt = new Array();
		var totLPC = 0;
		var totLPic = 0;
		var totWeight = 0;
		var fil = new Array();
		fil[0] = new nlobjSearchFilter('custrecord_pss_shipment_parent', null, 'is', shipmentId);
		var col = new Array();
		col[0] = new nlobjSearchColumn('custrecord_pss_nmfc_desc');
		col[1] = new nlobjSearchColumn('custrecord_pss_packagetype');
		col[2] = new nlobjSearchColumn('custrecord_pss_weight');
		col[3] = new nlobjSearchColumn('custrecord_pss_package_department');
		col[4] = new nlobjSearchColumn('custrecord_pss_package_class');
		col[5] = new nlobjSearchColumn('custrecord_pss_piece_count');
		var packages = nlapiSearchRecord('customrecord_pss_shipment_line', null, fil, col);
		for (var i = 0; i < packages.length; i++){
			lineType.push(packages[i].getText('custrecord_pss_packagetype'));
			lineDept.push(packages[i].getValue('custrecord_pss_package_department'));
			lineClass.push(packages[i].getValue('custrecord_pss_package_class'));
			lineDesc.push(packages[i].getValue('custrecord_pss_description'));
			lineCnt.push(packages[i].getValue('custrecord_pss_piece_count'));
			lineWeight.push(Number(packages[i].getValue('custrecord_pss_weight')));
		}
		var totWeight = lineWeight.reduce(function (a, b){return a + b;}, 0);
		for (var y = 0; y < lineWeight.length; y++){
			lineWeightPerc.push(lineWeight[y]/totWeight);
		}
		for (var z = 0; z< lineWeightPerc.length; z++){
			lineFreightAllo.push(lineWeightPerc[z]*shipCost);
		}
		nlapiLogExecution('DEBUG','Line Item Count', 'We counted: ' + packages.length + ' lines!!!');
		var rec = nlapiCreateRecord('vendorbill');
		//set mainline fields on Vendor Bill
		rec.setFieldValue('entity', shipVen);
		rec.setFieldValue('subsidiary', 3);
		rec.setFieldValue('trandate', shipDate);
		rec.setFieldValue('account', '122');
		rec.setFieldValue('tranid', proNum);
		rec.setFieldValue('paymenthold', 'T');
		rec.setFieldValue('custbody_pss_shipment_link', shipmentId);
		rec.setFieldValue('custbody_pss_so_parent', shipSOParent);
		//create Line Item record for expense
		for (var x = 0; x < lineFreightAllo.length; x++){
			rec.selectNewLineItem('expense');
			rec.setCurrentLineItemValue('expense', 'account', '138');
			rec.setCurrentLineItemValue('expense', 'memo', lineCnt[x]);
			rec.setCurrentLineItemValue('expense', 'amount', lineFreightAllo[x]);
			rec.setCurrentLineItemValue('expense', 'department', lineDept[x]);
			rec.setCurrentLineItemValue('expense', 'class', lineClass[x]);
			rec.commitLineItem('expense');
		}
		var recId = nlapiSubmitRecord(rec, true);
		shipmentRec.setFieldValue('custrecord_pss_billed', 'T');
		nlapiSubmitRecord(shipmentRec, true);
		alert('Bill ' + proNum + ' has been successfully created.  Remember, the vendor bill will stay on payment hold until the freight bill has been audited.');
		var baseURL = 'https://system.netsuite.com/app/accounting/transactions/vendbill.nl?id=';
		var url = baseURL + recId + '&whence=';
		window.location = url;
	} else alert('Shiptment has already been Billed.');
}

function openNewBill(recId) {
	var baseURL = 'https://system.netsuite.com/app/accounting/transactions/vendbill.nl?id=';
	var url = baseURL + recId + '&whence=';
	window.location = url;
}

function mapPop() {
	var reqId = nlapiGetRecordId();
	var url = nlapiResolveURL('SUITELET','customscript_pss_map_render','customdeploy_pss_map_render');
	url += '&pssmaporigin=' + reqId;
	var gmapTitle = 'PSS Shipment Tracker';
	nlExtOpenWindow(url, '', '800', '480', '', null, gmapTitle);
}

function AddEstRateButton(form){
	form.setScript('customscript_pss_rate_shipment_bttn');
	form.addButton('custpage_setrate', 'Create Shipment', 'pssShipGenInit()');
	nlapiLogExecution('DEBUG', 'We added a button', 'function is set to estShipgen');
}

function pssEstCS(type, form){
	if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
		var currentRecordId = nlapiGetRecordId();
		var recType = nlapiGetRecordType();
		AddEstRateButton(form);
	}
}

function getSaaSRatesNow(batId){
	//get current shipRec
	var tranId = nlapiGetRecordId();
	var tranType = nlapiGetRecordType();
	var shipRec = nlapiLoadRecord(tranType, tranId);
	var shipDate = shipRec.getFieldValue('custrecord_pss_ship_date');
	var formedDate = new Date(shipDate);
	var isoDate = formedDate.toISOString();
	//get Origin Info
	var origEnt = shipRec.getFieldValue('custrecord_pss_shipper');
	var origRec = nlapiLoadRecord('customer', origEnt);
	var origAddr1 = origRec.getFieldValue('shipaddr1');
	var origAddr2 = origRec.getFieldValue('shipaddr2');
	var origCity = origRec.getFieldValue('shipcity');
	var origState = origRec.getFieldValue('shipstate');
	var origCountry = origRec.getFieldValue('shipcountry');
	var origZip = origRec.getFieldValue('shipzip');
	//get Destination Info
	var destEnt = shipRec.getFieldValue('custrecord_pss_consignee');
	var destRec = nlapiLoadRecord('customer', destEnt);
	var destAddr1 = destRec.getFieldValue('shipaddr1');
	var destAddr2 = destRec.getFieldValue('shipaddr2');
	var destCity = destRec.getFieldValue('shipcity');
	var destState = destRec.getFieldValue('shipstate');
	var destCountry = destRec.getFieldValue('shipcountry');
	var destZip = destRec.getFieldValue('shipzip');
	//url def
	var url = 'http://api.tmssaas.com/Services/ShipmentLiteService.svc';
	//request headers
	var reqHeads = [];
	reqHeads['Content-Type'] = 'text/xml;charset=UTF-8';
	reqHeads['SOAPAction'] = 'http://tempuri.org/IShipmentLiteService/Login';
	reqHeads['Content-Length'] = '514';
	reqHeads['Host'] = 'tmssaas.com';
	reqHeads['Connection'] = 'Keep-Alive';
	//generate auth xml
	var authxml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">';
	authxml += '<soapenv:Header/>';
	authxml += '<soapenv:Body>';
	authxml += '<tem:Login>';
	authxml += '<!--Optional:-->';
	authxml += '<tem:userName>priorityadmin</tem:userName>';
	authxml += '<!--Optional:-->';
	authxml += '<tem:password>Priority</tem:password>';
	authxml += '<!--Optional:-->';
	authxml += '<tem:srvToken>335D6759802A4DBEB41CD6D68AB3024D</tem:srvToken>';
	authxml += '</tem:Login>';
	authxml += '</soapenv:Body>';
	authxml += '</soapenv:Envelope>';
	authmsg = nlapiRequestURL(url, authxml, reqHeads); //logging in and getting the user token
	var usrToken = authmsg.getBody();
	var authXML = nlapiStringToXML(usrToken);
	var tokenTag = authXML.getElementsByTagName('LoginResult');
	var tokenNum = tokenTag[0].textContent;
	//generate payloadxml
	var plreqHeads = [];
	plreqHeads['Content-Type'] = 'text/xml;charset=UTF-8';
	plreqHeads['SOAPAction'] = 'http://tempuri.org/IShipmentLiteService/GetLTLRates';
	plreqHeads['Content-Length'] = '514';
	plreqHeads['Host'] = 'tmssaas.com';
	plreqHeads['Connection'] = 'Keep-Alive';
	var payloadxml = '<?xml version="1.0" encoding="UTF-8"?>';
	payloadxml += '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:t="http://tempuri.org/">';
	payloadxml += '<s:Body>';
	payloadxml += '<t:GetLTLRates xmlns="http://api.tmssaas.com/services/Wcf/ShipmentLiteService.svc">';
	payloadxml += '<t:ltlRequest xmlns:a="http://schemas.datacontract.org/2004/07/LogisticsAppSuite.RatingEngine.DataModels" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">';
	payloadxml += '<a:AccessorialCodes>';
	payloadxml += '<!--Zero or more repetitions:-->';
	payloadxml += '<a:string>IDC</a:string>';
	payloadxml += '</a:AccessorialCodes>';
	payloadxml += '<a:ClientCode>SC420</a:ClientCode>';
	payloadxml += '<a:DestCity>' + destCity + '</a:DestCity>';
	payloadxml += '<a:DestCountry>' + destCountry + '</a:DestCountry>';
	payloadxml += '<a:DestState>' + destState +'</a:DestState>';
	payloadxml += '<a:DestZip>' + destZip + '</a:DestZip>';
	payloadxml += '<a:IsBatch>false</a:IsBatch>';
	payloadxml += '<a:Miles>0</a:Miles>';
	payloadxml += '<a:OrigCity>' + origCity + '</a:OrigCity>';
	payloadxml += '<a:OrigCountry>' + origCountry + '</a:OrigCountry>';
	payloadxml += '<a:OrigState>' + origState + '</a:OrigState>';
	payloadxml += '<a:OrigZip>' + origZip + '</a:OrigZip>';
	payloadxml += '<a:ProfileCode>SC42R</a:ProfileCode>';
	payloadxml += '<a:RequestId>5bd55929-94e4-4399-8986-2397f68a2583</a:RequestId>'; //?
	payloadxml += '<a:Route i:nil="true"/>';
	payloadxml += '<a:SCAC i:nil="true"/>';
	payloadxml += '<a:ServiceLevelCode i:nil="true"/>';
	payloadxml += '<a:ShipmentDate>' + isoDate + '</a:ShipmentDate>';
	payloadxml += '<a:Shipments>';
	payloadxml += '<a:Shipment>';
	payloadxml += '<a:Class>50</a:Class>';
	payloadxml += '<a:HazMat>false</a:HazMat>';
	payloadxml += '<a:Height i:nil="true"/>';
	payloadxml += '<a:Length i:nil="true"/>';
	payloadxml += '<a:NMFC i:nil="true"/>';
	payloadxml += '<a:Pallets>1</a:Pallets>';
	payloadxml += '<a:Pieces i:nil="true"/>';
	payloadxml += '<a:Weight>1000</a:Weight>';
	payloadxml += '<a:Width i:nil="true"/>';
	payloadxml += '</a:Shipment>';
	payloadxml += '</a:Shipments>';
	payloadxml += '<a:SrvToken>335D6759802A4DBEB41CD6D68AB3024D</a:SrvToken>';
	payloadxml += '<a:UsrToken>' + tokenNum + '</a:UsrToken>';
	payloadxml += '<a:ZoneCode i:nil="true"/>';
	payloadxml += '</t:ltlRequest>';
	payloadxml += '</t:GetLTLRates>';
	payloadxml += '</s:Body>';
	payloadxml += '</s:Envelope>';
	//make request to SaaS
	nlapiLogExecution('DEBUG', 'GetRates', 'Send Request: ' + url);
	message = nlapiRequestURL(url, payloadxml, plreqHeads); //calling the service
	var respObj = message.getBody();
	return respObj;
}

function round(value, precision) {
	var multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}

function getShippoRates(request, response){
	//get parent record
	//var recId = request.getParameter('REQURL');
	//var batId = request.getParameter('BATCHID');
	//generate Base64 credential key
	var creds = 'andy.reeder@priority-logistics.com:Leftfoot5510!';
	var shippoToken = 'shippo_live_4473d90fe4a10017060f9aa392dc1ed7354231d5';
	var shippoToken = 'shippo_test_3ad3bec2b759abd83c0842b74424a49a9ca9a558';
	//var enCreds = nlapiEncrypt(creds, 'base64');
	//p44 endPoint URL for Rating
	var url = 'https://api.goshippo.com/shipments/';
	//setting request headers
	var headers = [];
	headers['Authorization'] = 'ShippoToken ' + shippoToken;
	headers['Content-Type'] = 'application/json';
	headers['Accept'] = 'application/json';

	var jPayload = {
		"address_from":{
			"name":"",
			"street1":"",
			"city":"",
			"state":"CA",
			"zip":"94117",
			"country":"US"
		},
		"address_to":{
			"name":"Firestone Polymers",
			"street1":"5713 FM 1006",
			"city":"Orange",
			"state":"TX",
			"zip":"77630",
			"country":"US"
		},
		"parcels":[{
			"length":"15",
			"width":"15",
			"height":"15",
			"distance_unit":"in",
			"weight":"60",
			"mass_unit":"lb"
		}],
		"parcels":[{
			"length":"15",
			"width":"15",
			"height":"15",
			"distance_unit":"in",
			"weight":"60",
			"mass_unit":"lb"
		}],
		"parcels":[{
			"length":"15",
			"width":"15",
			"height":"15",
			"distance_unit":"in",
			"weight":"60",
			"mass_unit":"lb"
		}],
		"parcels":[{
			"length":"15",
			"width":"15",
			"height":"15",
			"distance_unit":"in",
			"weight":"60",
			"mass_unit":"lb"
		}],
		"async": false
	}
	var strPayload = JSON.stringify(jPayload);

	nlapiLogExecution('DEBUG', 'Payload', strPayload);

	var response = nlapiRequestURL(url, strPayload, headers, 'POST');
	nlapiLogExecution('DEBUG', 'Response', response.getBody());
	var obj = response.getBody();
	var respObj = JSON.parse(obj);
	var bestRate = respObj.rates[0].amount;
	return bestRate;
}

function generateShippoRatePasses(batId){
	var recId = nlapiGetRecordId();
	//var batId = Date.now();
	var scacCodes = [];
	var carriername = [];
	var shipRate = [];
	var transDays = [];
	var serviceLevel = [];
	var rateResp = ShippoRetriever(batId);
	//var bestRate = rateResp.rates[0].amount;
	//var cerRespXML = nlapiStringToXML(rateResp);
	var carriers = rateResp.rates;
	for(i=0;i < carriers.length; i++){
		serviceLevel.push(carriers[i].servicelevel.name);
		carriername.push(carriers[i].provider);
		shipRate.push(carriers[i].amount);
		transDays.push(carriers[i].estimated_days);
	}
	for(x=0; x < carriers.length; x++){
		var rateLine = nlapiCreateRecord('customrecord_pss_ratepass_line');
		rateLine.setFieldValue('custrecord_pss_batch_id', batId);
		//rateLine.setFieldValue('custrecord_pss_ratepass_shipment_id', recId);
		rateLine.setFieldValue('custrecord_pss_ratepass_id', x + 1);
		rateLine.setFieldValue('custrecord_pss_lane_name', 'Shippo API')
		rateLine.setFieldValue('custrecord_pss_service_level_desc', serviceLevel[x]);
		rateLine.setFieldValue('custrecord_pss_total_shipment_cost', shipRate[x]);
		rateLine.setFieldValue('custrecord_pss_transit_days', transDays[x]);
		rateLine.setFieldValue('custrecord_pss_ratepass_carrier', carriername[x]);
		nlapiSubmitRecord(rateLine);
	}
	return rateLine;
}

function ShippoRetriever(request, response){
	var tranId = nlapiGetRecordId();
	var tranType = nlapiGetRecordType();
	var shipRec = nlapiLoadRecord(tranType, tranId);
	var shipDate = shipRec.getFieldValue('custrecord_pss_ship_date');
	var formedDate = new Date(shipDate);
	var isoDate = formedDate.toISOString();
	//get Origin Info
	var origEnt = shipRec.getFieldValue('custrecord_pss_shipper');
	//var origName = shipRec.getFieldText('custrecord_pss_shipper');
	var origRec = nlapiLoadRecord('vendor', origEnt);
	var origName = origRec.getFieldValue('name');
	var origAddr1 = origRec.getFieldValue('shipaddr1');
	var origAddr2 = origRec.getFieldValue('shipaddr2');
	var origCity = origRec.getFieldValue('shipcity');
	var origState = origRec.getFieldValue('shipstate');
	var origCountry = origRec.getFieldValue('shipcountry');
	var origZip = origRec.getFieldValue('shipzip');
	//get Destination Info
	var destEnt = shipRec.getFieldValue('custrecord_pss_consignee');
	//var destName = shipRec.getFieldText('custrecord_pss_consignee');
	var destRec = nlapiLoadRecord('customer', destEnt);
	var destName = destRec.getFieldValue('name');
	var destAddr1 = destRec.getFieldValue('shipaddr1');
	var destAddr2 = destRec.getFieldValue('shipaddr2');
	var destCity = destRec.getFieldValue('shipcity');
	var destState = destRec.getFieldValue('shipstate');
	var destCountry = destRec.getFieldValue('shipcountry');
	var destZip = destRec.getFieldValue('shipzip');
	//generate Base64 credential key
	var creds = 'andy.reeder@priority-logistics.com:Leftfoot5510!';
	var shippoToken = 'shippo_test_3ad3bec2b759abd83c0842b74424a49a9ca9a558';
	//var enCreds = nlapiEncrypt(creds, 'base64');
	//p44 endPoint URL for Rating
	var url = 'https://api.goshippo.com/shipments/';
	//setting request headers
	var headers = [];
	headers['Authorization'] = 'ShippoToken ' + shippoToken;
	headers['Content-Type'] = 'application/json';
	headers['Accept'] = 'application/json';

	var jPayload = {
		"address_from":{
			"name": origEnt,
			"street1": origAddr1,
			"city": origCity,
			"state": origState,
			"zip": origZip,
			"country": origCountry
		},
		"address_to":{
			"name": destName,
			"street1": destAddr1,
			"city": destCity,
			"state": destState,
			"zip": destZip,
			"country": destCountry
		},
		"parcels":[{
			"length":"5",
			"width":"5",
			"height":"5",
			"distance_unit":"in",
			"weight":"2",
			"mass_unit":"lb"
		}],
		"async": false
	}
	var strPayload = JSON.stringify(jPayload);

	nlapiLogExecution('DEBUG', 'Payload', strPayload);

	var response = nlapiRequestURL(url, strPayload, headers, 'GET');
	nlapiLogExecution('DEBUG', 'Response', response.getBody());
	var obj = response.getBody();
	var respObj = JSON.parse(obj);
	return respObj;
}

function getComboRates(){
	//load parent record
	var tranId = nlapiGetRecordId();
	var tranType = nlapiGetRecordType();
	var parRec = nlapiLoadRecord(tranType, tranId);
	//get available rates
	var bestParcelRate = comboShippo();
	console.log('Parcel Rate Returned ' + bestParcelRate)
	var bestLTLRate = comboSaaS();
	console.log('SaaS Rate Returned ' + bestLTLRate)
	var totalRate = Number(Number(bestParcelRate) + Number(bestLTLRate));
	console.log('Rates Total' + totalRate);
	//set returned rates
	parRec.setFieldValue('custbody_pss_parcel_cost', bestParcelRate);
	parRec.setFieldValue('custbody_pss_ltl_cost', bestLTLRate);
	parRec.setFieldValue('shipmethod', 817);
	parRec.setFieldValue('shippingcost', totalRate);
	nlapiSubmitRecord(parRec);
}

function comboShippo(){
	//get parent record
	//generate Base64 credential key
	var creds = 'andy.reeder@priority-logistics.com:Leftfoot5510!';
	var shippoToken = 'shippo_live_4473d90fe4a10017060f9aa392dc1ed7354231d5';
	//var enCreds = nlapiEncrypt(creds, 'base64');
	//p44 endPoint URL for Rating
	var url = 'https://api.goshippo.com/shipments/';
	//setting request headers
	var headers = [];
	headers['Authorization'] = 'ShippoToken ' + shippoToken;
	headers['Content-Type'] = 'application/json';
	headers['Accept'] = 'application/json';

	var jPayload = {
		"address_from":{
			"name":"",
			"street1":"",
			"city":"",
			"state":"",
			"zip":"94117",
			"country":"US"
		},
		"address_to":{
			"name":"",
			"street1":"",
			"city":"",
			"state":"",
			"zip":"94105",
			"country":"US"
		},
		"parcels":[{
			"length":"15",
			"width":"15",
			"height":"15",
			"distance_unit":"in",
			"weight":"12",
			"mass_unit":"lb"
		}],
		"async": false
	}
	var strPayload = JSON.stringify(jPayload);

	nlapiLogExecution('DEBUG', 'Payload', strPayload);

	var response = nlapiRequestURL(url, strPayload, headers, 'POST');
	nlapiLogExecution('DEBUG', 'Response', response.getBody());
	console.log('response from Shippo ' + response);
	var obj = response.getBody();
	var respObj = JSON.parse(obj);
	var bestRate = respObj.rates[0].amount;
	return bestRate;
}

function comboSaaS(){
	var message = '';
	var originCity = 'San Francisco';
	var originZip = 94117;
	var destCity = 'Orange';
	var destinationZip = 77630;
	var profileCode = 'SC70R';//PRIOR-KRFTR-SC70R
	var clientCode = 'SC705';//PRILG-KRFT-SC705
	var shipmentDate = '10/30/2018';
	var totWeight = 240;
	//URL of end point
	var url = "http://ec2-52-33-148-2.us-west-2.compute.amazonaws.com/api/Rates?";
	url += "&originZip=" + originZip;
	url += "&orginCity=" + originCity;
	url += "&destinationZip=" + destinationZip;
	url += "&destinationCity=" + destCity;
	url += "&profileCode=" + profileCode;
	url += "&clientCode=" + clientCode;
	url += "&shipmentDate=" + shipmentDate;
	url += "&weight=" + totWeight;
	url += "&shipmentClass=55&accessorials=&palletCount=1";

	console.log('URL called: ' + url);
	message = nlapiRequestURL(url); //calling the service
	var obj = JSON.parse(message.getBody());
	var totalShipmentCost = obj[1].TotalShipmentCost;
	return totalShipmentCost;
}

function getPaqToken(){
	var url = 'http://qa.paquetexpress.com.mx:7007/RadRestFul/api/rad/loginv1/login';
	var uName = 'PRIORITY';
	var uPass = 'UDU0NzMwNDE=';
	var encPass = nlapiEncrypt(uPass, 'base64');
	var headers = [];
	headers['Content-Type'] = 'application/json';
	headers['Accept'] = 'application/json';
	var headPayload = {
		"header":{
			"security":{
				"user": uName,
				"password":uPass
			}
		}
	};
	var strPayload = JSON.stringify(headPayload);
	var response = nlapiRequestURL(url, strPayload, headers, 'POST');
	var obj = response.getBody();
	var respObj = JSON.parse(obj);
	var token = respObj.body.response.data.token;
	console.log('The call responded with ' + token + '--');
	return token;
}

function getPaqRates(){
	var rateUrl = 'http://qa.paquetexpress.com.mx:7007/RadRestFul/api/rad/v1/guia';
	var uName = 'PRIORITY';
	var authToken = getPaqToken();
	var headers = [];
	headers['Content-Type'] = 'application/json';
	headers['Accept'] = 'application/json';
	var ratePayload = {
		"header": {
			"security": {
				"user": uName,
				"type": 0,
				"token":authToken
			}
		},
		"body": {
			"request": {
				"data": [
					{
						"billRad": "REQUEST",
						"billClntId": "ID_CLIENT_PAQUETEXPRESS",
						"pymtMode": "PAID",
						"pymtType": "C",
						"radGuiaAddrDTOList": [
							{
								"addrLin1": "MEXICO",
								"addrLin3": "EDO.DE MEXICO",
								"addrLin4": "CUAUTITLAN IZCALLI",
								"addrLin5": "CUAUTITLAN IZCALLI",
								"addrLin6": "SAN MARTIN OBISPO TEPETLIXPA",
								"strtName": "AV. TEJOCOTES",
								"drnr": "S/N",
								"phno1": "52843000",
								"zipCode": "54763",
								"clntName": "ROBERT BOSCH S DE RL DE CV",
								"email": "correorobertbosch@bosch.com.mx",
								"contacto": "JUAN PEREZ",
								"addrType": "ORIGIN"
							},
							{
								"addrLin1": "México",
								"addrLin3": "Chihuahua",
								"addrLin4": "Las Delicias",
								"addrLin5": "Las Delicias",
								"addrLin6": "Col. Puente de Cantera",
								"strtName": "Fracc. Puente de Alcantara",
								"drnr": "95",
								"phno1": "6391287101",
								"zipCode": "33000",
								"clntName": "CLINICA PRUEBA CHIHUAHUA",
								"email": "clinicaprueba@chihuahua.com.mx",
								"contacto": "DR. JOSE LOPEZ",
								"addrType": "DESTINATION"
							}
						],
						"radSrvcItemDTOList": [
							{
								"srvcId": "PACKETS",
								"weight": "2",
								"volL": "30",
								"volW": "20",
								"volH": "40",
								"cont": "VALVULAS",
								"qunt": "1"
							},
							{
								"srvcId": "PACKETS",
								"weight": "2",
								"volL": "10",
								"volW": "20",
								"volH": "30",
								"cont": "BOBINAS",
								"qunt": "2"
							}
						],
						"listSrvcItemDTO": [
							{
								"srvcId": "EAD",
								"value1": ""
							},
							{
								"srvcId": "RAD",
								"value1": ""
							},
							{
								"srvcId": "INV",
								"value1": "5000"
							}
						]
					}
				],
				"objectDTO": null
			},
			"response": null
		}
	}
	var strRatePayload = JSON.stringify(ratePayload);
	var response = nlapiRequestURL(rateUrl, strRatePayload, headers, 'POST');
	var obj = response.getBody();
	console.log(obj);
}

function googleGEO(){

}

function nextPage1(){
	alert('inlineHTML button Rate aka nextPage1 clicked');
}
