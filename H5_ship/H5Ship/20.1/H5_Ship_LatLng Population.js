function aftsubShipment(){
    var shipRecId = nlapiGetRecordId();
  	var shipRecType = nlapiGetRecordType();
  	var shipRec = nlapiLoadRecord(shipRecType, shipRecId);
  	var parRec = shipRec.getFieldValue('custrecord_h5_so_parent_id');
  	var recStatus = shipRec.getFieldValue('custrecord_h5_shipment_status');
  	var shipProNum = shipRec.getFieldValue('custrecord_h5_carrier_pro');
  	var isBilled = shipRec.getFieldValue('custrecord_h5_billed');
  	var selCost = shipRec.getFieldValue('custrecord_h5_shipment_selcost');
    if (recStatus == 1){
      /*nlapiLogExecution('DEBUG', 'If Path Followed', 'This Executed IF 1');
  	  var batId = Date.now();
  	  var url = nlapiResolveURL('SUITELET','customscript_h5_retriever','customdeploy_h5_retriever');
	  url += '&reqURL=' + shipRecId;
	  url += '&batchId=' + batId;*/
    }
  	else if (recStatus == 2){
      nlapiLogExecution('DEBUG', 'If Path Followed', 'This Executed IF 2');
      var loadParRec = nlapiLoadRecord('itemfulfillment', parRec);
      loadParRec.setFieldValue('shippingcost', selCost);
      loadParRec.setLineItemValue('package', 'packagetrackingnumber',1,shipProNum);
      nlapiSubmitRecord(loadParRec);
    }
    else if (recStatus == 3 && isBilled == 'F' && shipProNum != 'null'){
      nlapiLogExecution('DEBUG', 'If Path Followed', 'This Executed IF 3');
      var shipVen = shipRec.getFieldValue('custrecord_h5_carrier');
      var shipDate = shipRec.getFieldValue('custrecord_h5_ship_date');
      var shipCost = shipRec.getFieldValue('custrecord_h5_shipment_selcost');
      var shipSOParent = shipRec.getFieldValue('custrecord_h5_so_parent_id');
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
      fil[0] = new nlobjSearchFilter('custrecord_h5_shipment_parent', null, 'is', shipRecId);
      var col = new Array();
      col[0] = new nlobjSearchColumn('custrecord_h5_nmfc_desc');
      col[1] = new nlobjSearchColumn('custrecord_h5_packagetype');
      col[2] = new nlobjSearchColumn('custrecord_h5_weight');
      col[3] = new nlobjSearchColumn('custrecord_h5_package_department');
      col[4] = new nlobjSearchColumn('custrecord_h5_package_class');
      col[5] = new nlobjSearchColumn('custrecord_h5_piece_count');
      var packages = nlapiSearchRecord('customrecord_h5_shipment_line', null, fil, col);
      for (var i = 0; i < packages.length; i++){
        lineType.push(packages[i].getText('custrecord_h5_packagetype'));
        lineDept.push(packages[i].getValue('custrecord_h5_package_department'));
        lineClass.push(packages[i].getValue('custrecord_h5_package_class'));
        lineDesc.push(packages[i].getValue('custrecord_h5_description'));
        lineCnt.push(packages[i].getValue('custrecord_h5_piece_count'));
        lineWeight.push(Number(packages[i].getValue('custrecord_h5_weight')));
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
      billRec.setFieldValue('custbody_h5_shipment_link', shipRecId);
      billRec.setFieldValue('custbody_h5_so_parent', shipSOParent);
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
      shipRec.setFieldValue('custrecord_h5_billed', 'T');
      nlapiSubmitRecord(shipRec, true);
      alert('Bill ' + shipProNum + ' has been successfully created.  Remember, the vendor bill will stay on payment hold until the freight bill has been audited.');
      var baseURL = 'https://system.netsuite.com/app/accounting/transactions/vendbill.nl?id=';
      var url = baseURL + billId + '&whence=';
      window.location = url;
      }
}