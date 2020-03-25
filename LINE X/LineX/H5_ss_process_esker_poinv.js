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
        // var contents = '<?xml version="1.0" encoding="UTF-8"?> <Invoice RUID="CD#TSJH283333D.696527435771939206"> <AlternativePayee></AlternativePayee> <Assignment></Assignment> <BaselineDate/> <BusinessArea></BusinessArea> <CalculateTax>1</CalculateTax> <CompanyCode>1</CompanyCode> <DueDate>2019-12-10</DueDate> <ERPLinkingDate>2019-10-14</ERPLinkingDate> <ERPPaymentBlocked>0</ERPPaymentBlocked> <ERPPostingDate>2019-10-14</ERPPostingDate> <ERP>generic</ERP> <ExchangeRate>0</ExchangeRate> <GRIV>0</GRIV> <HeaderText></HeaderText> <History></History> <InvoiceAmount>198.76</InvoiceAmount> <InvoiceCurrency>USD</InvoiceCurrency> <InvoiceDate>2019-10-07</InvoiceDate> <InvoiceDescription></InvoiceDescription> <InvoiceNumber>Robert-abc123</InvoiceNumber> <InvoiceReferenceNumber></InvoiceReferenceNumber> <InvoiceType>Non-PO Invoice</InvoiceType> <LocalCurrency>USD</LocalCurrency> <LocalInvoiceAmount>0</LocalInvoiceAmount> <LocalNetAmount>0</LocalNetAmount> <LocalTaxAmount>0</LocalTaxAmount> <ManualLink>0</ManualLink> <NetAmount>198.76</NetAmount> <OrderNumber></OrderNumber> <PaymentApprovalStatus>Not requested</PaymentApprovalStatus> <PaymentTerms>3</PaymentTerms> <PostingDate>2019-10-11</PostingDate> <ReceptionMethod>Email</ReceptionMethod> <SAPPaymentMethod></SAPPaymentMethod> <SelectedBankAccountID></SelectedBankAccountID> <TaxAmount>0</TaxAmount> <UnplannedDeliveryCosts>0</UnplannedDeliveryCosts> <VendorCity>Toronto</VendorCity> <VendorCountry>ON</VendorCountry> <VendorName>R and L Carriers Inc</VendorName> <VendorNumber>8030</VendorNumber> <VendorPOBox></VendorPOBox> <VendorRegion>M9C</VendorRegion> <VendorStreet>116-5399 Eglington Ave West</VendorStreet> <VendorZipCode>CA</VendorZipCode> <VerificationDate>2019-10-14</VerificationDate> <ApproversList> <item> <ApprovalDate/> <Approved>0</Approved> <ApproverComment></ApproverComment> <ApproverEmail></ApproverEmail> <ApproverID>apspecialistsprocess.su@100025597.esk</ApproverID> <ApproverLabelRole>AP Specialist</ApproverLabelRole> <Approver>AP Specialists</Approver> </item> </ApproversList> <LineItems> <item> <Amount>100.00</Amount> <Assignment></Assignment> <BusinessArea></BusinessArea> <CCDescription></CCDescription> <CostCenter>109</CostCenter> <Description>line1</Description> <GLAccount>1309</GLAccount> <GLDescription>Freight - Outbound Cost</GLDescription> <InternalOrder></InternalOrder> <LineType>GL</LineType> <TaxAmount>0</TaxAmount> <TaxCode>NOTAX</TaxCode> <TaxJurisdiction></TaxJurisdiction> <TaxRate>0</TaxRate> </item> <item> <Amount>98.76</Amount> <Assignment></Assignment> <BusinessArea></BusinessArea> <CCDescription></CCDescription> <CostCenter>109</CostCenter> <Description>line2</Description> <GLAccount>1309</GLAccount> <GLDescription>Freight - Outbound Cost</GLDescription> <InternalOrder></InternalOrder> <LineType>GL</LineType> <TaxAmount>0</TaxAmount> <TaxCode>NOTAX</TaxCode> <TaxJurisdiction></TaxJurisdiction> <TaxRate>0</TaxRate> </item> </LineItems> <InvoiceDocumentURL> https://na2.esker.com:443/ondemand/webaccess/asc/ManageDocumentsCheck.link?ruid=CD%23TSJH283333D.696527435771939206 </InvoiceDocumentURL> <InvoiceImageURL> https://na2.esker.com:443/ondemand/webaccess/asc/attach.file?id=CD%23TSJH283333D.696527435771939206 </InvoiceImageURL> </Invoice>';
        var parsedXML = nlapiStringToXML(contents);
        var Invoice = nlapiSelectNode(parsedXML, "//*[name()='Invoice']");
        var eskerRUID = nlapiSelectValue(Invoice, "//@RUID");
        // var eskerRUID = Invoice.attributes.RUID.value;
        var VendorNumber = nlapiSelectValue(Invoice, "//*[name()='VendorNumber']");
        var InvoiceDateRaw = nlapiSelectValue(Invoice, "//*[name()='InvoiceDate']");
        var dateSplit = InvoiceDateRaw.split('-');
        var correctedDate = dateSplit[1] + '/' + dateSplit[2] + '/' + dateSplit[0];
        var InvoiceNumber = nlapiSelectValue(Invoice, "//*[name()='InvoiceNumber']");
        var InvoiceType = nlapiSelectValue(Invoice, "//*[name()='InvoiceType']");
        //lineItems arrays
        var lineAmountArray = nlapiSelectValues(Invoice, "//*[name()='Amount']");
        var lineDescriptionArray = nlapiSelectValues(Invoice, "//*[name()='Description']");
        var lineCostCenterArray = nlapiSelectValues(Invoice, "//*[name()='CostCenter']");
        var lineGLAccountArray = nlapiSelectValues(Invoice, "//*[name()='GLAccount']");
        //now build a vendor bill record
        var newBillRec = nlapiCreateRecord('vendorbill');
        newBillRec.setFieldValue('trandate', correctedDate);
        newBillRec.setFieldValue('entity', VendorNumber);
        newBillRec.setFieldValue('tranid', InvoiceNumber);
        newBillRec.setFieldValue('subsidiary', 2);
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
        var ackXML = '<?xml version="1.0" encoding="utf-8"?>';
        ackXML += '<ERPAck>';
        ackXML += '<EskerInvoiceID>' + eskerRUID + '</EskerInvoiceID>';
        ackXML += '<ERPID>' + newRecId + '</ERPID>';
        ackXML += '</ERPAck>';
        // console.log(ackXML);


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

    var itemRecpt = nlapiTransformRecord('purchaseorder', poId, 'itemreceipt');

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



