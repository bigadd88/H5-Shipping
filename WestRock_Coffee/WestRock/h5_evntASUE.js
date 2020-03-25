function evtASUE(){
  var recId = nlapiGetRecordId();
  var evtRec = nlapiLoadRecord('customrecord_h5_environmentaltest', recId);

  var date = evtRec.getFieldValue('custrecord_h5_date');
  var facilityId = evtRec.getFieldValue('custrecord_h5_facilitycomponent');

  var facilityRec = nlapiLoadRecord('customrecord_h5_facilitycomponent', facilityId);
  facilityRec.setFieldValue('custrecord_h5_lasttestdate', date);

  nlapiSubmitRecord(facilityRec);
  nlapiLogExecution('debug', 'completed', facilityId);
}
