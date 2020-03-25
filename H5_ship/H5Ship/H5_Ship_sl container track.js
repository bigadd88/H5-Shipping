function containerTrack(request, response) {
    //get parent record
    //var recId = request.getParameter('requrl');
    var recId = '123457067';
    var parentShipment = nlapiLoadRecord('customrecord_h5_shipment', recId);
    var containerId = parentShipment.getFieldValue('custrecord_h5_containerid');
    var containerTrackingId = parentShipment.getFieldValue('custrecord_h5_container_trackingid');
      //generate Base64 credential key
    var creds = 'robert.regnier@priority-logistics.com:Priority1!';
    var enCreds = nlapiEncrypt(creds, 'base64');
    //p44 endPoint URL for Rating
    var url = 'https://test.p-44.com/api/v3/ocean/shipments/'+containerTrackingId+'/statuses';
    //setting request headers
    var headers = [];
    headers['Authorization'] = 'Basic ' + enCreds;
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
    //nlapiLogExecution('DEBUG', 'BeforeRequestSent', 'Requesting Record ID: ' + recId);
    var response = nlapiRequestURL(url, headers, 'GET');
    nlapiLogExecution('DEBUG', 'Response', response.getBody());
    var obj = response.getBody();
    var respObj = JSON.parse(obj);
    //alert({'Container Tracking Info',respObj})
    return response.getCode();
  }
  