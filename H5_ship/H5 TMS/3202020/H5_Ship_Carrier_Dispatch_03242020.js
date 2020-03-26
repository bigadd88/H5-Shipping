
nlapiLogExecution('debug', 'start of RL Carrier rate quote', '');
var recId = request.getParameter('reqId');
var batId = request.getParameter('batchId');

//Load shipment record to dom so you can get field values to send to R&L
var parentShipment = nlapiLoadRecord('customrecord_h5_shipment', 7);
var url = 'https://api.rlcarriers.com/sandbox/PickupRequestService.asmx'; //SANDBOX
var xml = '';


//Variables Loading up XML Request info
var apiKey = 'ItO0MjETNlYhIwMGUtYjIxOS00NTE4LWE5OTNWVlA4NjZ2J2C';
//#region Shipper Data
var shipperName = 'Line-X';
var shipperAddress1 = parentShipment.getFieldValue('custrecord_h5_shipper_address1');
var shipperAddress2 = parentShipment.getFieldValue('custrecord_h5_shipper_address2');
var isoCountry = parentShipment.getFieldValue('custrecord_h5_shipper_country');
var shipZipCode = parentShipment.getFieldValue('custrecord_h5_shipper_zip');
var shipCity = parentShipment.getFieldValue('custrecord_h5_shipper_city');
var shipState = parentShipment.getFieldValue('custrecord_h5_shipper_state');
var shipPhoneNumber = '8169061212';//parentShipment.getFieldValue('custrecord_h5_shipper_');
var shipPhoneExt = '243';//parentShipment.getFieldValue('custrecord_h5_shipper');
var shipContactName = 'Robert';//parentShipment.getFieldValue('custrecord_h5_shipper');
var shipContactEmail = 'robert@habit5.com';//parentShipment.getFieldValue('custrecord_h5_shipper');
//#endregion



//#region Contact Data
var contactName = 'Addison';
var contactCompanyName = 'Line-X';//parentShipment.getFieldValue();
var contactPhoneNumber = '8169061212';//parentShipment.getFieldValue();
var contactPhoneExt = '244';//parentShipment.getFieldValue();
var contactEmail = 'addison@habit5.com';//parentShipment.getFieldValue();
//#endregion

//#region Pickup Data
var pickupDate = parentShipment.getFieldValue('custrecord_h5_ship_date');
var pickupTime = '03:00 PM';
var pickupCloseTime = '05:00 PM';
var pickupAdditionalInstructions = 'None';
//#endregion

//#region LiftOrRoll, serviceLvl, hourlyWindow, linkedBolOrPdf
// var liftGateorNoRollUp1 = parentShipment.getFieldValue();
// var liftGateorNoRollUp2 = parentShipment.getFieldValue();
// var serviceLevel = parentShipment.getFieldValue();
// var hourlyWindowStart = parentShipment.getFieldValue();
// var hourlyWindowStart = parentShipment.getFieldValue();
// var exepditedQuoteNumber = parentShipment.getFieldValue();
// var linkedBolId = parentShipment.getFieldValue();
// var includeBol = parentShipment.getFieldValue();
// var includedBolPdf = parentShipment.getFieldValue();
//#endregion

//#region Desination
var destCountry = parentShipment.getFieldValue('custrecord_h5_consignee_addr1');
var destCode = parentShipment.getFieldValue('custrecord_h5_consignee_zip');
var destCity = parentShipment.getFieldValue('custrecord_h5_consignee_city');
var destState = parentShipment.getFieldValue('custrecord_h5_consignee_state');

//add loop to go through shipment lines to get total destWeight and destPieces
var destWeight = parentShipment.getFieldValue('custrecord_h5_shipper_address1');
var destPieces = parentShipment.getFieldValue('custrecord_h5_shipper_address1');
//#endregion
//adding test line for PUSH

//added testing line again



xml += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
xml += '<soap:Body>';
xml += '<CreatePickupRequest xmlns="http://www.rlcarriers.com/">';
xml += '<APIKey>' + apiKey + '</APIKey>';
xml += '<request>';
xml += '<Pickup>';
xml += '<Shipper>';
xml += '<Name>' + shipperName + '</Name>';
xml += '<AddressLine1>' + shipperAddress1 + '</AddressLine1>';
xml += '<AddressLine2>' + shipperAddress2 + '</AddressLine2>';
xml += '<ISO3Country>' + isoCountry + '</ISO3Country>';
xml += '<ZipCode>' + shipZipCode + '</ZipCode>';
xml += '<City>' + shipCity + '</City>';
xml += '<State>' + shipState + '</State>';
xml += '<PhoneNumber>' + shipPhoneNumber + '</PhoneNumber>';
xml += '<PhoneExtension>' + shipPhoneExt + '</PhoneExtension>';
xml += '<ContactName>' + shipContactName + '</ContactName>';
xml += '<ContactEmailAddress>' + shipContactEmail + '</ContactEmailAddress>';
xml += '</Shipper>';
xml += '<Contact>';
xml += '<Name>' + contactName + '</Name>';
xml += '<CompanyName>' + contactCompanyName + '</CompanyName>';
xml += '<PhoneNumber>' + contactPhoneNumber + '</PhoneNumber>';
xml += '<PhoneExtension>' + contactPhoneExt + '</PhoneExtension>';
xml += '<EmailAddress>' + contactEmail + '</EmailAddress>';
xml += '</Contact>';
xml += '<Destinations>';
xml += '<Destination>';
xml += '<ISO3Country>'+ destCountry +'</ISO3Country>';
xml += '<ZipCode>'+ destCode +'</ZipCode>';
xml += '<City>'+ destCity +'</City>';
xml += '<State>'+ destState +'</State>';
xml += '<Weight>'+ destWeight +'</Weight>';
xml += '<Pieces>'+ destPieces +'</Pieces>';
xml += '</Destination>';
xml += '</Destinations>';
xml += '<PickupInformation>';
xml += '<PickupDate>' + pickupDate + '</PickupDate>';
xml += '<ReadyTime>' + pickupTime + '</ReadyTime>';
xml += '<CloseTime>' + pickupCloseTime + '</CloseTime>';
xml += '<AdditionalInstructions>' + pickupAdditionalInstructions + '</AdditionalInstructions>';

xml += '<LoadAttributes>' + pickupDate + '</LoadAttributes>';
xml += '<LoadAttribute>' + pickupTime + '</LoadAttribute>';
xml += '</PickupInformation>';
xml += '<ServiceOptions>';
//xml += '<PURAccessorial>LiftGate or NoRollup</PURAccessorial>';
xml += '<PURAccessorial>LiftGate</PURAccessorial>';
xml += '</ServiceOptions>';
xml += '<ServiceLevel>StandardService</ServiceLevel>';
xml += '<HourlyWindow>';
xml += '<Start>01:00 PM</Start>';
xml += '<End>03:00 PM</End>';
xml += '</HourlyWindow>';
xml += '<ExpeditedQuoteNumber>1111</ExpeditedQuoteNumber>';
xml += '<LinkedBolId>22222</LinkedBolId>';
xml += '</Pickup>';
xml += '<IncludeBol>false</IncludeBol>';
xml += '<IncludeBolPdf>false</IncludeBolPdf>';
xml += '</request>';
xml += '</CreatePickupRequest>';
xml += '</soap:Body>';
xml += '</soap:Envelope>';

message = nlapiRequestURL(url, xml, null, null);