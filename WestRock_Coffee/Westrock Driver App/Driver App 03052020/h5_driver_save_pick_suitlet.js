function savePickRecord(request, response){
var pickData = request.getBody();

    
  var createSubmitPick = nlapiCreateRecord('customrecord_h5_driver_pick');
  
createSubmitPick.setFieldValue('name', 'Addisons Test');
  createSubmitPick.setFieldValue('custrecord_h5_pick_driver', 11);
  createSubmitPick.setFieldValue('custrecord_h5_pick_data', pickData);
  var newDriverPick = nlapiSubmitRecord(createSubmitPick);

  response.write(newDriverPick);

}