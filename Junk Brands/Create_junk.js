var products = [
    {
        "name": "0",
        "number": "0",
        "display": "",
        "fabric": "",
        "quantity": "",
        "hangTag": "",
        "basePrice": 15.99,
        "wholesalePrice": 8.00
    },
    {
        "name": "BBL",
        "number": "1",
        "display": "Big Bang Lite",
        "fabric": 59,
        "quantity": 0.04861111,
        "hangTag": 54,
        "basePrice": 15.99,
        "wholesalePrice": 8.00
    },
    {
        "name": "FT",
        "number": "2",
        "display": "Flex Tie",
        "fabric": 2383,
        "quantity": 0.09166667,
        "hangTag": 53,
        "basePrice": 17.99,
        "wholesalePrice": 9.00
    },
    {
        "name": "BB",
        "number": "3",
        "display": "Big Bang",
        "fabric": 59,
        "quantity": 0.09722222,
        "hangTag": 55,
        "basePrice": 19.99,
        "wholesalePrice": 10.00
    },
    {
        "name": "BAL",
        "number": "4",
        "display": "Baller",
        "fabric": 59,
        "quantity": 0.0448718,
        "hangTag": 56,
        "basePrice": 14.99,
        "wholesalePrice": 7.50
    },
    {
        "name": "TB",
        "number": "5",
        "display": "Thin Band",
        "fabric": 59,
        "quantity": 0.02536232,
        "hangTag": 57,
        "basePrice": 12.99,
        "wholesalePrice": 6.50
    },
    {
        "name": "FTR",
        "number": "6",
        "display": "",
        "fabric": "",
        "quantity": "",
        "hangTag": "",
        "basePrice": 15.99,
        "wholesalePrice": 8.00
    },
    {
        "name": "CT",
        "number": "7",
        "display": "Chalk Topper",
        "fabric": 2383,
        "quantity": 0.19444444,
        "hangTag": 58,
        "basePrice": 15.99,
        "wholesalePrice": 12.50
    },
    {
        "name": "GTR",
        "number": "8",
        "display": "Neck Gator",
        "fabric": 59,
        "quantity": 0.14583333,
        "hangTag": 58,
        "basePrice": 19.99,
        "wholesalePrice": 10.00
    },
    {
        "name": "EW",
        "number": "9",
        "display": "Ear Warmer",
        "fabric": 60,
        "quantity": 0.09259259,
        "hangTag": 14851,
        "basePrice": 19.99,
        "wholesalePrice": 10.00
    },
    {
        "name": "TS",
        "number": "10",
        "display": "T-Shirt",
        "fabric": 59,
        "quantity": 999,
        "hangTag": 59,
        "basePrice": 19.99,
        "wholesalePrice": 19.99
    },
    {
        "name": "DC",
        "number": "11",
        "display": "to be determined",
        "fabric": 59,
        "quantity": 999,
        "hangTag": 59,
        "basePrice": 15.99,
        "wholesalePrice": 8.00
    },
    {
        "name": "CS",
        "number": "12",
        "display": "to be determined",
        "fabric": 59,
        "quantity": 999,
        "hangTag": 59,
        "basePrice": 15.99,
        "wholesalePrice": 8.00
    },
    {
        "name": "BN",
        "number": "13",
        "display": "to be determined",
        "fabric": 59,
        "quantity": 999,
        "hangTag": 59,
        "basePrice": 15.99,
        "wholesalePrice": 8.00
    },
    {
        "name": "Sock (CW)",
        "number": "14",
        "display": "Crew Sock",
        "fabric": 12944,
        "quantity": 1,
        "hangTag": 12946,
        "basePrice": 24.99,
        "wholesalePrice": 24.99
    },
    {
        "name": "WGTR",
        "number": "15",
        "display": "Winter Gaiter",
        "fabric": 13247,
        "quantity": .14583333,
        "hangTag": 58,
        "basePrice": 24.99,
        "wholesalePrice": 12.50
    },
];
var fabrics = [
    {
        "name": "",
        "number": "",
        "itemid": ""
    },
    {
        "name": "TT",
        "number": "1",
        "itemid": "59"
    },
    {
        "name": "FLC",
        "number": "2",
        "itemid": "60"
    },
    {
        "name": "SG",
        "number": "3",
        "itemid": "61"
    },
    {
        "name": "RB",
        "number": "4",
        "itemid": "62"
    },
    {
        "name": "FHR",
        "number": "5",
        "itemid": "63"
    },
    {
        "name": "NP",
        "number": "6",
        "itemid": "64"
    },
    {
        "name": "NL",
        "number": "7",
        "itemid": "65"
    },
    {
        "name": "NY",
        "number": "8",
        "itemid": "66"
    },
    {
        "name": "MT",
        "number": "9",
        "itemid": "67"
    },
    {
        "name": "BANNER",
        "number": "10",
        "itemid": "68"
    },
    {
        "name": "HG",
        "number": "11",
        "itemid": "69"
    },
    {
        "name": "",
        "number": "12",
        "itemid": ""
    },
    {
        "name": "HNM",
        "number": "13",
        "itemid": "71"
    },
    {
        "name": "HNP",
        "number": "14",
        "itemid": "72"
    },
    {
        "name": "MB",
        "number": "15",
        "itemid": "73"
    },
    {
        "name": "HV",
        "number": "16",
        "itemid": "74"
    },
    {
        "name": "HT",
        "number": "17",
        "itemid": "75"
    },
    {
        "name": "PS",
        "number": "18",
        "itemid": "2383"
    }
];


//New Item Number	UPC	Display Name	Detailed Description	SKU	Shopify Product ID	productType	fabricType	royaltyId	teamId	stitchColor
function createAssemblyItem(newItemNumber, upc, displayName, detaildescription, sku, shopifyId, productType, fabricType, royaltyId, teamCode, stitchColor) {
    //console.log('create assembly started');
    //console.log('fabricType is '+fabricType);
    var newAssemblyItem = nlapiCreateRecord('assemblyitem');
    newAssemblyItem.setFieldValue('itemid', newItemNumber);
    newAssemblyItem.setFieldValue('upccode', upc);
    newAssemblyItem.setFieldValue('displayname', displayName);
    // newAssemblyItem.setFieldValue('vendorname', 'Junk Brands');
    newAssemblyItem.setFieldValue('description', displayName);
    newAssemblyItem.setFieldValue('storedetaileddescription', detaildescription);
    newAssemblyItem.setFieldValue('includechildren', 'T');
    newAssemblyItem.setFieldValue('costingmethod', 'AVG');
    newAssemblyItem.setFieldValue('costcategory', '4');
    newAssemblyItem.setFieldValue('department', '4');
    newAssemblyItem.setFieldValue('class', '8');
    newAssemblyItem.setFieldValue('matchbilltoreceipt', 'F');
    newAssemblyItem.setFieldValue('usebins', 'T');
    newAssemblyItem.setFieldValue('atpmethod', 'CUMULATIVE_ATP_WITH_LOOK_AHEAD');
    newAssemblyItem.setFieldValue('supplyreplenishmentmethod', 'REORDER_POINT');
    newAssemblyItem.setFieldValue('autopreferredstocklevel', 'F');
    newAssemblyItem.setFieldValue('autoreorderpoint', 'F');
    newAssemblyItem.setFieldValue('autoleadtime', 'F');
    newAssemblyItem.setFieldValue('seasonaldemand', 'F');
    newAssemblyItem.setFieldValue('manufacturer', 'JUNK Brands');
    newAssemblyItem.setFieldValue('manufactureraddr1', '1004 NW 11th ST');
    newAssemblyItem.setFieldValue('manufacturerstate', 'AR');
    newAssemblyItem.setFieldValue('manufacturerzip', '72712');
    newAssemblyItem.setFieldValue('manufacturercity', 'Bentonville');
    newAssemblyItem.setFieldValue('countryofmanufacture', 'US');
    newAssemblyItem.setFieldValue('tracklandedcost', 'F');
    newAssemblyItem.setFieldValue('offersupport', 'T');
    newAssemblyItem.setFieldValue('location', '1'); //nlloc ???
    newAssemblyItem.setFieldValue('costestimatetype', 'AVGCOST');
    newAssemblyItem.setFieldValue('weight', '2');
    newAssemblyItem.setFieldValue('weightunit', '2');
    newAssemblyItem.setFieldValue('cogsaccount', '212');
    newAssemblyItem.setFieldValue('subsidiary', '2');
    newAssemblyItem.setFieldValue('incomeaccount', '54');
    newAssemblyItem.setFieldValue('assetaccount', '211');
    newAssemblyItem.setFieldValue('billpricevarianceacct', '');
    newAssemblyItem.setFieldValue('billqtyvarianceacct', '');
    newAssemblyItem.setFieldValue('wipacct', '538');
    newAssemblyItem.setFieldValue('wipvarianceacct', '305');
    newAssemblyItem.setFieldValue('scrapacct', '303');
    newAssemblyItem.setFieldValue('istaxable', 'T');
    newAssemblyItem.setFieldValue('taxschedule', '1');
    newAssemblyItem.setFieldValue('custitem_atlas_engineer_complete', 'T');
    newAssemblyItem.setFieldValue('custitem_product_type', productType);
    newAssemblyItem.setFieldValue('custitem_fabric_type', fabricType);
    newAssemblyItem.setFieldValue('custitem_royalty_id', royaltyId);
    newAssemblyItem.setFieldValue('custitem_team_code', teamCode);
    newAssemblyItem.setFieldValue('custitem_stitch_color', stitchColor);
    newAssemblyItem.setFieldValue('custitem_sku', sku);
    newAssemblyItem.setFieldValue('custitem_junk_image_file', sku + '.tif');
    newAssemblyItem.setFieldValue('custitem_shopifyproductid', shopifyId);




    
    //set main location to WIP = true
    newAssemblyItem.selectLineItem('locations', 1);
    newAssemblyItem.setCurrentLineItemValue('locations', 'iswip', 'T');
    newAssemblyItem.commitLineItem('locations');
    //console.log('add component members');
    //add fabric component member
    newAssemblyItem.selectNewLineItem('member');
    newAssemblyItem.setCurrentLineItemValue('member', 'item', fabrics[fabricType].itemid);
    newAssemblyItem.setCurrentLineItemValue('member', 'quantity', products[productType].quantity);
    newAssemblyItem.setCurrentLineItemValue('member', 'custpage_member_autoissue', 'T');
    newAssemblyItem.setCurrentLineItemValue('member', 'custpage_member_process', '515');
    newAssemblyItem.commitLineItem('member');
    //add hangtag component member
    newAssemblyItem.selectNewLineItem('member');
    newAssemblyItem.setCurrentLineItemValue('member', 'item', products[productType].hangTag);
    newAssemblyItem.setCurrentLineItemValue('member', 'quantity', '1');
    newAssemblyItem.setCurrentLineItemValue('member', 'custpage_member_autoissue', 'T');
    newAssemblyItem.setCurrentLineItemValue('member', 'custpage_member_process', '518');
    newAssemblyItem.commitLineItem('member');
    newAssemblyItem.selectLineItem('price1', '1');
    newAssemblyItem.setCurrentLineItemMatrixValue('price1', 'price', 1, products[productType].basePrice);
    newAssemblyItem.commitLineItem('price1');
    newAssemblyItem.selectLineItem('price1', '3');
    newAssemblyItem.setCurrentLineItemMatrixValue('price1', 'price', 1, products[productType].wholesalePrice);
    newAssemblyItem.commitLineItem('price1');
    var newAssemblyItemRecId = nlapiSubmitRecord(newAssemblyItem);
    //console.log('assembly created');
    return newAssemblyItemRecId;
}

function createBOMDetail(productType, fabricType, newAssemblyItemRecId) {
    //console.log('create BOM Detail started');
    //fabric
    var bomDetailRecA = nlapiCreateRecord('customrecord_iqf_bom_detail');
    bomDetailRecA.setFieldValue('custrecord_iqf_assembly_item', newAssemblyItemRecId);
    bomDetailRecA.setFieldValue('custrecord_iqf_auto_issue', 'T');
    bomDetailRecA.setFieldValue('custrecord_iqf_member_item', fabrics[fabricType].itemid);
    bomDetailRecA.setFieldValue('custrecord_iqf_occurrence', 1);
    bomDetailRecA.setFieldValue('custrecord_iqf_oper_type', 515);
    nlapiSubmitRecord(bomDetailRecA);
    //hang tag
    var bomDetailRecB = nlapiCreateRecord('customrecord_iqf_bom_detail');
    bomDetailRecB.setFieldValue('custrecord_iqf_assembly_item', newAssemblyItemRecId);
    bomDetailRecB.setFieldValue('custrecord_iqf_auto_issue', 'T');
    bomDetailRecB.setFieldValue('custrecord_iqf_member_item', products[productType].hangTag);
    bomDetailRecB.setFieldValue('custrecord_iqf_occurrence', 1);
    bomDetailRecB.setFieldValue('custrecord_iqf_oper_type', 518);
    nlapiSubmitRecord(bomDetailRecB);
    //console.log('create BOM Detail finished');
    return true;
}

function createMfgRoutingECOM(newAssemblyItemRecId, newItemNumber, productType) {
    var operationsequence = ['10','20','30','40','50'];
    var operationname = ['Print','Press','Cut','Team Sew','Hang Tag'];
    var manufacturingworkcenter = ['211008','211009','211010','24897','211011'];
    var manufacturingworkcenter_display = ['Print Scrap Ecom','Press Scrap Ecom','Cut Scrap Ecom','Team Sew Scrap Ecom','Hang Tag Scrap Ecom'];


    //console.log('create ECOM Router Started');
    var newAssemblyItemRecId = newAssemblyItemRecId;
    var newItemNumber = newItemNumber;
    var productType = productType;
    var newMfgRouting = nlapiCreateRecord('manufacturingrouting');
    newMfgRouting.setFieldValue('item', newAssemblyItemRecId);
    newMfgRouting.setFieldValue('location', 1);
    newMfgRouting.setFieldValue('subsidiary', 2);
    newMfgRouting.setFieldValue('name', newItemNumber + '_ECOM_RT');
    newMfgRouting.setFieldValue('isdefault', "F");

    for (i=0;i < operationsequence.length;i++){
        newMfgRouting.selectNewLineItem('routingstep');
        newMfgRouting.setCurrentLineItemValue('routingstep', 'operationsequence', operationsequence[i]);
        newMfgRouting.setCurrentLineItemValue('routingstep', 'operationname', operationname[i]);
        newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingworkcenter', manufacturingworkcenter[i]);
        newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingworkcenter_display', manufacturingworkcenter_display[i]);
        newMfgRouting.setCurrentLineItemValue('routingstep', 'runrate', '1');
        newMfgRouting.setCurrentLineItemValue('routingstep', 'setuptime', '0');
        newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingcosttemplate', '1');
        newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingcosttemplate_display', 'Labor Run Cost Template');
        newMfgRouting.setCurrentLineItemValue('routingstep', 'laborresources', '1');
        newMfgRouting.setCurrentLineItemValue('routingstep', 'machineresources', '1');
        newMfgRouting.commitLineItem('routingstep');
    }
    var newMfgRoutingRecId = nlapiSubmitRecord(newMfgRouting);
    //console.log('create ECOM Router Finished');
    //console.log('create WB Operation Started');
    var custrecordworkinstructionstep = ['10','20','30','40','50'];
    var custrecordiqfworkinstructionop = ['514','515','516','517','518'];
    var custrecordiqfworkinstructionworkcenter = ['211008','211009','211010','24897','211011'];
    var RTopAssetArray =  ['13','12','10','7','11'];
    for (x=0;x < custrecordworkinstructionstep.length; x++) {
        var newWBOperation = nlapiCreateRecord('customrecordiqfworkinstructions');
        newWBOperation.setFieldValue('custrecordiqfworkinstructionitem', newAssemblyItemRecId);
        newWBOperation.setFieldValue('custrecordmfgrouting', newMfgRoutingRecId);
        newWBOperation.setFieldValue('custrecordworkinstructionstep', custrecordworkinstructionstep[x]);
        newWBOperation.setFieldValue('custrecordiqfworkinstructionop', custrecordiqfworkinstructionop[x]);
        newWBOperation.setFieldValue('custrecordiqfworkinstructionworkcenter', custrecordiqfworkinstructionworkcenter[x]);
        newWBOperation.setFieldValue('custrecordiqfworkinstructionsam', '1');
        newWBOperation.setFieldValue('custrecordiqfworkinstructionlagtype', 2);
        newWBOperation.setFieldValue('name', newItemNumber + '_ECOM_RT_' + operationsequence[x]);
        var newWBOperationsId = nlapiSubmitRecord(newWBOperation);
        //console.log('create WB Operation Finished');
        //console.log('create WB Asset Started');
        var newWBAsset = nlapiCreateRecord('customrecordiqfmfgworkbenchrates');
        newWBAsset.setFieldValue('custrecordiqfworkbenchrateop', newWBOperationsId);
        var RTopAssetArraySEW = '';
        if (RTopAssetArray[x] == '7' &&  custrecordworkinstructionstep[x] == '40' && productType == 1) {RTopAssetArraySEW = '7'}
        else if (RTopAssetArray[x] == '7' &&  custrecordworkinstructionstep[x] == '40' && productType == 2) {RTopAssetArraySEW = '4'}
        else {RTopAssetArraySEW = '9'}
        newWBAsset.setFieldValue('custrecordiqfworkbenchrateasset', RTopAssetArraySEW);
        newWBAsset.setFieldValue('custrecord_iqity_wbrate_priority', '1');
        nlapiSubmitRecord(newWBAsset);
    }
    return true;
}

function createMfgRoutingRT(newAssemblyItemRecId, newItemNumber, productType) {
    //console.log('create RT Router Started');
    var newAssemblyItemRecId = newAssemblyItemRecId;
    var newItemNumber = newItemNumber;
    var productType = productType;
    var sewMfgWorkCenter = '';
    if (productType == 1){sewMfgWorkCenter = '195199'}
    else if (productType == 2){sewMfgWorkCenter = '195201'}
    else {sewMfgWorkCenter = '195202'}
    var newMfgRouting = nlapiCreateRecord('manufacturingrouting');
    newMfgRouting.setFieldValue('item', newAssemblyItemRecId);
    newMfgRouting.setFieldValue('location', 1);
    newMfgRouting.setFieldValue('subsidiary', 2);
    newMfgRouting.setFieldValue('name', newItemNumber + '_RT');
    newMfgRouting.setFieldValue('isdefault', "T");
    newMfgRouting.selectNewLineItem('routingstep');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'operationsequence', '10');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'operationname', 'Print');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingworkcenter', '3433');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingworkcenter_display', 'Print');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'runrate', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'setuptime', '0');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingcosttemplate', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingcosttemplate_display', 'Labor Run Cost Template');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'laborresources', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'machineresources', '1');
    newMfgRouting.commitLineItem('routingstep');
    newMfgRouting.selectNewLineItem('routingstep');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'operationsequence', '20');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'operationname', 'Press');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingworkcenter', '24895');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingworkcenter_display', 'Press');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'runrate', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'setuptime', '0');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingcosttemplate', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingcosttemplate_display', 'Labor Run Cost Template');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'laborresources', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'machineresources', '1');
    newMfgRouting.commitLineItem('routingstep');
    newMfgRouting.selectNewLineItem('routingstep');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'operationsequence', '30');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'operationname', 'Cut');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingworkcenter', '24896');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingworkcenter_display', 'Cut');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'runrate', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'setuptime', '0');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingcosttemplate', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingcosttemplate_display', 'Labor Run Cost Template');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'laborresources', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'machineresources', '1');
    newMfgRouting.commitLineItem('routingstep');
    newMfgRouting.selectNewLineItem('routingstep');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'operationsequence', '40');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'operationname', 'Team Sew');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingworkcenter', sewMfgWorkCenter);
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingworkcenter_display', 'Team Sew');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'runrate', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'setuptime', '0');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingcosttemplate', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingcosttemplate_display', 'Labor Run Cost Template');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'laborresources', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'machineresources', '1');
    newMfgRouting.commitLineItem('routingstep');
    newMfgRouting.selectNewLineItem('routingstep');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'operationsequence', '50');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'operationname', 'Hang Tag');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingworkcenter', '24898');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingworkcenter_display', 'Hang Tag');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'runrate', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'setuptime', '0');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingcosttemplate', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'manufacturingcosttemplate_display', 'Labor Run Cost Template');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'laborresources', '1');
    newMfgRouting.setCurrentLineItemValue('routingstep', 'machineresources', '1');
    newMfgRouting.commitLineItem('routingstep');
    newMfgRoutingRecId = nlapiSubmitRecord(newMfgRouting);
    //console.log('create RT Router Finished');
    //console.log('create WB Operation Started');
    var newWBOperation10 = nlapiCreateRecord('customrecordiqfworkinstructions');
    newWBOperation10.setFieldValue('custrecordiqfworkinstructionitem', newAssemblyItemRecId);
    newWBOperation10.setFieldValue('custrecordmfgrouting', newMfgRoutingRecId);
    newWBOperation10.setFieldValue('custrecordworkinstructionstep', 10);
    newWBOperation10.setFieldValue('custrecordiqfworkinstructionop', 514);
    newWBOperation10.setFieldValue('custrecordiqfworkinstructionworkcenter', 3433);
    newWBOperation10.setFieldValue('custrecordiqfworkinstructionsam', '1');
    newWBOperation10.setFieldValue('custrecordiqfworkinstructionlagtype', 2);
    newWBOperation10.setFieldValue('name', newItemNumber + '_RT_10');
    var newWBOperation10Id = nlapiSubmitRecord(newWBOperation10);
    var newWBOperation20 = nlapiCreateRecord('customrecordiqfworkinstructions');
    newWBOperation20.setFieldValue('custrecordiqfworkinstructionitem', newAssemblyItemRecId);
    newWBOperation20.setFieldValue('custrecordmfgrouting', newMfgRoutingRecId);
    newWBOperation20.setFieldValue('custrecordworkinstructionstep', 20);
    newWBOperation20.setFieldValue('custrecordiqfworkinstructionop', 515);
    newWBOperation20.setFieldValue('custrecordiqfworkinstructionworkcenter', 24895);
    newWBOperation20.setFieldValue('custrecordiqfworkinstructionsam', 1);
    newWBOperation20.setFieldValue('custrecordiqfworkinstructionlagtype', 2);
    newWBOperation20.setFieldValue('name', newItemNumber + '_RT_20');
    var newWBOperation20Id = nlapiSubmitRecord(newWBOperation20);
    var newWBOperation30 = nlapiCreateRecord('customrecordiqfworkinstructions');
    newWBOperation30.setFieldValue('custrecordiqfworkinstructionitem', newAssemblyItemRecId);
    newWBOperation30.setFieldValue('custrecordmfgrouting', newMfgRoutingRecId);
    newWBOperation30.setFieldValue('custrecordworkinstructionstep', 30);
    newWBOperation30.setFieldValue('custrecordiqfworkinstructionop', 516);
    newWBOperation30.setFieldValue('custrecordiqfworkinstructionworkcenter', 24896);
    newWBOperation30.setFieldValue('custrecordiqfworkinstructionsam', '1');
    newWBOperation30.setFieldValue('custrecordiqfworkinstructionlagtype', 2);
    newWBOperation30.setFieldValue('name', newItemNumber + '_RT_30');
    var newWBOperation30Id = nlapiSubmitRecord(newWBOperation30);
    var newWBOperation40 = nlapiCreateRecord('customrecordiqfworkinstructions');
    newWBOperation40.setFieldValue('custrecordiqfworkinstructionitem', newAssemblyItemRecId);
    newWBOperation40.setFieldValue('custrecordmfgrouting', newMfgRoutingRecId);
    newWBOperation40.setFieldValue('custrecordworkinstructionstep', 40);
    newWBOperation40.setFieldValue('custrecordiqfworkinstructionop', 517);
    newWBOperation40.setFieldValue('custrecordiqfworkinstructionworkcenter', sewMfgWorkCenter);
    newWBOperation40.setFieldValue('custrecordiqfworkinstructionsam', '1');
    newWBOperation40.setFieldValue('custrecordiqfworkinstructionlagtype', 2);
    newWBOperation40.setFieldValue('name', newItemNumber + '_RT_40');
    var newWBOperation40Id = nlapiSubmitRecord(newWBOperation40);
    var newWBOperation50 = nlapiCreateRecord('customrecordiqfworkinstructions');
    newWBOperation50.setFieldValue('custrecordiqfworkinstructionitem', newAssemblyItemRecId);
    newWBOperation50.setFieldValue('custrecordmfgrouting', newMfgRoutingRecId);
    newWBOperation50.setFieldValue('custrecordworkinstructionstep', 50);
    newWBOperation50.setFieldValue('custrecordiqfworkinstructionop', 518);
    newWBOperation50.setFieldValue('custrecordiqfworkinstructionworkcenter', 24898);
    newWBOperation50.setFieldValue('custrecordiqfworkinstructionsam', '1');
    newWBOperation50.setFieldValue('custrecordiqfworkinstructionlagtype', 2);
    newWBOperation50.setFieldValue('name', newItemNumber + '_RT_50');
    var newWBOperation50Id = nlapiSubmitRecord(newWBOperation50);
    //console.log('create WB Operation Finished');
    //console.log('create WB Asset Started');
    //make WB Assets
    var newWBOperationsArray = [];
    newWBOperationsArray.push(newWBOperation10Id);
    newWBOperationsArray.push(newWBOperation20Id);
    newWBOperationsArray.push(newWBOperation30Id);
    newWBOperationsArray.push(newWBOperation40Id);
    newWBOperationsArray.push(newWBOperation50Id);
    var opNumberArray = ['10','20','30','40','50'];
    var RTopAssetArray =  [1,2,3,6,5];
    for (i=0;i<newWBOperationsArray.length; i++){
        var newWBAsset = nlapiCreateRecord('customrecordiqfmfgworkbenchrates');
        newWBAsset.setFieldValue('custrecordiqfworkbenchrateop', newWBOperationsArray[i]);
        newWBAsset.setFieldValue('custrecordiqfworkbenchrateasset', RTopAssetArray[i]);
        newWBAsset.setFieldValue('custrecord_iqity_wbrate_priority', '1');
        var newWBAssetId = nlapiSubmitRecord(newWBAsset);
        //console.log('create WB Asset Finished ' +newWBAssetId);
    }
    //console.log('create WB Asset Finished');
    return true;


}

function junkFile(request, response) {
    if (request.getMethod() == 'GET')
    {
        var form = nlapiCreateForm('Upload CSV to create JUNK:)');
        var fileField = form.addField('file', 'file', 'Select File');
        fileField.setMandatory(true);
        form.addSubmitButton();
        form.addResetButton();
        response.writePage(form);
    }
    else
    {
        var file = request.getFile("file");
        var contents = file.getValue();
        var parsed = contents.split(/\n|\n\r/);
        var csvArray = [];
        for (i = 0; i < parsed.length; i++) {
            csvArray.push(parsed[i].split(','));
        }
        for (j = 1; j < csvArray.length; j++) {
            var temp = csvArray[j];
            var last = temp[10].split('\r')[0];
            var newAssemblyItemRecId = createAssemblyItem(temp[0],temp[1],temp[2],temp[3],temp[4],temp[5],temp[6],temp[7],temp[8],temp[9],last);
            createBOMDetail(temp[6], temp[7], newAssemblyItemRecId);
            createMfgRoutingRT(newAssemblyItemRecId, temp[0], temp[6]);
            createMfgRoutingECOM(newAssemblyItemRecId, temp[0], temp[6]);
        }
        alert('Success!');
        // window.close();
    }
}