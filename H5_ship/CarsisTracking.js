function getCerasisTrackStatus(request) {

    var shipmentsToTrack = nlapiSearchRecord("customrecord_pss_shipment",null,
        [
            ["custrecord_pss_shiprec_cer_bill_num","isnotempty",""],
            "AND",
            ["custrecord_pss_shipmentclosed","is","F"],
            "AND",
            ["custrecord_pss_shipment_status","anyof","2","3"]
            // ["internalid","anyof","101150"]
        ],
        [
            new nlobjSearchColumn("id"),
            new nlobjSearchColumn("name").setSort(false),
            new nlobjSearchColumn("custrecord_pss_shiprec_cer_bill_num"),
        ]
    );

    var shipmentToTrack = [];
    for (var x = 0; x < shipmentsToTrack.length; x++) {
        shipmentToTrack.push(shipmentsToTrack[x].getValue('id'));
        var parentShipment = nlapiLoadRecord('customrecord_pss_shipment', shipmentToTrack[x]);
        var cerasisBOL = parentShipment.getFieldValue('custrecord_pss_shiprec_cer_bill_num');
        var usrOrigLoc = parentShipment.getFieldValue('custrecord_pss_location');
        var uOCerID = nlapiLookupField('location', usrOrigLoc, 'custrecord_pss_cer_acct_num');
        var uOCerUN = nlapiLookupField('location', usrOrigLoc, 'custrecord_pss_cer_user_name');
        var uOCerPW = nlapiLookupField('location', usrOrigLoc, 'custrecord_pss_cer_pw');
        var uOCerAcc = nlapiLookupField('location', usrOrigLoc, 'custrecord_pss_cer_acc_key');
        var url = 'https://cerasis.ltlship.com/API/requestinformation/V1/requestinformation.asmx';
        var shipperid = uOCerID;
        var username = uOCerUN;
        var pword = uOCerPW;
        var acckey = uOCerAcc;
        var xmlEnvelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:req="http://cerasis.ltlship.com/API/RequestInformation/V1/RequestInformation/">';
        xmlEnvelope += '<soapenv:Header/>';
        xmlEnvelope += '<soapenv:Body>';
        xmlEnvelope += '<req:GetTrackingStatus>';
        xmlEnvelope += '<req:TrackingStatusRequest>';
        xmlEnvelope += '<req:AccessRequest>';
        xmlEnvelope += '<req:ShipperID>'+shipperid+'</req:ShipperID>';
        xmlEnvelope += '<req:Username>'+username+'</req:Username>';
        xmlEnvelope += '<req:Password>'+pword+'</req:Password>';
        xmlEnvelope += '<req:AccessKey>'+acckey+'</req:AccessKey>';
        xmlEnvelope += '</req:AccessRequest>';
        xmlEnvelope += '<req:ShipmentBillNumber>'+cerasisBOL+'</req:ShipmentBillNumber>';
        xmlEnvelope += '</req:TrackingStatusRequest>';
        xmlEnvelope += '</req:GetTrackingStatus>';
        xmlEnvelope += '</soapenv:Body>';
        xmlEnvelope += '</soapenv:Envelope>';
        var trackStatusResults = nlapiRequestURL(url, xmlEnvelope, null, null);
        var respObj = trackStatusResults.getBody();
        nlapiLogExecution('debug', 'trackResponse XML', cerasisBOL + " : " + respObj);
        var xmlDoc = nlapiStringToXML(respObj);
        var errorNode = nlapiSelectNode(xmlDoc, "//*[name()='Error']");
        var returnedCode = nlapiSelectValue(errorNode, "//*[name()='Code']");
        var returnedMessage = nlapiSelectValue(errorNode, "//*[name()='Message']");
        var mainNode = nlapiSelectNode(xmlDoc, "//*[name()='TrackingStatusResponse']");
        var returnedStatusMessage = nlapiSelectValue(mainNode, "//*[name()='LastStatusMessage']");
        var returnedTrackingCode = nlapiSelectValue(mainNode, "//*[name()='TrackingCode']");
        var returnedTrackingURL = nlapiSelectValue(mainNode, "//*[name()='TrackingURL']");
        // console.log(shipmentToTrack[x] +' - '+ returnedCode +' - '+ returnedTrackingCode);
        // nlapiLogExecution('debug','tracking script status', shipmentToTrack[x] +' - '+ returnedCode +' - '+' - '+ returnedMessage+ returnedShipmentStatus);
        if (returnedCode === "0" && returnedStatusMessage != null) {

            var lastTrackDateTime = new Date().toISOString();
            var trackPassLine = nlapiCreateRecord('customrecord_pss_trackpass_line');
            trackPassLine.setFieldValue('custrecord_pss_tpass_shipment_id', shipmentToTrack[x]);
            trackPassLine.setFieldValue('custrecord_pss_tpass_statusraw', returnedStatusMessage);
            trackPassLine.setFieldValue('custrecord_pss_tpass_timestampraw', lastTrackDateTime);
            trackPassLine.setFieldValue('custrecord_pss_cerasistrackingurl', returnedTrackingURL);
            trackPassLine.setFieldValue('custrecord_pss_tpass_retrievaldatetime', lastTrackDateTime);
            nlapiSubmitRecord(trackPassLine);
            parentShipment.setFieldValue('custrecord_pss_last_trace_time', lastTrackDateTime);
            parentShipment.setFieldValue('custrecord_pss_cerasis_tracking_code', returnedTrackingCode);
            parentShipment.setFieldValue('custrecord_pss_cerasis_tracking_url', returnedTrackingURL);
            parentShipment.setFieldValue('custrecord_pss_last_trace_status', returnedStatusMessage);
            nlapiLogExecution('debug', 'Shipments being tracked', shipmentToTrack[x]);
            nlapiSubmitRecord(parentShipment);
        }
        else {
            parentShipment.setFieldValue('custrecord_pss_last_trace_status', 'No Tracking Available');
            nlapiLogExecution('debug', 'Shipments being tracked', shipmentToTrack[x]);
            nlapiSubmitRecord(parentShipment);
        }
    }
}
