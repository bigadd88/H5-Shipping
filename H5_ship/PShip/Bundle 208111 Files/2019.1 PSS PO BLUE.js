function pssposhipmentgen(type, form){
        if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
            var currentRecordId = nlapiGetRecordId();
        }
        AddShipmentButton(form);
        nlapiLogExecution('DEBUG', 'Current Shipment Record', 'Shipment ID: ' + currentRecordId);
}

function AddShipmentButton(form){
    form.setScript('customscript_pss_pship_client')
    form.addButton('custpage_addshipment', 'Create Shipment', 'pssShipGenInit()')
    nlapiLogExecution('DEBUG', 'We added a button', 'function is set to fltShipgen');
}

function addShipment(){
  nlapiLogExecution('DEBUG', 'Activated!', 'Button has been Pushed!');
  var soId = nlapiGetRecordId();
  var soType = nlapiGetRecordType();
  var parRec = nlapiLoadRecord(soType, soId);
  var docNum = parRec.getFieldValue('tranid');
  var Ent = parRec.getFieldValue('entity');
  var EntType = nlapiLookupField('entity', Ent,'type');
  var EntAddr = nlapiLookupField('entity', Ent, 'address')
  var ConsAddr = nlapiLookupField('entity', 234, 'address');
  var ConsZip = nlapiLookupField('entity', 234, 'shipzip');
  var EntRec = nlapiLoadRecord(EntType, Ent);
  var EntAddr1 = EntRec.getFieldValue('shipaddr1');
  var EntAddr2 = EntRec.getFieldValue('shipaddr2');
  var EntAddr3 = EntRec.getFieldValue('shipaddr3');
  var EntCity = EntRec.getFieldValue('shipcity');
  var EntState = EntRec.getFieldValue('shipstate');
  var EntZip = EntRec.getFieldValue('shipzip');
  var shipDate = parRec.getFieldValue('trandate');
  //var shipRef = parRec.getFieldValue('createdfrom');
  //var shipZip = parRec.getFieldValue('shipzip');
  //get item fulfillment lines
  	var fil = new Array();
  		fil[0] = new nlobjSearchFilter('tranid', null, 'is', docNum);
        fil[1] = new nlobjSearchFilter('mainline', null, 'is', 'F');
  		fil[2] = new nlobjSearchFilter('taxline', null, 'is', 'F');
  	var col = new Array();
  		col[0] = new nlobjSearchColumn('item');
  		col[1] = new nlobjSearchColumn('custcol_pss_item_weight');
  		col[2] = new nlobjSearchColumn('quantity');
  		col[3] = new nlobjSearchColumn('department');
  		col[4] = new nlobjSearchColumn('class');
  var linItems = nlapiSearchRecord('purchaseorder', null, fil, col);
  var shipLoad = nlapiCreateRecord('customrecord_pss_shipment');
  shipLoad.setFieldValue('name', docNum);
  shipLoad.setFieldValue('custrecord_pss_shipper', Ent);
  shipLoad.setFieldValue('custrecord_pss_shipper_address', EntAddr);
  shipLoad.setFieldValue('custrecord_pss_consignee', 234);
  shipLoad.setFieldValue('custrecord_pss_so_parent_id', soId);
  shipLoad.setFieldValue('custrecord_pss_ship_date', shipDate);
  shipLoad.setFieldValue('custrecord_pss_freight_bill_to', 119);
  shipLoad.setFieldValue('custrecord_pss_consignee_address', ConsAddr);
  shipLoad.setFieldValue('custrecord_pss_consignee_zip', ConsZip);
  shipLoad.setFieldValue('custrecord_pss_shipper_zip', EntZip)
  shipLoad.setFieldValue('custrecord_pss_billing_type', 1);
  shipLoad.setFieldValue('custrecord_pss_shipment_direction', 1);
  shipLoad.setFieldValue('custrecord_pss_shipment_type', 2);
  var shipmentId = nlapiSubmitRecord(shipLoad);
  //set shipment lines
  var packageItem = new Array();
  var packageWeight = new Array();
  var packageQty = new Array();
  var packageDept = new Array();
  var packageClass = new Array();
  for (var i = 0; i < linItems.length; i++){
    packageItem.push(linItems[i].getValue('item'));
    packageWeight.push(Number(linItems[i].getValue('custcol_pss_item_weight')*10));
    packageQty.push(linItems[i].getValue('quantity'));
    packageDept.push(linItems[i].getValue('department'));
    packageClass.push(linItems[i].getValue('class'));
    }
  console.log('Package Arrays Created');
  for (var x = 0; x < packageItem.length; x++){
	var packLoad = nlapiCreateRecord('customrecord_pss_shipment_line');
    packLoad.setFieldValue('custrecord_pss_shipment_parent', shipmentId);
	packLoad.setFieldValue('custrecord_pss_piece_count', packageItem[x]);
    packLoad.setFieldValue('custrecord_pss_packagetype', 7);
    packLoad.setFieldValue('custrecord_pss_inventoryunits',packageQty[x]);
    packLoad.setFieldValue('custrecord_pss_weight', packageWeight[x]);
    packLoad.setFieldValue('custrecord_pss_length', 12);
    packLoad.setFieldValue('custrecord_pss_height', 12);
    packLoad.setFieldValue('custrecord_pss_width', 12);
    packLoad.setFieldValue('custrecord_pss_package_department', packageDept[x]);
    packLoad.setFieldValue('custrecord_pss_package_class', packageClass[x]);
    nlapiSubmitRecord(packLoad);
  }
  alert('Shipment Record: created with ' + linItems.length + ' lines!');

    var baseURL = 'https://system.netsuite.com/app/common/custom/custrecordentry.nl?rectype=15&id=';
    var url = baseURL + shipmentId + '&whence=';
    window.location = url;
}