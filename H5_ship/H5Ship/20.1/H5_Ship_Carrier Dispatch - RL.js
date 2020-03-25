function rlDispatch() {
    var recId = request.getParameter('reqId');
    var batId = request.getParameter('batchId');

    var parentShipment = nlapiLoadRecord('customrecord_h5_shipment', recId);
    var shipperName = parentShipment.getFieldValue('custrecord_h5_shipper');
    var shipperEmail = parentShipment.getFieldValue('custrecord_h5_shipperEmail');
    var shipperAdd1 = parentShipment.getFieldValue('custrecord_h5_shipper_addr_1');
    var shipperAdd2 = parentShipment.getFieldValue('custrecord_h5_shipper_addrr_2');
    var shipperCountry = parentShipment.getFieldValue('custrecord_h5_shipper_country');
    var shipperZip = parentShipment.getFieldValue('custrecord_h5_shipper_zip');
    var shipperCity = parentShipment.getFieldValue('custrecord_h5_shipper_city');
    var shipperState = parentShipment.getFieldValue('custrecord_h5_shipper_state');
    var shipperPhoneNumber = parentShipment.getFieldValue('');
    var shipperPhoneNumberExt = parentShipment.getFieldValue('');

    var consName = parentShipment.getFieldValue('custrecord_h5_consignee');
    var consEmail = parentShipment.getFieldValue('custrecord_h5_consigneeEmail');
    var consAdd1 = parentShipment.getFieldValue('custrecord_h5_consignee_addr1');
    var consAdd2 = parentShipment.getFieldValue('custrecord_h5_consignee_addr2');
    var consCountry = parentShipment.getFieldValue('custrecord_h5_consignee_country');
    var consZip = parentShipment.getFieldValue('custrecord_h5_consignee_zip');
    var consCity = parentShipment.getFieldValue('custrecord_h5_consignee_city');
    var consState = parentShipment.getFieldValue('custrecord_h5_consignee_state');
    var consPhoneNumber = parentShipment.getFieldValue('');
    var consPhoneNumberExt = parentShipment.getFieldValue('');

    //bill to
    var billToName = parentShipment.getFieldValue('');
    var billToEmail = parentShipment.getFieldValue('');
    var billToEmailAddress = parentShipment.getFieldValue('');
    var billToAddress1 = parentShipment.getFieldValue('');
    var billToAddress2 = parentShipment.getFieldValue('');
    var billToCountry = parentShipment.getFieldValue('');
    var billToZip = parentShipment.getFieldValue('');
    var billToState = parentShipment.getFieldValue('');
    var billToCity = parentShipment.getFieldValue('');
    var billToPhoneNumber = parentShipment.getFieldValue('');
    var billToPhoneExt = parentShipment.getFieldValue('');

    //broker to
    var brokerToName = parentShipment.getFieldValue('');
    var brokerToEmail = parentShipment.getFieldValue('');
    var brokerToEmailAddress = parentShipment.getFieldValue('');
    var brokerToAddress1 = parentShipment.getFieldValue('');
    var brokerToAddress2 = parentShipment.getFieldValue('');
    var brokerToCountry = parentShipment.getFieldValue('');
    var brokerToZip = parentShipment.getFieldValue('');
    var brokerToState = parentShipment.getFieldValue('');
    var brokerToCity = parentShipment.getFieldValue('');
    var brokerToPhoneNumber = parentShipment.getFieldValue('');
    var brokerToPhoneExt = parentShipment.getFieldValue('');

    //remitCOD to
    var remitToName = parentShipment.getFieldValue('');
    var remitToEmail = parentShipment.getFieldValue('');
    var remitToEmailAddress = parentShipment.getFieldValue('');
    var remitToAddress1 = parentShipment.getFieldValue('');
    var remitToAddress2 = parentShipment.getFieldValue('');
    var remitToCountry = parentShipment.getFieldValue('');
    var remitToZip = parentShipment.getFieldValue('');
    var remitToState = parentShipment.getFieldValue('');
    var remitToCity = parentShipment.getFieldValue('');
    var remitToPhoneNumber = parentShipment.getFieldValue('');
    var remitToPhoneExt = parentShipment.getFieldValue('');
    var remitCodAmount = parentShipment.getFieldValue('');
    var remitCheckType = parentShipment.getFieldValue('');
    var remitFreeType = parentShipment.getFieldValue('');

    var accessorials = GetAccessorials(parentShipment);
    var accessorialXML = '';
    for (a = 0; a < accessorials.length; a++) {
        accessorialXML += '<BOLAccessorial>'+ accessorials[a] +'</BOLAccessorial>';
    }



    





//make API call to R&L Carriers
//     var url = 'https://api.rlcarriers.com/1.0.3/BillOfLadingService.asmx'; //LIVE
    var url = 'https://api.rlcarriers.com/sandbox/BillOfLadingService.asmx'; //SANDBOX
    var xml = '';
    xml += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
    xml += '<soap:Body>';
    xml += '<CreateBillOfLading xmlns="http://www.rlcarriers.com/">';
    xml += '<APIKey>ItO0MjETNlYhIwMGUtYjIxOS00NTE4LWE5OTNWVlA4NjZ2J2C</APIKey>';
    xml += '<request>';
    xml += '<BillOfLading>';
    xml += '' < !--required.Accepted date format MM / DD / YYYY-- > ';'
    xml += '<BOLDate>string</BOLDate>';
    xml += '' < !--required-- > ';'
    xml += '<Shipper>';
    xml += '' < !--required-- > ';'
    xml += '<Name>string</Name>';
    xml += '' < !--required-- > ';'
    xml += '<EmailAddress>string</EmailAddress>';
    xml += '' < !--required-- > ';'
    xml += '<AddressLine1>string</AddressLine1>';
    xml += '' < !--optional-- > ';'
    xml += '<AddressLine2>string</AddressLine2>';
    xml += '' < !--required-- > ';'
    xml += '<ISO3Country>string</ISO3Country>';
    xml += '' < !--required-- > ';'
    xml += '<ZipCode>string</ZipCode>';
    xml += '' < !--required-- > ';'
    xml += '<City>string</City>';
    xml += '' < !--Accepting state abbreviations-- > ';'
    xml += '<State>string</State>';
    xml += '' < !--required-- > ';'
    xml += '<PhoneNumber>string</PhoneNumber>';
    xml += '' < !--optional-- > ';'
    xml += '<PhoneExtension>string</PhoneExtension>';
    xml += '</Shipper>';
    xml += '' < !--required-- > ';'
    xml += '<Consignee>';
    xml += '' < !--required-- > ';'
    xml += '<Name>string</Name>';
    xml += '' < !--optional-- > ';'
    xml += '<EmailAddress>string</EmailAddress>';
    xml += '' < !--required-- > ';'
    xml += '<AddressLine1>string</AddressLine1>';
    xml += '' < !--optional-- > ';'
    xml += '<AddressLine2>string</AddressLine2>';
    xml += '' < !--required-- > ';'
    xml += '<ISO3Country>string</ISO3Country>';
    xml += '' < !--required-- > ';'
    xml += '<ZipCode>string</ZipCode>';
    xml += '' < !--required-- > ';'
    xml += '<City>string</City>';
    xml += '' < !--required-- > ';'
    xml += '<State>string</State>';
    xml += '' < !--optional-- > ';'
    xml += '<PhoneNumber>string</PhoneNumber>';
    xml += '' < !--optional-- > ';'
    xml += '<PhoneExtension>string</PhoneExtension>';
    xml += '' < !--optional-- > ';'
    xml += '<Attention>string</Attention>';
    xml += '</Consignee>';
    xml += '' < !--optional-- > ';'
    xml += '<BillTo>';
    xml += '<Name>string</Name>';
    xml += '<EmailAddress>string</EmailAddress>';
    xml += '<AddressLine1>string</AddressLine1>';
    xml += '<AddressLine2>string</AddressLine2>';
    xml += '<ISO3Country>string</ISO3Country>';
    xml += '<ZipCode>string</ZipCode>';
    xml += '<City>string</City>';
    xml += '<State>string</State>';
    xml += '<PhoneNumber>string</PhoneNumber>';
    xml += '<PhoneExtension>string</PhoneExtension>';
    xml += '</BillTo>';
    xml += '' < !--optional-- > ';'
    xml += '<Broker>';
    xml += '<Name>string</Name>';
    xml += '<EmailAddress>string</EmailAddress>';
    xml += '<AddressLine1>string</AddressLine1>';
    xml += '<AddressLine2>string</AddressLine2>';
    xml += '<ISO3Country>string</ISO3Country>';
    xml += '<ZipCode>string</ZipCode>';
    xml += '<City>string</City>';
    xml += '<State>string</State>';
    xml += '<PhoneNumber>string</PhoneNumber>';
    xml += '<PhoneExtension>string</PhoneExtension>';
    xml += '</Broker>';
    xml += '' < !--optional-- > ';'
    xml += '<RemitCOD>';
    xml += '<Name>string</Name>';
    xml += '<EmailAddress>string</EmailAddress>';
    xml += '<AddressLine1>string</AddressLine1>';
    xml += '<AddressLine2>string</AddressLine2>';
    xml += '<ISO3Country>string</ISO3Country>';
    xml += '<ZipCode>string</ZipCode>';
    xml += '<City>string</City>';
    xml += '<State>string</State>';
    xml += '<PhoneNumber>string</PhoneNumber>';
    xml += '<PhoneExtension>string</PhoneExtension>';
    xml += '<CODAmount>string</CODAmount>';
    xml += '<CheckType>Company or Certified</CheckType>';
    xml += '<FeeType>Prepaid or Collect</FeeType>';
    xml += '</RemitCOD>';
    xml += '' < !--optional-- > ';'
    xml += '<AdditionalServices>';
    
    xml += accessorialXML;

    xml += '</AdditionalServices>';

    xml += '<ServiceLevel>StandardService</ServiceLevel>';

    xml += '' < !--required if GuaranteedHourlyWindow is selected-- > ';'
    xml += '<HourlyWindow>';
    xml += '<Start>string</Start>';
    xml += '<End>string</End>';
    xml += '</HourlyWindow>';
    xml += '' < !--required if ExpeditedService is selected-- > ';'
    xml += '<ExpeditedQuoteNumber>string</ExpeditedQuoteNumber>';
    xml += '' < !--required minimum 1 item-- > ';'
    xml += '<Items>';
    xml += '<Item>';
    xml += '' < !--required-- > ';'
    xml += '<IsHazmat>boolean</IsHazmat>';
    xml += '' < !--required-- > ';'
    xml += '<Pieces>string</Pieces>';
    xml += '' < !--required-- > ';'
    xml += '<PackageType>BAG or BAR or BIN or BNDL or BOX or BSKT or BULK or CARBOY or COIL or CPT or CRT or CTN or CYL or DAC or DRM or GAY or IBC or JER or LSE or MLBG or NSTD or PAIL or PIG or PLT or RACK or REEL or ROLL or SKD or STK or TL or TANK or TOTE or UNIT</PackageType>';
    xml += '' < !--optional-- > ';'
    xml += '<NMFCItemNumber>string</NMFCItemNumber>';
    xml += '' < !--optional-- > ';'
    xml += '<NMFCClass>string</NMFCClass>';
    xml += '' < !--required-- > ';'
    xml += '<Class>string</Class>';
    xml += '' < !--required-- > ';'
    xml += '<Weight>string</Weight>';
    xml += '' < !--required-- > ';'
    xml += '<Description>string</Description>';
    xml += '</Item>';
    xml += '</Items>';
    xml += '' < !--required if any item is marked HazMat-- > ';'
    xml += '<HazmatInformation>';
    xml += '' < !--required-- > ';'
    xml += '<EmergenyNumber>string</EmergenyNumber>';
    xml += '' < !--optional-- > ';'
    xml += '<ContractNumber>string</ContractNumber>';
    xml += '' < !--optional-- > ';'
    xml += '<ContractHolder>string</ContractHolder>';
    xml += '</HazmatInformation>';
    xml += '' < !--optional-- > ';'
    xml += '<DeclaredValue>';
    xml += '<Value>string</Value>';
    xml += '<Per>string</Per>';
    xml += '</DeclaredValue>';
    xml += '' < !--optional-- > ';'
    xml += '<SpecialInstructions>string</SpecialInstructions>';
    xml += '' < !--optional-- > ';'
    xml += '<ReferenceNumbers>';
    xml += '<ShipperNumber>string</ShipperNumber>';
    xml += '<QuoteNumber>string</QuoteNumber>';
    xml += '<PONumber>string</PONumber>';
    xml += '</ReferenceNumbers>';
    xml += '' < !--required-- > ';'
    xml += '<FreightChargePaymentMethod>Prepaid or Collect</FreightChargePaymentMethod>';
    xml += '</BillOfLading>';
    xml += '' < !--required-- > ';'
    xml += '<AddPickupRequest>boolean</AddPickupRequest>';
    xml += '' < !--required if AddPickupRequest is true-- > ';'
    xml += '<PickupRequestInfo>';
    xml += '<PickupDate>string</PickupDate>';
    xml += '<ReadyTime>string</ReadyTime>';
    xml += '<CloseTime>string</CloseTime>';
    xml += '<AdditionalInstructions>string</AdditionalInstructions>';
    xml += '' < !--ContactName and CompanyName are required if any field is filled out-- > ';'
    xml += '<ThirdParty>';
    xml += '<ContactName>string</ContactName>';
    xml += '<CompanyName>string</CompanyName>';
    xml += '<PhoneNumber>string</PhoneNumber>';
    xml += '<PhoneExtension>string</PhoneExtension>';
    xml += '<EmailAddress>string</EmailAddress>';
    xml += '</ThirdParty>';
    xml += '</PickupRequestInfo>';
    xml += '</request>';
    xml += '</CreateBillOfLading>';
    xml += '</soap:Body>';
    xml += '</soap:Envelope>';

    message = nlapiRequestURL(url, xml, null, null);
    var respObj = message.getBody();
    var returnXml = nlapiStringToXML(respObj);
    var xmlbody = nlapiSelectNode(returnXml, "//*[name()='GetRateQuoteResult']");
    var jsonbody = xmlToJson(xmlbody);

}

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