//generate Rate Request and sends to

//SaaS transportation
function getRatepass(request, response) {
    //get parent record
    var recId = request.getParameter('reqURL');
    var batId = request.getParameter('batchId');
    nlapiLogExecution('DEBUG', 'CallAWSBox', '--Begin RatePass Batch Number--' + batId);
    var palletVolume = palletCalc();
    nlapiLogExecution('DEBUG', 'The pallet volume is: ' + palletVolume);
    //var FX = 24;
    //var RL = 34;
    //var UP = 37;
    var parentShipment = nlapiLoadRecord('customrecord_h5_shipment', recId);
    var pkgcount = new Array();
    var fil = new Array();
        fil[0] = new nlobjSearchFilter('custrecord_h5_shipment_parent', null, 'is', recId);
    var col = new Array();
        col[0] = new nlobjSearchColumn('custrecord_h5_hazmat');
        col[1] = new nlobjSearchColumn('custrecord_h5_nmfc_number');
        col[2] = new nlobjSearchColumn('custrecord_h5_nmfc_short_desc_line');
        col[3] = new nlobjSearchColumn('custrecord_h5_packagetype');
        col[4] = new nlobjSearchColumn('custrecord_h5_pkgnumber');
        col[5] = new nlobjSearchColumn('custrecord_h5_weight');
        col[6] = new nlobjSearchColumn('custrecord_h5_nmfc_number_line');
        col[7] = new nlobjSearchColumn('custrecord_h5_pallet_count');
    var packages = nlapiSearchRecord('customrecord_h5_shipment_line', null, fil, col);
        for (var x = 0; x < packages.length; x++){
        pkgcount.push(packages[x].getValue('custrecord_h5_pallet_count'));
        }
    var pkgcnt = Math.max.apply(null,pkgcount);
    var message = '';
    var originZip = parentShipment.getFieldValue('custrecord_h5_shipper_zip');
    var trimOriginZip = originZip.split(' ').join('');
    nlapiLogExecution('DEBUG', 'fix Canada zip', 'original ' + originZip + ' new ' + trimOriginZip);
    var origCity = parentShipment.getFieldValue('custrecord_h5_shipper_city');
    var destinationZip =parentShipment.getFieldValue('custrecord_h5_consignee_zip');
    var destCity =parentShipment.getFieldValue('custrecord_h5_consignee_city');
    var origEnt = parentShipment.getFieldValue('custrecord_h5_shipper');
    var destEnt = parentShipment.getFieldValue('custrecord_h5_consignee');
    //var origCity = nlapiLookupField('customer', origEnt, 'city');
    //var destCity = nlapiLookupField('customer', destEnt, 'city');
    var profileCode = 'SD68R';
    var clientCode = 'SD688';
    var shipmentDate = parentShipment.getFieldValue('custrecord_h5_ship_date');
    //URL of end point
    var url = "http://ec2-52-33-148-2.us-west-2.compute.amazonaws.com/api/Rates?";
      url += "&originZip=" + trimOriginZip;
        url += "&orginCity=" + origCity;
      url += "&destinationZip=" + destinationZip;
        url += "&destinationCity=" + destCity;
      url += "&profileCode=" + profileCode;
      url += "&clientCode=" + clientCode;
      url += "&shipmentDate=" + shipmentDate;
  
    //Get any shipments
    var shipments = GetShipmentLinesByShipmentID(recId);
    //Now build the strings to pass
    var weights = '';
    var classes = '';
    weights = CreateStringFromArray(shipments, 'Weight');
    classes = CreateStringFromArray(shipments, 'Class');
  
    url += "&weight=" + weights;
    url += "&shipmentClass=" + classes;
    var accessorials = GetAccessorials(parentShipment);
    url += "&accessorials=" + accessorials;
    url += "&palletCount=" + pkgcnt;
  
    nlapiLogExecution('DEBUG', 'GetRates', 'Send Request: ' + url);
    message = nlapiRequestURL(url); //calling the service
    nlapiLogExecution('DEBUG', 'BeforeRequestSent', 'Requesting Record ID: ' + recId);
    //nlapiSendEmail(26408,'april.withers@priority-logistics.com','Customer Requested Rates for '+recId,url);
    var obj = JSON.parse(message.getBody());
    var rates = (message.getBody());
      for (i = 0; i < parseInt(obj.length) ; i++) {
          var accessorialCodes = obj[i].AccessorialCharges.AccessorialCode;
          var accessorialRates = obj[i].AccessorialCharges.AccessorialRate;
          var carrier = obj[i].CarrierName;
          var TotalShipmentCost = obj[i].TotalShipmentCost;
          var CarrierQuoteNo = obj[i].CarrierQuoteNo;
          var CarrierType = obj[i].CarrierType;
          var Discount = obj[i].Discount;
          var DiscountRate = obj[i].DiscountRate;
          var ErrorMessage = obj[i].ErrorMessage;
          var FuelSurcharge = obj[i].FuelSurcharge;
          var GrossCharge = obj[i].GrossCharge;
          var LaneName = obj[i].LaneName;
          var NetCharge = obj[i].NetCharge;
          var PaymentType = obj[i].PaymentType;
          var SAASQuoteNumber = obj[i].SAASQuoteNumber;
          var SCAC = obj[i].SCAC;
          var ServiceLevelDescription = obj[i].ServiceLevelDescription;
          var TransitDays = obj[i].TransitDays;
          var RateType = obj[i].RateType;
          var accessorialsRated = accessorialCodes + ',' + accessorialRates;
          var rateLine = nlapiCreateRecord('customrecord_h5_ratepass_line');
            rateLine.setFieldValue('custrecord_h5_batch_id', batId);
          rateLine.setFieldValue('custrecord_h5_ratepass_shipment_id', recId);
          rateLine.setFieldValue('custrecord_h5_ratepass_id', i + 1);
          rateLine.setFieldValue('custrecord_h5_carrier_quote_num', CarrierQuoteNo);
          rateLine.setFieldValue('custrecord_h5_discount', Discount);
          rateLine.setFieldValue('custrecord_h5_discount_rate', DiscountRate);
          rateLine.setFieldValue('custrecord_h5_error_message', ErrorMessage);
          rateLine.setFieldValue('custrecord_h5_fuel_surcharge', FuelSurcharge);
          rateLine.setFieldValue('custrecord_h5_gross_charge', GrossCharge);
          rateLine.setFieldValue('custrecord_h5_lane_name', LaneName);
          rateLine.setFieldValue('custrecord_h5_netcharge', NetCharge);
          rateLine.setFieldValue('custrecord_h5_payment_type', PaymentType);
          rateLine.setFieldValue('custrecord_h5_saas_quote_num', SAASQuoteNumber);
          rateLine.setFieldValue('custrecord_h5_scac', SCAC);
          rateLine.setFieldValue('custrecord_h5_service_level_desc', ServiceLevelDescription);
          rateLine.setFieldValue('custrecord_h5_total_shipment_cost', TotalShipmentCost);
          rateLine.setFieldValue('custrecord_h5_transit_days', TransitDays);
          rateLine.setFieldValue('custrecord_h5_ratepass_carrier', carrier);
          rateLine.setFieldValue('custrecord_h5_ratepass_total_cost', TotalShipmentCost);
          rateLine.setFieldValue('custrecord_h5_ratepass_origin_zip', originZip);
          rateLine.setFieldValue('custrecord_h5_ratepass_destination_zip', destinationZip);
          rateLine.setFieldValue('custrecord_h5_ratepass_pf_code', profileCode);
          rateLine.setFieldValue('custrecord_h5_ratepass_client_code', clientCode);
          rateLine.setFieldValue('custrecord_h5_acc_rated', accessorialsRated);
          rateLine.setFieldValue('custrecord_h5_CarrierType', CarrierType);
          /*if(SCAC = 'FXNL'){
          rateLine.setFieldValue('custrecord_h5_ratepass_vendor', FX);
        }
        if(SCAC = 'RLCA'){
            rateLine.setFieldValue('custrecord_h5_ratepass_vendor', RL);
        }
      if(SCAC = 'UPGF'){
            rateLine.setFieldValue('custrecord_h5_ratepass_vendor', UP);
        };*/
          nlapiSubmitRecord(rateLine);
      }
    nlapiLogExecution('DEBUG', 'RatePass Created!', message.getBody());
    nlapiLogExecution('DEBUG', 'AfterRequestSent', message.getCode());
    return message.getCode();
  }
  //Function we want to call
  function P44getRatepass(request, response) {
    //get parent record
    var recId = request.getParameter('requrl');
    var batId = request.getParameter('batid');
    var parentShipment = nlapiLoadRecord('customrecord_h5_shipment', recId);
    var pkgcount = [];
    var nmfcNum = [];
    var nmfcShortLine = [];
    var pkgFreightClass = [];
    var packType = [];
    var pkgNumber = [];
    var pkgWeight = [];
    var pkgnmfcLineNum = [];
    var pkgLength = [];
    var pkgWidth = [];
    var pkgHeight = [];
    var fil = [];
        fil[0] = new nlobjSearchFilter('custrecord_h5_shipment_parent', null, 'is', recId);
    var col = [];
        col[0] = new nlobjSearchColumn('custrecord_h5_hazmat');
        col[1] = new nlobjSearchColumn('custrecord_h5_nmfc_number');
        col[2] = new nlobjSearchColumn('custrecord_h5_freight_class_value');
        col[3] = new nlobjSearchColumn('custrecord_h5_packagetype');
        col[4] = new nlobjSearchColumn('custrecord_h5_pkgnumber');
        col[5] = new nlobjSearchColumn('custrecord_h5_weight');
        col[6] = new nlobjSearchColumn('custrecord_h5_nmfc_number_line');
          col[7] = new nlobjSearchColumn('custrecord_h5_length');
          col[8] = new nlobjSearchColumn('custrecord_h5_width');
          col[9] = new nlobjSearchColumn('custrecord_h5_height');
    var packages = nlapiSearchRecord('customrecord_h5_shipment_line', null, fil, col);
        for (var x = 0; x < packages.length; x++){
        pkgcount.push(packages[x].getValue('custrecord_h5_pkgnumber'));
        pkgFreightClass.push(packages[x].getValue('custrecord_h5_freight_class_value'));
        pkgWeight.push(packages[x].getValue('custrecord_h5_weight'));
        pkgLength.push(packages[x].getValue('custrecord_h5_length'));
        pkgWidth.push(packages[x].getValue('custrecord_h5_width'));
        pkgHeight.push(packages[x].getValue('custrecord_h5_height'));
        }
    var pkgcnt = Math.max.apply(null,pkgcount);
    //generate Base64 credential key
    var creds = 'priority.prod@p-44.com:Prirate18';
    var enCreds = nlapiEncrypt(creds, 'base64');
    //p44 endPoint URL for Rating
    var url = 'https://cloud.p-44.com/api/v3/quotes/rates/query';
    //setting request headers
    var headers = [];
    headers['Authorization'] = 'Basic ' + enCreds;
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
    //get Origin and Destination Info
    //var originEntId = parentShipment.getFieldValue('custrecord_h5_shipper');
    //var originEnt = nlapiLoadRecord('vendor', originEntId);
    var originCountry = parentShipment.getFieldValue('custrecord_h5_shipper_country');
    var originZip = parentShipment.getFieldValue('custrecord_h5_shipper_zip');
    var origAddr1 = parentShipment.getFieldValue('custrecord_h5_shipper_addr1');
    var origCity = parentShipment.getFieldValue('custrecord_h5_shipper_city');
    var origState = parentShipment.getFieldValue('custrecord_h5_shipper_state');
    //var destEntId = parentShipment.getFieldValue('custrecord_h5_consignee');
    //var destEnt = nlapiLoadRecord('customer', destEntId);
      var consigneeAddressee = parentShipment.getFieldValue('custrecord_h5_consignee_addree');
      var consigneeAddr1 = parentShipment.getFieldValue('custrecord_h5_consingee_addr1');
      var consigneeCity = parentShipment.getFieldValue('custrecord_h5_consignee_city');
      var consigneeState = parentShipment.getFieldValue('custrecord_h5_consignee_state');
      var consigneeZip = parentShipment.getFieldValue('custrecord_h5_consignee_zip');
      var consigneeCountry = parentShipment.getFieldValue('custrecord_h5_consignee_country');
    //var destZip = parentShipment.getFieldValue('custrecord_h5_consignee_zip');
    //var destAddr1 = parentShipment.getFieldValue('custrecord_h5_consingee_addr1');
    //var destCity = parentShipment.getFieldValue('custrecord_h5_consignee_city');
    //var destState = parentShipment.getFieldValue('custrecord_h5_consignee_state');
    var shipmentDate = parentShipment.getFieldValue('custrecord_h5_ship_date');
    var linItems = [];
    for (var y = 0; y < packages.length; y++){
          linItems.push({"freightClass": pkgFreightClass[y], "totalWeight": pkgWeight[y], "packageDimensions": {"length": pkgLength[y], "width": pkgWidth[y], "height": pkgHeight[y]}});
    }
    var accessorials = GetP44Accessorials(parentShipment);
    var jPayload = {
    "originAddress": {
      "postalCode": originZip,
      "addressLines":[
        origAddr1
      ],
      "city": origCity,
      "state": origState,
      "country": originCountry
    },
    "destinationAddress": {
      "postalCode": consigneeZip,
      "addressLines":[
          consigneeAddr1
      ],
      "city": consigneeCity,
      "state": consigneeState,
      "country": consigneeCountry
    },
    "lineItems": linItems,
    "capacityProviderAccountGroup":{
      "code": ""
    },
    "accessorialServices": accessorials,
    "apiConfiguration":{
      "timeout": 20,
      "enableUnitConversion": false,
      "accessorialServiceConfiguration": {
          "fetchAllServiceLevels": false,
          "fetchAllGuaranteed": false,
          "fetchAllExcessiveLength": false,
          "fetchAllInsideDelivery": false,
          "allowUnacceptedAccessorials": true
      },
      "fallBackToDefaultAccountGroup": false
      }
    }
  
    var strPayload = JSON.stringify(jPayload);
    nlapiLogExecution('DEBUG', 'Payload', strPayload);
    nlapiLogExecution('DEBUG', 'BeforeRequestSent', 'Requesting Record ID: ' + recId);
    var response = nlapiRequestURL(url, strPayload, headers, 'POST');
    nlapiLogExecution('DEBUG', 'Response', response.getBody());
    var obj = response.getBody();
    var respObj = JSON.parse(obj);
    var rates = respObj.rateQuotes;
    nlapiLogExecution('DEBUG', 'Post Request Processing', rates[0].rateQuoteDetail.total);
    //This is looped through the response and get indivual rates and create rate passes
    nlapiLogExecution('DEBUG', 'Number of Rates Created', rates.length + ' rates created.' );
    var TotalShipmentCost = [];
    var CarrierQuoteNo = [];
    var SCAC = [];
    var TransitDays = [];
    var serviceLevel = [];
    for (i = 0; i < rates.length; i++) {
      if (rates[i].hasOwnProperty('rateQuoteDetail')){
        //var accessorialCodes = obj.rateQuote[i].AccessorialCharges.AccessorialCode;
        //var accessorialRates = obj.rateQuote[i].AccessorialCharges.AccessorialRate;
        //var carrier = obj.rateQuote[i].CarrierName;
        TotalShipmentCost.push(rates[i].rateQuoteDetail.total);
        CarrierQuoteNo.push(rates[i].capacityProviderQuoteNumber);
        //var CarrierType = obj.rateQuote[i].CarrierType;
        //var Discount = obj.rateQuote[i].Discount;
        //var DiscountRate = obj.rateQuote[i].DiscountRate;
        //var ErrorMessage = obj.rateQuote[i].ErrorMessage;
        //var FuelSurcharge = obj.rateQuote[i].FuelSurcharge;
        //var GrossCharge = obj.rateQuote[i].GrossCharge;
        //var LaneName = obj.rateQuote[i].LaneName;
        //var NetCharge = obj.rateQuote[i].NetCharge;
        //var PaymentType = obj.rateQuote[i].PaymentType;
        //SAASQuoteNumber = rates[i].capacityProviderQuoteNumber;
        SCAC.push(rates[i].carrierCode);
        serviceLevel.push(rates[i].serviceLevel.description);
      if (rates[i].hasOwnProperty('transitDays')){TransitDays.push(rates[i].transitDays);} else {TransitDays.push(0);}
        //var RateType = obj.rateQuote[i].RateType;
        var accessorialsRated = '';//accessorialCodes + ',' + accessorialRates;
        nlapiLogExecution('DEBUG', 'Addison Debugging Line 290');
        var rateLine = nlapiCreateRecord('customrecord_h5_ratepass_line');
        rateLine.setFieldValue('custrecord_h5_batch_id', batId);
        rateLine.setFieldValue('custrecord_h5_ratepass_shipment_id', recId);
        rateLine.setFieldValue('custrecord_h5_ratepass_id', i + 1);
        rateLine.setFieldValue('custrecord_h5_carrier_quote_num', CarrierQuoteNo[i]);
        //rateLine.setFieldValue('custrecord_h5_discount', Discount);
        //rateLine.setFieldValue('custrecord_h5_discount_rate', DiscountRate);
        //rateLine.setFieldValue('custrecord_h5_error_message', ErrorMessage);
        //rateLine.setFieldValue('custrecord_h5_fuel_surcharge', FuelSurcharge);
        //rateLine.setFieldValue('custrecord_h5_gross_charge', GrossCharge);
        //rateLine.setFieldValue('custrecord_h5_lane_name', LaneName);
        //rateLine.setFieldValue('custrecord_h5_netcharge', NetCharge);
        //rateLine.setFieldValue('custrecord_h5_payment_type', PaymentType);
        //rateLine.setFieldValue('custrecord_h5_saas_quote_num', SAASQuoteNumber);
        rateLine.setFieldValue('custrecord_h5_scac', SCAC[i]);
        nlapiLogExecution('DEBUG', 'Addison Debugging Line 306');
        rateLine.setFieldValue('custrecord_h5_service_level_desc', serviceLevel[i]);
        rateLine.setFieldValue('custrecord_h5_total_shipment_cost', TotalShipmentCost[i]);
      
        rateLine.setFieldValue('custrecord_h5_transit_days', TransitDays[i]);
        //rateLine.setFieldValue('custrecord_h5_ratepass_carrier', carrier);
        rateLine.setFieldValue('custrecord_h5_ratepass_total_cost', TotalShipmentCost[i]);
        rateLine.setFieldValue('custrecord_h5_ratepass_origin_zip', originZip);
        rateLine.setFieldValue('custrecord_h5_ratepass_destination_zip', consigneeZip);
        //rateLine.setFieldValue('custrecord_h5_ratepass_pf_code', profileCode);
        //rateLine.setFieldValue('custrecord_h5_ratepass_client_code', clientCode);
        //rateLine.setFieldValue('custrecord_h5_acc_rated', accessorialsRated);
        //rateLine.setFieldValue('custrecord_h5_CarrierType', CarrierType);
        nlapiLogExecution('DEBUG', 'Before rateline submit  319');
        nlapiSubmitRecord(rateLine);
        nlapiLogExecution('DEBUG', 'After rateline submit  321');
      }
      }
    nlapiLogExecution('DEBUG', 'RatePass Created!', response.getBody());
    nlapiLogExecution('DEBUG', 'AfterRequestSent', response.getCode());
    return response.getCode();
  }
  
  function CHRgetRatepass(request, response) {
      //get parent record
      var recId = request.getParameter('requrl');
      var batId = request.getParameter('batid');
      var parentShipment = nlapiLoadRecord('customrecord_h5_shipment', recId);
      var linePkgNumber = [];
      var linePalletCount = [];
      var linePieceCount = [];
      var linePackageType = [];
      var lineDesc = [];
      var lineFrtClass = [];
      var lineWeight = [];
      var lineLength = [];
      var lineWidth = [];
      var lineHeight = [];
      var lineHazmat = [];
      var lineNMFC = [];
      var lineInventoryUnits = [];
      var fil = [];
      fil[0] = new nlobjSearchFilter('custrecord_h5_shipment_parent', null, 'is', recId);
      var col = [];
      col[0] = new nlobjSearchColumn('custrecord_h5_pkgnumber');
      col[1] = new nlobjSearchColumn('custrecord_h5_pallet_count');
      col[2] = new nlobjSearchColumn('custrecord_h5_piece_count');
      col[3] = new nlobjSearchColumn('custrecord_h5_packagetype');
      col[4] = new nlobjSearchColumn('custrecord_h5_ship_line_item_desc');
      col[5] = new nlobjSearchColumn('custrecord_h5_freight_class_value');
      col[6] = new nlobjSearchColumn('custrecord_h5_weight');
      col[7] = new nlobjSearchColumn('custrecord_h5_length');
      col[8] = new nlobjSearchColumn('custrecord_h5_width');
      col[9] = new nlobjSearchColumn('custrecord_h5_height');
      col[10] = new nlobjSearchColumn('custrecord_h5_hazmat');
      col[11] = new nlobjSearchColumn('custrecord_h5_nmfc_number');
      col[12] = new nlobjSearchColumn('custrecord_h5_inventoryunits');
      var packages = nlapiSearchRecord('customrecord_h5_shipment_line', null, fil, col);
      for (var x = 0; x < packages.length; x++){
          linePkgNumber.push(packages[x].getValue('custrecord_h5_pkgnumber'));
          linePalletCount.push(packages[x].getValue('custrecord_h5_pallet_count'));
          linePieceCount.push(packages[x].getValue('custrecord_h5_piece_count'));
          linePackageType.push(packages[x].getValue('custrecord_h5_packagetype'));
          lineDesc.push(packages[x].getValue('custrecord_h5_ship_line_item_desc'));
          lineFrtClass.push(packages[x].getValue('custrecord_h5_freight_class_value'));
          lineWeight.push(packages[x].getValue('custrecord_h5_weight'));
          lineLength.push(packages[x].getValue('custrecord_h5_length'));
          lineWidth.push(packages[x].getValue('custrecord_h5_width'));
          lineHeight.push(packages[x].getValue('custrecord_h5_height'));
          lineHazmat.push(packages[x].getValue('custrecord_h5_hazmat'));
          lineNMFC.push(packages[x].getValue('custrecord_h5_nmfc_number'));
          lineInventoryUnits.push(packages[x].getValue('custrecord_h5_inventoryunits'));
      }
      var pkgcnt = Math.max.apply(null,linePkgNumber);
  
      var originCountry = parentShipment.getFieldValue('custrecord_h5_shipper_country');
      var originZip = parentShipment.getFieldValue('custrecord_h5_shipper_zip');
      var origAddr1 = parentShipment.getFieldValue('custrecord_h5_shipper_addr_1');
      var origCity = parentShipment.getFieldValue('custrecord_h5_shipper_city');
      var origState = parentShipment.getFieldValue('custrecord_h5_shipper_state');
      //var destEntId = parentShipment.getFieldValue('custrecord_h5_consignee');
      //var destEnt = nlapiLoadRecord('customer', destEntId);
      var consigneeAddressee = parentShipment.getFieldValue('custrecord_h5_consignee_addree');
      var consigneeAddr1 = parentShipment.getFieldValue('custrecord_h5_consignee_addr1');
      var consigneeCity = parentShipment.getFieldValue('custrecord_h5_consignee_city');
      var consigneeState = parentShipment.getFieldValue('custrecord_h5_consignee_state');
      var consigneeZip = parentShipment.getFieldValue('custrecord_h5_consignee_zip');
      var consigneeCountry = parentShipment.getFieldValue('custrecord_h5_consignee_country');
      var shipmentDate = parentShipment.getFieldValue('custrecord_h5_ship_date');
      var formDate = new Date(shipmentDate).toISOString();
      var origLiftGate = parentShipment.getFieldValue('custrecord_h5_orig_chr_liftgate');
      if (origLiftGate === 'T'){origLiftGate = 'true'} else {origLiftGate = 'false'}
      var origInsidePickup = parentShipment.getFieldValue('custrecord_h5_orig_chr_insidepickup');
      if (origInsidePickup === 'T'){origInsidePickup = 'true'} else {origInsidePickup = 'false'}
      var origInsideDelivery = parentShipment.getFieldValue('custrecord_h5_orig_chr_insidedelivery');
      if (origInsideDelivery === 'T'){origInsideDelivery = 'true'} else {origInsideDelivery = 'false'}
      var origResidential = parentShipment.getFieldValue('custrecord_h5_orig_chr_residential');
      if (origResidential === 'T'){origResidential = 'true'} else {origResidential = 'false'}
      var origLimitedAccess = parentShipment.getFieldValue('custrecord_h5_orig_chr_limitedaccess');
      if (origLimitedAccess === 'T'){origLimitedAccess = 'true'} else {origLimitedAccess = 'false'}
      var origConstruction = parentShipment.getFieldValue('custrecord_h5_orig_chr_construction');
      if (origConstruction === 'T'){origConstruction = 'true'} else {origConstruction = 'false'}
      var destLiftGate = parentShipment.getFieldValue('custrecord_h5_dest_chr_liftgate');
      if (destLiftGate === 'T'){destLiftGate = 'true'} else {destLiftGate = 'false'}
      var destInsidePickup = parentShipment.getFieldValue('custrecord_h5_dest_chr_insidepickup');
      if (destInsidePickup === 'T'){destInsidePickup = 'true'} else {destInsidePickup = 'false'}
      var destInsideDelivery = parentShipment.getFieldValue('custrecord_h5_dest_chr_insidedelivery');
      if (destInsideDelivery === 'T'){destInsideDelivery = 'true'} else {destInsideDelivery = 'false'}
      var destResidential = parentShipment.getFieldValue('custrecord_h5_dest_chr_residential');
      if (destResidential === 'T'){destResidential = 'true'} else {destResidential = 'false'}
      var destLimitedAccess = parentShipment.getFieldValue('custrecord_h5_dest_chr_limitedaccess');
      if (destLimitedAccess === 'T'){destLimitedAccess = 'true'} else {destLimitedAccess = 'false'}
      var destConstruction = parentShipment.getFieldValue('custrecord_h5_dest_chr_construction');
      if (destConstruction === 'T'){destConstruction = 'true'} else {destConstruction = 'false'}
      var refAtPickup = parentShipment.getFieldValue('custrecord_h5_reference_pickup');
      var refAtDestination = parentShipment.getFieldValue('custrecord_h5_reference_delivery');
      var shipperLoc = parentShipment.getFieldValue('custrecord_h5_location');
      var customerCodeCHR = nlapiLookupField('location',shipperLoc, 'custrecord_h5_chr_accountnumber');
      var shipmentName = parentShipment.getFieldValue('name');
      var declaredValue = parentShipment.getFieldValue('custrecord_h5_shiprec_declared_value');
      // var accessorials = GetCHRAccessorials(parentShipment);
      //var CHRAccessorials = parentShipment.getFieldValue('custrecord_h5_accessorials');
  
      var linItems = [];
      for (var y = 0; y < packages.length; y++){
          linItems.push(
              {
                  "description": lineDesc[y],
                  "freightClass": lineFrtClass[y],
                  "actualWeight": lineWeight[y],
                  "weightUnit": "Pounds",
                  "length": lineLength[y],
                  "width": lineWidth[y],
                  "height": lineHeight[y],
                  "linearUnit": "Inches",
                  "pallets": linePalletCount[y],
                  "pieces": lineInventoryUnits[y],
                  "declaredValue": declaredValue,
                  "packagingCode": "PCS",
                  "nmfc": lineNMFC[y],
              }
          )
      }
      //CH Robinson Rates
      //   first get token
      var creds = 'mikekoch:HolePro54401';
      var enCreds = nlapiEncrypt(creds, 'base64');
      var authPayLoad = {
          "client_id": "0pIloP13Xpe5EwZhXRnmGutyiIdp67US",
          "client_secret": "1CqsiJaOVWAJln0zFEdqRcmeK4hXqh3_-WV6qVIlsOhXFvuXBPQLj_P8qXZyVXBh",
          "audience": "https://inavisphere.chrobinson.com",
          "grant_type": "client_credentials"
      }
      var authURL = 'https://api.navisphere.com/v1/oauth/token';
      var authHeaders = [];
      authHeaders['Content-Type'] = 'application/json';
      authHeaders['Authorization'] = 'Basic ' + enCreds;
      authHeaders['Accept'] = 'application/json';
      var authResponse = nlapiRequestURL(authURL, authPayLoad, null, 'POST');
      var obj = authResponse.getBody();
      var respObj = JSON.parse(obj);
      var token = respObj.access_token;
      var tokenType = respObj.token_type;
      // now get rates using that token
  
      var url = 'https://api.navisphere.com/v1/quotes';
      var authToken = token;
      nlapiLogExecution('DEBUG', 'Auth Successful', tokenType);
      // var url = 'https://api.navisphere.com/v1/quotes';
      // var authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik56SkdNVGcyUWpWRE1EQXlPRVJHUmpjeE1UWkNNa1pET1VZME9VVTNSamswUVRreFJEY3dOZyJ9.eyJpc3MiOiJodHRwczovL2FwcC1hdXRoLmNocm9iaW5zb24uY29tLyIsInN1YiI6IjBwSWxvUDEzWHBlNUV3WmhYUm5tR3V0eWlJZHA2N1VTQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2luYXZpc3BoZXJlLmNocm9iaW5zb24uY29tIiwiaWF0IjoxNTU2NTQ2MDAyLCJleHAiOjE1NTY2MzI0MDIsImF6cCI6IjBwSWxvUDEzWHBlNUV3WmhYUm5tR3V0eWlJZHA2N1VTIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.YJcavj92uHDv0Xrnh2mxaPYrt0z1M0psxRE1i4oMnesco7PIRJfuzPjK03jWjKiX8gB27d1e878hecM0g-haHRNvXSxxJn0ZEBHgYVyGAvH0F9Rd4aWMNLg4SIDyD4Xwkv00JadsTdKPUeGcabKGNXQDGwSIMJEKP1XDFVrZwa9Tb9PgRUCJKj83Gob-lwgBGFM7PVngIoIVBLOZTz8PrVNDN6U4ZU3I1PN-cfw-fumMsIl6t-uQe8GM8tI2NVFIDN4AzqUGjzTgFU0Sz13yo9n_kYeCv9cHWlH-ddkwgH4itPCHZDDoxA-PbyjRr-x7VdQALPFs8YJaxNmTMkaPmA';
      //setting request headers
      var headers = [];
      headers['Authorization'] = 'Bearer ' + authToken;
      headers['Content-Type'] = 'application/json';
      headers['Accept'] = 'application/json';
      var jPayLoad = {
          "items": linItems,
          "origin": {
              "locationName": "Hole Products",
              "address1": origAddr1,
              "city": origCity,
              "stateProvinceCode": origState,
              "countryCode": originCountry,
              "postalCode": originZip,
              "specialRequirement": {
                  "liftGate": origLiftGate,
                  "insidePickup": origInsidePickup,
                  "insideDelivery": origInsideDelivery,
                  "residentialNonCommercial": origResidential,
                  "limitedAccess": origLimitedAccess,
                  "tradeShoworConvention": "false",
                  "constructionSite": origConstruction,
                  "dropOffAtCarrierTerminal": "false",
                  "pickupAtCarrierTerminal": "false"
              },
              "referenceNumbers": [{
                  "type": "ORD",
                  "value": refAtPickup
              }]
          },
          "destination": {
              "locationName": consigneeAddressee,
              "address1": consigneeAddr1,
              "city": consigneeCity,
              "stateProvinceCode": consigneeState,
              "countryCode": consigneeCountry,
              "postalCode": consigneeZip,
              "specialRequirement": {
                  "liftGate": destLiftGate,
                  "insidePickup": destInsidePickup,
                  "insideDelivery": destInsideDelivery,
                  "residentialNonCommercial": destResidential,
                  "limitedAccess": destLimitedAccess,
                  "tradeShoworConvention": "false",
                  "constructionSite": destConstruction,
                  "dropOffAtCarrierTerminal": "false",
                  "pickupAtCarrierTerminal": "false"
              },
              "referenceNumbers": [{
                  "type": "PO",
                  "value": refAtDestination
              }]
          },
          "shipDate": formDate,
          "customerCode": customerCodeCHR,
          "transportModes": [{
              "mode": "LTL"
          }],
          "referenceNumbers": [{
              "type": "SHID",
              "value": shipmentName
          }]
      }
      var strPayload = JSON.stringify(jPayLoad);
      nlapiLogExecution('debug', 'strPayload sent', strPayload);
      var response = nlapiRequestURL(url, strPayload, headers, 'POST');
      var obj = response.getBody();
      nlapiLogExecution('debug', 'response returned', obj);
      //nlapiSendEmail(18052,'robert.regnier@priority-logistics.com','CHR rate pass json',obj,null,null,null,null,'true');
      var respObj = JSON.parse(obj);
  
      if (respObj.statusCode === 400){
          alert("**Message from CH Robinson ** Code " + respObj.statusCode + ":" + respObj.message);
      } else {
  
          var rates = respObj.quoteSummaries;
          var SCAC = [];
          var carrierName = [];
          var CarrierQuoteNo = [];
          var TotalShipmentCost = [];
          var TransitDays = [];
          var originServiceLevel = [];
          var destinationServiceLevel = [];
          var totalAccessorialCharge = [];
          for (i = 0; i < rates.length; i++) {
              if (rates[i].hasOwnProperty('carrier')) {
                  SCAC.push(rates[i].carrier.scac);
                  carrierName.push(rates[i].carrier.carrierName);
                  CarrierQuoteNo.push(rates[i].quoteId.toString());
                  TotalShipmentCost.push(rates[i].totalCharge);
                  TransitDays.push(rates[i].transit.minimumTransitDays);
                  originServiceLevel.push(rates[i].transit.originService);
                  destinationServiceLevel.push(rates[i].transit.destinationService);
                  totalAccessorialCharge.push(rates[i].totalAccessorialCharge);
              }
              var rateLine = nlapiCreateRecord('customrecord_h5_ratepass_line');
              rateLine.setFieldValue('custrecord_h5_batch_id', batId);
              rateLine.setFieldValue('custrecord_h5_ratepass_shipment_id', recId);
              rateLine.setFieldValue('custrecord_h5_ratepass_id', i + 1);
              rateLine.setFieldValue('custrecord_h5_carrier_quote_num', CarrierQuoteNo[i]);
              rateLine.setFieldValue('custrecord_h5_scac', SCAC[i]);
              rateLine.setFieldValue('custrecord_h5_ratepass_carrier', carrierName[i]);
              rateLine.setFieldValue('custrecord_h5_service_level_desc', destinationServiceLevel[i]);
              rateLine.setFieldValue('custrecord_h5_total_shipment_cost', TotalShipmentCost[i]);
              rateLine.setFieldValue('custrecord_h5_transit_days', TransitDays[i]);
              rateLine.setFieldValue('custrecord_h5_fuel_surcharge', totalAccessorialCharge[i]);
              rateLine.setFieldValue('custrecord_h5_ratepass_total_cost', TotalShipmentCost[i]);
              rateLine.setFieldValue('custrecord_h5_ratepass_origin_zip', originZip);
              rateLine.setFieldValue('custrecord_h5_ratepass_destination_zip', consigneeZip);
              rateLine.setFieldValue('custrecord_h5_lane_name', 'CH Robinson');
              nlapiSubmitRecord(rateLine);
          }
          nlapiLogExecution('DEBUG', 'RatePass Created!', 'rate passes created');
          nlapiLogExecution('DEBUG', 'CHR Response Code', response.getCode());
          return response.getCode();
      }
  }
  
  //Returned Ratepass list for selection
  function ratePasslist(request, response){
    var list = nlapiCreateList('Requested Rates','editor');
    var r = nlapiSearchRecord('customrecord_h5_ratepass_line', 'customsearch_pri_ratepass_view', null, null);
      if(r!=null){
        var columns = r[0].getAllColumns();
          for(var i=0; i<columns.length; i++){
      list.addColumn(columns[i].getName(), 'text', columns[i].getLabel());
                       }
                       list.addRows(r);
                 list.addButton('custpage_selectrate','Select Rate','testSelect()');
                }
     alert('Rating Completed!');
  }
  
  //Returns weight/classes for shipments
  function GetShipmentLinesByShipmentID(shipmentInternalID) {
    var shipmentLines = [];
    var results = nlapiSearchRecord("customrecord_h5_shipment_line", null,
      [
        ["custrecord_h5_shipment_parent.internalidnumber", "equalto", shipmentInternalID]
      ],
      [
        new nlobjSearchColumn("custrecord_h5_freight_class_value", null, null),
        new nlobjSearchColumn("custrecord_h5_weight", null, null),
      ]);
  
    for (var i = 0; results != null &&
      i < results.length; i++) {
      shipmentLines.push({
        "Weight": results[i].getValue('custrecord_h5_weight'),
        "Class": results[i].getValue('custrecord_h5_freight_class_value'),
      })
    }
  
  
    return shipmentLines;
  }
  
  //Builds a comma seperated string
  function CreateStringFromArray(arr, key) {
    return arr.map(function (obj) {
      return obj[key];
    }).join(',');
  }
  
  //Returns the accessorials selected by the user
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
            var finalSAArray = noUniStrSAIds.split(',');
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
            var craftedP44AssyObj = [];
            for (i = 0; i < selAccNamesPrnt.length; i++){
            craftedP44AssyObj.push({
              "code": selAccNamesPrnt[i]
            });
          }
        //var strAccNamesPrnt = selAccNamesPrnt.toString();
        return craftedP44AssyObj;
      }
  
  function GetP44Accessorials(parentShipment) {
      //Build the Accessorial Array
      var selAccessorialIds = [];
      var selAccessorials = parentShipment.getFieldValue('custrecord_h5_accessorials');
      for (k = 0; k < selAccessorials.length; k++){
          selAccessorialIds.push(selAccessorials[k]);
      }
      var strSAIds = selAccessorialIds.toString();
      var nocomStrSAIds = strSAIds.replace(/,/g,'');
      var noUniStrSAIds = nocomStrSAIds.replace(/\u0005/g,',');
      var finalSAArray = noUniStrSAIds.split(',');
      nlapiLogExecution('DEBUG','Selected Accessorials Started','Selected passed are: ' + noUniStrSAIds);
      if (selAccessorials != ''){
          var selAccNamesPrnt = [];
          var accFil = [];
          accFil[0] = new nlobjSearchFilter('internalid', null, 'anyof', finalSAArray);
          var accCol = [];
          accCol[0] = new nlobjSearchColumn('custrecord_h5_ratecode_e2');
          var selAccNames = nlapiSearchRecord('customrecord_h5_accessorials', null, accFil, accCol);
          for (y = 0; y < selAccNames.length; y++){
              selAccNamesPrnt.push(selAccNames[y].getValue('custrecord_h5_ratecode_e2'));
          }
      } else {var selAccNamesPrnt = '';}
      var craftedP44AssyObj = [];
      for (i = 0; i < selAccNamesPrnt.length; i++){
          craftedP44AssyObj.push({
              "code": selAccNamesPrnt[i]
          });
      }
      //var strAccNamesPrnt = selAccNamesPrnt.toString();
      return craftedP44AssyObj;
  }	
  
  //inactivate previous rates
  function RateCleanUp(recId){
    var fil = new Array();
      fil[0] = new nlobjSearchFilter('custrecord_h5_ratepass_shipment_id', null, 'is', recId);
      fil[1] = new nlobjSearchFilter('custrecord_h5_ratepass_selected', null, 'is', 'false');
    var col = new Array();
      col[0] = new nlobjSearchColumn('internalid');
      col[1] = new nlobjSearchColumn('isinactive');
     var searchresults = nlapiSearchRecord('customrecord_h5_ratepass_line', null, fil, col);
  
     for ( var i = 0; searchresults != null && i < searchresults.length; i++ ){
        var id = searchresults[i].getId();
        var ratepass = nlapiLoadRecord('customrecord_h5_ratepass_line', id);
        ratepass.setFieldValue('isinactive', 'T');
        nlapiSubmitRecord(ratepass);
     }
  
    nlapiLogExecution('DEBUG', 'Scheduled script cleaned up', 'Rates inactived' + searchresults.length);
  }