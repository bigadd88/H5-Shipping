//generate Rate Request and sends to
function getRatepass(request, response) {
  //get parent record
  var recId = request.getParameter('reqURL');
  var batId = request.getParameter('batchId');
  nlapiLogExecution('DEBUG', 'CallAWSBox', '--Begin RatePass Batch Number--' + batId);
  var palletVolume = palletCalc();
  nlapiLogExecution('DEBUG', 'The pallet voluem is: ' + palletVolume);
  //var FX = 24;
  //var RL = 34;
  //var UP = 37;
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
      for (var x = 0; x < packages.length; x++){
      pkgcount.push(packages[x].getValue('custrecord_pss_pkgnumber'));
      }
  var pkgcnt = Math.max.apply(null,pkgcount);
  var message = '';
  var originZip = parentShipment.getFieldValue('custrecord_pss_shipper_zip');
  var destinationZip =parentShipment.getFieldValue('custrecord_pss_consignee_zip');
  var origEnt = parentShipment.getFieldValue('custrecord_pss_shipper');
  var destEnt = parentShipment.getFieldValue('custrecord_pss_consignee');
  var origCity = nlapiLookupField('vendor', origEnt, 'city');
  var destCity = nlapiLookupField('customer', destEnt, 'city');
  var profileCode = 'SC38R';//PRIOR-KRFTR-SC70R-3fast-SC38R-holeSCA
  var clientCode = 'SC385';//PRILG-KRFT-SC705-3fast-SC385-holeSCA
  var shipmentDate = parentShipment.getFieldValue('custrecord_pss_ship_date');
  //URL of end point
  var url = "http://ec2-52-33-148-2.us-west-2.compute.amazonaws.com/api/Rates?";
    url += "&originZip=" + originZip;
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
        var rateLine = nlapiCreateRecord('customrecord_pss_ratepass_line');
      	rateLine.setFieldValue('custrecord_pss_batch_id', batId);
        rateLine.setFieldValue('custrecord_pss_ratepass_shipment_id', recId);
        rateLine.setFieldValue('custrecord_pss_ratepass_id', i + 1);
        rateLine.setFieldValue('custrecord_pss_carrier_quote_num', CarrierQuoteNo);
        rateLine.setFieldValue('custrecord_pss_discount', Discount);
        rateLine.setFieldValue('custrecord_pss_discount_rate', DiscountRate);
        rateLine.setFieldValue('custrecord_pss_error_message', ErrorMessage);
        rateLine.setFieldValue('custrecord_pss_fuel_surcharge', FuelSurcharge);
        rateLine.setFieldValue('custrecord_pss_gross_charge', GrossCharge);
        rateLine.setFieldValue('custrecord_pss_lane_name', LaneName);
        rateLine.setFieldValue('custrecord_pss_netcharge', NetCharge);
        rateLine.setFieldValue('custrecord_pss_payment_type', PaymentType);
        rateLine.setFieldValue('custrecord_pss_saas_quote_num', SAASQuoteNumber);
        rateLine.setFieldValue('custrecord_pss_scac', SCAC);
        rateLine.setFieldValue('custrecord_pss_service_level_desc', ServiceLevelDescription);
        rateLine.setFieldValue('custrecord_pss_total_shipment_cost', TotalShipmentCost);
        rateLine.setFieldValue('custrecord_pss_transit_days', TransitDays);
        rateLine.setFieldValue('custrecord_pss_ratepass_carrier', carrier);
        rateLine.setFieldValue('custrecord_pss_ratepass_total_cost', TotalShipmentCost);
        rateLine.setFieldValue('custrecord_pss_ratepass_origin_zip', originZip);
        rateLine.setFieldValue('custrecord_pss_ratepass_destination_zip', destinationZip);
        rateLine.setFieldValue('custrecord_pss_ratepass_pf_code', profileCode);
        rateLine.setFieldValue('custrecord_pss_ratepass_client_code', clientCode);
        rateLine.setFieldValue('custrecord_pss_acc_rated', accessorialsRated);
        rateLine.setFieldValue('custrecord_pss_CarrierType', CarrierType);
        /*if(SCAC = 'FXNL'){
        rateLine.setFieldValue('custrecord_pss_ratepass_vendor', FX);
      }
      if(SCAC = 'RLCA'){
          rateLine.setFieldValue('custrecord_pss_ratepass_vendor', RL);
      }
    if(SCAC = 'UPGF'){
          rateLine.setFieldValue('custrecord_pss_ratepass_vendor', UP);
      };*/
        nlapiSubmitRecord(rateLine);
    }
  nlapiLogExecution('DEBUG', 'RatePass Created!', message.getBody());
  nlapiLogExecution('DEBUG', 'AfterRequestSent', message.getCode());
  return message.getCode();
}

//Returned Ratepass list for selection
function ratePasslist(request, response){
  var list = nlapiCreateList('Requested Rates','editor');
  var r = nlapiSearchRecord('customrecord_pss_ratepass_line', 'customsearch_pri_ratepass_view', null, null);
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
  var results = nlapiSearchRecord("customrecord_pss_shipment_line", null,
    [
      ["custrecord_pss_shipment_parent.internalidnumber", "equalto", shipmentInternalID]
    ],
    [
      new nlobjSearchColumn("custrecord_pss_freight_class_value", null, null),
      new nlobjSearchColumn("custrecord_pss_weight", null, null),
    ]);

  for (var i = 0; results != null &&
    i < results.length; i++) {
    shipmentLines.push({
      "Weight": results[i].getValue('custrecord_pss_weight'),
      "Class": results[i].getValue('custrecord_pss_freight_class_value'),
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
  		var selAccessorials = parentShipment.getFieldValue('custrecord_pss_accessorials');
  		for (k = 0; k < selAccessorials.length; k++){
        	selAccessorialIds.push(selAccessorials[k]);
        }
      	nlapiLogExecution('DEBUG','Selected Accessorials Started','Selected passed are: ' + selAccessorialIds);
      	if (selAccessorials != ''){
      		var selAccNamesPrnt = new Array();
      		var accFil = new Array();
      			accFil[0] = new nlobjSearchFilter('internalid', null, 'anyof', selAccessorialIds);
      		var accCol = new Array();
      			accCol[0] = new nlobjSearchColumn('custrecord_ps_ratecode');
      		var selAccNames = nlapiSearchRecord('customrecord_pss_accessorials', null, accFil, accCol);
      		for (y = 0; y < selAccNames.length; y++){
          	selAccNamesPrnt.push(selAccNames[y].getValue('custrecord_ps_ratecode'));
        	}
        } else {var selAccNamesPrnt = '';}
  	var strAccNamesPrnt = selAccNamesPrnt.toString();
  	return strAccNamesPrnt;
	}

//inactivate previous rates
function RateCleanUp(recId){
  var fil = new Array();
    fil[0] = new nlobjSearchFilter('custrecord_pss_ratepass_shipment_id', null, 'is', recId);
    fil[1] = new nlobjSearchFilter('custrecord_pss_ratepass_selected', null, 'is', 'false');
  var col = new Array();
    col[0] = new nlobjSearchColumn('internalid');
    col[1] = new nlobjSearchColumn('isinactive');
   var searchresults = nlapiSearchRecord('customrecord_pss_ratepass_line', null, fil, col);

   for ( var i = 0; searchresults != null && i < searchresults.length; i++ ){
      var id = searchresults[i].getId();
      var ratepass = nlapiLoadRecord('customrecord_pss_ratepass_line', id);
      ratepass.setFieldValue('isinactive', 'T');
      nlapiSubmitRecord(ratepass);
   }

  nlapiLogExecution('DEBUG', 'Scheduled script cleaned up', 'Rates inactived' + searchresults.length);
}

//Project44 Retreiver
function getP44Rates(recId){
  var shipments = GetShipmentLinesByShipmentID(recId);
}