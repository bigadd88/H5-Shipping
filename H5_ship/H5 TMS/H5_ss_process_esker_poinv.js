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
    nlapiLogExecution('debug', 'files to process', inboundsToProcess.length);

    for (i = 0; i < inboundsToProcess.length; i++) {
        var xmlFileId = inboundsToProcess[i].getValue('internalid');
        // console.log(xmlFileId);

        var xmlFile = nlapiLoadFile(xmlFileId);
        var xmlFileNameRaw = xmlFile.getName();
        var splitFileName = xmlFileNameRaw.split('.');
        var xmlFileName = splitFileName[0];
        var contents = xmlFile.getValue();
        // non-PO var contentsNonPO = '<?xml version="1.0" encoding="UTF-8"?><Invoice RUID="CD#TSJH283333D.707645697444428660"><AlternativePayee></AlternativePayee><Assignment></Assignment><BaselineDate/><BusinessArea></BusinessArea><CalculateTax>1</CalculateTax><CompanyCode>11</CompanyCode><DueDate/><ERPLinkingDate>2019-11-20</ERPLinkingDate><ERPPaymentBlocked>0</ERPPaymentBlocked><ERPPostingDate>2019-11-20</ERPPostingDate><ERP>generic</ERP><ExchangeRate>1</ExchangeRate><GRIV>0</GRIV><HeaderText></HeaderText><History></History><InvoiceAmount>768.31</InvoiceAmount><InvoiceCurrency>USD</InvoiceCurrency><InvoiceDate>2019-11-19</InvoiceDate><InvoiceDescription></InvoiceDescription><InvoiceNumber>602667457</InvoiceNumber><InvoiceReferenceNumber></InvoiceReferenceNumber><InvoiceType>Non-PO Invoice</InvoiceType><LocalCurrency>USD</LocalCurrency><LocalInvoiceAmount>768.31</LocalInvoiceAmount><LocalNetAmount>768.31</LocalNetAmount><LocalTaxAmount>0</LocalTaxAmount><ManualLink>0</ManualLink><NetAmount>768.31</NetAmount><OrderNumber></OrderNumber><PaymentApprovalStatus>Not requested</PaymentApprovalStatus><PaymentTerms></PaymentTerms><PostingDate>2019-11-20</PostingDate><ReceptionMethod>Email</ReceptionMethod><SAPPaymentMethod></SAPPaymentMethod><SelectedBankAccountID></SelectedBankAccountID><TaxAmount>0</TaxAmount><UnplannedDeliveryCosts>0</UnplannedDeliveryCosts><VendorCity>Boston</VendorCity><VendorCountry>US</VendorCountry><VendorName>Keystone Automotive Operations  Inc</VendorName><VendorNumber>V01800</VendorNumber><VendorPOBox></VendorPOBox><VendorRegion>MA</VendorRegion><VendorStreet>PO Box 417450</VendorStreet><VendorZipCode>02241-7450</VendorZipCode><VerificationDate>2019-11-20</VerificationDate><ApproversList><item><ApprovalDate/><Approved>0</Approved><ApproverComment></ApproverComment><ApproverEmail></ApproverEmail><ApproverID>apspecialistsprocess.su@100025597.esk</ApproverID><ApproverLabelRole>AP Specialist</ApproverLabelRole><Approver>AP Specialists</Approver></item></ApproversList><LineItems><item><Amount>768.31</Amount><Assignment></Assignment><BusinessArea></BusinessArea><CCDescription>F4005 LINE-X of Livonia</CCDescription><CostCenter>66</CostCenter><Description>COGS - 4005 1726</Description><GLAccount>763</GLAccount><GLDescription>6295 Cost of Goods Sold : Equipment &amp; Other COS : </GLDescription><InternalOrder></InternalOrder><LineType>GL</LineType><TaxAmount>0</TaxAmount><TaxCode>NOTAX</TaxCode><TaxJurisdiction></TaxJurisdiction><TaxRate>0</TaxRate></item></LineItems><InvoiceDocumentURL>https://na2.esker.com:443/ondemand/webaccess/asc/ManageDocumentsCheck.link?ruid=CD%23TSJH283333D.707645697444428660</InvoiceDocumentURL><InvoiceImageURL>https://na2.esker.com:443/ondemand/webaccess/asc/attach.file?id=CD%23TSJH283333D.707645697444428660</InvoiceImageURL></Invoice>';
        // var contents = '<?xml version="1.0" encoding="UTF-8"?><Invoice RUID="CD#TSJH283333D.703757824297849445"><AlternativePayee></AlternativePayee><Assignment></Assignment><BaselineDate/><BusinessArea></BusinessArea><CalculateTax>1</CalculateTax><CompanyCode>2</CompanyCode><DueDate/><ERPLinkingDate>2019-11-13</ERPLinkingDate><ERPPaymentBlocked>0</ERPPaymentBlocked><ERPPostingDate>2019-11-13</ERPPostingDate><ERP>generic</ERP><ExchangeRate>1</ExchangeRate><GRIV>0</GRIV><HeaderText></HeaderText><History></History><InvoiceAmount>1435.52</InvoiceAmount><InvoiceCurrency>USD</InvoiceCurrency><InvoiceDate>2019-10-28</InvoiceDate><InvoiceDescription></InvoiceDescription><InvoiceNumber>160230</InvoiceNumber><InvoiceReferenceNumber></InvoiceReferenceNumber><InvoiceType>PO Invoice</InvoiceType><LocalCurrency>USD</LocalCurrency><LocalInvoiceAmount>1435.52</LocalInvoiceAmount><LocalNetAmount>1435.52</LocalNetAmount><LocalTaxAmount>0</LocalTaxAmount><ManualLink>0</ManualLink><NetAmount>1435.52</NetAmount><OrderNumber>53421</OrderNumber><PaymentApprovalStatus>Not requested</PaymentApprovalStatus><PaymentTerms></PaymentTerms><PostingDate>2019-11-13</PostingDate><ReceptionMethod>Email</ReceptionMethod><SAPPaymentMethod></SAPPaymentMethod><SelectedBankAccountID></SelectedBankAccountID><TaxAmount>0</TaxAmount><TouchlessDone>0</TouchlessDone><TouchlessEnabled>0</TouchlessEnabled><UnplannedDeliveryCosts>0</UnplannedDeliveryCosts><VendorCity>Santa Fe Springs</VendorCity><VendorCountry>US</VendorCountry><VendorName>Polycoat Products</VendorName><VendorNumber>V02195</VendorNumber><VendorPOBox></VendorPOBox><VendorRegion>CA</VendorRegion><VendorStreet>14722 Spring Avenue</VendorStreet><VendorZipCode>90670</VendorZipCode><VerificationDate>2019-11-13</VerificationDate><ApproversList><item><ApprovalDate/><Approved>0</Approved><ApproverComment></ApproverComment><ApproverEmail></ApproverEmail><ApproverID>apspecialistsprocess.su@100025597.esk</ApproverID><ApproverLabelRole>AP Specialist</ApproverLabelRole><Approver>AP Specialists</Approver></item></ApproversList><LineItems><item><Amount>1435.52</Amount><Assignment></Assignment><BusinessArea></BusinessArea><CCDescription></CCDescription><CostCenter></CostCenter><DeliveryNote></DeliveryNote><Description>BLUE STEEL OPEN TOP DRUM</Description><GLAccount></GLAccount><GLDescription></GLDescription><GoodsReceipt></GoodsReceipt><InternalOrder></InternalOrder><ItemNumber>12523</ItemNumber><LineType>PO</LineType><OrderNumber>53421</OrderNumber><Quantity>32</Quantity><TaxAmount>0</TaxAmount><TaxCode>NOTAX</TaxCode><TaxJurisdiction></TaxJurisdiction><TaxRate>0</TaxRate></item></LineItems><InvoiceDocumentURL>https://na2.esker.com:443/ondemand/webaccess/asc/ManageDocumentsCheck.link?ruid=CD%23TSJH283333D.703757824297849445</InvoiceDocumentURL><InvoiceImageURL>https://na2.esker.com:443/ondemand/webaccess/asc/attach.file?id=CD%23TSJH283333D.703757824297849445</InvoiceImageURL></Invoice>';
        var parsedXML = nlapiStringToXML(contents);
        var Invoice = nlapiSelectNode(parsedXML, "//*[name()='Invoice']");
        var eskerRUID = nlapiSelectValue(Invoice, "//@RUID");
        // var eskerRUID = Invoice.attributes.RUID.value;
        var VendorNumber = nlapiSelectValue(Invoice, "//*[name()='VendorNumber']");
        //find vendor internal id
        var vendorSearch = nlapiSearchRecord("vendor",null,
            [
                ["entityid","haskeywords",VendorNumber]
            ],
            [
                new nlobjSearchColumn("internalid")
            ]
        );
        var vendorId = vendorSearch[0].id;


        var InvoiceDateRaw = nlapiSelectValue(Invoice, "//*[name()='InvoiceDate']");
        var dateSplit = InvoiceDateRaw.split('-');
        var correctedDate = dateSplit[1] + '/' + dateSplit[2] + '/' + dateSplit[0];
        var PostingDateRaw = nlapiSelectValue(Invoice, "//*[name()='PostingDate']");
        var dateSplit1 = PostingDateRaw.split('-');
        var correctedPostingDate = dateSplit1[1] + '/' + dateSplit1[2] + '/' + dateSplit1[0];
        var OrderNumber = nlapiSelectValue(Invoice, "//*[name()='OrderNumber']");
        var InvoiceNumber = nlapiSelectValue(Invoice, "//*[name()='InvoiceNumber']");
        var InvoiceType = nlapiSelectValue(Invoice, "//*[name()='InvoiceType']");
        var CompanyCode = nlapiSelectValue(Invoice, "//*[name()='CompanyCode']");
        //lineItems arrays
        var lineAmountArray = nlapiSelectValues(Invoice, "//*[name()='Amount']");
        var lineDescriptionArray = nlapiSelectValues(Invoice, "//*[name()='Description']");
        var lineCostCenterArray = nlapiSelectValues(Invoice, "//*[name()='CostCenter']");
        var lineGLAccountArray = nlapiSelectValues(Invoice, "//*[name()='GLAccount']");
        var lineItemNumberArray = nlapiSelectValues(Invoice, "//*[name()='ItemNumber']");
        // var lineItemNumberArray2 = [];
        // if (typeof lineItemNumberArray == string){
        //     lineItemNumberArray2.push(lineItemNumberArray);
        // }
        var lineQuantityArray = nlapiSelectValues(Invoice, "//*[name()='Quantity']");

        if (InvoiceType == "PO Invoice") {
            //now build PO vendor bill record
            var newPOVendorBillRec = nlapiTransformRecord('purchaseorder', 1501221, 'vendorbill');
            newPOVendorBillRec.setFieldValue('tranid', InvoiceNumber);
            newPOVendorBillRec.setFieldValue('trandate', correctedDate);
            var lineCount = newPOVendorBillRec.getLineItemCount('item');
            //unset all lines for receipt
            var itemIds = [];
            for (i = 1; i <= lineCount; i++) {
                newPOVendorBillRec.setLineItemValue('item', 'quantity', i, 0);
            }
/////////////
            for (i = 1; i <= lineCount; i++) {
                itemIds[i-1] = newPOVendorBillRec.getLineItemValue('item', 'item', i);
                var lineId = i;
                for (j = 0; j < lineItemNumberArray.length; j++) {
                    if (itemIds[i-1] == lineItemNumberArray[j]) {
                        lineItemNumberArray[j] = [];
                        lineItemNumberArray[j][0] = lineId;
                    }
                }
            }
/////////////            //set items lines
            for (i = 0; i < itemIds.length; i++) {
                newPOVendorBillRec.setLineItemValue('item', 'islinefulfilled', lineItemNumberArray[i][0], 'T');
                newPOVendorBillRec.setLineItemValue('item', 'quantity', lineItemNumberArray[i][0], Number(lineQuantityArray[i]));
            }
            var newRecId = nlapiSubmitRecord(newPOVendorBillRec);
        }
        else {

            //now build NON-PO vendor bill record
            var newBillRec = nlapiCreateRecord('vendorbill');
            newBillRec.setFieldValue('trandate', correctedDate);
            newBillRec.setFieldValue('entity', vendorId);
            newBillRec.setFieldValue('tranid', InvoiceNumber);
            newBillRec.setFieldValue('subsidiary', CompanyCode);
            newBillRec.setFieldValue('location', 7);
            newBillRec.setFieldValue('account', 117);
            for (x = 0; x < lineGLAccountArray.length; x++) {
                newBillRec.selectNewLineItem('expense');
                newBillRec.setCurrentLineItemValue('expense', 'account', lineGLAccountArray[x]);
                newBillRec.setCurrentLineItemValue('expense', 'amount', lineAmountArray[x]);
                newBillRec.setCurrentLineItemValue('expense', 'department', lineCostCenterArray[x]);
                newBillRec.setCurrentLineItemValue('expense', 'memo', lineDescriptionArray[x]);
                newBillRec.commitLineItem('expense');
            }
            var newRecId = nlapiSubmitRecord(newBillRec);
            //completed NON-PO vendor bill
        }

        var ackXML = '<?xml version="1.0" encoding="utf-8"?>';
        ackXML += '<ERPAck>';
        ackXML += '<EskerInvoiceID>' + eskerRUID + '</EskerInvoiceID>';
        ackXML += '<ERPID>' + newRecId + '</ERPID>';
        ackXML += '</ERPAck>';
        var file = nlapiCreateFile(xmlFileName + 'ACK.xml', 'PLAINTEXT', ackXML);
        file.setFolder(3213046);
        var newFileId = nlapiSubmitFile(file);
        nlapiLogExecution('debug', 'inboundfileID', xmlFileId);
    }
    for (i = 0; i < inboundsToProcess.length; i++) {
        nlapiDeleteFile(inboundsToProcess[i].getValue('internalid'));
    }
}


function AndyxxxxxreceivePO(request, response) {
    var poNum = request.getParameter('ponum');
    var jPayload = request.getParameter('jpay');
    nlapiLogExecution('DEBUG', 'Progress Indiciator', 'Payload Object is ' + jPayload);
    var jsData = JSON.parse(jPayload);
    var poId = jsData.intid;
    nlapiLogExecution('DEBUG', 'Progress Indicator', 'PO Id: ' + poId);
    nlapiLogExecution('DEBUG', 'Progress Indicator', 'TranId: ' + poNum);
    var itemList = jsData.lineitems;
    nlapiLogExecution('DEBUG', 'Progress Indicator', 'Line Items: ' + itemList);
    var lineQty = jsData.lineqty;
    nlapiLogExecution('DEBUG', 'Progress Indicator', 'Line Qtys: ' + lineQty);
    var itemIds = [];
    var tranLinesIds = [];

    var itemRecpt = nlapiTransformRecord('purchaseorder', 1509442, 'itemreceipt');

    var createCode = itemRecpt.setFieldValue('custbody_owms_create_code', 'acc');

    //get item internalIds
    for (i = 0; i < itemList.length; i++) {
        var itemFils = [];
        itemFils[0] = new nlobjSearchFilter('upccode', null, 'is', itemList[i]);
        var itemCols = [];
        itemCols[0] = new nlobjSearchColumn('internalid');
        var itemid = nlapiSearchRecord('inventoryitem', null, itemFils, itemCols);
        itemIds.push(itemid[0].id);
    }

    nlapiLogExecution('DEBUG', 'Progress Indicator', 'Passed Item ID Lookup found ' + itemIds + ' items.');

    var lineCount = itemRecpt.getLineItemCount('item');

    //unset all lines for receipt
    for (i = 1; i <= lineCount; i++) {
        itemRecpt.setLineItemValue('item', 'itemreceive', i, 'F');
    }


    //find correct item lines
    for (i = 1; i <= lineCount; i++) {
        var item_id = itemRecpt.getLineItemValue('item', 'item', i);
        var lineId = i;
        for (j = 0; j < itemIds.length; j++) {
            if (item_id == itemIds[j]) {
                itemIds[j] = [];
                itemIds[j][0] = lineId;
            }
        }
    }

    //set scanned items lines
    for (i = 0; i < itemIds.length; i++) {
        itemRecpt.setLineItemValue('item', 'itemreceive', itemIds[i][0], 'T');
        itemRecpt.setLineItemValue('item', 'quantity', itemIds[i][0], lineQty[i]);
    }

    nlapiSubmitRecord(itemRecpt);
}



