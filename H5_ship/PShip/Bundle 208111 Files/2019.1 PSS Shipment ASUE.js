function aftsubShipment(){
    var shipRecId = nlapiGetRecordId();
  	var shipRecType = nlapiGetRecordType();
  	var shipRec = nlapiLoadRecord(shipRecType, shipRecId);
  	var selCarrier = shipRec.getFieldValue('custrecord_pss_carrier');
    var selCost = shipRec.getFieldValue('custrecord_pss_shipment_selcost');
  	var parRec = shipRec.getFieldValue('custrecord_pss_so_parent_id');
    var parRecType = nlapiLookupField('transaction',parRec,'type');
    if (parRecType === 'SalesOrd'){parRecType = 'salesorder';}
    //var ifRecord = nlapiLoadRecord('itemfulfillment',parRec);
    //var soRecId = ifRecord.getFieldValue('createdfrom');
  	var recStatus = shipRec.getFieldValue('custrecord_pss_shipment_status');
    var shipDate = shipRec.getFieldValue('custrecord_pss_ship_date');
  	var shipProNum = shipRec.getFieldValue('custrecord_pss_carrier_pro');
  	var isBilled = shipRec.getFieldValue('custrecord_pss_billed');
  	var selCost = shipRec.getFieldValue('custrecord_pss_shipment_selcost');
    var costCurr = shipRec.getFieldValue('custrecord_pss_ship_cur');
    //nlapiExchangeRate(sourceCurrency,targetCurrency,effectiveDate)
    
    if (recStatus == 1){
        nlapiLogExecution('DEBUG', 'If Path Followed', 'ASUE on status 1 - shipRecId='+shipRecId);
    }
    else if (recStatus == 2) {
        nlapiLogExecution('DEBUG', 'If Path Followed', 'ASUE on status 2 - shipRecId='+shipRecId);
        var loadParRec = nlapiLoadRecord('itemfulfillment', parRec);
        loadParRec.setFieldValue('custbody_pss_estimated_ship_cost', selCost);
        loadParRec.setFieldValue('custbody_pss_selected_carrier', selCarrier);
        loadParRec.setLineItemValue('package', 'packagetrackingnumber',1,shipProNum);
        nlapiSubmitRecord(loadParRec);
    }
    else if (recStatus == 3){
        nlapiLogExecution('DEBUG', 'If Path Followed', 'ASUE on status 3 - shipRecId='+shipRecId);
    }
    else if (recStatus == 4) {
        nlapiLogExecution('DEBUG', 'If Path Followed', 'ASUE on status 4 - shipRecId='+shipRecId);
    }
    else if (recStatus == 5) {
        nlapiLogExecution('DEBUG', 'If Path Followed', 'ASUE on status 5 - shipRecId='+shipRecId);
    }
    else if (recStatus == 6) {
        nlapiLogExecution('DEBUG', 'If Path Followed', 'ASUE on status 6 - shipRecId='+shipRecId);
    }
    else if (recStatus == 7) {
        nlapiLogExecution('DEBUG', 'If Path Followed', 'ASUE on status 7 - shipRecId='+shipRecId);
    }
    else if (recStatus == 8) {
        nlapiLogExecution('DEBUG', 'If Path Followed', 'ASUE on status 8 - shipRecId='+shipRecId);
        var loadParRec = nlapiLoadRecord(parRecType, parRec);
        var CurrType = loadParRec.getFieldValue('currency');
        var exchRate = nlapiExchangeRate(costCurr, CurrType, shipDate);
        loadParRec.setFieldValue('custbody_pss_shipment_cost', selCost * exchRate);
        nlapiSubmitRecord(loadParRec);
    }

    var shipperAddress = shipRec.getFieldValue('custrecord_pss_shipper_addr_1');
    var shipperCity = shipRec.getFieldValue('custrecord_pss_shipper_city');
    var shipperState = shipRec.getFieldValue('custrecord_pss_shipper_state');
    var shipperAddrForGoogle = (shipperAddress + " " + shipperCity + " " + shipperState);
    var shipperFinalAddr = shipperAddrForGoogle.replace(/ /g, '+');
    var googleURLbase = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    var googleURLkey = '&key=AIzaSyD7zgGRz9SGftLzqgJqY9JYPllgbVUaeJk';
    var finalGoogleURL = (googleURLbase + shipperFinalAddr + googleURLkey);
    var response = nlapiRequestURL(finalGoogleURL, null, null, 'GET');
    var obj = response.getBody();
    var respObj = JSON.parse(obj);
    var loc1 = respObj.results;
    var shipperLat = loc1[0].geometry.location.lat;
    var shipperLng = loc1[0].geometry.location.lng;
    var consigneeAddress = shipRec.getFieldValue('custrecord_pss_consignee_addr1');
    var consigneeCity = shipRec.getFieldValue('custrecord_pss_consignee_city');
    var consigneeState = shipRec.getFieldValue('custrecord_pss_consignee_state');
    var consigneeAddrForGoogle = (consigneeAddress + " " + consigneeCity + " " + consigneeState);
    var consigneeFinalAddr = consigneeAddrForGoogle.replace(/ /g, '+');
    var googleURLbase = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    var googleURLkey = '&key=AIzaSyD7zgGRz9SGftLzqgJqY9JYPllgbVUaeJk';
    var finalGoogleURL = (googleURLbase + consigneeFinalAddr + googleURLkey);
    var response = nlapiRequestURL(finalGoogleURL, null, null, 'GET');
    var obj = response.getBody();
    var respObj = JSON.parse(obj);
    var loc1 = respObj.results;
    var consigneeLat = loc1[0].geometry.location.lat;
    var consigneeLng = loc1[0].geometry.location.lng;
    shipRec.setFieldValue('custrecord_pss_shipper_lat', shipperLat);
    shipRec.setFieldValue('custrecord_pss_shipper_lng', shipperLng);
    shipRec.setFieldValue('custrecord_pss_consignee_lat', consigneeLat);
    shipRec.setFieldValue('custrecord_pss_consignee_lng', consigneeLng);
    nlapiSubmitRecord(shipRec);


    /*else if (recStatus == 2){
      nlapiLogExecution('DEBUG', 'If Path Followed', 'This Executed IF 2');
      var loadParRec = nlapiLoadRecord('itemfulfillment', parRec);
      loadParRec.setFieldValue('shippingcost', selCost);
      loadParRec.setLineItemValue('package', 'packagetrackingnumber',1,shipProNum);
      nlapiSubmitRecord(loadParRec);
    }
    else if (recStatus == 3 && isBilled == 'F' && shipProNum != 'null'){
      nlapiLogExecution('DEBUG', 'If Path Followed', 'This Executed IF 3');
      var shipVen = shipRec.getFieldValue('custrecord_pss_carrier');
      var shipDate = shipRec.getFieldValue('custrecord_pss_ship_date');
      var shipCost = shipRec.getFieldValue('custrecord_pss_shipment_selcost');
      var shipSOParent = shipRec.getFieldValue('custrecord_pss_so_parent_id');
      //get shipment lines information for template - ajr
      var lineType = new Array();
      var lineNum = new Array();
      var lineDesc = new Array();
      var lineWeight = new Array();
      var lineWeightPerc = new Array();
      var lineFreightAllo = new Array();
      var lineDept = new Array();
      var lineClass = new Array();
      var lineCnt = new Array();
      var totLPC = 0;
      var totLPic = 0;
      var totWeight = 0;
      var fil = new Array();
      fil[0] = new nlobjSearchFilter('custrecord_pss_shipment_parent', null, 'is', shipRecId);
      var col = new Array();
      col[0] = new nlobjSearchColumn('custrecord_pss_nmfc_desc');
      col[1] = new nlobjSearchColumn('custrecord_pss_packagetype');
      col[2] = new nlobjSearchColumn('custrecord_pss_weight');
      col[3] = new nlobjSearchColumn('custrecord_pss_package_department');
      col[4] = new nlobjSearchColumn('custrecord_pss_package_class');
      col[5] = new nlobjSearchColumn('custrecord_pss_piece_count');
      var packages = nlapiSearchRecord('customrecord_pss_shipment_line', null, fil, col);
      for (var i = 0; i < packages.length; i++){
        lineType.push(packages[i].getText('custrecord_pss_packagetype'));
        lineDept.push(packages[i].getValue('custrecord_pss_package_department'));
        lineClass.push(packages[i].getValue('custrecord_pss_package_class'));
        lineDesc.push(packages[i].getValue('custrecord_pss_description'));
        lineCnt.push(packages[i].getValue('custrecord_pss_piece_count'));
        lineWeight.push(Number(packages[i].getValue('custrecord_pss_weight')));
        }
      var totWeight = lineWeight.reduce(function (a, b){return a + b;}, 0);
      for (var y = 0; y < lineWeight.length; y++){
        lineWeightPerc.push(lineWeight[y]/totWeight);
        }
      for (var z = 0; z< lineWeightPerc.length; z++){
        lineFreightAllo.push(lineWeightPerc[z]*shipCost);
        }
      nlapiLogExecution('DEBUG','Line Item Count', 'We counted: ' + packages.length + ' lines!!!');
      var billRec = nlapiCreateRecord('vendorbill');
      //set mainline fields on Vendor Bill
      billRec.setFieldValue('entity', shipVen);
      billRec.setFieldValue('subsidiary', 3);
      billRec.setFieldValue('trandate', shipDate);
      billRec.setFieldValue('account', '122');
      billRec.setFieldValue('tranid', shipProNum);
      billRec.setFieldValue('paymenthold', 'T');
      billRec.setFieldValue('custbody_pss_shipment_link', shipRecId);
      billRec.setFieldValue('custbody_pss_so_parent', shipSOParent);
      //create Line Item record for expense
      for (var x = 0; x < lineFreightAllo.length; x++){
        billRec.selectNewLineItem('expense');
        billRec.setCurrentLineItemValue('expense', 'account', '138');
        billRec.setCurrentLineItemValue('expense', 'memo', lineCnt[x]);
        billRec.setCurrentLineItemValue('expense', 'amount', lineFreightAllo[x]);
        billRec.setCurrentLineItemValue('expense', 'department', lineDept[x]);
        billRec.setCurrentLineItemValue('expense', 'class', lineClass[x]);
        billRec.commitLineItem('expense');
        }
      var billId = nlapiSubmitRecord(billRec, true);
      shipRec.setFieldValue('custrecord_pss_billed', 'T');
      nlapiSubmitRecord(shipRec, true);
      alert('Bill ' + shipProNum + ' has been successfully created.  Remember, the vendor bill will stay on payment hold until the freight bill has been audited.');
      var baseURL = 'https://system.netsuite.com/app/accounting/transactions/vendbill.nl?id=';
      var url = baseURL + billId + '&whence=';
      window.location = url;
    } */
}
