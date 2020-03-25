function createAssemblyItem(){
​
​
    var newItemNumber = document.getElementById('newItemNumber').value;
    var upc = document.getElementById('upc').value;
    var displayName = document.getElementById('displayName').value;
    var description = document.getElementById('description').value;
    var productType = document.getElementById('productType').value;
    var fabricType = document.getElementById('fabricType').value;
    var royalID = document.getElementById('royalID').value;
    var teamCode = document.getElementById('teamCode').value;
    var stichColor = document.getElementById('stichColor').value;
    var sku = document.getElementById('sku').value;
    var fileName = document.getElementById('fileName').value;
​
    var newItemNumber = '21310';
    var upc = '841382189118';
    var displayName = 'Your Inner Tiger BBL';
    var description = 'Your Inner Tiger BBL';
    var productType = '1';
    var fabricType = '1';
    var royalID = '';
    var teamCode = '';
    var stichColor = '94';
    var sku = 'YOURINNERTIGER_BBL';
    var fileName = 'YOURINNERTIGER_BBL.tif';
    var newAssemblyItem = nlapiCreateRecord('assemblyItem');
    newAssemblyItem.setFieldValue('itemid', newItemNumber);
    newAssemblyItem.setFieldValue('upccode', upc);
    newAssemblyItem.setFieldValue('displayname', displayName);
    // newAssemblyItem.setFieldValue('vendorname', 'Junk Brands');
    newAssemblyItem.setFieldValue('description', description);
    newAssemblyItem.setFieldValue('includechildren', 'T');
    newAssemblyItem.setFieldValue('costingmethod', 'AVG');
    newAssemblyItem.setFieldValue('costcategory', '4');
    newAssemblyItem.setFieldValue('matchbilltoreceipt', 'F');
    newAssemblyItem.setFieldValue('usebins', 'T');
    newAssemblyItem.setFieldValue('atpmethod', 'CUMULATIVE_ATP_WITH_LOOK_AHEAD');
    newAssemblyItem.setFieldValue('supplyreplenishmentmethod', 'REORDER_POINT');
    newAssemblyItem.setFieldValue('autopreferredstocklevel', 'F');
    newAssemblyItem.setFieldValue('autoleadtime', 'F');
    newAssemblyItem.setFieldValue('seasonaldemand', 'F');
    newAssemblyItem.setFieldValue('manufacturer', 'JUNK Brands');
    newAssemblyItem.setFieldValue('manufactureraddr1', '1004 NW 11th ST');
    newAssemblyItem.setFieldValue('manufacturerstate', 'AR');
    newAssemblyItem.setFieldValue('manufacturerzip', '72712');
    newAssemblyItem.setFieldValue('manufacturercity', 'Bentonville');
    newAssemblyItem.setFieldValue('countryofmanufacture', 'US');
    newAssemblyItem.setFieldValue('tracklandedcost', 'T');
​
​
    if (productType == "1") {
        newAssemblyItem.selectNewLineItem('member');
        newAssemblyItem.setCurrentLineItemValue('member','item', '59');
        newAssemblyItem.setCurrentLineItemValue('member','quantity', '0.04861111');
        newAssemblyItem.setCurrentLineItemValue('member','custpage_member_autoissue', 'T');
        newAssemblyItem.setCurrentLineItemValue('member','custpage_member_process', '515');
        newAssemblyItem.commitLineItem('member');
        newAssemblyItem.selectNewLineItem('member');
        newAssemblyItem.setCurrentLineItemValue('member','item', '54');
        newAssemblyItem.setCurrentLineItemValue('member','quantity', '1');
        newAssemblyItem.commitLineItem('member');
        newAssemblyItem.selectLineItem('price1','1');
        newAssemblyItem.setCurrentLineItemMatrixValue('price1','price', 1, '15.99');
        newAssemblyItem.commitLineItem('price1');
        newAssemblyItem.selectLineItem('price1','3');
        newAssemblyItem.setCurrentLineItemMatrixValue('price1','price', 1, '8.00');
        newAssemblyItem.commitLineItem('price1');
    } else {
        newAssemblyItem.selectNewLineItem('member');
        newAssemblyItem.setCurrentLineItemValue('member','item', '2383');
        newAssemblyItem.setCurrentLineItemValue('member','quantity', '0.09166667');
        newAssemblyItem.setCurrentLineItemValue('member','custpage_member_autoissue', 'T');
        newAssemblyItem.setCurrentLineItemValue('member','custpage_member_process', '518');
        newAssemblyItem.commitLineItem('member');
        newAssemblyItem.selectNewLineItem('member');
        newAssemblyItem.setCurrentLineItemValue('member','item', '53');
        newAssemblyItem.setCurrentLineItemValue('member','quantity', '1');
        newAssemblyItem.commitLineItem('member');
        newAssemblyItem.selectLineItem('price1','1');
        newAssemblyItem.setCurrentLineItemMatrixValue('price1','price', 1, '17.99');
        newAssemblyItem.commitLineItem('price1');
        newAssemblyItem.selectLineItem('price1','3');
        newAssemblyItem.setCurrentLineItemMatrixValue('price1','price', 1, '9.00');
        newAssemblyItem.commitLineItem('price1');
    }
​
    newAssemblyItem.setFieldValue('itemLocationLine1_location', 'Main Warehouse'); //nlloc ???
    newAssemblyItem.setFieldValue('costestimatetype', 'AVGCOST');
    newAssemblyItem.setFieldValue('weight', '2');
    newAssemblyItem.setFieldValue('weightunit', '2');
    newAssemblyItem.setFieldValue('itemPriceLine1_itemPriceTypeRef', 'Base Price');
    newAssemblyItem.setFieldValue('itemPriceLine1_currencyRef', 'USA');
    //newAssemblyItem.setFieldValue('itemPriceLine1_itemPrice', 'Base Price');
    newAssemblyItem.setFieldValue('itemPriceLine2_itemPriceTypeRef', 'Wholesale Base Price');
    newAssemblyItem.setFieldValue('itemPriceLine2_currencyRef', 'USA');
    //newAssemblyItem.setFieldValue('itemPriceLine2_itemPrice', 'Base Price');
    newAssemblyItem.setFieldValue('cogsaccount', '212');
    newAssemblyItem.setFieldValue('subsidiary', '2');
    newAssemblyItem.setFieldValue('incomeaccount', '54');
    newAssemblyItem.setFieldValue('assetaccount', '211');
    newAssemblyItem.setFieldValue('wipacct', '538');
    newAssemblyItem.setFieldValue('wipvarianceacct', '113');
    newAssemblyItem.setFieldValue('scrapacct', '303');
​
​
    newAssemblyItem.setFieldValue('istaxable', 'T');
    // newAssemblyItem.setFieldValue('purchasetaxcode', 'Taxable');
    newAssemblyItem.setFieldValue('taxschedule', '1');
    newAssemblyItem.setFieldValue('custitem_atlas_engineer_complete', 'T');
    newAssemblyItem.setFieldValue('custitem_product_type', productType);
    newAssemblyItem.setFieldValue('custitem_fabric_type', fabricType);
    newAssemblyItem.setFieldValue('custitem_royalty_id', royalID);
    newAssemblyItem.setFieldValue('custitem_team_code', teamCode);
    newAssemblyItem.setFieldValue('custitem_stitch_color', stichColor);
    newAssemblyItem.setFieldValue('custitem_sku', sku);
    newAssemblyItem.setFieldValue('custitem_junk_image_file', fileName);
    nlapiSubmitRecord(newAssemblyItem);
​
​
}
