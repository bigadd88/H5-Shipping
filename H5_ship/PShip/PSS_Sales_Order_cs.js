function beforeLoad(type, form){
	if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
		var currentRecordId = nlapiGetRecordId();
	}
  	addShipmentButton(form);
	nlapiLogExecution('DEBUG', 'Current Shipment Record', 'Transaction ID: ' + currentRecordId);
}

function addShipmentButton(form){
  form.setScript('customscript_pss_pship_client');
  form.addButton('custpage_addpackages', 'Create Shipment', 'getComboRates()');
}

function beforeSOSubmit(){
  nlapiLogExecution('DEBUG', 'Activated!', 'Sales Order Submitted!');
  var soId = nlapiGetRecordId();
  var soType = nlapiGetRecordType();
  var parRec = nlapiLoadRecord(soType, soId);
  var docNum = parRec.getFieldValue('tranid');
  var destCust = parRec.getFieldValue('entity');
  var destAddy = parRec.getFieldValue('shipaddress')
  var shipDate = parRec.getFieldValue('trandate');
  var shipZip = parRec.getFieldValue('shipzip');
  var origAddr = nlapiLookupField('entity', 231, 'address');
  var origZip = nlapiLookupField('entity', 231, 'shipzip');
  var shipLoad = nlapiCreateRecord('customrecord_pss_shipment');
  shipLoad.setFieldValue('name', docNum);
  shipLoad.setFieldValue('custrecord_pss_shipper', 231);
  shipLoad.setFieldValue('custrecord_pss_shipper_address', origAddr);
  shipLoad.setFieldValue('custrecord_pss_consignee', destCust);
  shipLoad.setFieldValue('custrecord_pss_so_parent_id', soId);
  shipLoad.setFieldValue('custrecord_pss_ship_date', shipDate);
  shipLoad.setFieldValue('custrecord_pss_freight_bill_to', 119);
  shipLoad.setFieldValue('custrecord_pss_consignee_address', destAddy);
  shipLoad.setFieldValue('custrecord_pss_shipper_zip', origZip);
  shipLoad.setFieldValue('custrecord_pss_consignee_zip', shipZip);
  shipLoad.setFieldValue('custrecord_pss_billing_type', 1);
  shipLoad.setFieldValue('custrecord_pss_shipment_direction', 2);
  shipLoad.setFieldValue('custrecord_pss_shipment_type', 2);
  var shipmentId = nlapiSubmitRecord(shipLoad);
}