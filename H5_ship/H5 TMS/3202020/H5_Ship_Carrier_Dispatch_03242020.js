
nlapiLogExecution('debug', 'start of RL Carrier rate quote', '');
var recId = request.getParameter('reqId');
var batId = request.getParameter('batchId');

//Load shipment record to dom so you can get field values to send to R&L
var parentShipment = nlapiLoadRecord('customrecord_h5_shipment', recId);
var url = 'https://api.rlcarriers.com/sandbox/BillOfLadingService.asmx'; //SANDBOX
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
var contactName = parentShipment.getFieldValue('custrecord_h5_consignee');
var contactCompanyName = 'Line-X';//parentShipment.getFieldValue();
var contactPhoneNumber = '8169061212';//parentShipment.getFieldValue();
var contactPhoneExt = '244';//parentShipment.getFieldValue();
var contactEmail = 'addison@habit5.com';//parentShipment.getFieldValue();
//#endregion

//#region Pickup Data
var pickupDate;
var pickupTime;
var pickupCloseTime;
var pickupAdditionalInstructions;
//#endregion

//#region LiftOrRoll, serviceLvl, hourlyWindow, linkedBolOrPdf
var liftGateorNoRollUp1 = parentShipment.getFieldValue();
var liftGateorNoRollUp2 = parentShipment.getFieldValue();
var serviceLevel = parentShipment.getFieldValue();
var hourlyWindowStart = parentShipment.getFieldValue();
var hourlyWindowStart = parentShipment.getFieldValue();
var exepditedQuoteNumber = parentShipment.getFieldValue();
var linkedBolId = parentShipment.getFieldValue();
var includeBol = parentShipment.getFieldValue();
var includedBolPdf = parentShipment.getFieldValue();
//#endregion

//adding test line for PUSH

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
xml += '<Destination xsi:nil="true" />';
xml += '<Destination xsi:nil="true" />';
xml += '</Destinations>';
xml += '<PickupInformation>';
xml += '<PickupDate>' + pickupDate + '</PickupDate>';
xml += '<ReadyTime>' + pickupTime + '</ReadyTime>';
xml += '<CloseTime>' + pickupCloseTime + '</CloseTime>';
xml += '<AdditionalInstructions>' + pickupAdditionalInstructions + '</AdditionalInstructions>';
xml += '<LoadAttributes xsi:nil="true" />';
xml += '</PickupInformation>';
xml += '<ServiceOptions>';
xml += '<PURAccessorial>LiftGate or NoRollup</PURAccessorial>';
xml += '<PURAccessorial>LiftGate or NoRollup</PURAccessorial>';
xml += '</ServiceOptions>';
xml += '<ServiceLevel>StandardService or GuaranteedService or GuaranteedByNoon or GuaranteedHourlyWindow or ExpeditedService or WeekendExpress</ServiceLevel>';
xml += '<HourlyWindow>';
xml += '<Start>' + hourlyWindowStart + '</Start>';
xml += '<End>' + hourlyWindowEnd + '</End>';
xml += '</HourlyWindow>';
xml += '<ExpeditedQuoteNumber>' + exepditedQuoteNumber + '</ExpeditedQuoteNumber>';
xml += '<LinkedBolId>' + linkedBolId + '</LinkedBolId>';
xml += '</Pickup>';
xml += '<IncludeBol>' + includeBol + '</IncludeBol>';
xml += '<IncludeBolPdf>' + includedBolPdf + '</IncludeBolPdf>';
xml += '</request>';
xml += '</CreatePickupRequest>';
xml += '</soap:Body>';
xml += '</soap:Envelope>';