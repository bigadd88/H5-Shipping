function trackPassLTL(request, response) {
    //get parent record
    //var recId = request.getParameter('requrl');

    var recId = '123457065';
    var parentShipment = nlapiLoadRecord('customrecord_pss_shipment', recId);
    var carrier = parentShipment.getFieldValue('custrecord_pss_carrier');
    var carrierSCAC = nlapiLookupField('vendor',carrier,'custentity_pss_scac');
    var carrierPRO = parentShipment.getFieldValue('custrecord_pss_carrier_pro');
    var creds = 'robert.regnier@priority-logistics.com:Priority1!';
    var enCreds = nlapiEncrypt(creds, 'base64');
    var url = 'https://test.p-44.com/api/v3/statuses/query';
    var headers = [];
    headers['Authorization'] = 'Basic ' + enCreds;
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
    //nlapiLogExecution('DEBUG', 'BeforeRequestSent', 'Requesting Record ID: ' + recId);
    var jPayload =
        {
            "capacityProviderAccountGroup": {
                "code": 43384,
                "accounts": [
                    {
                        "code": carrierSCAC
                    }
                ]
            },
            "shipmentIdentifiers": [
                {
                    "type": "PRO",
                    "value": carrierPRO
                }
            ],
            "apiConfiguration": {
                "fallBackToDefaultAccountGroup": false
            }
        }
    var strPayload = JSON.stringify(jPayload);
    var response = nlapiRequestURL(url, strPayload, headers, 'POST');
    nlapiLogExecution('DEBUG', 'Response', response.getBody());
    var obj = response.getBody();
    var respObj = JSON.parse(obj);
    var code = respObj.statusUpdateHistory[1].code;
    var description = respObj.statusUpdateHistory[1].description;
    var timestamp = respObj.statusUpdateHistory[1].timestamp;
    var retrievalDateTime = respObj.statusUpdateHistory[1].retrievalDateTime;
    var trackPassLine = nlapiCreateRecord('customrecord_pss_trackpass_line');
    trackPassLine.setFieldValue('custrecord_pss_tpass_shipment_id', recId);
    trackPassLine.setFieldValue('custrecord_pss_tpass_statusraw', code);
    trackPassLine.setFieldValue('custrecord_pss_tpass_carriernotes', description);
    trackPassLine.setFieldValue('custrecord_pss_tpass_timestampraw', timestamp);
    trackPassLine.setFieldValue('custrecord_pss_tpass_retrievaldatetime', retrievalDateTime);
    nlapiSubmitRecord(trackPassLine);
    parentShipment.setFieldValue('custrecord_pss_last_trace_time',timestamp);
    parentShipment.setFieldValue('custrecord_pss_last_trace_status',code);
    nlapiSubmitRecord(parentShipment);
}