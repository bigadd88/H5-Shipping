function rlRates(request, response) {
  nlapiLogExecution('debug', 'start of RL Carrier rate quote', '');
  var recId = request.getParameter('reqId');
  var batId = request.getParameter('batchId');
//testing variables
//end of testing variables
  var parentShipment = nlapiLoadRecord('customrecord_h5_shipment', recId);
  var originZip = parentShipment.getFieldValue('custrecord_h5_shipper_zip');
  var countryCode = parentShipment.getFieldValue('custrecord_h5_shipper_country');
  var destinationZip = parentShipment.getFieldValue('custrecord_h5_consignee_zip');
  var pkgcount = [];
  var pkgFreightClass = [];
  var pkgWeight = [];
  var packages = nlapiSearchRecord("customrecord_h5_shipment_line", null,
      [
          ["custrecord_h5_shipment_parent", "anyof", recId]
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
  var pkgWeight2 = 0;
  for (var x = 0; x < packages.length; x++) {
      pkgcount.push(packages[x].getValue('custrecord_h5_pkgnumber'));
      pkgFreightClass.push(packages[x].getValue('custrecord_h5_freight_class_value'));
      pkgWeight2 += Number(packages[x].getValue('custrecord_h5_weight'));
  }
  var weight = pkgWeight2;
  var freightClass = 0;
  for (i = 0; i < pkgFreightClass.length; i++) {
      if (freightClass < Number(pkgFreightClass[i])) {
          freightClass = Number(pkgFreightClass[i])
      }
  }
  var accessorials = GetAccessorials(parentShipment);
  var accessorialXML = '';
  for (a = 0; a < accessorials.length; a++) {
      accessorialXML += '<RQAccessorial>'+ accessorials[a] +'</RQAccessorial>';
  }

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
nlapiLogExecution('debug', 'after xml formed', xml);
  message = nlapiRequestURL(url, xml, null, null);
  nlapiRequestURL(url, postdata, headers, callback, httpMethod)

  
  var respObj = message.getBody();
  var returnXml = nlapiStringToXML(respObj);
  var xmlbody = nlapiSelectNode(returnXml, "//*[name()='GetRateQuoteResult']");
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
//create a record
  var ratePassObj = nlapiCreateRecord('customrecord_h5_ratepass_line');
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
  var newRatePassId = nlapiSubmitRecord(ratePassObj);

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

function GetAccessorials(parentShipment) {
  //Build the Accessorial Array
  var selAccessorialIds = [];
  var selAccessorials = parentShipment.getFieldValue('custrecord_h5_accessorials');
  for (k = 0; k < selAccessorials.length; k++){
      selAccessorialIds.push(selAccessorials[k]);
  }
  var strSAIds = selAccessorialIds.toString();
  var nocomStrSAIds = strSAIds.replace(/,/g,'');
  var noUniStrSAIds = nocomStrSAIds.replace(/\u0005/g,',');
  var finalSAArray = noUniStrSAIds.split('');
  nlapiLogExecution('DEBUG','Selected Accessorials Started','Selected passed are: ' + noUniStrSAIds);
  if (selAccessorials != ''){
      var selAccNamesPrnt = [];
      var accFil = [];
      accFil[0] = new nlobjSearchFilter('internalid', null, 'anyof', finalSAArray);
      var accCol = [];
      accCol[0] = new nlobjSearchColumn('custrecord_h5_ratecode_e1');
      var selAccNames = nlapiSearchRecord('customrecord_h5_accessorials', null, accFil, accCol);
      for (y = 0; y < selAccNames.length; y++){
          selAccNamesPrnt.push(selAccNames[y].getValue('custrecord_h5_ratecode_e1'));
      }
  } else {var selAccNamesPrnt = '';}
  return selAccNamesPrnt;
}


