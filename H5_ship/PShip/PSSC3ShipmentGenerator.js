function beforeLoad(type, form){
    if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
        var currentRecordId = nlapiGetRecordId();
    }
    addShipmentButton(form);
    nlapiLogExecution('DEBUG', 'Current Shipment Record', 'Sales Order ID: ' + currentRecordId);
}

function addShipmentButton(form){
    form.setScript('customscript_pss_pship_client')
    form.addButton('custpage_addpackages', 'Create Shipment', 'ifShipgen()')
    nlapiLogExecution('DEBUG', 'We added a button', 'function is set to fltShipgen');
}

function addShipment(){
    nlapiLogExecution('DEBUG', 'Activated!', 'Button has been Pushed!');
    var soId = nlapiGetRecordId();
    var soType = nlapiGetRecordType();
    var parRec = nlapiLoadRecord(soType, soId);
    var destCust = parRec.getFieldValue('entity');
    var destAddy = parRec.getFieldValue('shipaddress')
    var shipDate = parRec.getFieldValue('trandate');
    var shipRef = parRec.getFieldValue('memo');
    //get item fulfillment lines
  	var fil = new Array();
  		fil[0] = new nlobjSearchFilter('createdfrom', null, 'is', shipRef);
    	fil[1] = new nlobjSearchFilter('mainline', null, 'is', false);
  	var col = new Array();
  		col[0] = new nlobjSearchColumn('item');
  		col[1] = new nlobjSearchColumn('custcol_pss_item_weight');
  		col[2] = new nlobjSearchColumn('quantity');
  		col[3] = new nlobjSearchColumn('department');
  		col[4] = new nlobjSearchColumn('class');
  	var linItems = nlapiSearchRecord('itemfulfillment', null, fil, col);
    var shipLoad = nlapiCreateRecord('customrecord_pss_shipment');
    shipLoad.setFieldValue('name', shipRef);
    shipLoad.setFieldValue('custrecord_pss_shipper', 1);
    shipLoad.setFieldValue('custrecord_pss_consignee', destCust);
    shipLoad.setFieldValue('custrecord_pss_so_parent_id', soId);
    shipLoad.setFieldValue('custrecord_pss_ship_date', shipDate);
    shipLoad.setFieldValue('custrecord_pss_freight_bill_to', 119);
    shipLoad.setFieldValue('custrecord_pss_consignee_address', destAddy);
  	nlapiSubmitRecord(shipLoad);
  	var shipLoadId = nlapiGetRecordId(shipLoad);
    //set shipment lines(packages)
    for (var x = 0; x < linItems.length; x++){
		console.log(shipLoadId);
    }
    nlapiLogExecution('DEBUG','Shipment ID', 'Shipment Record: created successfully!');
}