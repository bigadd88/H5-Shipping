function processPOinvoices() {
    var inboundsToProcess = nlapiSearchRecord("file", null,
        [
            ["folder", "anyof", "3193358"]
        ],
        [
            new nlobjSearchColumn("name"),
            new nlobjSearchColumn("internalid")
        ]
    );

    if (inboundsToProcess != null) {
        nlapiLogExecution('debug', 'files to process', inboundsToProcess.length);
        for (var b = 0; b < inboundsToProcess.length; b++) {
            var xmlFileId = inboundsToProcess[b].getValue('internalid');
            var xmlFile = nlapiLoadFile(xmlFileId);
            //this creates a copy of the processed file in a different folder
            var xmlFileNameRaw = xmlFile.getName();
            var contents = xmlFile.getValue();
            var splitFileName = xmlFileNameRaw.split('.');
            var xmlFileName = splitFileName[0];
            xmlFile.setFolder(3726650);
            var dateRaw = new Date();
            var processedDate = dateRaw.toISOString();
            xmlFile.setName('Processed-' + processedDate + '-' + xmlFileNameRaw);
            nlapiLogExecution('debug', 'Processing File: ', xmlFileNameRaw);
            nlapiSubmitFile(xmlFile);
            //end of file copy

            try {
                nlapiLogExecution('debug', 'starting try/catch');
                // nlapiLogExecution('debug', 'file contents', contents);
                var parsedXML = nlapiStringToXML(contents);
                var Invoice = nlapiSelectNode(parsedXML, "//*[name()='Invoice']");
                var eskerRUID = nlapiSelectValue(Invoice, "//@RUID");
                var VendorNumber = nlapiSelectValue(Invoice, "//*[name()='VendorNumber']");
                var InvoiceGrandTotal = nlapiSelectValue(Invoice, "//*[name()='InvoiceAmount']");
                var vendorId = findVendorId(VendorNumber);
                var InvoiceDateRaw = nlapiSelectValue(Invoice, "//*[name()='InvoiceDate']");
                var dateSplit = InvoiceDateRaw.split('-');
                var correctedDate = dateSplit[1] + '/' + dateSplit[2] + '/' + dateSplit[0];
                var PostingDateRaw = nlapiSelectValue(Invoice, "//*[name()='PostingDate']");
                var dateSplit1 = PostingDateRaw.split('-');
                var correctedPostingDate = dateSplit1[1] + '/' + dateSplit1[2] + '/' + dateSplit1[0];
                var OrderNumberRaw = nlapiSelectValue(Invoice, "//*[name()='OrderNumber']");
                if (OrderNumberRaw != null) {
                    var poInternalId = findPOId(OrderNumberRaw);
                }
                var InvoiceNumber = nlapiSelectValue(Invoice, "//*[name()='InvoiceNumber']");
                nlapiLogExecution('debug', 'Processing invoice # ', InvoiceNumber);
                var InvoiceType = nlapiSelectValue(Invoice, "//*[name()='InvoiceType']");
                var InvoiceDocumentURL = nlapiSelectValue(Invoice, "//*[name()='InvoiceDocumentURL']");
                var CompanyCode = nlapiSelectValue(Invoice, "//*[name()='CompanyCode']");
                //lineItems arrays
                var lineAmountArray = nlapiSelectValues(Invoice, "//*[name()='Amount']");
                var lineQuantityArray = nlapiSelectValues(Invoice, "//*[name()='Quantity']");
                var lineDescriptionArray = nlapiSelectValues(Invoice, "//*[name()='Description']");
                var lineCostCenterArray = nlapiSelectValues(Invoice, "//*[name()='CostCenter']");
                var lineGLAccountArray = nlapiSelectValues(Invoice, "//*[name()='GLAccount']");
                var lineItemNumberArray = nlapiSelectValues(Invoice, "//*[name()='ItemNumber']");
                var lineZ_AmortScheduleArray = nlapiSelectValues(Invoice, "//*[name()='Z_AmortSchedule']");
                var lineZ_AmortStartArray = nlapiSelectValues(Invoice, "//*[name()='Z_AmortStart']");
                var lineZ_AmortEndArray = nlapiSelectValues(Invoice, "//*[name()='Z_AmortEnd']");
                var lineZ_BillableArray = nlapiSelectValues(Invoice, "//*[name()='Z_Billable']");
                var lineZ_CustomerIDArray = nlapiSelectValues(Invoice, "//*[name()='Z_CustomerID']");
                var lineZ_CustomerNameArray = nlapiSelectValues(Invoice, "//*[name()='Z_CustomerName']");
                var lineZ_ItemCategoryArray = nlapiSelectValues(Invoice, "//*[name()='Z_ItemCategory']");
                var lineZ_LocationArray = nlapiSelectValues(Invoice, "//*[name()='Z_Location']");
                var fullLineObj = [];
                for (var i = 0; i < lineAmountArray.length; i++) {
                    fullLineObj.push({
                        "item":
                            {
                                "lineItemNumber": Number(lineItemNumberArray[i]),
                                "lineQuantity": lineQuantityArray[i],
                                "lineDescription": lineDescriptionArray[i],
                                "lineCostCenter": lineCostCenterArray[i],
                                "lineGLAccount": lineGLAccountArray[i],
                                "lineZ_AmortSchedule": lineZ_AmortScheduleArray[i],
                                "lineZ_AmortStart": lineZ_AmortStartArray[i],
                                "lineZ_AmortEnd": lineZ_AmortEndArray[i],
                                "lineZ_Billable": lineZ_BillableArray[i],
                                "lineZ_CustomerID": lineZ_CustomerIDArray[i],
                                "lineZ_CustomerName": lineZ_CustomerNameArray[i],
                                "lineZ_ItemCategory": lineZ_ItemCategoryArray[i],
                                "lineZ_Location": lineZ_LocationArray[i]
                            }

                    })
                }
//Sam
//first sort the array to make lineIDs line up
                var sortArray = [];
                // sort of hashinh here to get items into their slots
                for (var g = 0; g < fullLineObj.length; g++) {
                    if (sortArray[fullLineObj[g].item.lineItemNumber] == null) {
                        sortArray[fullLineObj[g].item.lineItemNumber] = [];
                        sortArray[fullLineObj[g].item.lineItemNumber].push(fullLineObj[g]);
                    } else {
                        sortArray[fullLineObj[g].item.lineItemNumber].push(fullLineObj[g]);
                    }
                }
//now combine any multiple fulfillments into 1 line
                for (var j = 0; j < sortArray.length; j++) {
                    var qty = 0;
                    if (sortArray[j] != null) {
                        for (var z = 0; z < sortArray[j].length; z++) {
                            qty += Number(sortArray[j][z].item.lineQuantity);
                        }
                        sortArray[j][0].item.lineQuantity = qty;
                    }
                }
//end Sam

                if (InvoiceType == "PO Invoice") {
                    //now build PO vendor bill record
                    nlapiLogExecution('debug', 'Is PO Invoice ', 'PO Invoice: ' + OrderNumberRaw);
                    var newPOVendorBillRec = nlapiTransformRecord('purchaseorder', poInternalId, 'vendorbill');
                    newPOVendorBillRec.setFieldValue('tranid', InvoiceNumber);
                    newPOVendorBillRec.setFieldValue('trandate', correctedDate);
                    var lineCount = newPOVendorBillRec.getLineItemCount('item');
                    //unset all lines for receipt
                    var itemIds = [];
                    for (var r = 1; r <= lineCount; r++) {
                        newPOVendorBillRec.setLineItemValue('item', 'quantity', r, 0);
                    }
/////////////
                    for (k = 1; k <= lineCount; k++) {
                        itemIds[k - 1] = newPOVendorBillRec.getLineItemValue('item', 'item', k);
                        var lineId = k;
                        for (m = 0; m < lineItemNumberArray.length; m++) {
                            if (itemIds[k - 1] == lineItemNumberArray[m]) {
                                lineItemNumberArray[m] = [];
                                lineItemNumberArray[m][0] = lineId;
                            }
                        }
                    }
/////////////            //set items lines
                    for (n = 1; n <= lineCount; n++) {
                        // nlapiLogExecution('debug', 'Interation of Lines # ', n + ' of ' + itemIds.length);
                        // newPOVendorBillRec.setLineItemValue('item', 'islinefulfilled', lineCount[n], 'T');
                        if (sortArray[n] == undefined) {
                            newPOVendorBillRec.setLineItemValue('item', 'quantity', n, 0);
                        } else {
                            newPOVendorBillRec.setLineItemValue('item', 'class', n, findClassId(sortArray[n][0].item.lineZ_ItemCategory));
                            newPOVendorBillRec.setLineItemValue('item', 'location', n, findLocationId(sortArray[n][0].item.lineZ_Location));
/////////////           //Need to convert UOM
//                             if (vendorId == '15345' || vendorId == '20398' || vendorId == '21103' || vendorId == '21104' || vendorId == '21103' || vendorId == '21105' || vendorId == '7753' || vendorId == '15326' || vendorId == '15430' || vendorId == '8674' || vendorId == '7275' || vendorId == '8009' || vendorId == '20810') {
//                                 // V02195 Polycoat Products 15345
//                                 // V02641 POLYCOAT PRODUCTS (UL-BEDFORD) OEM 20398
//                                 // V03105 POLYCOAT PRODUCTS (UL-BEDFORD) 21104
//                                 // V03104 POLYCOATA PRODUCTS (UL-SANTA FE SPRINGS) OEM21103 21103
//                                 // V03105 POLYCOAT PRODUCTS (UL-BEDFORD) 21104
//                                 // V03106 POLYCOAT PRODUCTS (UL-SANTA FE SPRINGS) 21105
//                                 // V00302 LANGEMEN MANUFACTURING LIMITED 7753
//                                 // V02184 LANGEMAN MANUFACTURING LIMITED (EU) 15326
//                                 // V00249 LANGEMAN MANUFACTURING LIMITED (MX) 15430
//                                 // V00667 3M COMPANY 8674
//                                 // V03009 3M COMPANY (UL) 20810
//                                 // V00068 BRON TAPES 7275
//                                 // V00413 Quantum Technical 8009
//                                 // nlapiLogExecution('debug', 'just before convertUOM', itemIds[n]);
//                                 // var conversionFactor = 1;
//                                 var conversionFactor = convertUOM(itemIds[n-1]);
//                                 // nlapiLogExecution('debug', 'conversionFactor', 'conversion factor ' + conversionFactor);
//                             } else {
//                                 var conversionFactor = 1;
//                             }
/////////////           //End of UOM convert
                            var lineUOM = newPOVendorBillRec.getLineItemValue('item', 'units', n);
                            nlapiLogExecution('debug', 'UOM on Line', itemIds[n-1] + ' is UOM ' + lineUOM);
                            var conversionFactor = convertUOM(itemIds[n-1], lineUOM);
                            newPOVendorBillRec.setLineItemValue('item', 'quantity', n, Number((sortArray[n][0].item.lineQuantity / conversionFactor)));

                            // lineQuantityArray.sort(function(a, b){return a - b});
                        }
                    }

                    var newRecId = nlapiSubmitRecord(newPOVendorBillRec);
                    nlapiLogExecution('debug', 'New PO Inv Created ', InvoiceNumber);
                    //send ACK
                    var ackXML = '<?xml version="1.0" encoding="utf-8"?>';
                    ackXML += '<ERPAck>';
                    ackXML += '<EskerInvoiceID>' + eskerRUID + '</EskerInvoiceID>';
                    ackXML += '<ERPID>' + newRecId + '</ERPID>';
                    ackXML += '</ERPAck>';
                    var file = nlapiCreateFile(xmlFileName + 'ACK.xml', 'PLAINTEXT', ackXML);
                    file.setFolder(3213046);
                    var newFileId = nlapiSubmitFile(file);
                    nlapiLogExecution('debug', 'ACK file created: ', newFileId);
                } //creates PO Invoice
                else {
                    nlapiLogExecution('debug', 'Is non-PO Invoice ', 'non-PO Invoice');
                    //now build NON-PO vendor bill record
                    if (InvoiceGrandTotal > 0) {
                        var newBillRec = nlapiCreateRecord('vendorbill');
                        newBillRec.setFieldValue('trandate', correctedDate);
                        newBillRec.setFieldValue('entity', vendorId);
                        newBillRec.setFieldValue('tranid', InvoiceNumber);
                        newBillRec.setFieldValue('subsidiary', CompanyCode);
                        newBillRec.setFieldValue('location', '');
                        newBillRec.setFieldValue('account', 117);
                        for (o = 0; o < lineGLAccountArray.length; o++) {
                            newBillRec.selectNewLineItem('expense');
                            newBillRec.setCurrentLineItemValue('expense', 'account', lineGLAccountArray[o]);
                            newBillRec.setCurrentLineItemValue('expense', 'amount', lineAmountArray[o]);
                            newBillRec.setCurrentLineItemValue('expense', 'department', lineCostCenterArray[o]);
                            newBillRec.setCurrentLineItemValue('expense', 'memo', lineDescriptionArray[o]);
                            newBillRec.setCurrentLineItemValue('expense', 'amortizationsched', findAmortId(lineZ_AmortScheduleArray[o]));
                            newBillRec.setCurrentLineItemValue('expense', 'amortizstartdate', formatDate(lineZ_AmortStartArray[o]));
                            newBillRec.setCurrentLineItemValue('expense', 'amortizationenddate', formatDate(lineZ_AmortEndArray[o]));
                            newBillRec.setCurrentLineItemValue('expense', 'isbillable', convertBillable(lineZ_BillableArray[o]));
                            newBillRec.setCurrentLineItemValue('expense', 'custcol24', lineZ_CustomerIDArray[o]);
                            newBillRec.setCurrentLineItemValue('expense', 'customer', findCustomerId(lineZ_CustomerNameArray[o]));
                            newBillRec.setCurrentLineItemValue('expense', 'class', findClassId(lineZ_ItemCategoryArray[o]));
                            newBillRec.setCurrentLineItemValue('expense', 'location', findLocationId(lineZ_LocationArray[o]));
                            newBillRec.commitLineItem('expense');
                        }
                        var newRecId = nlapiSubmitRecord(newBillRec, false, true);
                        nlapiLogExecution('debug', 'New non-PO Inv Created ', InvoiceNumber);

                    } //creates non PO invoice
                    else {
                        var newCMRec = nlapiCreateRecord('vendorcredit');
                        newCMRec.setFieldValue('trandate', correctedDate);
                        newCMRec.setFieldValue('entity', vendorId);
                        newCMRec.setFieldValue('tranid', InvoiceNumber);
                        newCMRec.setFieldValue('subsidiary', CompanyCode);
                        newCMRec.setFieldValue('location', '');
                        newCMRec.setFieldValue('account', 117);
                        for (p = 0; p < lineGLAccountArray.length; p++) {
                            newCMRec.selectNewLineItem('expense');
                            newCMRec.setCurrentLineItemValue('expense', 'account', lineGLAccountArray[p]);
                            newCMRec.setCurrentLineItemValue('expense', 'amount', Math.abs(lineAmountArray[p]));
                            newCMRec.setCurrentLineItemValue('expense', 'department', lineCostCenterArray[p]);
                            newCMRec.setCurrentLineItemValue('expense', 'memo', lineDescriptionArray[p]);
                            newCMRec.commitLineItem('expense');
                        }
                        var newRecId = nlapiSubmitRecord(newCMRec, false, true);
                        nlapiLogExecution('debug', 'New Credit Memo Created ', InvoiceNumber);
                    }//creates credit memo
                     //create ACK
                    var ackXML = '<?xml version="1.0" encoding="utf-8"?>';
                    ackXML += '<ERPAck>';
                    ackXML += '<EskerInvoiceID>' + eskerRUID + '</EskerInvoiceID>';
                    ackXML += '<ERPID>' + newRecId + '</ERPID>';
                    ackXML += '</ERPAck>';
                    var file = nlapiCreateFile(xmlFileName + 'ACK.xml', 'PLAINTEXT', ackXML);
                    file.setFolder(3213046);
                    var newFileId = nlapiSubmitFile(file);
                    nlapiLogExecution('debug', 'ACK file created: ', newFileId);
                }
            } catch (err) {
                nlapiLogExecution('debug', 'try/catch error ', err);
                // nlapiSendEmail(25149, ['robert@habit5.com', 1583], 'Error Processing Esker Invoice ', err + ' URL to Esker Record ' + InvoiceDocumentURL);
                var ackXML = '<?xml version="1.0" encoding="utf-8"?>';
                ackXML += '<ERPAck>';
                ackXML += '<EskerInvoiceID>' + eskerRUID + '</EskerInvoiceID>';
                ackXML += '<ERPPostingError>' + err.toString() + '</ERPPostingError>';
                ackXML += '</ERPAck>';
                var file = nlapiCreateFile(xmlFileName + 'ACK.xml', 'PLAINTEXT', ackXML);
                file.setFolder(3213046);
                var newFileId = nlapiSubmitFile(file);
                nlapiSendEmail(25149, 25149, 'Failed IXS Esker Invoice', err.toString());
                nlapiLogExecution('debug', 'ACK file created: ', newFileId);
            }
        }
    } else {
        nlapiLogExecution('debug', 'No files to process ');
        // nlapiSendEmail(25149, 1583, 'No Esker invoice files to process ', 'No Esker invoice files to process.');
    }
}

function convertUOM2(itemRecId, uom) {
    var itemRec = nlapiLoadRecord('inventoryitem', itemRecId);
    var baseUnit = itemRec.getFieldValue('unitstype');
    var purchaseUOM = uom;
    var baseUnitRec = nlapiLoadRecord('unitstype', baseUnit);
    var len = baseUnitRec.getLineItemCount('uom');
    for (i = 1; i <= len; i++) {
        if (baseUnitRec.getLineItemValue('uom', 'internalid', [i]) == purchaseUOM) {
            var convertByValue = baseUnitRec.getLineItemValue('uom', 'conversionrate', [i]);
        }
    }
    return Number(convertByValue);
}

function convertUOM(itemRecId) {
    var itemRec = nlapiLoadRecord('inventoryitem', itemRecId);
    var baseUnit = itemRec.getFieldValue('unitstype');
    var purchaseUOM = itemRec.getFieldValue('purchaseunit');
    var baseUnitRec = nlapiLoadRecord('unitstype', baseUnit);
    var len = baseUnitRec.getLineItemCount('uom');
    for (i = 1; i <= len; i++) {
        if (baseUnitRec.getLineItemValue('uom', 'internalid', [i]) == purchaseUOM) {
            var convertByValue = baseUnitRec.getLineItemValue('uom', 'conversionrate', [i]);
        }
    }
    return Number(convertByValue);
}

function formatDate(datestring) {
    if (datestring == null || datestring == "") {
        return null;
    } else {
        var dateSplit = datestring.split('-');
        var fixedDate = dateSplit[1] + '/' + dateSplit[2] + '/' + dateSplit[0];
        return fixedDate;
    }
}

function findCustomerId(custName) {
    if (custName == null || custName == "") {
        return "";
    } else {

        var customerSearch = nlapiSearchRecord("customer", null,
            [
                ["companyname", "is", custName]
            ],
            [
                new nlobjSearchColumn("internalid")
            ]
        );
        if (customerSearch.length == 1) {
            var internalId = customerSearch[0].getValue('internalid');
        }
        return internalId;
    }
}

function findPOId(OrderNumberRaw) {
    var purchaseorderSearch = nlapiSearchRecord("purchaseorder", null,
        [
            ["type", "anyof", "PurchOrd"],
            "AND",
            ["transactionnumbernumber", "equalto", OrderNumberRaw],
            "AND",
            ["mainline", "is", "T"]
        ],
        [
            new nlobjSearchColumn("internalid")
        ]
    );
    var internalId = purchaseorderSearch[0].id;
    return internalId;
}

function findVendorId(VendorNumber) {
    var vendorSearch = nlapiSearchRecord("vendor", null,
        [
            ["entityid", "haskeywords", VendorNumber]
        ],
        [
            new nlobjSearchColumn("internalid")
        ]
    );
    var internalId = vendorSearch[0].id;
    return internalId;
}

function findLocationId(locName) {
    if (locName == null || locName == "") {
        return "";
    } else {
        var locationSearch = nlapiSearchRecord("location", null,
            [
                ["name", "is", locName]
            ],
            [
                new nlobjSearchColumn("internalid")
            ]
        );
        if (locationSearch.length == 1) {
            var internalId = locationSearch[0].getValue('internalid');
        }
        return internalId;
    }
}

function findClassId(className) {
    if (className == null || className == "") {
        return "";
    } else {
        var classSearch = nlapiSearchRecord("classification", null,
            [
                ["name", "is", className]
            ],
            [
                new nlobjSearchColumn("internalid")
            ]
        );
        if (classSearch.length == 1) {
            var internalId = classSearch[0].getValue('internalid');
        }
        return internalId;
    }
}

function findAmortId(amortName) {
    if (amortName == null || amortName == "") {
        return "";
    } else {
        var amortSearch = nlapiSearchRecord("amortizationschedule", null,
            [
                ["templatename", "is", amortName]
            ],
            [
                new nlobjSearchColumn("amortemplate")
            ]
        );
        if (amortSearch != null) {
            var internalId = amortSearch[0].getValue('amortemplate');
        }
        return internalId;
    }
}

function convertBillable(val) {
    if (val == 0) {
        return "F";
    } else {
        return "T";
    }
}





