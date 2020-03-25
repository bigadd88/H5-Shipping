function masterFunction(){
    createEskerPOHeaders();
    createEskerPOLines();
    createEskerGLAccounts();
    createEskerVendors();

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



    for(i=0; i < completeResultSet.length -1; i++){
        csvFile += completeResultSet[i].getValue('trandate') + ','; //OrderDate__
        csvFile += completeResultSet[i].getValue('transactionnumber').replace('PO','') + ','; //OrderNumber__
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
    var search = nlapiLoadSearch('transaction', 'customsearch_h5_esker_polines');
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
    csvFile += 'VendorNumber__,';
    csvFile += 'OrderNumber__,';
    csvFile += 'ItemNumber__,';
    csvFile += 'Description__,';
    csvFile += 'OrderedAmount__,';
    csvFile += 'OrderedQuantity__,';
    csvFile += 'DeliveredAmount__,';
    csvFile += 'DeliveredQuantity__,';
    csvFile += 'InvoicedAmount__,';
    csvFile += 'InvoicedQuantity__,';
    csvFile += 'TaxCode__,';
    csvFile += 'CompanyCode__,';
    csvFile += 'UnitPrice__,';
    csvFile += 'PartNumber__,';
    csvFile += 'GLAccount__,';
    csvFile += 'CostCenter__,';
    csvFile += 'BudgetID__,';
    csvFile += 'TaxRate__\n';


    for(i=0; i < completeResultSet.length -1; i++){
        csvFile += completeResultSet[i].getValue('entityid', 'vendor') + ','; //VendorNumber__
        csvFile += completeResultSet[i].getValue('transactionnumber').replace('PO','') + ','; //OrderNumber__
        csvFile += completeResultSet[i].getValue('internalid', 'item') + ','; //ItemNumber__
        var memo = completeResultSet[i].getValue('memo').replace(/\n/g,''); //Description__
        var memo = memo.replace(/,/g,'');
        csvFile += memo + ',';
        csvFile += completeResultSet[i].getValue('amount') + ','; //OrderedAmount__
        csvFile += completeResultSet[i].getValue('quantity') + ','; //OrderedQuantity__
        csvFile += completeResultSet[i].getValue('amount') + ','; //DeliveredAmount__
        csvFile += completeResultSet[i].getValue('quantity') + ','; //DeliveredQuantity__
        csvFile += '0' + ','; //InvoicedAmount__
        csvFile += '0' + ','; //InvoicedQuantity__
        csvFile += '' + ','; //TaxCode__
        csvFile += completeResultSet[i].getValue('internalid', 'subsidiary') + ','; //CompanyCode__
        csvFile += completeResultSet[i].getValue('porate') + ','; //UnitPrice__
        csvFile += completeResultSet[i].getValue('item') + ','; //PartNumber__
        csvFile += completeResultSet[i].getValue('internalid', 'account') + ','; //GLAccount__
        csvFile += '' + ','; //CostCenter__
        csvFile += '' + ','; //BudgetID__
        csvFile += completeResultSet[i].getValue('taxamount') + '\n'; //TaxRate__

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
    csvFile += 'Manager__,\n';

    for(i=0; i < completeResultSet.length -1; i++){
        csvFile += completeResultSet[i].getValue('internalid') + ','; //Account__
        csvFile += completeResultSet[i].getValue('name').replace(',',' ') + ','; //Description__
        csvFile += '' + ',';
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
        csvFile += '' + ',';//12
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



