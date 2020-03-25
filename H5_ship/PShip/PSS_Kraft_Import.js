function generateResponse(response) {
	var json = JSON.parse(response.getBody());
	nlapiLogExecution('DEBUG', 'dataIn', json)
	var rec = nlapiGetNewRecord('customrecord_pss_response_repo');
	var loadRec = nlapiCreateRecord('customrecord_pss_response_repo', rec.getId());
	loadRec.setFieldValue('custrecord_pss_rr_shipmentid', 'KRAFT Imported');
	loadRec.setFieldValue('custrecord_pss_rr_message', json);
	nlapiSubmitRecord(loadRec);
	nlapiLogExecution('DEBUG', 'RatePass Created!', 'Success!!');
	return 200;
}