function fetchFDV(request, response) {
    //get the work order # that is provided via parameter called lot_id
    var WOID = request.getParameter('lot_id');
    //go get the internal ID of the work order
    // var WOID = 11446;
    var findWorkorderId = nlapiSearchRecord('workorder', null,
        [
            ['type', 'anyof', 'WorkOrd'],
            'AND',
            ['mainline', 'is', 'T'],
            'AND',
            ['transactionnumbernumber', 'equalto', WOID]
        ],
        [
            new nlobjSearchColumn('internalid')
        ]
    );
    /**
     *This section does:
     * load work order, get the line items and
     */
    var detailsArray = [];
    var lotArray = [];
    var woId = findWorkorderId[0].id;
    var woObj = nlapiLoadRecord('workorder', woId);
    var lotExpirationDate = woObj.getFieldValue('custbody_wcr_lot_exp_date');
    var item = woObj.getFieldValue('assemblyitem');
    var itemStoreDisplayName = nlapiLookupField('item', item, 'storedisplayname');
    var itemImageFileId = nlapiLookupField('item', item, 'custitem_h5_fdv_item_image');
    var itemImageURL = 'https://1212003.app.netsuite.com' + nlapiLookupField('file', itemImageFileId, 'url');
    var icoNumberRawId = woObj.getFieldValue('custbody_wcr_green_coffee_lots');
    var inventoryNumbers = nlapiSearchRecord("inventorynumber", null,
        [
            ['internalid', 'anyof', icoNumberRawId]
        ],
        [
            new nlobjSearchColumn('internalid'),
            new nlobjSearchColumn('inventorynumber')
        ]
    );
    for (i = 0; i < inventoryNumbers.length; i++) {
        // lotArray.push(inventoryNumbers[i].getValue('inventorynumber'));
        var icoBadFormat = inventoryNumbers[i].getValue('inventorynumber');
        var icoGoodFormat = icoBadFormat.replace(/\//g, "-");
        lotArray.push(icoGoodFormat);
    }

    var lotArrayTemp = ["002/1274/0049"];
    var greenLots = nlapiSearchRecord("customrecord_h5_tts_green_lot", null,
        [
            ["custrecord_h5_ico_number", "contains", lotArrayTemp]
        ],
        [
            new nlobjSearchColumn("custrecord_h5_ico_number"),
            new nlobjSearchColumn("custrecord_h5_bl_number"),
            new nlobjSearchColumn("custrecord_h5_farmer_id"),
            new nlobjSearchColumn("custrecord_h5_farmer_name"),
            new nlobjSearchColumn("internalid"),
            new nlobjSearchColumn("custrecord_h5_cooperative"),
            new nlobjSearchColumn("custrecord_h5_sref"),
            new nlobjSearchColumn("custrecord_h5_estimated_green_kgs").setSort(true),
            new nlobjSearchColumn("custrecord_h5_vol_contribution"),
            new nlobjSearchColumn("custrecord_h5_date_paid"),
            new nlobjSearchColumn("custrecord_h5_origin")
        ]
    );
    /**
     *This section does:
     * Loop thru green lot records and set variables and arrays
     */
    var paidDateArray = [];
    var cooperativeArray = [];
    var greenKgArray = [];
    for (i=0;i<greenLots.length;i++) {
        paidDateArray.push(new Date(greenLots[i].getValue('custrecord_h5_date_paid')));
        cooperativeArray.push(greenLots[i].getValue('custrecord_h5_cooperative'));
        greenKgArray.push(greenLots[i].getValue('custrecord_h5_estimated_green_kgs'));
    }
    // var uniqueCoopArray = [];
    // var distinct = (value, index, self) => {
    //     return self.indexOf(value) === index;
    // }
    // uniqueCoopArray = cooperativeArray.filter(distinct);



    /**
     *This section does:
     * Find earliest and latest harvest date and formats
     * Based on the Date Paid value in TTS Greenlots
     */
    var minPaidDate = new Date(Math.min.apply(null,paidDateArray));
    var month = minPaidDate.getMonth() + 1;
    var day = minPaidDate.getDate();
    var year = minPaidDate.getFullYear();
    var minPaidDate =  month + "/" + day + "/" + year;
    var maxPaidDate = new Date(Math.max.apply(null,paidDateArray));
    var month = maxPaidDate.getMonth() + 1;
    var day = maxPaidDate.getDate();
    var year = maxPaidDate.getFullYear();
    var maxPaidDate =  month + "/" + day + "/" + year;



    /**
     *This section does:
     * Get bill of lading number, and search for the movement record and get key data
     */
    var blNumber = greenLots[0].getValue('custrecord_h5_bl_number');
    var blNumber = 'HLCUSS5190932560';
    var movementsData = nlapiSearchRecord("customrecord_h5_tts_green_lot_movement", null,
        [
            ["custrecord_h5_bl_number_movement", "is", blNumber]
        ],
        [
            new nlobjSearchColumn("id").setSort(false),
            new nlobjSearchColumn("scriptid"),
            new nlobjSearchColumn("custrecord_h5_move_sref"),
            new nlobjSearchColumn("custrecord_h5_move_mill2port"),
            new nlobjSearchColumn("custrecord_h5_move_transportco_mill2port"),
            new nlobjSearchColumn("custrecord_h5_move_origin_port"),
            new nlobjSearchColumn("custrecord_h5_move_date_receivedatport"),
            new nlobjSearchColumn("custrecord_h5_move_date_containerships"),
            new nlobjSearchColumn("custrecord_h5_move_marineshipper"),
            new nlobjSearchColumn("custrecord_h5_move_us_port"),
            new nlobjSearchColumn("custrecord_h5_move_date_arrivedinwh"),
            new nlobjSearchColumn("custrecord_h5_move_destinationwh"),
            new nlobjSearchColumn("custrecord_h5_move_ico"),
            new nlobjSearchColumn("custrecord_h5_move_origin_country"),
            new nlobjSearchColumn("custrecord_h5_bl_number_movement"),
            new nlobjSearchColumn("custrecord_h5_move_date_arrivesinusport")
        ]
    );
    var dispatchedForDelivery = movementsData[0].getValue('custrecord_h5_move_mill2port');
    var leftPort = movementsData[0].getValue('custrecord_h5_move_date_containerships');
    var arrivedUSPort= movementsData[0].getValue('custrecord_h5_move_date_arrivesinusport');
    var originCountry= movementsData[0].getValue('custrecord_h5_move_origin_country');

    /**
     *This section does:
     * Loop thru Green Lot array and get top 10 Farmers
     */
    var top10FarmersArray = [];
    var top10Contributions = [];
    for (i=0;i<5;i++){
        top10FarmersArray.push(greenLots[i].getValue('custrecord_h5_farmer_id'));
        top10Contributions.push(Number(greenLots[i].getValue('custrecord_h5_estimated_green_kgs')));
    }


    /**
     *This section builds final JSON
     */
    var finalJSON = {
        'paragraph1': '',
        'image1': itemImageURL,
        'paragraph2': '',
        'image2': 'value',
        'paragraph3': 'value',
        'image3': 'value',
        'product': itemStoreDisplayName,
        'originCountry': originCountry,
        'lotExpirationDate': lotExpirationDate,
        // 'cooperatives': uniqueCoopArray.length,
        'daysHarvestToRoast': '113',
        'farmersContributing': greenLots.length,
        'milesTraveled': '2105',
        'beginHarvest': '1/26/2019',
        'beginDeliveryToMill': minPaidDate,
        'lastDeliveryToMill': maxPaidDate,
        'dispatchedForDelivery': dispatchedForDelivery,
        'leftPort': leftPort,
        'arrivedUSPort': arrivedUSPort,
        'top10Farmers': top10FarmersArray,
        'top10Contributions': top10Contributions
    };
    var strResponse = JSON.stringify(finalJSON)
    response.write(strResponse);
}

function AddCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}