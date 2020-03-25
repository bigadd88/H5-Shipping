function createEskerFiles() {
    nlapiLogExecution('debug','Started ', 'Started');
    var search = nlapiLoadSearch('transaction', 'customsearch_h5_esker_polines');
    var searchResults = search.runSearch();
    var resultIndex = 0;
    var resultStep = 1000;
    var resultSet;
    var completeResultSet = [];
    nlapiLogExecution('debug','before the DO ', '');
    //     do {
    //     nlapiLogExecution('debug','Inside loop first run: ', '');
    //     resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
    //         resultIndex = resultIndex + resultStep;
    //         completeResultSet = completeResultSet.concat(resultSet);
    //     }
    // while (resultSet != null);
    // Alternate method
    var resultSet = [1,2];
    while (resultSet.length > 0){
        nlapiLogExecution('debug','Inside loop first run: ', '');
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        resultIndex = resultIndex + resultStep;
        completeResultSet = completeResultSet.concat(resultSet);
    }

    nlapiLogExecution('debug','search loop complete. Records: ', completeResultSet.length);

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
        csvFile += completeResultSet[i].getValue('internalid', 'vendor') + ','; //VendorNumber__
        csvFile += completeResultSet[i].getValue('transactionnumber') + ','; //OrderNumber__
        csvFile += completeResultSet[i].getValue('internalid', 'item') + ','; //ItemNumber__
        var memo = completeResultSet[i].getValue('memo').replace(/\n/g,''); //Description__
        var memo = memo.replace(/,/g,'');
        csvFile += memo + ',';
        csvFile += completeResultSet[i].getValue('amount') + ','; //OrderedAmount__
        csvFile += completeResultSet[i].getValue('quantity') + ','; //OrderedQuantity__
        csvFile += '' + ','; //DeliveredAmount__
        csvFile += '' + ','; //DeliveredQuantity__
        csvFile += '' + ','; //InvoicedAmount__
        csvFile += '' + ','; //InvoicedQuantity__
        csvFile += '' + ','; //TaxCode__
        csvFile += completeResultSet[i].getValue('internalid', 'subsidiary') + ','; //CompanyCode__
        csvFile += completeResultSet[i].getValue('porate') + ','; //UnitPrice__
        csvFile += completeResultSet[i].getValue('item') + ','; //PartNumber__
        csvFile += completeResultSet[i].getValue('internalid', 'account') + ','; //GLAccount__
        csvFile += '' + ','; //CostCenter__
        csvFile += '' + ','; //BudgetID__
        csvFile += completeResultSet[i].getValue('taxamount') + '\n'; //TaxRate__

    }
    nlapiLogExecution('debug','String created with character count: ', csvFile.length);
    var file = nlapiCreateFile('ERP__PurchaseorderItems__', 'CSV', csvFile);
    file.setFolder(3109383);
    var newFileId = nlapiSubmitFile(file);
    nlapiLogExecution('debug','file created: ', newFileId);
    // var newEmail = nlapiSendEmail(25149, 'robert@habit5.com', 'Esker PO Lines', csvFile, null, null, null, null);
}