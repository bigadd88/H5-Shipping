function rlDispatch() {

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
    xml += '<BOLAccessorial>';
    xml += 'OriginLiftgate or DestinationLiftgate or InsidePickup or InsideDelivery or LimitedAccessPickup or LimitedAccessDelivery or FreezeProtection or DeliveryNotification';
    xml += '</BOLAccessorial>';
    xml += '</AdditionalServices>';
    xml += '' < !--required-- > ';'
    xml += '<ServiceLevel>';
    xml += 'StandardService or GuranteedService or GuaranteedByNoon or GuaranteedHourlyWindow or ExpeditedService or WeekendExpress';
    xml += '</ServiceLevel>';
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