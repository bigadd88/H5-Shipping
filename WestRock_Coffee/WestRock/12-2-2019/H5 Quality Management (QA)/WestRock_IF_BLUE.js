function beforeLoad(type, form){
	addIFTButton(form);
}

function addIFTButton(form){
	form.setScript('customscript_h5_if_blue');
	form.addButton('custpage_ift', 'H5-IFT', 'postItemFulfillment()');
}

function postItemFulfillment() {
	var recId = nlapiGetRecordId();
	var recType = nlapiGetRecordType();
	var hasIFTConfirm = nlapiLookupField('itemfulfillment', recId, 'custbody_h5_ift_confirm');
	if (hasIFTConfirm != ""){
		alert('This item fulfillment has already been posted to IBM Food Trust Blockchain.');
	}
	else {
	var url = nlapiResolveURL('SUITELET','customscript_h5_ift_post_if','customdeploy_h5_ift_post_if');
	url += '&recId=' + recId;
	var reqObj = nlapiRequestURL(url);
	var respObj = reqObj.getBody();
	alert('Successful Blockchain submission.  IBM Food Trust returned the following confirmation: ' + respObj);
	}
}
