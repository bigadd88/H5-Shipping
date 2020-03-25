function beforeLoad(type, form){
	if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
		var currentRecordId = nlapiGetRecordId();
	}
  	addShipmentButton(form);
	nlapiLogExecution('DEBUG', 'Current Shipment Record', 'Transaction ID: ' + currentRecordId);
}

function addShipmentButton(form){
  form.setScript('customscript_h5_pship_client');
  form.addButton('custpage_addpackages', 'Create LTL Shipment', 'h5ShipGenInit()');
}
