/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
 *@NModuleScope Public
 *Habit 5
 *Author - Addison Regnier
 */

define(["N/encode", "N/runtime", 'N/ui/serverWidget', 'N/url', 'N/http', 'N/https', 'N/record', 'N/search'], rlRates);

function rlRates(request, response){
    var recId = request.getParameter('reqId');
    var batId = request.getParameter('batchId');


//1.0
// var parentShipment = nlapiLoadRecord('customrecord_h5_shipment', recId);
//   var originZip = parentShipment.getFieldValue('custrecord_h5_shipper_zip');
//   var countryCode = parentShipment.getFieldValue('custrecord_h5_shipper_country');
//   var destinationZip = parentShipment.getFieldValue('custrecord_h5_consignee_zip');


//2.0
var shipmentRecord = record.load({
    type: 'customrecord_h5_shipment',
       id: 9,
       isDynamic: false                       
   });
    var originZip = shipmentRecord.getValue({
        fieldId: "custrecord_h5_shipper_zip"
    });
    var countryCode = shipmentRecord.getValue({
        fieldId: "custrecord_h5_shipper_country"
    });
    var destinationZip = shipmentRecord.getValue({
        fieldId: "custrecord_h5_consignee_zip"
    });

    var pkgcount = [];
  var pkgFreightClass = [];
  var pkgWeight = [];

  var shipLines = search.create({
    type: "customrecord_h5_shipment_line",
    filters:
    [
       ["custrecord_h5_shipment_parent","anyof","9"]
    ],
    columns:
    [
       search.createColumn({
          name: "id",
          sort: search.Sort.ASC
       }),
       "custrecord_h5_pkgnumber",
       "custrecord_h5_pallet_count",
       "custrecord_h5_piece_count",
       "custrecord_h5_packagetype",
       "custrecord_h5_ship_line_item_desc",
       "custrecord_h5_nmfc_number_line",
       "custrecord_h5_freight_class_value",
       "custrecord_h5_weight",
       "custrecord_h5_length",
       "custrecord_h5_width",
       "custrecord_h5_height",
       "custrecord_h5_shipment_parent",
       "custrecord_h5_pcf"
    ]
 });
var myResultSet = shipLines.run();




 var searchResultCount = customrecord_h5_shipment_lineSearchObj.runPaged().count;
 log.debug("customrecord_h5_shipment_lineSearchObj result count",searchResultCount);
 customrecord_h5_shipment_lineSearchObj.run().each(function(result){
    // .run().each has a limit of 4,000 results
    return true;
 });
 
 var pkgWeight2 = 0;
 for (var x = 0; x < customrecord_h5_shipment_lineSearchObj.length; x++) {
     pkgcount.push(customrecord_h5_shipment_lineSearchObj[x].getValue('custrecord_h5_pkgnumber'));
     pkgFreightClass.push(customrecord_h5_shipment_lineSearchObj[x].getValue('custrecord_h5_freight_class_value'));
     pkgWeight2 += Number(customrecord_h5_shipment_lineSearchObj[x].getValue('custrecord_h5_weight'));
 }
 var weight = pkgWeight2;
 var freightClass = 0;
 for (i = 0; i < pkgFreightClass.length; i++) {
     if (freightClass < Number(pkgFreightClass[i])) {
         freightClass = Number(pkgFreightClass[i])
     }
 }


var originZip = 66226;
var countryCode = 'US';
var destinationZip = 81001;
//countryCode = 'US';
var freightClass = 55;
var weight = 1000;
var accessorialXML = '';



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
 xml += '<DeclaredValue>100.00</DeclaredValue>';
 xml += '<Accessorials>';
 xml += accessorialXML;
 xml += '</Accessorials>';
 xml += '</request>';
 xml += '</GetRateQuote>';
 xml += '</soapenv:Body>';
 xml += '</soapenv:Envelope>';
//nlapiLogExecution('debug', 'after xml formed', xml);

var response = https.post({
    url: 'https://api.rlcarriers.com/1.0.3/RateQuoteService.asmx',
    body: xml
});

var parser; 
var xmlDoc;
var text = response.body;
parser = new DOMParser();
xmlDoc = parser.parseFromString(text,"text/xml");
xmlToJson(xmlDoc);
// var bookNode = xml.XPath.select({
//     node : xmlDocument,
//     xpath : "//*[name()='GetRateQuoteResult']"
// });

//var xmlbody = nlapiSelectNode(returnXml, "//*[name()='GetRateQuoteResult']");

var jsonbody = xmlToJson(xmlbody);
var chargeType = [];
    var chargeTitle = [];
    var chargeWeight = [];
    var chargeRate = [];
    var chargeAmount = [];
    for (z=0;z<jsonbody.Result.Charges.Charge.length;z++){
        chargeType.push(jsonbody.Result.Charges.Charge[z].Type["#text"]);
        chargeTitle.push(jsonbody.Result.Charges.Charge[z].Title["#text"]);
        chargeWeight.push(jsonbody.Result.Charges.Charge[z].Weight["#text"]);
        chargeRate.push(jsonbody.Result.Charges.Charge[z].Rate["#text"]);
        // chargeAmount.push(jsonbody.Result.Charges.Charge[z].Amount["#text"]);
        var amtTemp1 = jsonbody.Result.Charges.Charge[z].Amount["#text"];
        if (amtTemp1 === undefined){
            amtTemp3 = '0.00';
        } else {
            var amtTemp2 = amtTemp1.replace("$", "");
            var amtTemp3 = amtTemp2.replace(",", "");

        }
        chargeAmount.push(amtTemp3);
    }
    for (i=0;i<chargeType.length;i++){
        if (chargeType[i] == "GROSS"){var GROSS = chargeAmount[i]}
        if (chargeType[i] == "DISCNT"){var DISCNT = chargeAmount[i]}
        if (chargeType[i] == "DISCNF"){var DISCNF = chargeAmount[i]}
        if (chargeType[i] == "FUEL"){var FUEL = chargeAmount[i]}
        if (chargeType[i] == "NET"){var NET = chargeAmount[i]}
    }
    var serviceLevelTitle = jsonbody.Result.ServiceLevels.ServiceLevel[0].Title["#text"];
    var serviceLevelCode = jsonbody.Result.ServiceLevels.ServiceLevel[0].Code["#text"];
    var serviceLevelQuoteNumber = jsonbody.Result.ServiceLevels.ServiceLevel[0].QuoteNumber["#text"];
    var serviceLevelDays = jsonbody.Result.ServiceLevels.ServiceLevel[0].ServiceDays["#text"];
    var serviceLevelNetCharge = jsonbody.Result.ServiceLevels.ServiceLevel[0].NetCharge["#text"];
    var serviceLevelNetChargeFixed = serviceLevelNetCharge.replace("$", "");




    //var ratePassObj = nlapiCreateRecord('customrecord_h5_ratepass_line');
    ratePassObj.setFieldValue('custrecord_h5_scac', 'RLCA');
    ratePassObj.setFieldValue('custrecord_h5_ratepass_carrier', 'R+L Carriers API');
    ratePassObj.setFieldValue('custrecord_h5_transit_days', serviceLevelDays);
    ratePassObj.setFieldValue('custrecord_h5_total_shipment_cost', serviceLevelNetChargeFixed);
    ratePassObj.setFieldValue('custrecord_h5_carrier_quote_num', serviceLevelQuoteNumber);
    ratePassObj.setFieldValue('custrecord_h5_service_level_desc', serviceLevelTitle);
    ratePassObj.setFieldValue('custrecord_h5_ratepass_shipment_id', recId);
    ratePassObj.setFieldValue('custrecord_h5_batch_id', batId);
    ratePassObj.setFieldValue('custrecord_h5_gross_charge', GROSS);
    ratePassObj.setFieldValue('custrecord_h5_discount', DISCNT);
    ratePassObj.setFieldValue('custrecord_h5_netcharge', DISCNF);
    ratePassObj.setFieldValue('custrecord_h5_fuel_surcharge', FUEL);
    ratePassObj.setFieldValue('custrecord_h5_accessorial_total', (Number(NET) - Number(FUEL) - Number(DISCNF)));
    ratePassObj.setFieldValue('custrecord_h5_ratepass_total_cost', serviceLevelNetChargeFixed);
    ratePassObj.setFieldValue('custrecord_h5_total_shipment_cost', serviceLevelNetChargeFixed);
   // var newRatePassId = nlapiSubmitRecord(ratePassObj);

    var ratePassLineRecord = record.create({
        type: 'customrecord_h5_ratepass_line',
        isDynamic: false                       
    });
    ratePassLineRecord.setValue({
        fieldId: 'custrecord_h5_scac',
        value: 'RLCA'
   });
   ratePassLineRecord.setValue({
    fieldId: 'custrecord_h5_ratepass_carrier',
    value: 'R+L Carriers API'
});
ratePassLineRecord.setValue({
    fieldId: 'custrecord_h5_transit_days',
    value: serviceLevelDays
});
ratePassLineRecord.setValue({
    fieldId: 'custrecord_h5_total_shipment_cost',
    value: serviceLevelNetChargeFixed
});
ratePassLineRecord.setValue({
    fieldId: 'custrecord_h5_carrier_quote_num',
    value: serviceLevelQuoteNumber
});
ratePassLineRecord.setValue({
    fieldId: 'custrecord_h5_service_level_desc',
    value: serviceLevelTitle
});
ratePassLineRecord.setValue({
    fieldId: 'custrecord_h5_ratepass_shipment_id',
    value: recId
});
ratePassLineRecord.setValue({
    fieldId: 'custrecord_h5_batch_id',
    value: batId
});
ratePassLineRecord.setValue({
    fieldId: 'custrecord_h5_gross_charge',
    value: GROSS
});
ratePassLineRecord.setValue({
    fieldId: 'custrecord_h5_discount',
    value: DISCNT
});
ratePassLineRecord.setValue({
    fieldId: 'custrecord_h5_netcharge',
    value: DISCNF
});
ratePassLineRecord.setValue({
    fieldId: 'custrecord_h5_fuel_surcharge',
    value: FUEL
});
ratePassLineRecord.setValue({
    fieldId: 'custrecord_h5_accessorial_total',
    value: (Number(NET) - Number(FUEL) - Number(DISCNF))
});
ratePassLineRecord.setValue({
    fieldId: 'custrecord_h5_ratepass_total_cost',
    value: serviceLevelNetChargeFixed
});
ratePassLineRecord.setValue({
    fieldId: 'custrecord_h5_total_shipment_cost',
    value: serviceLevelNetChargeFixed
});


var recordId = ratePassLineRecord.save({
    enableSourcing: true,
}); 




/////////////////////////////////////////////////////




function xmlToJson(xmlDoc) {

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
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
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