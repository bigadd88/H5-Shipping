function Before_Load(type, form) {
	if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
		//AddPackagesButton(form);
		AddRateButton(form);
	}
}

function AddRateButton(){
form.setScript('customscript_h5_quote_blue');
form.addButton('custpage_setrate', 'H5-Ideal Rater', 'newGetRates()');
}

function newGetRates(){
  var recId = nlapiGetRecordId();
var quoteRec = nlapiLoadRecord('estimate', recId);

var toZip = quoteRec.getFieldValue('shipzip').substr(0, 5);
var locId = quoteRec.getFieldValue('custbody_sol_default_ship_from_loc');
var fromZip = nlapiLookupField('location', locId, 'zip');


var totalWeight = 0;
for(i = 1; i < quoteRec.lineitems.item.length; i++){
  if (quoteRec.lineitems.item[i].custcol_sol_default_drop_ship == 'F') {
    q = quoteRec.lineitems.item[i].quantity;
    w = quoteRec.lineitems.item[i].custcol_item_weight;
    totalWeight += q * w;
}}

  var url = 'https://tstdrv1555022.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=670&deploy=1&compid=TSTDRV1555022&h=b19cbccd32e4d712fae8';
  url += '&toZip=' + toZip;
  url += '&fromZip=' + fromZip;
  url += '&weight=' + Math.round(totalWeight);
  window.open(url);
}
