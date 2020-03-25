//H5 ShipRec Generator
function H5ShipRecGen(request, response) {
    nlapiLogExecution('DEBUG', 'Activated!', 'ShipRec Begin');
    var tranId = request.getParameter('reqURL');
    var batId = request.getParameter('batchId');
    var tranType = request.getParameter('recType');
    nlapiLogExecution('DEBUG', 'Object Strings', 'tranId: ' + tranId + ', batId: ' + batId + ', tranType: ' + tranType);
    if (tranType === 'purchaseorder') {
        var shipLoadId = poShipGen(tranId, batId, tranType);
    }
    if (tranType === 'itemfulfillment') {
        var shipLoadId = ifShipGen(tranId, batId, tranType);
    }
    if (tranType === 'salesorder') {
        var shipLoadId = soShipGen(tranId, batId, tranType);
    }
    if (tranType === 'estimate') {
        var shipLoadId = estShipGen(tranId, batId, tranType);
    } else {
        alert('Unsupported Transaction Detected, please contact Priority Suite Support.')
    }
    response.write(shipLoadId);
}

function poShipGen(tranId, batId, tranType) {
    nlapiLogExecution('DEBUG', 'Progress indicator', 'Button has been pushed from a purchase order!');
    var parRec = nlapiLoadRecord(tranType, tranId);
    var docNum = parRec.getFieldValue('tranid');
    var Ent = parRec.getFieldValue('entity');
    var EntType = nlapiLookupField('entity', Ent, 'type');
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
    var fils = [];
    fils[0] = new nlobjSearchFilter('tranid', null, 'is', docNum);
    fils[1] = new nlobjSearchFilter('mainline', null, 'is', 'F');
    fils[2] = new nlobjSearchFilter('taxline', null, 'is', 'F');
    fils[3] = new nlobjSearchFilter('custcol_h5_item_weight', null, 'isnotempty');
    var cols = [];
    cols[0] = new nlobjSearchColumn('item');
    cols[1] = new nlobjSearchColumn('custcol_h5_item_weight');
    cols[2] = new nlobjSearchColumn('quantity');
    //cols[3] = new nlobjSearchColumn('department');
    cols[3] = new nlobjSearchColumn('custcol_h5_packing_container');
    cols[4] = new nlobjSearchColumn('custcol_h5_max_cq');
    cols[5] = new nlobjSearchColumn('rate');
    cols[6] = new nlobjSearchColumn('amount');
    var linItems = nlapiSearchRecord('purchaseorder', null, fils, cols);
    var shipLoad = nlapiCreateRecord('customrecord_h5_shipment');
    shipLoad.setFieldValue('name', 'Shipment #' + docNum);
    shipLoad.setFieldValue('custrecord_h5_shipper', Ent);
    shipLoad.setFieldValue('custrecord_h5_shipper_address', EntAddr);
    shipLoad.setFieldValue('custrecord_h5_consignee', 234);
    shipLoad.setFieldValue('custrecord_h5_so_parent_id', tranId);
    shipLoad.setFieldValue('custrecord_h5_ship_date', shipDate);
    shipLoad.setFieldValue('custrecord_h5_freight_bill_to', 119);
    shipLoad.setFieldValue('custrecord_h5_consignee_address', ConsAddr);
    shipLoad.setFieldValue('custrecord_h5_consignee_zip', ConsZip);
    shipLoad.setFieldValue('custrecord_h5_shipper_zip', EntZip)
    shipLoad.setFieldValue('custrecord_h5_billing_type', 1);
    shipLoad.setFieldValue('custrecord_h5_shipment_direction', 1);
    shipLoad.setFieldValue('custrecord_h5_shipment_type', 2);
    var shipLoadId = nlapiSubmitRecord(shipLoad);
    //set shipment lines
    var packageItem = new Array();
    var packageWeight = new Array();
    var packageQty = new Array();
    var packageDept = new Array();
    var packageClass = new Array();
    for (var i = 0; i < linItems.length; i++) {
        packageItem.push(linItems[i].getValue('item'));
        packageWeight.push(Number(linItems[i].getValue('custcolitem_weight')) * Number(linItems[i].getValue('quantity')));
        packageQty.push(linItems[i].getValue('quantity'));
        packageDept.push(linItems[i].getValue('department'));
        packageClass.push(linItems[i].getValue('custcol_h5_nmfc_code'));
    }
    for (var x = 0; x < packageItem.length; x++) {
        var packLoad = nlapiCreateRecord('customrecord_h5_shipment_line');
        packLoad.setFieldValue('custrecord_h5_shipment_parent', shipLoadId);
        packLoad.setFieldValue('custrecord_h5_ship_line_item_desc', packageItem[x]);
        packLoad.setFieldValue('custrecord_h5_piece_count', packageQty[x]);
        packLoad.setFieldValue('custrecord_h5_packagetype', 7);
        packLoad.setFieldValue('custrecord_h5_inventoryunits', packageQty[x]);
        packLoad.setFieldValue('custrecord_h5_weight', packageWeight[x]);
        packLoad.setFieldValue('custrecord_h5_length', 12);
        packLoad.setFieldValue('custrecord_h5_height', 12);
        packLoad.setFieldValue('custrecord_h5_width', 12);
        packLoad.setFieldValue('custrecord_h5_package_department', packageDept[x]);
        packLoad.setFieldValue('custrecord_h5_freight_class_value', packageClass[x]);
        nlapiSubmitRecord(packLoad);
    }
    response.write(shipLoadId);
}

function ifShipGen(tranId, batId, tranType) {
    nlapiLogExecution('DEBUG', 'Activated!', 'Button has been pushed from an item fulfillment!');
    var parRec = nlapiLoadRecord(tranType, tranId);
    var docNum = parRec.getFieldValue('id');
    var docTranId = parRec.getFieldValue('tranid');
    var destCust = parRec.getFieldValue('entity');
    var destAtten = parRec.getFieldValue('shipattention');
    if (destAtten === null) {destAtten = 'Receiving';}
    var destAddree = parRec.getFieldValue('shipcompany');
    if (destAddree === null) {destAddree = 'Receiving';}
    var destAddr1 = parRec.getFieldValue('shipaddr1');
    var destAddr2 = parRec.getFieldValue('shipaddr2');
    var destCity = parRec.getFieldValue('shipcity');
    var destState = parRec.getFieldValue('shipstate');
    var destZip = parRec.getFieldValue('shipzip');
    var destCountry = parRec.getFieldValue('shipcountry');
    var shortShipZip = destZip.substr(0, 5);
    var salesOrderNum = parRec.getFieldValue('sonum');
    var createdFromSO = parRec.getFieldValue('createdfrom'); 
    var refAtDest = nlapiLookupField('salesorder',createdFromSO,'otherrefnum');
    var shipDate = new Date();
    var shipCur = parRec.getFieldValue('currencycode');
    var shipRef = parRec.getFieldValue('tranid');
    //find location
    var fils = new Array();
    fils[0] = new nlobjSearchFilter('internalid', null, 'is', docNum);
    fils[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');
    var cols = new Array();
    cols[0] = new nlobjSearchColumn('location');
    var lineSearchResults = nlapiSearchRecord('itemfulfillment', null, fils, cols);
    var lineLocations = [];
    for (var i = 0; i < lineSearchResults.length; i++) {
        lineLocations.push(lineSearchResults[i].getValue('location'));
      }
    var ifLocation = Math.max.apply(null, lineLocations);
    nlapiLogExecution('DEBUG', 'Progress indicator', 'Line Locations = ' + lineSearchResults.length);
    //Build Shipment
    var locationRecord = nlapiLoadRecord('location', ifLocation, null, null);
    var locationAddressee = locationRecord.getFieldValue('addressee');
    var locationAddr1 = locationRecord.getFieldValue('addr1');
    var locationAddr2 = locationRecord.getFieldValue('addr2');
    var locationCity = locationRecord.getFieldValue('city');
    var locationState = locationRecord.getFieldValue('state');
    var locationZip = locationRecord.getFieldValue('zip');
    var locationCountry = locationRecord.getFieldValue('country');
    var shipLoad = nlapiCreateRecord('customrecord_h5_shipment');
        shipLoad.setFieldValue('name', 'Shipment #' + docTranId);
        shipLoad.setFieldValue('custrecord_h5_location',ifLocation);
        shipLoad.setFieldValue('custrecord_h5_shipper_addressee', locationAddressee);
        shipLoad.setFieldValue('custrecord_h5_shipper_addr_1', locationAddr1);
        shipLoad.setFieldValue('custrecord_h5_shipper_addr_2', locationAddr2);
        shipLoad.setFieldValue('custrecord_h5_shipper_city', locationCity);
        shipLoad.setFieldValue('custrecord_h5_shipper_state', locationState);
        shipLoad.setFieldValue('custrecord_h5_shipper_zip', locationZip);
        shipLoad.setFieldValue('custrecord_h5_shipper_country', locationCountry);
        shipLoad.setFieldValue('custrecord_h5_so_parent_id', docNum);
        shipLoad.setFieldValue('custrecord_h5_ship_date', shipDate);
        shipLoad.setFieldValue('custrecord_h5_freight_bill_to', 119);
        shipLoad.setFieldValue('custrecord_h5_consignee_attn', destAtten);
        shipLoad.setFieldValue('custrecord_h5_consignee_addree', destAddree);
        shipLoad.setFieldValue('custrecord_h5_consignee_addr1', destAddr1);
        shipLoad.setFieldValue('custrecord_h5_consignee_addr2', destAddr2);
        shipLoad.setFieldValue('custrecord_h5_consignee_city', destCity);
        shipLoad.setFieldValue('custrecord_h5_consignee_state', destState);
        shipLoad.setFieldValue('custrecord_h5_consignee_zip', destZip);
        shipLoad.setFieldValue('custrecord_h5_consignee_country', destCountry);
        shipLoad.setFieldValue('custrecord_h5_reference_pickup', salesOrderNum);
        shipLoad.setFieldValue('custrecord_h5_reference_delivery', refAtDest);
        shipLoad.setFieldValue('custrecord_h5_billing_type', 1);
        shipLoad.setFieldValue('custrecord_h5_shiprec_type', 2);
        shipLoad.setFieldValue('custrecord_h5_shipment_direction', 2);
        shipLoad.setFieldValue('custrecord_h5_shipment_type', 2);
        shipLoad.setFieldValue('customform', 2);
        //shipLoad.setFieldValue('custrecord_h5_ship_cur', shipCur);
        var shipLoadId = nlapiSubmitRecord(shipLoad);
        nlapiLogExecution('DEBUG', 'Progress indicator', 'shipLoadId' + shipLoadId);
        //Build Shipment Lines
        //var linePackagelocs = [];
        //var lineItems = [];
        //var lineQtys = [];
        //var lineWeights = [];
        //var lineContainers = [];
        //var lineMaxQtys = [];
        //for (var x = 1; x <= parRec.getLineItemCount('item'); x++) {
        //if (parRec.getLineItemValue('item', 'location', x) != null) {
        //linePackagelocs.push(parRec.getLineItemValue('item', 'location', x));
        //lineItems.push(parRec.getLineItemValue('item', 'item', x));
        //lineQtys.push(parRec.getLineItemValue('item', 'quantity', x));
        //lineWeights.push(parRec.getLineItemValue('item','custcol_h5_item_weight', x));
        //lineContainers.push(parRec.getLineItemValue('item','custcol_h5_packing_container', x));
        //lineMaxQtys.push(parRec.getLineItemValue('item','custcol_h5_max_cq', x));
        //     }
        // }
        //nlapiLogExecution('DEBUG', 'Progress indicator', 'saved search ran' + lineItems.length);
        var packageItem = [];
        var packLineName = [];
        var packageWeight = [];
        var packageQty = [];
        var packageDept = [];
        var packageContainer = [];
        var packageContCubicInches = [];
        var packType = [];
        var packLength = [];
        var packHeight = [];
        var packWidth = [];
        var packWeight = [];
        var packUnitPrice = [];
        var packExtendedTotal = [];
        var packCountryofOrigin = [];
        var packHTS = [];
        var packNMFC = [];
        var packNMFCDesc = [];
        var packClass = [];
        var packCost = [];
        for (var z = 1; z <= parRec.getLineItemCount('item'); z++) {
          packageItem.push(parRec.getLineItemValue('item','item', z));
          packageWeight.push(Number(parRec.getLineItemValue('item','custcol_h5_item_weight', z)));
          packageQty.push(parRec.getLineItemValue('item','quantity', z));
          packageContainer.push(parRec.getLineItemValue('item','custcol_h5_packing_container', z));
          packageContCubicInches.push(parRec.getLineItemValue('item','custcol_h5_max_cq', z));
        }
        for (var z = 0; z < packageContainer.length; z++) {
          packHTS.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_hts'));
          packLineName.push(nlapiLookupField('item', packageItem[z], 'description'));
          packType.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_type'));
          packLength.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_length'));
          packHeight.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_height'));
          packWidth.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_width'));
          packWeight.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_weight'));
          //packNMFC.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_nmfc_assignment'));
          //packNMFCDesc.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_nmfc_desc'));
          packClass.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_nmfc_frt_class'));
          //packCost.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_cost'));
          nlapiLogExecution('DEBUG', 'formed arrays', 'got package containers length is ' + packageContainer.length);
          nlapiLogExecution('DEBUG', 'formed arrays', 'max_cq ' + packageContCubicInches);
          nlapiLogExecution('DEBUG', 'formed arrays', 'item qty ' + packageQty);
          nlapiLogExecution('DEBUG', 'formed arrays', 'item weight ' + packageWeight);
          //nlapiLogExecution('DEBUG', 'formed arrays', 'unitprice ' + packUnitPrice);
          //nlapiLogExecution('DEBUG', 'formed arrays', 'amount ' + packExtendedTotal);
          nlapiLogExecution('DEBUG', 'formed arrays', 'HTS ' + packHTS);
          var packLoad = nlapiCreateRecord('customrecord_h5_shipment_line');
          packLoad.setFieldValue('custrecord_h5_shipment_parent', shipLoadId);
          packLoad.setFieldValue('custrecord_h5_ship_line_item_desc', packLineName[z]);
          packLoad.setFieldValue('custrecord_h5_piece_count', Math.ceil(packageQty[z] / packageContCubicInches[z]));
          packLoad.setFieldValue('custrecord_h5_packagetype', packType[z]);
          packLoad.setFieldValue('custrecord_h5_inventoryunits', packageQty[z]);
          packLoad.setFieldValue('custrecord_h5_weight', Number(Math.round(packageWeight[z] * packageQty[z]) + Number(packWeight[z]) * Math.ceil(packageQty[z] / packageContCubicInches[z])));
          packLoad.setFieldValue('custrecord_h5_length', packLength[z]);
          packLoad.setFieldValue('custrecord_h5_height', packHeight[z]);
          packLoad.setFieldValue('custrecord_h5_width', packWidth[z]);
          packLoad.setFieldValue('custrecord_h5_package_cost', packCost[z]);
          packLoad.setFieldValue('custrecord_h5_freight_class_value', packClass[z]);
          //packLoad.setFieldValue('custrecord_h5_nmfc_number', packNMFC[z]);
          //packLoad.setFieldValue('custrecord_h5_nmfc_desc', packNMFCDesc[z]);
          packLoad.setFieldValue('custrecord_h5_packingcontainer', packageContainer[z]);
          //packLoad.setFieldValue('custrecord_h5_unitprice', packUnitPrice[z]);
          //packLoad.setFieldValue('custrecord_h5_extendedtotal', packExtendedTotal[z]);
          packLoad.setFieldValue('custrecord_h5_htsnumber', packHTS[z]);
          nlapiSubmitRecord(packLoad);
    }
    response.write(shipLoadId);
}

function soShipGenOLD(tranId, batId, tranType) {
    nlapiLogExecution('DEBUG', 'Progress indicator', 'Button has been pushed from a sales order!');
    //define arrays
    var shipLoadId = [];
    var origAddr = [];
    var origCity = [];
    var origState = [];
    var origZip = [];
    var lineAmt = [];
    var parRec = nlapiLoadRecord(tranType, tranId);
    var docNum = parRec.getFieldValue('tranid');
    //var docName = parRec.getFieldValue('transactionnumber');
    var refAtDest = parRec.getFieldValue('otherrefnum');
    var destCust = parRec.getFieldValue('entity');
    var destAtten = parRec.getFieldValue('shipattention');
    if (destAtten === null) {destAtten = 'Receiving';}
    var destAddree = parRec.getFieldValue('shipaddressee');
    if (destAddree === null) {destAddree = 'Receiving';}
    var destAddr1 = parRec.getFieldValue('shipaddr1');
    var destAddr2 = parRec.getFieldValue('shipaddr2');
    var destCity = parRec.getFieldValue('shipcity');
    var destState = parRec.getFieldValue('shipstate');
    var destZip = parRec.getFieldValue('shipzip');
    var shipDate = new Date(); //parRec.getFieldValue('trandate');
    //var shipDate = parRec.getFieldValue('trandate');
    var shipCur = parRec.getFieldValue('currency');
    var decAmt = parRec.getFieldValue('total');
    var shortShipZip = destZip.substr(0, 5);
    //var shortOrigZip = origZip.substr(0,5);
    nlapiLogExecution('DEBUG', 'Progress indicator', 'inital variables docNum' + docNum);
    //build unique locations
    var packagelocs = [];
    for (var x = 1; x <= parRec.getLineItemCount('item'); x++) {
        if (parRec.getLineItemValue('item', 'location', x) != null) {
            packagelocs.push(parRec.getLineItemValue('item', 'location', x));
            lineAmt.push(parRec.getLineItemValue('item', 'amount', x));
        }
    }
    nlapiLogExecution('DEBUG', 'Progress indicator', 'packagelocs passed' + packagelocs);
    var totShipAmt = lineAmt.reduce(add, 0);
    var unilocs = uniques(packagelocs);
    for (var m = 0; m < unilocs.length; m++) {
        var shipperEnt = nlapiLoadRecord('location', unilocs[m]);
        origAddr.push(shipperEnt.getFieldValue('addr1'));
        origCity.push(shipperEnt.getFieldValue('city'));
        origState.push(shipperEnt.getFieldValue('state'));
        origZip.push(shipperEnt.getFieldValue('zip'));
    }
    nlapiLogExecution('DEBUG', 'Progress indicator', 'unilocs passed' + unilocs);
    for (var y = 0; y < unilocs.length; y++) {
        var shipLoad = nlapiCreateRecord('customrecord_h5_shipment');
        shipLoad.setFieldValue('name', 'Shipment #' + docNum);
        shipLoad.setFieldValue('custrecord_h5_location', unilocs[y]);
        //shipLoad.setFieldValue('custrecord_h5_shipper', unilocs[y]);
        shipLoad.setFieldValue('custrecord_h5_shipper_addr_1', origAddr[y]);
        shipLoad.setFieldValue('custrecord_h5_shipper_city', origCity[y]);
        shipLoad.setFieldValue('custrecord_h5_shipper_state', origState[y]);
        shipLoad.setFieldValue('custrecord_h5_shipper_zip', origZip[y]);
        shipLoad.setFieldValue('custrecord_h5_consignee', destCust);
        shipLoad.setFieldValue('custrecord_h5_so_parent_id', tranId);
        shipLoad.setFieldValue('custrecord_h5_ship_date', shipDate);
        shipLoad.setFieldValue('custrecord_h5_freight_bill_to', 1318);
        shipLoad.setFieldValue('custrecord_h5_consignee_attn', destAtten);
        shipLoad.setFieldValue('custrecord_h5_consignee_addree', destAddree);
        shipLoad.setFieldValue('custrecord_h5_consignee_addr1', destAddr1);
        shipLoad.setFieldValue('custrecord_h5_consignee_addr2', destAddr2);
        shipLoad.setFieldValue('custrecord_h5_consignee_city', destCity);
        shipLoad.setFieldValue('custrecord_h5_consignee_state', destState);
        shipLoad.setFieldValue('custrecord_h5_consignee_zip', destZip);
        shipLoad.setFieldValue('custrecord_h5_reference_delivery', refAtDest);
        shipLoad.setFieldValue('custrecord_h5_billing_type', 1);
        shipLoad.setFieldValue('custrecord_h5_shipment_direction', 2);
        shipLoad.setFieldValue('custrecord_h5_shipment_type', 2);
        shipLoad.setFieldValue('custrecord_h5_shipment_status', 6);
        shipLoad.setFieldValue('custrecord_h5_shiprec_type', 1);
        shipLoad.setFieldValue('custrecord_h5_ship_cur', shipCur);
        //shipLoad.setFieldValue('custrecord_h5_shiprec_declared_value', totShipAmt);
        var shipLoadId = nlapiSubmitRecord(shipLoad);
        nlapiLogExecution('DEBUG', 'Progress indicator', 'ship rec created ' + shipLoadId);
        var fils = [];
        fils[0] = new nlobjSearchFilter('tranid', null, 'is', docNum);
        fils[1] = new nlobjSearchFilter('mainline', null, 'is', 'F');
        fils[2] = new nlobjSearchFilter('taxline', null, 'is', 'F');
        fils[3] = new nlobjSearchFilter('location', null, 'is', unilocs[y]);
        fils[4] = new nlobjSearchFilter('custcol_h5_item_weight', null, 'isnotempty');
        var cols = [];
        cols[0] = new nlobjSearchColumn('item');
        cols[1] = new nlobjSearchColumn('custcol_h5_item_weight');
        cols[2] = new nlobjSearchColumn('quantity');
        //cols[3] = new nlobjSearchColumn('department');
        cols[3] = new nlobjSearchColumn('custcol_h5_packing_container');
        cols[4] = new nlobjSearchColumn('custcol_h5_max_cq');
        cols[5] = new nlobjSearchColumn('rate');
        cols[6] = new nlobjSearchColumn('amount');
        var lineItems = nlapiSearchRecord('salesorder', null, fils, cols);
        nlapiLogExecution('DEBUG', 'Progress indicator', 'saved search ran' + lineItems.length);
        var packageItem = [];
        var packLineName = [];
        var packageWeight = [];
        var packageQty = [];
        var packageDept = [];
        var packageContainer = [];
        var packageContCubicInches = [];
        var packType = [];
        var packLength = [];
        var packHeight = [];
        var packWidth = [];
        var packWeight = [];
        var packUnitPrice = [];
        var packExtendedTotal = [];
        var packCountryofOrigin = [];
        var packHTS = [];
        var packNMFC = [];
        var packNMFCDesc = [];
        var packClass = [];
        var packCost = [];
        for (var z = 0; z < lineItems.length; z++) {
            packageItem.push(lineItems[z].getValue('item'));
            packageWeight.push(Number(lineItems[z].getValue('custcol_h5_item_weight')));
            packageQty.push(lineItems[z].getValue('quantity'));
            //packageDept.push(lineItems[z].getValue('department'));
            packageContainer.push(lineItems[z].getValue('custcol_h5_packing_container'));
            packageContCubicInches.push(lineItems[z].getValue('custcol_h5_max_cq'));
            packUnitPrice.push(lineItems[z].getValue('rate'));
            packExtendedTotal.push(lineItems[z].getValue('amount'));
            packHTS.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_hts'));
            packLineName.push(nlapiLookupField('item', packageItem[z], 'description'));
            packType.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_type'));
            packLength.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_length'));
            packHeight.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_height'));
            packWidth.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_width'));
            packWeight.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_weight'));
            packNMFC.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_nmfc_assignment'));
            packNMFCDesc.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_nmfc_desc'));
            packClass.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_nmfc_frt_class'));
            packCost.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_cost'));

            nlapiLogExecution('DEBUG', 'formed arrays', 'got package containers length is ' + packageContainer.length);
            nlapiLogExecution('DEBUG', 'formed arrays', 'max_cq ' + packageContCubicInches);
            nlapiLogExecution('DEBUG', 'formed arrays', 'item qty ' + packageQty);
            nlapiLogExecution('DEBUG', 'formed arrays', 'item weight ' + packageWeight);
            nlapiLogExecution('DEBUG', 'formed arrays', 'unitprice ' + packUnitPrice);
            nlapiLogExecution('DEBUG', 'formed arrays', 'amount ' + packExtendedTotal);
            nlapiLogExecution('DEBUG', 'formed arrays', 'HTS ' + packHTS);

            var packLoad = nlapiCreateRecord('customrecord_h5_shipment_line');
            packLoad.setFieldValue('custrecord_h5_shipment_parent', shipLoadId);
            packLoad.setFieldValue('custrecord_h5_ship_line_item_desc', packLineName[z]);
            packLoad.setFieldValue('custrecord_h5_piece_count', Math.ceil(packageQty[z] / packageContCubicInches[z]));
            packLoad.setFieldValue('custrecord_h5_packagetype', packType[z]);
            packLoad.setFieldValue('custrecord_h5_inventoryunits', packageQty[z]);
            packLoad.setFieldValue('custrecord_h5_weight', Number(Math.round(packageWeight[z] * packageQty[z]) + Number(packWeight[z]) * Math.ceil(packageQty[z] / packageContCubicInches[z])));
            packLoad.setFieldValue('custrecord_h5_length', packLength[z]);
            packLoad.setFieldValue('custrecord_h5_height', packHeight[z]);
            packLoad.setFieldValue('custrecord_h5_width', packWidth[z]);
            packLoad.setFieldValue('custrecord_h5_package_cost', packCost[z]);
            packLoad.setFieldValue('custrecord_h5_freight_class_value', packClass[z]);
            packLoad.setFieldValue('custrecord_h5_nmfc_number', packNMFC[z]);
            packLoad.setFieldValue('custrecord_h5_nmfc_desc', packNMFCDesc[z]);
            packLoad.setFieldValue('custrecord_h5_packingcontainer', packageContainer[z]);
            packLoad.setFieldValue('custrecord_h5_unitprice', packUnitPrice[z]);
            packLoad.setFieldValue('custrecord_h5_extendedtotal', packExtendedTotal[z]);
            packLoad.setFieldValue('custrecord_h5_htsnumber', packHTS[z]);
            nlapiSubmitRecord(packLoad);
        }
    }
    nlapiLogExecution('DEBUG', 'ShipRec Progress', 'Shipment Lines Created.' + shipLoadId);
    //response.write(shipLoadId);
    return shipLoadId;
}

function soShipGen(tranId, batId, tranType) {
    nlapiLogExecution('DEBUG', 'Progress indicator', 'Button has been pushed from a sales order!');
    var parRec = nlapiLoadRecord(tranType, tranId);
    var docNum = parRec.getFieldValue('tranid');
    var locationId = parRec.getFieldValue('location');
    var locationAddressee = parRec.getFieldText('location');
    var locationRecord = nlapiLoadRecord('location', locationId, null, null);
    var locationAddr1 = locationRecord.getFieldValue('addr1');
    var locationAddr2 = locationRecord.getFieldValue('addr2');
    var locationCity = nlapiLookupField('location', locationId, 'city');
    var locationState = nlapiLookupField('location', locationId, 'state');
    var locationZip = nlapiLookupField('location', locationId, 'zip');
    var locationCountry = nlapiLookupField('location', locationId, 'country');    
    //var docName = parRec.getFieldValue('transactionnumber');
    var refAtDest = parRec.getFieldValue('otherrefnum');
    var destCust = parRec.getFieldValue('entity');
    var destAtten = parRec.getFieldValue('shipattention');
    if (destAtten === null) {destAtten = 'Receiving';}
    var destAddree = parRec.getFieldValue('shipaddressee');
    if (destAddree === null) {destAddree = 'Receiving';}
    var destAddr1 = parRec.getFieldValue('shipaddr1');
    var destAddr2 = parRec.getFieldValue('shipaddr2');
    var destCity = parRec.getFieldValue('shipcity');
    var destState = parRec.getFieldValue('shipstate');
    var destZip = parRec.getFieldValue('shipzip');
    var destCountry = parRec.getFieldValue('shipcountry');
    var shipDate = new Date(); //parRec.getFieldValue('trandate');
    //var shipDate = parRec.getFieldValue('trandate');
    var shipCur = parRec.getFieldValue('currency');
    var decAmt = parRec.getFieldValue('total');
    var shortShipZip = destZip.substr(0, 5);
    //var shortOrigZip = origZip.substr(0,5);
    nlapiLogExecution('DEBUG', 'Progress indicator', 'inital variables docNum' + docNum);
    var shipLoad = nlapiCreateRecord('customrecord_h5_shipment');
        shipLoad.setFieldValue('name', 'Shipment #' + docNum);
        shipLoad.setFieldValue('custrecord_h5_location',locationId);
        shipLoad.setFieldValue('custrecord_h5_shipper_addressee', locationAddressee);
        shipLoad.setFieldValue('custrecord_h5_shipper_addr_1', locationAddr1);
        shipLoad.setFieldValue('custrecord_h5_shipper_addr_2', locationAddr2);
        shipLoad.setFieldValue('custrecord_h5_shipper_city', locationCity);
        shipLoad.setFieldValue('custrecord_h5_shipper_state', locationState);
        shipLoad.setFieldValue('custrecord_h5_shipper_zip', locationZip);
        shipLoad.setFieldValue('custrecord_h5_shipper_country', locationCountry);
        shipLoad.setFieldValue('custrecord_h5_consignee', destCust);
        shipLoad.setFieldValue('custrecord_h5_so_parent_id', tranId);
        shipLoad.setFieldValue('custrecord_h5_ship_date', shipDate);
        shipLoad.setFieldValue('custrecord_h5_freight_bill_to', 5797);
        shipLoad.setFieldValue('custrecord_h5_consignee_attn', destAtten);
        shipLoad.setFieldValue('custrecord_h5_consignee_addree', destAddree);
        shipLoad.setFieldValue('custrecord_h5_consignee_addr1', destAddr1);
        shipLoad.setFieldValue('custrecord_h5_consignee_addr2', destAddr2);
        shipLoad.setFieldValue('custrecord_h5_consignee_city', destCity);
        shipLoad.setFieldValue('custrecord_h5_consignee_state', destState);
        shipLoad.setFieldValue('custrecord_h5_consignee_zip', destZip);
        shipLoad.setFieldValue('custrecord_h5_consignee_country', destCountry);
        shipLoad.setFieldValue('custrecord_h5_reference_delivery', refAtDest);
        shipLoad.setFieldValue('custrecord_h5_billing_type', 1);
        shipLoad.setFieldValue('custrecord_h5_shipment_status', 1);
        shipLoad.setFieldValue('custrecord_h5_shiprec_type', 1);
        shipLoad.setFieldValue('custrecord_h5_shipment_direction', 2);
        shipLoad.setFieldValue('custrecord_h5_shipment_type', 2);
        shipLoad.setFieldValue('custrecord_h5_ship_cur', shipCur);
        var shipLoadId = nlapiSubmitRecord(shipLoad);
        nlapiLogExecution('DEBUG', 'Progress indicator', 'ship rec created ' + shipLoadId);
        // var fils = [];
        // fils[0] = new nlobjSearchFilter('tranid', null, 'is', docNum);
        // fils[1] = new nlobjSearchFilter('mainline', null, 'is', 'F');
        // fils[2] = new nlobjSearchFilter('taxline', null, 'is', 'F');
        // fils[3] = new nlobjSearchFilter('custcol_h5_item_weight', null, 'isnotempty');
        // var cols = [];
        // cols[0] = new nlobjSearchColumn('item');
        // cols[1] = new nlobjSearchColumn('custcol_h5_item_weight');
        // cols[2] = new nlobjSearchColumn('quantity');
        // //cols[3] = new nlobjSearchColumn('department');
        // cols[3] = new nlobjSearchColumn('custcol_h5_packing_container');
        // cols[4] = new nlobjSearchColumn('custcol_h5_max_cq');
        // cols[5] = new nlobjSearchColumn('rate');
        // cols[6] = new nlobjSearchColumn('amount');
        // var lineItems = nlapiSearchRecord('salesorder', null, fils, cols);
    var lineItems = nlapiSearchRecord("salesorder",null,
        [
            ["type","anyof","SalesOrd"],
            "AND",
            ["internalid","anyof",tranId],
            "AND",
            ["mainline","is","F"],
            "AND",
            ["taxline","is","F"],
            "AND",
            ["item.type","anyof","Assembly","InvtPart"]
        ],
        [
            new nlobjSearchColumn("internalid"),
            new nlobjSearchColumn("item"),
            new nlobjSearchColumn("memo"),
            new nlobjSearchColumn("custcol_h5_item_weight"),
            new nlobjSearchColumn("quantity"),
            new nlobjSearchColumn("rate"),
            new nlobjSearchColumn("amount"),
            new nlobjSearchColumn("quantityuom")
        ]
    );
        nlapiLogExecution('DEBUG', 'Progress indicator', 'saved search ran' + lineItems.length);
        var packageItem = [];
        var packLineName = [];
        var packageWeight = [];
        var packageQty = [];
        var packageDept = [];
        var packageContainer = [];
        var packageContCubicInches = [];
        var packType = [];
        var packLength = [];
        var packHeight = [];
        var packWidth = [];
        var packWeight = [];
        var packUnitPrice = [];
        var packExtendedTotal = [];
        var packCountryofOrigin = [];
        var packHTS = [];
        var packNMFC = [];
        var packNMFCDesc = [];
        var packClass = [];
        var packCost = [];
        for (var z = 0; z < lineItems.length; z++) {
            packageItem.push(lineItems[z].getValue('item'));
            packageWeight.push(Number(lineItems[z].getValue('custcol_h5_item_weight')));
            packageQty.push(lineItems[z].getValue('quantityuom'));
            //packageDept.push(lineItems[z].getValue('department'));
            // packageContainer.push(lineItems[z].getValue('custcol_h5_packing_container'));
            // packageContCubicInches.push(lineItems[z].getValue('custcol_h5_max_cq'));
            packUnitPrice.push(lineItems[z].getValue('rate'));
            packExtendedTotal.push(lineItems[z].getValue('amount'));
            // packHTS.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_hts'));
            packLineName.push(lineItems[z].getValue('memo'));
            // packType.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_type'));
            // packLength.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_length'));
            // packHeight.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_height'));
            // packWidth.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_width'));
            // packWeight.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_weight'));
            // packNMFC.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_nmfc_assignment'));
            // packNMFCDesc.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_nmfc_desc'));
            //packClass.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_nmfc_frt_class'));
            packClass.push('50');
            // packCost.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_cost'));


            var packLoad = nlapiCreateRecord('customrecord_h5_shipment_line');
            packLoad.setFieldValue('custrecord_h5_shipment_parent', shipLoadId);
            packLoad.setFieldValue('custrecord_h5_ship_line_item_desc', packLineName[z]);
            packLoad.setFieldValue('custrecord_h5_piece_count', Number(packageQty[z]));
            packLoad.setFieldValue('custrecord_h5_packagetype', 1);
            packLoad.setFieldValue('custrecord_h5_inventoryunits', packageQty[z]);
            packLoad.setFieldValue('custrecord_h5_weight', Number(Math.round(packageWeight[z] * packageQty[z])));
            // packLoad.setFieldValue('custrecord_h5_length', packLength[z]);
            // packLoad.setFieldValue('custrecord_h5_height', packHeight[z]);
            // packLoad.setFieldValue('custrecord_h5_width', packWidth[z]);
            // packLoad.setFieldValue('custrecord_h5_package_cost', packCost[z]);
            packLoad.setFieldValue('custrecord_h5_freight_class_value', packClass[z]);
            // packLoad.setFieldValue('custrecord_h5_nmfc_number', packNMFC[z]);
            // packLoad.setFieldValue('custrecord_h5_nmfc_desc', packNMFCDesc[z]);
            // packLoad.setFieldValue('custrecord_h5_packingcontainer', packageContainer[z]);
            packLoad.setFieldValue('custrecord_h5_unitprice', packUnitPrice[z]);
            packLoad.setFieldValue('custrecord_h5_extendedtotal', packExtendedTotal[z]);
            // packLoad.setFieldValue('custrecord_h5_cont_hts', packHTS[z]);
            nlapiSubmitRecord(packLoad);
        }
    nlapiLogExecution('DEBUG', 'ShipRec Progress', 'Shipment Lines Created.' + shipLoadId);
    //response.write(shipLoadId);
    return shipLoadId;
}

function estShipGen(tranId, batId, tranType) {
  var parRec = nlapiLoadRecord(tranType, tranId);
  var docNum = parRec.getFieldValue('tranid');
  var locationId = parRec.getFieldValue('location');
  var locationAddressee = parRec.getFieldText('location');
  var locationRecord = nlapiLoadRecord('location', locationId, null, null);
  var locationAddr1 = locationRecord.getFieldValue('addr1');
  var locationAddr2 = locationRecord.getFieldValue('addr2');
  var locationCity = nlapiLookupField('location', locationId, 'city');
  var locationState = nlapiLookupField('location', locationId, 'state');
  var locationZip = nlapiLookupField('location', locationId, 'zip');
  var locationCountry = nlapiLookupField('location', locationId, 'country');
  nlapiLogExecution('DEBUG', 'Progress indicator', 'shipperName ' + locationAddressee);
  nlapiLogExecution('DEBUG', 'Progress indicator', 'shipperAddr1 ' + locationAddr1);
  nlapiLogExecution('DEBUG', 'Progress indicator', 'shipperAddr2 ' + locationAddr2);
  nlapiLogExecution('DEBUG', 'Progress indicator', 'shipperCity ' + locationCity);
  nlapiLogExecution('DEBUG', 'Progress indicator', 'shipperState ' + locationState);
  nlapiLogExecution('DEBUG', 'Progress indicator', 'shipperZip ' + locationZip);
  var refAtDest = parRec.getFieldValue('otherrefnum');
  var destCust = parRec.getFieldValue('entity');
  var destAtten = parRec.getFieldValue('shipattention');
  if (destAtten === null) {destAtten = 'Receiving';}
  var destAddree = parRec.getFieldValue('shipaddressee');
  if (destAddree === null) {destAddree = 'Receiving';}
  var destAddr1 = parRec.getFieldValue('shipaddr1');
  var destAddr2 = parRec.getFieldValue('shipaddr2');
  var destCity = parRec.getFieldValue('shipcity');
  var destState = parRec.getFieldValue('shipstate');
  var destZip = parRec.getFieldValue('shipzip');
  var destCountry = parRec.getFieldValue('shipcountry');
  var shortShipZip = destZip.substr(0, 5);
  var shipDate = new Date();
  var shipCur = parRec.getFieldValue('currency');
  var decAmt = parRec.getFieldValue('total');
  //Create Shipment header
  var shipLoad = nlapiCreateRecord('customrecord_h5_shipment');
      shipLoad.setFieldValue('name', 'Shipment #' + docNum);
      shipLoad.setFieldValue('custrecord_h5_location',locationId);
      shipLoad.setFieldValue('custrecord_h5_shipper_addressee', locationAddressee);
      shipLoad.setFieldValue('custrecord_h5_shipper_addr_1', locationAddr1);
      shipLoad.setFieldValue('custrecord_h5_shipper_addr_2', locationAddr2);
      shipLoad.setFieldValue('custrecord_h5_shipper_city', locationCity);
      shipLoad.setFieldValue('custrecord_h5_shipper_state', locationState);
      shipLoad.setFieldValue('custrecord_h5_shipper_zip', locationZip);
      shipLoad.setFieldValue('custrecord_h5_shipper_country', locationCountry);
      shipLoad.setFieldValue('custrecord_h5_consignee', destCust);
      shipLoad.setFieldValue('custrecord_h5_so_parent_id', tranId);
      shipLoad.setFieldValue('custrecord_h5_ship_date', shipDate);
      shipLoad.setFieldValue('custrecord_h5_freight_bill_to', 119);
      shipLoad.setFieldValue('custrecord_h5_consignee_attn', destAtten);
      shipLoad.setFieldValue('custrecord_h5_consignee_addree', destAddree);
      shipLoad.setFieldValue('custrecord_h5_consignee_addr1', destAddr1);
      shipLoad.setFieldValue('custrecord_h5_consignee_addr2', destAddr2);
      shipLoad.setFieldValue('custrecord_h5_consignee_city', destCity);
      shipLoad.setFieldValue('custrecord_h5_consignee_state', destState);
      shipLoad.setFieldValue('custrecord_h5_consignee_zip', destZip);
      shipLoad.setFieldValue('custrecord_h5_consignee_country', destCountry);
      shipLoad.setFieldValue('custrecord_h5_reference_delivery', refAtDest);
      shipLoad.setFieldValue('custrecord_h5_billing_type', 1);
      shipLoad.setFieldValue('custrecord_h5_shipment_status', 6);
      shipLoad.setFieldValue('custrecord_h5_shiprec_type', 1);
      shipLoad.setFieldValue('custrecord_h5_shipment_direction', 2);
      shipLoad.setFieldValue('custrecord_h5_shipment_type', 2);
      shipLoad.setFieldValue('custrecord_h5_ship_cur', shipCur);
      var shipLoadId = nlapiSubmitRecord(shipLoad);
      nlapiLogExecution('DEBUG', 'Progress indicator', 'ship rec created ' + shipLoadId);
      //Create Shipment Lines
      var fils = [];
       fils[0] = new nlobjSearchFilter('tranid', null, 'is', docNum);
       fils[1] = new nlobjSearchFilter('mainline', null, 'is', 'F');
       fils[2] = new nlobjSearchFilter('taxline', null, 'is', 'F');
       fils[3] = new nlobjSearchFilter('custcol_h5_item_weight', null, 'isnotempty');
      var cols = [];
       cols[0] = new nlobjSearchColumn('item');
       cols[1] = new nlobjSearchColumn('custcol_h5_item_weight');
       cols[2] = new nlobjSearchColumn('quantity');
       cols[3] = new nlobjSearchColumn('custcol_h5_packing_container');
       cols[4] = new nlobjSearchColumn('custcol_h5_max_cq');
       cols[5] = new nlobjSearchColumn('rate');
       cols[6] = new nlobjSearchColumn('amount');
      var lineItems = nlapiSearchRecord('estimate', null, fils, cols);
      nlapiLogExecution('DEBUG', 'Progress indicator', 'saved search ran' + lineItems.length);
      var packageItem = [];
      var packLineName = [];
      var packageWeight = [];
      var packageQty = [];
      var packageDept = [];
      var packageContainer = [];
      var packageContCubicInches = [];
      var packType = [];
      var packLength = [];
      var packHeight = [];
      var packWidth = [];
      var packWeight = [];
      var packUnitPrice = [];
      var packExtendedTotal = [];
      var packCountryofOrigin = [];
      var packHTS = [];
      var packNMFC = [];
      var packNMFCDesc = [];
      var packClass = [];
      var packCost = [];
      for (var z = 0; z < lineItems.length; z++) {
          packageItem.push(lineItems[z].getValue('item'));
          packageWeight.push(Number(lineItems[z].getValue('custcol_h5_item_weight')));
          packageQty.push(lineItems[z].getValue('quantity'));
          packageContainer.push(lineItems[z].getValue('custcol_h5_packing_container'));
          packageContCubicInches.push(lineItems[z].getValue('custcol_h5_max_cq'));
          packUnitPrice.push(lineItems[z].getValue('rate'));
          packExtendedTotal.push(lineItems[z].getValue('amount'));
          packHTS.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_hts'));
          packLineName.push(nlapiLookupField('item', packageItem[z], 'description'));
          packType.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_type'));
          packLength.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_length'));
          packHeight.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_height'));
          packWidth.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_width'));
          packWeight.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_weight'));
          //packNMFC.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_nmfc_assignment'));
          //packNMFCDesc.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_nmfc_desc'));
          packClass.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_nmfc_frt_class'));
          //packCost.push(nlapiLookupField('customrecord_h5_containers', packageContainer[z], 'custrecord_h5_cont_cost'));

          nlapiLogExecution('DEBUG', 'formed arrays', 'got package containers length is ' + packageContainer.length);
          nlapiLogExecution('DEBUG', 'formed arrays', 'max_cq ' + packageContCubicInches);
          nlapiLogExecution('DEBUG', 'formed arrays', 'item qty ' + packageQty);
          nlapiLogExecution('DEBUG', 'formed arrays', 'item weight ' + packageWeight);
          nlapiLogExecution('DEBUG', 'formed arrays', 'unitprice ' + packUnitPrice);
          nlapiLogExecution('DEBUG', 'formed arrays', 'amount ' + packExtendedTotal);
          nlapiLogExecution('DEBUG', 'formed arrays', 'HTS ' + packHTS);

          var packLoad = nlapiCreateRecord('customrecord_h5_shipment_line');
          packLoad.setFieldValue('custrecord_h5_shipment_parent', shipLoadId);
          packLoad.setFieldValue('custrecord_h5_ship_line_item_desc', packLineName[z]);
          packLoad.setFieldValue('custrecord_h5_piece_count', Math.ceil(packageQty[z] / packageContCubicInches[z]));
          packLoad.setFieldValue('custrecord_h5_packagetype', packType[z]);
          packLoad.setFieldValue('custrecord_h5_inventoryunits', packageQty[z]);
          packLoad.setFieldValue('custrecord_h5_weight', Number(Math.round(packageWeight[z] * packageQty[z]) + Number(packWeight[z]) * Math.ceil(packageQty[z] / packageContCubicInches[z])));
          packLoad.setFieldValue('custrecord_h5_length', packLength[z]);
          packLoad.setFieldValue('custrecord_h5_height', packHeight[z]);
          packLoad.setFieldValue('custrecord_h5_width', packWidth[z]);
          packLoad.setFieldValue('custrecord_h5_package_cost', packCost[z]);
          packLoad.setFieldValue('custrecord_h5_freight_class_value', packClass[z]);
          //packLoad.setFieldValue('custrecord_h5_nmfc_number', packNMFC[z]);
          //packLoad.setFieldValue('custrecord_h5_nmfc_desc', packNMFCDesc[z]);
          packLoad.setFieldValue('custrecord_h5_packingcontainer', packageContainer[z]);
          packLoad.setFieldValue('custrecord_h5_unitprice', packUnitPrice[z]);
          packLoad.setFieldValue('custrecord_h5_extendedtotal', packExtendedTotal[z]);
          packLoad.setFieldValue('custrecord_h5_htsnumber', packHTS[z]);
          nlapiSubmitRecord(packLoad);
      }
  nlapiLogExecution('DEBUG', 'ShipRec Progress', 'Shipment Lines Created.');
  //response.write(shipLoadId);
  return shipLoadId;
}

function uniques(arr) {
    var a = [];
    for (var i = 0, l = arr.length; i < l; i++)
        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
            a.push(arr[i]);
    return a;
}

function getSum(total, num) {
    return total + num;
}

function add(a, b) {
    return Number(a) + Number(b);
}
