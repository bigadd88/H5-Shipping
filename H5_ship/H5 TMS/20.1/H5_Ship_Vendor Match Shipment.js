function getSCACVendor(){
  nlapiLogExecution('DEBUG', 'Started');
    try {
      var recId = nlapiGetRecordId();
      var record = nlapiLoadRecord('customrecord_h5_ratepass_line', recId);
      var scacCode = record.getFieldValue('custrecord_h5_scac');
        nlapiLogExecution('DEBUG', 'SCAC Code', scacCode);
        var fil = new Array();
            fil[0] = new nlobjSearchFilter('custentity_h5_scac', null, 'is', scacCode);
        var col = new Array();
            col[0] = new nlobjSearchColumn('internalid');
        var sResults = nlapiSearchRecord('vendor', null, fil, col);
        if (sResults != 'null'){
        for (var i=0; i < sResults.length; i++){
        record.setFieldValue('custrecord_h5_ratepass_vendor', sResults[i].getValue('internalid'));
      }
        nlapiSubmitRecord(record);
      }
         else {}
  }
    catch (e) {
        nlapiLogExecution('ERROR', 'Error Encounterd', e);
      }
  }