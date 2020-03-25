    function masterFunction(){
        createEskerPOHeaders();
        createEskerPOLines();
        createEskerGLAccounts();
        createEskerVendors();
        createEskerItemReceiptLines();
        createEskerCustomers();
        createEskerAmortSchedules();
        createEskerItemCategory();
        createLocation();

    }

    function createEskerPOHeaders() {
        nlapiLogExecution('debug','Started ', 'Started PO Headers');
        var search = nlapiLoadSearch('transaction', 'customsearch_h5_esker_poheaders');
        var searchResults = search.runSearch();
        var resultIndex = 0;
        var resultStep = 1000;
        var resultSet;
        var completeResultSet = [];
        var resultSet = [1,2];
        while (resultSet.length > 0){
            resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
            resultIndex = resultIndex + resultStep;
            completeResultSet = completeResultSet.concat(resultSet);
        }
        nlapiLogExecution('debug','search loop complete. PO Header Records: ', completeResultSet.length);
        var csvFile = '';
        csvFile += 'OrderDate__,';
        csvFile += 'OrderNumber__,';
        csvFile += 'VendorNumber__,';
        csvFile += 'OrderedAmount__,';
        csvFile += 'DeliveredAmount__,';
        csvFile += 'InvoicedAmount__,';
        csvFile += 'CompanyCode__\n';


        // completeResultSet.pop();
        for(i=0; i < completeResultSet.length; i++){
            csvFile += completeResultSet[i].getValue('trandate') + ','; //OrderDate__
            csvFile += completeResultSet[i].getValue('formulatext').replace('PO','') + ','; //OrderNumber__
            csvFile += completeResultSet[i].getValue('entityid', 'vendor') + ','; //VendorNumber__
            csvFile += completeResultSet[i].getValue('amount') + ','; //OrderedAmount__
            csvFile += completeResultSet[i].getValue('amount') + ','; //DeliveredAmount__
            csvFile += '0.00,'; //InvoicedAmount__
            csvFile += completeResultSet[i].getValue('internalid', 'subsidiary') + '\n'; //CompanyCode__
        }
        var file = nlapiCreateFile('ERP__PurchaseorderHeaders__.csv', 'CSV', csvFile);
        file.setFolder(3109383);
        var newFileId = nlapiSubmitFile(file);
        nlapiLogExecution('debug','PO Headers file created: ', newFileId);
        // var newEmail = nlapiSendEmail(25149, 'robert@habit5.com', 'Esker PO Headers', csvFile, null, null, null, null);
    }

    function createEskerPOLines() {
        nlapiLogExecution('debug','Started ', 'Started PO Lines');
        var search = nlapiLoadSearch('transaction', 'customsearch_h5_esker_polines_2_3');
        var searchResults = search.runSearch();
        var resultIndex = 0;
        var resultStep = 1000;
        var resultSet;
        var completeResultSet = [];
        var resultSet = [1,2];
        while (resultSet.length > 0){
            resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
            resultIndex = resultIndex + resultStep;
            completeResultSet = completeResultSet.concat(resultSet);
        }
        nlapiLogExecution('debug','search loop complete. PO Line Records: ', completeResultSet.length);
        var csvFile = '';
        csvFile += 'VendorNumber__,';//1
        csvFile += 'OrderNumber__,';//2
        csvFile += 'ItemNumber__,';//3
        csvFile += 'Description__,';//4
        csvFile += 'OrderedAmount__,';//5
        csvFile += 'OrderedQuantity__,';//6
        csvFile += 'DeliveredAmount__,';//7
        csvFile += 'DeliveredQuantity__,';//8
        csvFile += 'InvoicedAmount__,';//9
        csvFile += 'InvoicedQuantity__,';//10
        csvFile += 'TaxCode__,';//11
        csvFile += 'CompanyCode__,';//12
        csvFile += 'UnitPrice__,';//13
        csvFile += 'PartNumber__,';//14
        csvFile += 'GLAccount__,';//15
        csvFile += 'CostCenter__,';//16
        csvFile += 'BudgetID__,';//17
        csvFile += 'TaxRate__,';//18
        csvFile += 'ItemCategory__,';//19
        csvFile += 'Location__,';//20
        csvFile += 'Customer__,';//21
        csvFile += 'CustomerId__\n';//22
        // completeResultSet.pop();
        for(i=0; i < completeResultSet.length; i++){
            csvFile += completeResultSet[i].getValue('entityid', 'vendor', 'MAX') + ','; //VendorNumber__ 1
            csvFile += completeResultSet[i].getValue('formulatext', null, 'MAX').replace('PO','') + ','; //OrderNumber__ 2
            csvFile += completeResultSet[i].getValue('line', null, 'GROUP') + ','; //ItemNumber 3
            var memo = completeResultSet[i].getValue('memo', null, 'MAX').replace(/\n/g,''); //Description__4
            var memo = memo.replace(/,/g,'');
            csvFile += memo + ',';
            csvFile += completeResultSet[i].getValue('amount', null, 'MAX') + ','; //OrderedAmount__ 5
            csvFile += completeResultSet[i].getValue('quantity', null, 'MAX') + ','; //OrderedQuantity__ 6
            csvFile += completeResultSet[i].getValue('formulanumeric', null, 'MAX') + ','; //DeliveredAmount__ 7
            csvFile += completeResultSet[i].getValue('quantity', 'applyingTransaction', 'MAX') + ','; //DeliveredQuantity__ 8
            csvFile += '0' + ','; //InvoicedAmount__ 9
            csvFile += '0' + ','; //InvoicedQuantity__ 10
            csvFile += '' + ','; //TaxCode__ 11
            csvFile += completeResultSet[i].getValue('internalid', 'subsidiary', 'MAX') + ','; //CompanyCode__  12
            csvFile += completeResultSet[i].getValue('rate', null, 'MAX') + ','; //UnitPrice__ 13
            csvFile += completeResultSet[i].getValue('itemid', 'item', 'MAX') + ','; //PartNumber__ 17
            csvFile += completeResultSet[i].getValue('internalid', 'account', 'MAX') + ','; //GLAccount__ 15
            csvFile += '' + ','; //CostCenter__ 16
            csvFile += '' + ','; //BudgetID__ 17
            csvFile += completeResultSet[i].getValue('taxamount', null, 'MAX') + ','; //TaxRate__ 18
            csvFile += completeResultSet[i].getValue('name', 'class', 'MAX') + ','; //ItemCategory__ 19
            csvFile += completeResultSet[i].getValue('location', null, 'MAX') + ','; //Location 20
            csvFile += completeResultSet[i].getValue('altname', 'customer', 'MAX').replace(/,/g,'') + ','; //Customer__ 21
            csvFile += completeResultSet[i].getValue('entityid', 'customer', 'MAX') + '\n'; //CustomerId__ 22

        }
        var file = nlapiCreateFile('ERP__PurchaseorderItems__.csv', 'CSV', csvFile);
        file.setFolder(3109383);
        var newFileId = nlapiSubmitFile(file);
        nlapiLogExecution('debug','PO Lines file created: ', newFileId);
        // var newEmail = nlapiSendEmail(25149, 'robert@habit5.com', 'Esker PO Lines', csvFile, null, null, null, null);
    }

    function createEskerCostCenters() {
        nlapiLogExecution('debug','Started ', 'Started Cost Centers');
        var search = nlapiLoadSearch('transaction', 'customsearch_h5_esker_poheaders');
        var searchResults = search.runSearch();
        var resultIndex = 0;
        var resultStep = 1000;
        var resultSet;
        var completeResultSet = [];
        var resultSet = [1,2];
        while (resultSet.length > 0){
            resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
            resultIndex = resultIndex + resultStep;
            completeResultSet = completeResultSet.concat(resultSet);
        }
        nlapiLogExecution('debug','search loop complete. Cost Center Records: ', completeResultSet.length);
        var csvFile = '';
        csvFile += 'CostCenter__,';
        csvFile += 'Description__,';
        csvFile += 'CompanyCode__,';
        csvFile += 'Manager__\n';

        for(i=0; i < completeResultSet.length -1; i++){
            csvFile += completeResultSet[i].getValue('trandate') + ','; //OrderDate__
            csvFile += completeResultSet[i].getValue('transactionnumber') + ','; //OrderNumber__
            csvFile += completeResultSet[i].getValue('internalid', 'vendor') + ','; //VendorNumber__
            csvFile += completeResultSet[i].getValue('amount') + ','; //OrderedAmount__
            csvFile += '' + ','; //DeliveredAmount__
            csvFile += '' + ','; //InvoicedAmount__
            csvFile += completeResultSet[i].getValue('internalid', 'subsidiary') + '\n'; //CompanyCode__
        }
        var file = nlapiCreateFile('ERP__Costcenters__.csv', 'CSV', csvFile);
        file.setFolder(3109383);
        var newFileId = nlapiSubmitFile(file);
        nlapiLogExecution('debug','Cost Center file created: ', newFileId);
        // var newEmail = nlapiSendEmail(25149, 'robert@habit5.com', 'Esker Cost Centers', csvFile, null, null, null, null);
    }

    function createEskerGLAccounts() {
        nlapiLogExecution('debug','Started ', 'Started GL Accounts');
        var search = nlapiLoadSearch('account', 'customsearch_h5_esker_glaccounts');
        var searchResults = search.runSearch();
        var resultIndex = 0;
        var resultStep = 1000;
        var resultSet;
        var completeResultSet = [];
        var resultSet = [1,2];
        while (resultSet.length > 0){
            resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
            resultIndex = resultIndex + resultStep;
            completeResultSet = completeResultSet.concat(resultSet);
        }
        nlapiLogExecution('debug','search loop complete. GL Accounts Records: ', completeResultSet.length);
        var csvFile = '';
        csvFile += 'Account__,';
        csvFile += 'Description__,';
        csvFile += 'CompanyCode__,';
        csvFile += 'Allocable1__,';
        csvFile += 'Allocable2__,';
        csvFile += 'Allocable3__,';
        csvFile += 'Allocable4__,';
        csvFile += 'Allocable5__,';
        csvFile += 'Group__,';
        csvFile += 'Manager__\n';

        for(i=0; i < completeResultSet.length -1; i++){
            csvFile += completeResultSet[i].getValue('internalid') + ','; //Account__
            csvFile += completeResultSet[i].getValue('name').replace(',',' ') + ','; //Description__
            csvFile += completeResultSet[i].getValue('internalid', 'CUSTRECORD_CE_SUBSIDIARIAS') + ','; //CompanyCode__
            csvFile += '' + ',';
            csvFile += '' + ',';
            csvFile += '' + ',';
            csvFile += '' + ',';
            csvFile += '' + ',';
            csvFile += '' + ',';
            csvFile += '' + '\n';
        }
        var file = nlapiCreateFile('ERP__GLaccount__.csv', 'CSV', csvFile);
        file.setFolder(3109383);
        var newFileId = nlapiSubmitFile(file);
        nlapiLogExecution('debug','GL Account file created: ', newFileId);
        // var newEmail = nlapiSendEmail(25149, 'robert@habit5.com', 'Esker GL Accounts', csvFile, null, null, null, null);
    }

    function createEskerVendors() {
        nlapiLogExecution('debug','Started ', 'Started Vendors');
        var search = nlapiLoadSearch('vendor', 'customsearch_h5_esker_vendors');
        var searchResults = search.runSearch();
        var resultIndex = 0;
        var resultStep = 1000;
        var resultSet;
        var completeResultSet = [];
        var resultSet = [1,2];
        while (resultSet.length > 0){
            resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
            resultIndex = resultIndex + resultStep;
            completeResultSet = completeResultSet.concat(resultSet);
        }
        nlapiLogExecution('debug','search loop complete. Vendors Records: ', completeResultSet.length);
        var csvFile = '';
        csvFile += 'Number__,';//1
        csvFile += 'Name__,';//2
        csvFile += 'Street__,';//3
        csvFile += 'City__,';//4
        csvFile += 'Country__,';//5
        csvFile += 'PostalCode__,';//6
        csvFile += 'Region__,';//7
        csvFile += 'PhoneNumber__,';//8
        csvFile += 'FaxNumber__,';//9
        csvFile += 'Email__,';//10
        csvFile += 'VATNumber__,';//11
        csvFile += 'CompanyCode__,';//12
        csvFile += 'Currency__,';//13
        csvFile += 'PaymentTermCode__,';//14
        csvFile += 'PostOfficeBox__,';//15
        csvFile += 'TaxSystem__,';//16
        csvFile += 'SupplierDue__,';//17
        csvFile += 'ParafiscalTax__,';//18
        csvFile += 'GeneralAccount__,';//19
        csvFile += 'PreferredInvoiceType__,';//20
        csvFile += 'Sub__,\n';//21

        for(i=0; i < completeResultSet.length -1; i++){
            if(completeResultSet[i].getValue('entitynumber') != ""){
            csvFile += completeResultSet[i].getValue('entityid').replace(/,/g,' ') + ',';//1
            csvFile += completeResultSet[i].getValue('altname').replace(/,/g,' ') + ',';//2
            csvFile += completeResultSet[i].getValue('billaddress1').replace(/,/g,' ') + ',';//3
            csvFile += completeResultSet[i].getValue('billcity').replace(/,/g,' ') + ',';//4
            csvFile += completeResultSet[i].getValue('billcountry') + ',';//5
            csvFile += completeResultSet[i].getValue('billzipcode') + ',';//6
            csvFile += completeResultSet[i].getValue('billstate') + ',';//7
            csvFile += completeResultSet[i].getValue('phone').replace(/,/g,' ') + ',';//8
            csvFile += completeResultSet[i].getValue('fax').replace(/,/g,' ') + ',';//9
            csvFile += completeResultSet[i].getValue('email') + ',';//10
            csvFile += completeResultSet[i].getValue('taxidnum') + ',';//11
            csvFile += completeResultSet[i].getValue('internalid', 'msesubsidiary') + ',';//12
            csvFile += completeResultSet[i].getValue('currency') + ',';//13
            csvFile += completeResultSet[i].getValue('terms') + ',';//14
            csvFile += '' + ',';//15
            csvFile += '' + ',';//16
            csvFile += '' + ',';//17
            csvFile += '' + ',';//18
            csvFile += completeResultSet[i].getValue('expenseaccount') + ',';//19
            csvFile += '' + ',';//20
            csvFile += '' + '\n';//21
            }
        }
        var file = nlapiCreateFile('ERP__Vendors__.csv', 'CSV', csvFile);
        file.setFolder(3109383);
        var newFileId = nlapiSubmitFile(file);
        nlapiLogExecution('debug','Vendor file created: ', newFileId);
        // var newEmail = nlapiSendEmail(25149, 'robert@habit5.com', 'Esker Vendors', csvFile, null, null, null, null);
    }

    function createEskerItemReceiptLinesOLD() {
        nlapiLogExecution('debug','Started ', 'Started PO Lines');
        var search = nlapiLoadSearch('transaction', 'customsearch_h5_esker_irlines_4');
        var searchResults = search.runSearch();
        var resultIndex = 0;
        var resultStep = 1000;
        var resultSet;
        var completeResultSet = [];
        var resultSet = [1,2];
        while (resultSet.length > 0){
            resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
            resultIndex = resultIndex + resultStep;
            completeResultSet = completeResultSet.concat(resultSet);
        }
        nlapiLogExecution('debug','search loop complete. IR Line Records: ', completeResultSet.length);
        var csvFile = '';
        csvFile += 'CompanyCode__,';//CompanyCode__
        csvFile += 'DeliveryDate__,';//DeliveryDate__
        csvFile += 'GoodsReceipt__,';//GoodsReceipt__
        csvFile += 'DeliveryNote__,';//DeliveryNote__
        csvFile += 'OrderNumber__,';//OrderNumber__
        csvFile += 'ItemNumber__,';//ItemNumber__
        csvFile += 'Quantity__,';//Quantity__
        csvFile += 'Amount__,';//Amount__
        csvFile += 'InvoicedQuantity__,';//InvoicedQuantity__
        csvFile += 'InvoicedAmount__,';//InvoicedAmount__
        csvFile += 'DeliveryCompleted__\n';//DeliveryCompleted__

        // completeResultSet.pop();
        for(i=0; i < completeResultSet.length; i++){
            csvFile += completeResultSet[i].getValue('subsidiary') + ','; //CompanyCode__
            csvFile += completeResultSet[i].getValue('trandate') + ','; //DeliveryDate__
            csvFile += completeResultSet[i].getValue('transactionnumber').replace('IR','') + ','; //GoodsReceipt__
            csvFile += completeResultSet[i].getText('location') + ','; //DeliveryNote__
            csvFile += completeResultSet[i].getValue('formulatext').replace('PO','') + ','; //OrderNumber__
            csvFile += completeResultSet[i].getValue('line') + ','; //ItemNumber__
            csvFile += completeResultSet[i].getValue('quantity') + ','; //Quantity__
            var amount = (completeResultSet[i].getValue('quantity') * completeResultSet[i].getValue('rate'));
            csvFile += amount + ','; //Amount__
            csvFile += completeResultSet[i].getValue('quantitybilled', 'appliedToTransaction') + ','; //InvoicedQuantity__
            var invoicedAmount = (completeResultSet[i].getValue('quantitybilled', 'appliedToTransaction')*completeResultSet[i].getValue('rate'));
            csvFile += invoicedAmount + ','; //InvoicedAmount__
            var receivedQ = Number(completeResultSet[i].getValue('quantityshiprecv', 'appliedToTransaction'));
            var orderedQ = Number(completeResultSet[i].getValue('quantity', 'appliedToTransaction'));
            if (receivedQ < orderedQ) {
                csvFile += '0' + '\n'; //DeliveryCompleted__
            } else {
            csvFile += '1' + '\n'; //DeliveryCompleted__
            }
        }
        var file = nlapiCreateFile('ERP__GoodsReceiptItems__.csv', 'CSV', csvFile);
        file.setFolder(3109383);
        var newFileId = nlapiSubmitFile(file);
        nlapiLogExecution('debug','IR Lines file created: ', newFileId);
    }
    function createEskerItemReceiptLines() {
        nlapiLogExecution('debug','Started ', 'Started PO Lines');
        var search = nlapiLoadSearch('transaction', 'customsearch_h5_esker_goodsreceiptsv1');
        var searchResults = search.runSearch();
        var resultIndex = 0;
        var resultStep = 1000;
        var resultSet;
        var completeResultSet = [];
        var resultSet = [1,2];
        while (resultSet.length > 0){
            resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
            resultIndex = resultIndex + resultStep;
            completeResultSet = completeResultSet.concat(resultSet);
        }
        nlapiLogExecution('debug','search loop complete. IR Line Records: ', completeResultSet.length);
        var csvFile = '';
        csvFile += 'CompanyCode__,';//CompanyCode__
        csvFile += 'DeliveryDate__,';//DeliveryDate__
        csvFile += 'GoodsReceipt__,';//GoodsReceipt__
        csvFile += 'DeliveryNote__,';//DeliveryNote__
        csvFile += 'OrderNumber__,';//OrderNumber__
        csvFile += 'ItemNumber__,';//ItemNumber__
        csvFile += 'Quantity__,';//Quantity__
        csvFile += 'Amount__,';//Amount__
        csvFile += 'InvoicedQuantity__,';//InvoicedQuantity__
        csvFile += 'InvoicedAmount__,';//InvoicedAmount__
        csvFile += 'DeliveryCompleted__\n';//DeliveryCompleted__

        // completeResultSet.pop();
        for(i=0; i < completeResultSet.length; i++){
            csvFile += completeResultSet[i].getValue('internalid', 'subsidiary') + ','; //CompanyCode__
            csvFile += completeResultSet[i].getValue('trandate', 'applyingTransaction') + ','; //DeliveryDate__
            csvFile += completeResultSet[i].getValue('transactionnumber', 'applyingTransaction').replace('IR','') + ','; //GoodsReceipt__
            csvFile += completeResultSet[i].getText('location') + ','; //DeliveryNote__
            csvFile += completeResultSet[i].getValue('transactionnumber').replace('PO','') + ','; //OrderNumber__
            csvFile += completeResultSet[i].getValue('line') + ','; //ItemNumber__
            csvFile += completeResultSet[i].getValue('quantity', 'applyingTransaction') + ','; //Quantity__
            csvFile += completeResultSet[i].getValue('formulanumeric') + ','; //Amount__
            csvFile += completeResultSet[i].getValue('quantitybilled') + ','; //InvoicedQuantity__
            csvFile += completeResultSet[i].getValue('formulacurrency') + ','; //InvoicedAmount__
            var toReceive = Number(completeResultSet[i].getValue('formulanumeric'));
            if (toReceive > 0) {
                csvFile += '0' + '\n'; //DeliveryCompleted__
            } else {
                csvFile += '1' + '\n'; //DeliveryCompleted__
            }
        }
        var file = nlapiCreateFile('ERP__GoodsReceiptItems__.csv', 'CSV', csvFile);
        file.setFolder(3109383);
        var newFileId = nlapiSubmitFile(file);
        nlapiLogExecution('debug','IR Lines file created: ', newFileId);
    }

    function createEskerCustomers() {
        nlapiLogExecution('debug','Started ', 'Started Customers');
        var search = nlapiLoadSearch('customer', 'customsearch_h5_esker_customers');
        var searchResults = search.runSearch();
        var resultIndex = 0;
        var resultStep = 1000;
        var resultSet;
        var completeResultSet = [];
        var resultSet = [1,2];
        while (resultSet.length > 0){
            resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
            resultIndex = resultIndex + resultStep;
            completeResultSet = completeResultSet.concat(resultSet);
        }
        nlapiLogExecution('debug','search loop complete. Customer Records: ', completeResultSet.length);
        var csvFile = '';
        csvFile += 'Z_CustomerName__,';//1
        csvFile += 'Z_CustomerID__\n';//21

        for(i=0; i < completeResultSet.length -1; i++){
            if(completeResultSet[i].getValue('entitynumber') != ""){
                csvFile += completeResultSet[i].getValue('companyname').replace(/,/g) + ',';//1
                csvFile += completeResultSet[i].getValue('entityid')  + '\n';//21
            }
        }
        var file = nlapiCreateFile('ERP__Customer__.csv', 'CSV', csvFile);
        file.setFolder(3109383);
        var newFileId = nlapiSubmitFile(file);
        nlapiLogExecution('debug','Customer file created: ', newFileId);
    }

    function createEskerAmortSchedules() {
        nlapiLogExecution('debug','Started ', 'Started Amortization Schedules');
        var amortizationscheduleSearch = nlapiSearchRecord("amortizationtemplate",null,
            ['isinactive', 'is', false
            ],
            [
                new nlobjSearchColumn("name").setSort(false)
            ]
        );
        nlapiLogExecution('debug','Amortization Records: ', amortizationscheduleSearch.length);
        var csvFile = '';
        csvFile += 'Z_AmortSchedule__,'+'\n';//1


        for(i=0; i < amortizationscheduleSearch.length; i++){

                csvFile += amortizationscheduleSearch[i].getValue('name') + '\n';//1

        }
        var file = nlapiCreateFile('ERP__AmortSchedule__.csv', 'CSV', csvFile);
        file.setFolder(3109383);
        var newFileId = nlapiSubmitFile(file);
        nlapiLogExecution('debug','Amortization file created: ', newFileId);
    }

    function createEskerItemCategory() {
        nlapiLogExecution('debug','Started ', 'Started Item Category');
        var classificationSearch = nlapiSearchRecord("classification",null,
            [
                ["isinactive","is","F"]
            ],
            [
                new nlobjSearchColumn("name").setSort(false),
                new nlobjSearchColumn("internalid")
            ]
        );
        nlapiLogExecution('debug','ItemCategory Records: ', classificationSearch.length);
        var csvFile = '';
        csvFile += 'Z_ItemCategory__,'+'\n';//1


        for(i=0; i < classificationSearch.length; i++){

            csvFile += classificationSearch[i].getValue('name') + '\n';//1

        }
        var file = nlapiCreateFile('ERP__ItemCategory__.csv', 'CSV', csvFile);
        file.setFolder(3109383);
        var newFileId = nlapiSubmitFile(file);
        nlapiLogExecution('debug','Item Category file created: ', newFileId);
    }

    function createLocation() {
        nlapiLogExecution('debug','Started ', 'Started Location');
        var locationSearch = nlapiSearchRecord("location",null,
            [
                ["isinactive","is","F"]
            ],
            [
                new nlobjSearchColumn("name").setSort(false),
                new nlobjSearchColumn("internalid")
            ]
        );
        nlapiLogExecution('debug','Location Records: ', locationSearch.length);
        var csvFile = '';
        csvFile += 'Z_Location__,'+'\n';//1


        for(i=0; i < locationSearch.length; i++){

            csvFile += locationSearch[i].getValue('name') + '\n';//1

        }
        var file = nlapiCreateFile('ERP__Location__.csv', 'CSV', csvFile);
        file.setFolder(3109383);
        var newFileId = nlapiSubmitFile(file);
        nlapiLogExecution('debug','Location file created: ', newFileId);
    }



