/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */


define(['N/record', 'N/log', 'N/search', 'N/format', 'N/email','N/file', 'N/http', 'N/render','N/runtime'],
function (record, log, search, format, email, file, http, render, runtime){ 

//Creates the Prodcuts and Fabrics Objects
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
function createAssemblyItem(newItemNumber, upc, displayName, detaildescription, sku, shopifyId, productType, fabricType, royaltyId, teamCode, stitchColor){
    var objRecord = record.create({
        type: record.Type.ASSEMBLY_ITEM, // CHECK TO SEE IF RIGHT ASSEMBLY ITEM record reference link
        isDynamic: true
    });

    //#region Set Values for Assembly Item Record
  
    objRecord.setValue({
        fieldId: 'itemid',
        value: newItemNumber
    });

    objRecord.setValue({
        fieldId: 'upccode',
        value: upc
    });

    objRecord.setValue({
        fieldId: 'displayname',
        value: displayName
    });

    objRecord.setValue({
        fieldId: 'description',
        value: displayName
    });

    objRecord.setValue({
        fieldId: 'storedetaileddescription',
        value: detaildescription
    });

   
    objRecord.setValue({
        fieldId: 'manufacturer',
        value: 'JUNK Brands'
    });
    objRecord.setValue({
        fieldId: 'manufactureraddr1',
        value: '1004 NW 11th ST'
    });
    objRecord.setValue({
        fieldId: 'manufacturerstate',
        value: 'AR'
    });
    objRecord.setValue({
        fieldId: 'manufacturerzip',
        value: '72712'
    });
    objRecord.setValue({
        fieldId: 'manufacturercity',
        value: 'Bentonville'
    });
    objRecord.setValue({
        fieldId: 'countryofmanufacture',
        value: 'US'
    });
    objRecord.setValue({
        fieldId: 'tracklandedcost',
        value: 'F'
    });
    objRecord.setValue({
        fieldId: 'offersupport',
        value: 'T'
    });
    objRecord.setValue({
        fieldId: 'location',
        value: '1'
    });
    objRecord.setValue({
        fieldId: 'costestimatetype',
        value: 'AVGCOST'
    });
    objRecord.setValue({
        fieldId: 'weight',
        value: '2'
    });

    objRecord.setValue({
        fieldId: 'weightunit',
        value: '2'
    });
    objRecord.setValue({
        fieldId: 'cogsaccount',
        value: '212'
    });
    objRecord.setValue({
        fieldId: 'subsidiary',
        value: '2'
    });
    objRecord.setValue({
        fieldId: 'incomeaccount',
        value: '54'
    });
    objRecord.setValue({
        fieldId: 'assetaccount',
        value: '211'
    });
    objRecord.setValue({
        fieldId: 'billpricevarianceacct',
        value: ''
    });
    objRecord.setValue({
        fieldId: 'billqtyvarianceacct',
        value: ''
    });
    objRecord.setValue({
        fieldId: 'wipacct',
        value: '538'
    });
    objRecord.setValue({
        fieldId: 'wipvarianceacct',
        value: '305'
    });
    objRecord.setValue({
        fieldId: 'scrapacct',
        value: '303'
    });
    objRecord.setValue({
        fieldId: 'istaxable',
        value: 'T'
    });
    objRecord.setValue({
        fieldId: 'taxschedule',
        value: '1'
    });

    objRecord.setValue({
        fieldId: 'custitem_atlas_engineer_complete',
        value: 'T'
    });
    objRecord.setValue({
        fieldId: 'custitem_product_type',
        value: productType
    });
    objRecord.setValue({
        fieldId: 'custitem_fabric_type',
        value: fabricType
    });
    objRecord.setValue({
        fieldId: 'custitem_royalty_id',
        value: royaltyId
    });
    objRecord.setValue({
        fieldId: 'custitem_team_code',
        value: teamCode
    });
    objRecord.setValue({
        fieldId: 'custitem_stitch_color',
        value: stitchColor
    });
    objRecord.setValue({
        fieldId: 'custitem_sku',
        value: sku
    });
    objRecord.setValue({
        fieldId: 'custitem_junk_image_file',
        value: sku + '.tif'
    });
    objRecord.setValue({
        fieldId: 'custitem_shopifyproductid',
        value: shopifyId
    });
   //#endregion

   objRecord.selectLine({
    sublistId: 'locations',
    line: 1
});
objRecord.setCurrentSublistValue({
    sublistId: 'locations',
    fieldId: 'iswip',
    value: true,
    ignoreFieldChange: true
});


   rec.selectNewLine({  
    sublistId: 'item'
});
rec.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'item',
    value: 190
});
rec.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'quantity',
    value: 2
});
      //set main location to WIP = true
      newAssemblyItem.selectLineItem('locations', 1);
      newAssemblyItem.setCurrentLineItemValue('locations', 'iswip', 'T');
      newAssemblyItem.commitLineItem('locations');

}});