function SubmitForm() {
  var req = nlapiGetLineItemCount('custpage_sublist_id');
  var tNow = getTodayShortDate();
  console.log('the request is: ' + req + ' entries long.');
  var vals = new Array();
  var intIds = new Array();
  console.log('base arrays created.');
	for (var i = 0; i < req; i++) {
		vals.push(nlapiGetLineItemValue('custpage_sublist_id', 'custrecord_pss_bill_selected', i));
    }
	for (var x = 0; x < vals.length; x++){
    if (vals[x] == 'T'){
      intIds.push(nlapiGetLineItemValue('custpage_sublist_id', 'internalid', x));
    }}
  console.log(intIds);
  for (var y = 0; y < intIds.length; y++){
    var recBill = nlapiLoadRecord('vendorbill', intIds[y]);
    recBill.setFieldValue('custbody_pss_audit_date', tNow);
    recBill.setFieldValue('paymenthold', 'F');
    recBill.setFieldValue('custbody_pss_status', 4);
    nlapiSubmitRecord(recBill);
  }
  console.log('You selected: ' + intIds.length + ' to be marked approved.');
  nlapiLogExecution('DEBUG', 'WhasamattaU', 'Bills Counted: ' + vals);
  window.location.reload(false);
}

function alertRow(){
  document.getElementById('custpage_sublist_idrow9').style.color = 'red';
}

function helpFlyout(){
  alert('helpFlyout Called, they too would like their function back.');
}