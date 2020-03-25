
function junkListOptions (){

var col = new Array();
col[0] = new nlobjSearchColumn('name');
col[1] = new nlobjSearchColumn('internalId').setSort(false);
var results = nlapiSearchRecord('customlist_pss_freight_class', null, null, col);

var listString = '';

for (var i = 0; i < results.length; i++) {
  listString += '<option value="' + results[i].getValue('internalId') + '">'  + results[i].getValue('name') + '</option>';
}
document.getElementById('productType').innerHTML = '<select id="productType" class="mdb-select md-form">' + listString + '</select>';
}
