function rateEstAfterSubmit(tranId) {
    //start loading record data from the NetSuite Estimate Record
    // set a bunch of variables
    var tranId = nlapiGetRecordId();
    nlapiLogExecution('debug', 'starting asue rating on estimate ID ', tranId);
    nlapiLogExecution('debug', 'Performance', 'starting time - ' + new Date());
    var parRec = nlapiLoadRecord('estimate', tranId);
    var docNum = parRec.getFieldValue('tranid');
    var locationId = parRec.getFieldValue('location');
    //  var locationAddressee = parRec.getFieldText('location');
    var locationRecord = nlapiLoadRecord('location', locationId, null, null);
    var locationAddr1 = locationRecord.getFieldValue('addr1');
    var locationAddr2 = locationRecord.getFieldValue('addr2');
    var locationCity = locationRecord.getFieldValue('city');;
    var locationState = locationRecord.getFieldValue('state');
    var locationZip = locationRecord.getFieldValue('zip');
    var locationCountry = locationRecord.getFieldValue('country');
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
    //end of setting record variables; now we have the from and the to addresses
    //Create Shipment Lines or parcel or commodity lines; call them whatever
    //first search for the line items from the estimate
    var lineItems = nlapiSearchRecord("estimate",null,
        [
            ["type","anyof","Estimate"],
            "AND",
            ["mainline","is","F"],
            "AND",
            ["internalid","anyof","822"],
            "AND",
            ["taxline","is","F"],
            "AND",
            ["custcol_pss_item_weight","isnotempty",""]
        ],
        [
            new nlobjSearchColumn("internalid"),
            new nlobjSearchColumn("item"),
            new nlobjSearchColumn("custcol_pss_item_weight"),
            new nlobjSearchColumn("custcol_pss_packing_container"),
            new nlobjSearchColumn("custcol_pss_max_cq"),
            new nlobjSearchColumn("quantity"),
            new nlobjSearchColumn("account"),
            new nlobjSearchColumn("rate")
        ]
    );
    nlapiLogExecution('debug', 'estimate lines ', lineItems.length);
    //now you have an array of the line items

    //now we loop thru the resulting lines and get data
    //set empty arrays
    var packageItem = [];
    var packLineName = [];
    var packageWeight = [];
    var packageQty = [];
    var packageDept = [];
    var packageContainer = [];
    var packageQtyMAX = [];
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
        // line items info
        packageItem.push(lineItems[z].getValue('item'));
        packageWeight.push(Number(lineItems[z].getValue('custcol_pss_item_weight')));
        packageQty.push(lineItems[z].getValue('quantity'));
        packageContainer.push(lineItems[z].getValue('custcol_pss_packing_container'));
        packageQtyMAX.push(lineItems[z].getValue('custcol_pss_max_cq'));
        packUnitPrice.push(lineItems[z].getValue('rate'));
        packExtendedTotal.push(lineItems[z].getValue('amount'));

        packHTS.push(nlapiLookupField('customrecord_pss_containers', packageContainer[z], 'custrecord_pss_cont_hts'));

        packLineName.push(nlapiLookupField('item', packageItem[z], 'description'));
        packType.push(nlapiLookupField('customrecord_pss_containers', packageContainer[z], 'custrecord_pss_cont_type'));
        packLength.push(nlapiLookupField('customrecord_pss_containers', packageContainer[z], 'custrecord_pss_cont_length'));
        packHeight.push(nlapiLookupField('customrecord_pss_containers', packageContainer[z], 'custrecord_pss_cont_height'));
        packWidth.push(nlapiLookupField('customrecord_pss_containers', packageContainer[z], 'custrecord_pss_cont_width'));
        packWeight.push(nlapiLookupField('customrecord_pss_containers', packageContainer[z], 'custrecord_pss_cont_weight'));
        //packNMFC.push(nlapiLookupField('customrecord_pss_containers', packageContainer[z], 'custrecord_pss_cont_nmfc_assignment'));
        //packNMFCDesc.push(nlapiLookupField('customrecord_pss_containers', packageContainer[z], 'custrecord_pss_cont_nmfc_desc'));
        packClass.push(nlapiLookupField('customrecord_pss_containers', packageContainer[z], 'custrecord_pss_cont_nmfc_frt_class'));
        //packCost.push(nlapiLookupField('customrecord_pss_containers', packageContainer[z], 'custrecord_pss_cont_cost'));
    }

        //so now we have a bunch of arrays.  Now we loop thru and create shipment lines or final parcel or commodity lines
        //Builds the sub-array of commodity lines
        var linItems = [];
        for (var z = 0; z < packageItem.length; z++){
            linItems.push({"freightClass": packClass[z], "totalWeight": Number(Math.round(packageWeight[z] * packageQty[z]) + Number(packWeight[z]) * Math.ceil(packageQty[z] / packageQtyMAX[z])), "packageDimensions": {"length": packLength[z], "width": packWidth[z], "height": packHeight[z]}});
        }
        //build final JSON body to send to rating engine aka Project 44
        var creds = 'priority.prod@p-44.com:Prirate18';
        var enCreds = nlapiEncrypt(creds, 'base64');
        //p44 endPoint URL for Rating
        var url = 'https://cloud.p-44.com/api/v3/quotes/rates/query';
        //setting request headers
        var headers = [];
        headers['Authorization'] = 'Basic ' + enCreds;
        headers['Content-Type'] = 'application/json';
        headers['Accept'] = 'application/json';
        var jPayload = {
            "originAddress": {
                "postalCode": locationZip,
                "addressLines":[
                    locationAddr1
                ],
                "city": locationCity,
                "state": locationState,
                "country": locationCountry
            },
            "destinationAddress": {
                "postalCode": destZip,
                "addressLines":[
                    destAddr1
                ],
                "city": destCity,
                "state": destState,
                "country": destCountry
            },
            "lineItems": linItems,
            "capacityProviderAccountGroup":{
                "code": "44394B"
            },
            //   "accessorialServices": [
            // {
            // "code": ""
            // }
            // ],
            "apiConfiguration":{
                "timeout": 20,
                "enableUnitConversion": false,
                "accessorialServiceConfiguration": {
                    "fetchAllServiceLevels": false,
                    "fetchAllGuaranteed": false,
                    "fetchAllExcessiveLength": false,
                    "fetchAllInsideDelivery": false,
                    "allowUnacceptedAccessorials": true
                },
                "fallBackToDefaultAccountGroup": false
            }
        }
        var strPayload = JSON.stringify(jPayload);
        nlapiLogExecution('debug', 'JSON Request ', strPayload);
        var response = nlapiRequestURL(url, strPayload, headers, 'POST');
        var obj = response.getBody();
        nlapiLogExecution('debug', 'JSON Response ', obj);
        var respObj = JSON.parse(obj);
        var rates = respObj.rateQuotes;
        var finalRate = rates[0].rateQuoteDetail.total;
        //We are going to request rates for only 1 carrier; thus rates will only have 1 result
        parRec.setFieldValue('custbody_pss_ltl_cost', finalRate);
        nlapiLogExecution('debug', 'Performance', 'end time - ' + new Date());
        nlapiSubmitRecord(parRec);
    }