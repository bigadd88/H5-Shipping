function calculatePCF(){
  var recId = nlapiGetRecordId();
  var record = nlapiLoadRecord('customrecord_pss_shipment_line', recId);
  var len = record.getFieldValue('custrecord_pss_length');
  var wid = record.getFieldValue('custrecord_pss_width');
  var hgt = record.getFieldValue('custrecord_pss_height');
  var weight = record.getFieldValue('custrecord_pss_weight');
  var nmfcVal = record.getFieldValue('custrecord_pss_nmfc_number_line');
  var nmfcNumber = nlapiLookupField('customrecord_pss_nmfc_classification', nmfcVal, 'custrecord_pss_nmfc_num');
  var nmfcDim = nlapiLookupField('customrecord_pss_nmfc_classification', nmfcVal, 'custrecord_pss_dim_item');
  var cubicFt = Math.round(len * wid * hgt) / 1728;
  nlapiLogExecution('DEBUG', 'Ninja Math', 'Cubic Feet is: ' + cubicFt);
  var number = weight/cubicFt;
  var calcPCF = Math.round(number * 10 ) / 10;
  if ( nmfcDim == 'F' ){
    return true;
  } else {
    	record.setFieldValue('custrecord_pss_pcf', calcPCF);
  		nlapiLogExecution('DEBUG', 'Ninja Math', 'Base Number is: ' + number);
  		nlapiLogExecution('DEBUG', 'Ninja Math', 'PCF is: ' + calcPCF);
  		if (calcPCF > 29.9){
    		var dsub = 11;
    		var dclass = 60;
    		nlapiLogExecution('DEBUG', 'Ninja If/Else Lookup', 'PCF is 30 or Greater, static values used.');
  			} else {
  			nlapiLogExecution('DEBUG', 'Ninja If/Else Lookup', 'Running the gauntlet...');
  			var fil = ['custrecord_pss_freight_class_pcf', 'is', calcPCF];
  			var searchFC = nlapiCreateSearch('customrecord_pss_freight_class_lu', fil,[
  				new nlobjSearchColumn('custrecord_pss_freight_sub'),
  				new nlobjSearchColumn('custrecord_pss_freight_class')
  				]);
  var resultSet = searchFC.runSearch();
  var results = resultSet.getResults(0,999);
  for ( var i = 0; results != null && i < results.length; i++) {
    var dsub = results[i].getValue('custrecord_pss_freight_sub');
    var dclass = results[i].getValue('custrecord_pss_freight_class');
  }
  };
  nlapiLogExecution('DEBUG', 'Ninja If/Else Lookup', 'Sub: ' + dsub + 'Class: ' + dclass);
  record.setFieldValue('custrecord_pss_nmfc_number', nmfcNumber + '-' + dsub);
  record.setFieldValue('custrecord_pss_freight_class_value', dclass);
  nlapiSubmitRecord(record);
  }
}