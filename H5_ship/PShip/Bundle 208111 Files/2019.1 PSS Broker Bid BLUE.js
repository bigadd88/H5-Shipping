function beforeLoad(type, form){
	//if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
	//	var currentRecordId = nlapiGetRecordId();
	//}
  	addAckButton(form);
	//nlapiLogExecution('DEBUG', 'Current Broker Bid Record', 'Transaction ID: ' + currentRecordId);
    // 
    }

function addAckButton(form){
  form.setScript('customscript_pss_broker_bid_blue');
  form.addButton('custpage_addAckButton', 'Broker Bid Acknowledgement', 'brokerbidack()');
}

function brokerbidack() {
	var recName = nlapiGetRecordId();
  	var url = nlapiResolveURL('SUITELET','customscript_pss_brokerbidack','customdeploy_pss_brokerbidack');
	url += '&recName=' + recName,
		window.open(url);
}
