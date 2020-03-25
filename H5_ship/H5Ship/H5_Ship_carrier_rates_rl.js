function rlRates(request, response){
    var recId = request.getParameter('reqId');
    nlapiLogExecution('debug', 'step 1 in BOL');
    var batId = request.getParameter('batchId');
    nlapiLogExecution('debug', 'step 2 in BOL');
    
  //  var recId = 1;
   // var batId = '123';

    var parentShipment = nlapiLoadRecord('customrecord_h5_shipment', recId);
    var originZip = parentShipment.getFieldValue('custrecord_h5_shipper_zip');
    var countryCode = parentShipment.getFieldValue('custrecord_h5_shipper_country');
    var destinationZip = parentShipment.getFieldValue('custrecord_h5_consignee_zip');
    nlapiLogExecution('debug', 'step 3 in BOL');
    var pkgcount = [];

    var pkgFreightClass = [];

    var pkgWeight = [];
    nlapiLogExecution('debug', 'step 4 in BOL');

    var packages = nlapiSearchRecord("customrecord_h5_shipment_line",null,
    [
       ["custrecord_h5_shipment_parent","anyof",recId]
    ], 
    [
       new nlobjSearchColumn("id").setSort(false), 
       new nlobjSearchColumn("custrecord_h5_pkgnumber"), 
       new nlobjSearchColumn("custrecord_h5_pallet_count"), 
       new nlobjSearchColumn("custrecord_h5_piece_count"), 
       new nlobjSearchColumn("custrecord_h5_packagetype"), 
       new nlobjSearchColumn("custrecord_h5_ship_line_item_desc"), 
       new nlobjSearchColumn("custrecord_h5_nmfc_number_line"), 
       new nlobjSearchColumn("custrecord_h5_freight_class_value"), 
       new nlobjSearchColumn("custrecord_h5_weight"), 
       new nlobjSearchColumn("custrecord_h5_length"), 
       new nlobjSearchColumn("custrecord_h5_width"), 
       new nlobjSearchColumn("custrecord_h5_height"), 
       new nlobjSearchColumn("custrecord_h5_shipment_parent"), 
       new nlobjSearchColumn("custrecord_h5_pcf")
    ]
    );
    nlapiLogExecution('debug', 'step 5 in BOL');


    var pkgWeight2 = 0;
        for (var x = 0; x < packages.length; x++){
        pkgcount.push(packages[x].getValue('custrecord_h5_pkgnumber'));
        //pkgFreightClass.push(Number(packages[x].getValue('custrecord_h5_freight_class_value')));
        pkgFreightClass.push(packages[x].getValue('custrecord_h5_freight_class_value'));

        //pkgWeight.push(Number(packages[x].getValue('custrecord_h5_weight')));
        pkgWeight2 += Number(packages[x].getValue('custrecord_h5_weight'));
        }

        //var weight = pkgWeight.reduce();

        var weight = pkgWeight2;
       // var frtClass = Math.max(pkgFreightClass);

       var freightClass = 0;
    for (i = 0; i < pkgFreightClass.length; i++) {
        if (freightClass < Number(pkgFreightClass[i])) {
            freightClass = Number(pkgFreightClass[i])
        }
    }
    nlapiLogExecution('debug', 'step 6 in BOL');

    


    
    // var originZip = '66227';
    // var countryCode = 'USA';
    // var destinationZip = '71671';
    // var frtClass = '50';
    // var weight = '1500';
    var url = 'https://api.rlcarriers.com/1.0.3/RateQuoteService.asmx';
    var xml = '';
    xml += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rlc="http://www.rlcarriers.com/">';
    xml += '<soapenv:Header/>';
    xml += '<soapenv:Body>';
    xml += '<GetRateQuote xmlns="http://www.rlcarriers.com/">';
    xml += '<APIKey>ItO0MjETNlYhIwMGUtYjIxOS00NTE4LWE5OTNWVlA4NjZ2J2C</APIKey>';
    xml += '<request>';
    xml += '<Origin>';
    xml += '<ZipOrPostalCode>' + originZip + '</ZipOrPostalCode>';
    xml += '<CountryCode>' + countryCode + '</CountryCode>';
    xml += '</Origin>';
    xml += '<Destination>';
    xml += '<ZipOrPostalCode>' + destinationZip + '</ZipOrPostalCode>';
    xml += '<CountryCode>' + countryCode + '</CountryCode>';
    xml += '</Destination>';
    xml += '<Items>';
    xml += '<Item>';
    xml += '<Class>' + freightClass + '</Class>';
    xml += '<Weight>' + weight + '</Weight>';
    xml += '</Item>';
    xml += '</Items>';
    xml += '</request>';
    xml += '</GetRateQuote>';
    xml += '</soapenv:Body>';
    xml += '</soapenv:Envelope>';
	
	message = nlapiRequestURL(url, xml, null, null); 
    var respObj = message.getBody();
    var returnXml = nlapiStringToXML(respObj);

    // var chargeAmount = nlapiSelectValues(returnXml, "//*[name()='Amount']");
    // var chargeType = nlapiSelectValues(returnXml, "//*[name()='Type']");
    // var chargeRate = nlapiSelectValues(returnXml, "//*[name()='Rate']");
    // var chargeTitle = nlapiSelectValues(returnXml, "//*[name()='Title']");
    // var serviceTitle = nlapiSelectValues(returnXml, "//*[name()='Title']");
     var serviceLevelNode = nlapiSelectNode(returnXml, "//*[name()='ServiceLevel']");

    var serviceLevelTitle = nlapiSelectValue(serviceLevelNode, "//*[name()='Title']");
    var serviceLevelCode = nlapiSelectValue(serviceLevelNode, "//*[name()='Code']");
    var serviceLevelQuoteNumber = nlapiSelectValue(serviceLevelNode, "//*[name()='QuoteNumber']");
    var serviceLevelDays = nlapiSelectValue(serviceLevelNode, "//*[name()='ServiceDays']");
    var serviceLevelNetCharge = nlapiSelectValue(serviceLevelNode, "//*[name()='NetCharge']");
// add replace to get rid of dollar sign

var serviceLevelNetChargeFixed = serviceLevelNetCharge.replace("$", "");

//create a record
var ratePassObj = nlapiCreateRecord('customrecord_h5_ratepass_line');
ratePassObj.setFieldValue('custrecord_h5_scac', 'RLCA');
ratePassObj.setFieldValue('custrecord_h5_transit_days', serviceLevelDays);
ratePassObj.setFieldValue('custrecord_h5_total_shipment_cost', serviceLevelNetChargeFixed);
ratePassObj.setFieldValue('custrecord_h5_carrier_quote_num', serviceLevelQuoteNumber);
ratePassObj.setFieldValue('custrecord_h5_service_level_desc', serviceLevelTitle);
ratePassObj.setFieldValue('custrecord_h5_ratepass_shipment_id', recId);
ratePassObj.setFieldValue('custrecord_h5_batch_id', batId);
ratePassObj.setFieldValue('custrecord_h5_ratepass_total_cost', serviceLevelNetChargeFixed);



var newRatePassId = nlapiSubmitRecord(ratePassObj);








}


