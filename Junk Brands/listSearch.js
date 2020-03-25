
function productTypeOptions (){

var col = new Array();
col[0] = new nlobjSearchColumn('name');
col[1] = new nlobjSearchColumn('internalId').setSort(false);
var results = nlapiSearchRecord('customlist_pss_freight_class', null, null, col);

var listStringA = '';

for (var i = 0; i < results.length; i++) {
  listStringA += '<option value="' + results[i].getValue('internalId') + '">'  + results[i].getValue('name') + '</option>';
}
document.getElementById('productType').innerHTML = '<select id="productType" class="mdb-select md-form">' + listStringA + '</select>';

var col = new Array();
col[0] = new nlobjSearchColumn('name');
col[1] = new nlobjSearchColumn('internalId').setSort(false);
var results = nlapiSearchRecord('customlist_pss_freight_class', null, null, col);

var listStringB = '';

for (var i = 0; i < results.length; i++) {
  listStringB += '<option value="' + results[i].getValue('internalId') + '">'  + results[i].getValue('name') + '</option>';
}
document.getElementById('fabricType').innerHTML = '<select id="fabricType" class="mdb-select md-form">' + listStringB + '</select>';

var col = new Array();
col[0] = new nlobjSearchColumn('name');
col[1] = new nlobjSearchColumn('internalId').setSort(false);
var results = nlapiSearchRecord('customlist_pss_freight_class', null, null, col);

var listStringC = '';

for (var i = 0; i < results.length; i++) {
  listStringC += '<option value="' + results[i].getValue('internalId') + '">'  + results[i].getValue('name') + '</option>';
}
document.getElementById('royaltyId').innerHTML = '<select id="royaltyId" class="mdb-select md-form">' + listStringC + '</select>';

var col = new Array();
col[0] = new nlobjSearchColumn('name');
col[1] = new nlobjSearchColumn('internalId').setSort(false);
var results = nlapiSearchRecord('customlist_pss_freight_class', null, null, col);

var listStringD = '';

for (var i = 0; i < results.length; i++) {
  listStringD += '<option value="' + results[i].getValue('internalId') + '">'  + results[i].getValue('name') + '</option>';
}
document.getElementById('teamCode').innerHTML = '<select id="teamCode" class="mdb-select md-form">' + listStringD + '</select>';

var col = new Array();
col[0] = new nlobjSearchColumn('name');
col[1] = new nlobjSearchColumn('internalId').setSort(false);
var results = nlapiSearchRecord('customlist_pss_freight_class', null, null, col);

var listStringE = '';

for (var i = 0; i < results.length; i++) {
  listStringE += '<option value="' + results[i].getValue('internalId') + '">'  + results[i].getValue('name') + '</option>';
}
document.getElementById('stitchColor').innerHTML = '<select id="stitchColor" class="mdb-select md-form">' + listStringE + '</select>';
}
