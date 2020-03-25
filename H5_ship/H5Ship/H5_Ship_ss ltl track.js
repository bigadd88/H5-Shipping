function scheduledTrackPassLTL(request) {

    var shipmentsToTrack = nlapiSearchRecord("customrecord_h5_shipment",null,
        [
            ["custrecord_h5_shipment_status","anyof","2","3"]
        ],
        [
            new nlobjSearchColumn("id"),
            new nlobjSearchColumn("name").setSort(false),
            new nlobjSearchColumn("custrecord_h5_ship_date"),
            new nlobjSearchColumn("custrecord_h5_carrier"),
            new nlobjSearchColumn("custrecord_h5_location"),
            new nlobjSearchColumn("custrecord_h5_shipper"),
            new nlobjSearchColumn("custrecord_h5_consignee"),
            new nlobjSearchColumn("custrecord_h5_shipment_status")
        ]
    );
    var shipmentToTrack = [];
    for (var x = 0; x < shipmentsToTrack.length; x++) {
        shipmentToTrack.push(shipmentsToTrack[x].getValue('id'));
        var parentShipment = nlapiLoadRecord('customrecord_h5_shipment', shipmentToTrack[x]);
        var carrier = parentShipment.getFieldValue('custrecord_h5_carrier');
        var carrierSCAC = nlapiLookupField('vendor', carrier, 'custentity_h5_scac');
        var carrierPRO = parentShipment.getFieldValue('custrecord_h5_carrier_pro');
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
        var code = respObj.statusUpdateHistory[0].code;
        var description = respObj.statusUpdateHistory[0].description;
        var timestamp = respObj.statusUpdateHistory[0].timestamp;
        var retrievalDateTime = respObj.statusUpdateHistory[0].retrievalDateTime;
        var trackPassLine = nlapiCreateRecord('customrecord_h5_trackpass_line');
        trackPassLine.setFieldValue('custrecord_h5_tpass_shipment_id', shipmentToTrack[x]);
        trackPassLine.setFieldValue('custrecord_h5_tpass_statusraw', code);
        trackPassLine.setFieldValue('custrecord_h5_tpass_carriernotes', description);
        trackPassLine.setFieldValue('custrecord_h5_tpass_timestampraw', timestamp);
        trackPassLine.setFieldValue('custrecord_h5_tpass_retrievaldatetime', retrievalDateTime);
        nlapiSubmitRecord(trackPassLine);
        parentShipment.setFieldValue('custrecord_h5_last_trace_time', timestamp);
        parentShipment.setFieldValue('custrecord_h5_last_trace_status', code);
        nlapiSubmitRecord(parentShipment);
    }
}