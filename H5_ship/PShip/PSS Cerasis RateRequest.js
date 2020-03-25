// JavaScript Document
function getcerasisrates(request, response) {
    //get parameter data
    var recId = request.getParameter('reqURL');
    var batId = request.getParameter('batchId');
    //collect shipment record data
    var parentShipment = nlapiLoadRecord('customrecord_pss_shipment', recId);
    var pkgcount = new Array();
    var fil = new Array();
    fil[0] = new nlobjSearchFilter('custrecord_pss_shipment_parent', null, 'is', recId);
    var col = new Array();
    col[0] = new nlobjSearchColumn('custrecord_pss_hazmat');
    col[1] = new nlobjSearchColumn('custrecord_pss_nmfc_number');
    col[2] = new nlobjSearchColumn('custrecord_nmfc_short_desc_line');
    col[3] = new nlobjSearchColumn('custrecord_pss_packagetype');
    col[4] = new nlobjSearchColumn('custrecord_pss_pkgnumber');
    col[5] = new nlobjSearchColumn('custrecord_pss_weight');
    col[6] = new nlobjSearchColumn('custrecord_pss_nmfc_number_line');
    var packages = nlapiSearchRecord('customrecord_pss_shipment_line', null, fil, col);
    for (var x = 0; x < packages.length; x++) {
        pkgcount.push(packages[x].getValue('custrecord_pss_pkgnumber'));
    }
    var pkgcnt = Math.max.apply(null, pkgcount);
    var message = '';
    var origZip = parentShipment.getFieldValue('custrecord_pss_shipper_zip');
    var destZip = parentShipment.getFieldValue('custrecord_pss_consignee_zip');
    var shipmentDate = parentShipment.getFieldValue('custrecord_pss_ship_date');
    var shipDirection = parentShipment.getFieldText('custrecord_pss_shipment_type');
    var billType = parentShipment.getFieldText('custrecord_pss_billing_type');

    var formDate = new Date(shipmentDate).toISOString();
    //basic auth elements
    var url = 'https://dev.ltlship.com/API/Rating/V1/Rating.asmx';
    var shipperid = '1376';
    var username = 'wsaccess';
    var pword = 'b8q3Fwxg';
    var acckey = '77ddac33-ec06-4894-8e16-9421875577af';
    //start well formed xml object
    var xmlEnvelope = '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" ';
    xmlEnvelope += 'SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">';
    xmlEnvelope += '<SOAP-ENV:Body>';

    var xmlhead = '<RateShipment xmlns="http://cerasis.ltlship.com/API/Rating/V1/Rating/"><RateRequest><AccessRequest>';
    xmlhead += '<ShipperID>' + shipperid + '</ShipperID>';
    xmlhead += '<Username>' + username + '</Username>';
    xmlhead += '<Password>' + pword + '</Password>';
    xmlhead += '<AccessKey>' + acckey + '</AccessKey>';
    xmlhead += '</AccessRequest>'

    var requestxml = '<Request>';
    requestxml += '<Direction>' + shipDirection + '</Direction>';
    requestxml += '<BillingType>' + billType + '</BillingType>';
    requestxml += '<Carrier>' + 'Rateshop' + '</Carrier>';
    requestxml += '<ShipDate>' + formDate + '</ShipDate>';
    //requestxml += '<Accessorials>';
    //requestxml += '<Accessorial>';
    //requestxml += '<AccessorialCode>' + accessorialCode[i] + '</AccessorialCode>';
    //requestxml += '</Accessorial>';
    //requestxml += '</Accessorials>';

    var destinationxml = '<Destination>';
    destinationxml += '<Name>' + 'Andy Reeder' + '</Name>';
    destinationxml += '<Address1>' + 'North Ave NW' + '</Address1>';
    destinationxml += '<Address2>' + 'null' + '</Address2>';
    destinationxml += '<Address3>' + 'null' + '</Address3>';
    destinationxml += '<City>' + 'Orlando' + '</City>';
    destinationxml += '<State>' + 'FL' + '</State>';
    destinationxml += '<PostalCode>' + '32809' + '</PostalCode>';
    destinationxml += '<Country>' + 'US' + '</Country>';
    destinationxml += '<Contact>' + 'Andy Reeder' + '</Contact>';
    destinationxml += '<EmailAddress>' + 'andy.reeder@priority-logistics.com' + '</EmailAddress>';
    destinationxml += '<Fax>' + 'null' + '</Fax>';
    destinationxml += '<Phone>' + '9139917281' + '</Phone>';
    destinationxml += '<Reference>' + '8675099' + '</Reference>';
    destinationxml += '<ResidentialDelivery>false</ResidentialDelivery>';
    //destinationxml += '<EmergencyContactName>' + destemergencyname + '</EmergencyContactName>';
    //destinationxml += '<EmergencyContactNumber>' + destemergencyphone + '</EmergencyContactNumber>';
    //destinationxml += '<EmergencyAgentContractNumber>' + emergencyagentphone + '</EmergencyAgentContractNumber>';
    destinationxml += '</Destination>';

    var Originxml = '<Origin>';
    Originxml += '<Name>' + 'Hole Products' + '</Name>';
    Originxml += '<Address1>' + '6448 Pinecastle Boulevard' + '</Address1>';
    Originxml += '<Address2>' + 'Suite 105' + '</Address2>';
    Originxml += '<Address3>' + 'null' + '</Address3>';
    Originxml += '<City>' + 'Orlando' + '</City>';
    Originxml += '<State>' + 'FL' + '</State>';
    Originxml += '<PostalCode>' + '32809' + '</PostalCode>';
    Originxml += '<Country>' + 'US' + '</Country>';
    Originxml += '<Contact>' + 'Hole Products' + '</Contact>';
    Originxml += '<EmailAddress>' + 'info@holeproducts.com' + '</EmailAddress>';
    Originxml += '<Fax>' + 'null' + '</Fax>';
    Originxml += '<Phone>' + '18009991345' + '</Phone>';
    Originxml += '<Reference>' + '8675099' + '</Reference>';
    Originxml += '<ResidentialDelivery>false</ResidentialDelivery>';
    //Originxml += '<EmergencyContactName>' + origemergencyname + '</EmergencyContactName>';
    //Originxml += '<EmergencyContactNumber>' + origemergencyphone + '</EmergencyContactNumber>';
    //Originxml += '<EmergencyAgentContractNumber>' + emergencyagentphone + '</EmergencyAgentContractNumber>';
    Originxml += '</Origin>';

    var detailsxml = '<Details>';
    detailsxml += '<Detail>';
    detailsxml += '<Class>' + '60' + '</Class>';
    detailsxml += '<Weight>' + '515' + '</Weight>';
    detailsxml += '<Quantity>' + '2' + '</Quantity>';
    detailsxml += '<Height>' + '12' + '</Height>';
    detailsxml += '<Length>' + '12' + '</Length>';
    detailsxml += '<Width>' + '12' + '</Width>';
    detailsxml += '<Unit>' + 'Pallet' + '</Unit>';
    detailsxml += '<Hazmat>false</Hazmat>';
    detailsxml += '<Commodity>';
    detailsxml += '<Description>' + 'Pallet' + '</Description>';
    detailsxml += '<NMFCCode>' + 'null' + '</NMFCCode>';
    detailsxml += '<Class>' + '60' + '</Class>';
    detailsxml += '<HazardousMaterial>false</HazardousMaterial>';
    detailsxml += '<HazmatDescription1>' + 'null' + '</HazmatDescription1>';
    detailsxml += '<HazmatDescription2>' + 'null' + '</HazmatDescription2>';
    detailsxml += '<HazmatDescription3>' + 'null' + '</HazmatDescription3>';
    detailsxml += '<HazmatClass>' + 'null' + '</HazmatClass>';
    detailsxml += '<HazmatSubClass>' + 'null' + '</HazmatSubClass>';
    detailsxml += '<HazMatPackagingClass>' + 'null' + '</HazMatPackagingClass>';
    detailsxml += '<HazmatTechnicalName>' + 'null' + '</HazmatTechnicalName>';
    detailsxml += '<HazmatZone>' + 'null' + '</HazmatZone>';
    detailsxml += '<HazmatDetailDescription>' + 'null' + '</HazmatDetailDescription>';
    detailsxml += '<HazmatSpecialProvision>' + 'null' + '</HazmatSpecialProvision>';
    detailsxml += '<HazmatSpecialProvExpDate>' + 'null' + '</HazmatSpecialProvExpDate>';
    detailsxml += '<UNIdentificationNumber>' + 'null' + '</UNIdentificationNumber>';
    detailsxml += '<ERGGuidePage>' + 'null' + '</ERGGuidePage>';
    detailsxml += '<ContactName>' + 'null' + '</ContactName>';
    detailsxml += '<ContactNumber>' + 'null' + '</ContactNumber>';
    detailsxml += '<BolDescription1>' + 'Test Pallet' + '</BolDescription1>';
    detailsxml += '<BolDescription2>' + 'null' + '</BolDescription2>';
    detailsxml += '<BolDescription3>' + 'null' + '</BolDescription3>';
    detailsxml += '</Commodity>';
    detailsxml += '</Detail>';
    detailsxml += '</Details>';

    var dimsxml = '<Dimensions>';
    dimsxml += '<Dimension>';
    dimsxml += '<Quantity>' + '1' + '</Quantity>';
    dimsxml += '<Height>' + '12' + '</Height>';
    dimsxml += '<Width>' + '12' + '</Width>';
    dimsxml += '<Length>' + '12' + '</Length>';
    dimsxml += '</Dimension>';
    dimsxml += '<Dimension>';
    dimsxml += '<Quantity>' + '1' + '</Quantity>';
    dimsxml += '<Height>' + '12' + '</Height>';
    dimsxml += '<Width>' + '12' + '</Width>';
    dimsxml += '<Length>' + '12' + '</Length>';

    dimsxml += '</Dimension>';
    dimsxml += '</Dimensions></Request></RateRequest></RateShipment >';

    var closurexml = '</SOAP-ENV:Body></SOAP-ENV:Envelope>'

    //compile all xml elements
    var finalxml = xmlEnvelope + xmlhead + requestxml + Originxml + destinationxml + detailsxml + dimsxml + closurexml;

    nlapiLogExecution('DEBUG', 'GetRates', 'Send Request: ' + url);
    message = nlapiRequestURL(url, finalxml, null, null); //calling the service
    nlapiLogExecution('DEBUG', 'BeforeRequestSent', 'Request XML: ' + finalxml);
    var respObj = message.getBody();
    nlapiLogExecution('DEBUG', 'Response String', 'Response String: ' + respObj);
  	return respObj;
    /*//NS Built in XMLDoc Generator
    //var respdoc = nlapiStringToXML(respObj);
    //var respCarrier = respdoc.getElementsByTagName('Carrier');
    var scacCodes = new Array();
    var carrierName = new Array();
    var shipRate = new Array();
    var shipType = new Array();
    var transDays = new Array();

    var parser = new DOMParser();
    var xml = parser.parseFromString(respObj, "text/xml");
    var jsonObj = xmlToJson(xml);
    nlapiLogExecution('DEBUG', 'XML Parse To JSON', 'Completed!');

    for (var key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
            console.log(key + " -> " + jsonObj[key]);
        }
    }
    //console.log(jsonObj);
    //for (i = 0; i < parseInt(obj.length) ; i++) {
    //let accessorialCodes = obj[i].AccessorialCharges.AccessorialCode;
    //let accessorialRates = obj[i].AccessorialCharges.AccessorialRate;
    //let carrier = obj[i].CarrierName;
    //let TotalShipmentCost = obj[i].TotalShipmentCost;
    //let CarrierQuoteNo = obj[i].CarrierQuoteNo;
    //let CarrierType = obj[i].CarrierType;
    //let Discount = obj[i].Discount;
    //let DiscountRate = obj[i].DiscountRate;
    //let ErrorMessage = obj[i].ErrorMessage;
    //let FuelSurcharge = obj[i].FuelSurcharge;
    //let GrossCharge = obj[i].GrossCharge;
    //let LaneName = obj[i].LaneName;
    //let NetCharge = obj[i].NetCharge;
    //let PaymentType = obj[i].PaymentType;
    //let SAASQuoteNumber = obj[i].SAASQuoteNumber;
    //let SCAC = obj[i].SCAC;
    //let ServiceLevelDescription = obj[i].ServiceLevelDescription;
    //let TransitDays = obj[i].TransitDays;
    //let RateType = obj[i].RateType;
    //let accessorialsRated = accessorialCodes + ',' + accessorialRates;
    //print the values of the selected nodes
    //for(i = 0; i < respCarrier.length; i++){
    //	scacCodes.push(respCarrier[i].childNodes[0].textContent);
    //}*/
}
function xmlToJson(xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};