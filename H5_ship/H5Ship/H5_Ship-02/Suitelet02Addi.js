function Addison02TestingButton(form){
	form.setScript('customscript_h5_rate_shipment_bttn');
	form.addButton('custpage_AddCustomsButton', 'Customs', 'addCustoms()');
}

function Addison02Trigger() {
	var recName = nlapiGetRecordId();
	var url = nlapiResolveURL('SUITELET','customscript_h5_customs','customdeploy_h5_customs');
	url += '&recName=' + recName,
		window.open(url);
}