function createEskerPayments() {
    nlapiLogExecution('debug','Started ', 'Started Payments');
    var search = nlapiLoadSearch('transaction', 'customsearch_h5_eskerpaymentfile');
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
    // Company code;Vendor number;Invoice number;Payment date;Payment method;Payment reference

    nlapiLogExecution('debug','search loop complete. payment Records: ', completeResultSet.length);
    var csvFile = '';
    csvFile += 'Company code;';
    csvFile += 'Vendor number;';
    csvFile += 'Invoice number;';
    csvFile += 'Payment date;';
    csvFile += 'Payment method;';
    csvFile += 'Payment reference\n';
  //  csvFile += 'CompanyCode__\n';



    for(i=0; i < completeResultSet.length -1; i++){
        csvFile += completeResultSet[i].getValue('internalid', 'subsidiary') + ';'; //OrderDate__
        csvFile += completeResultSet[i].getValue('entityid', 'vendor') + ';'; //VendorNumber__
        csvFile += completeResultSet[i].getValue('invoicenum') + ';'; //OrderedAmount__
        csvFile += completeResultSet[i].getValue('trandate') + ';'; //DeliveredAmount__
        csvFile += 'Check' + ';'; //InvoicedAmount__
        csvFile += completeResultSet[i].getValue('transactionname') + '\n'; //CompanyCode__
    }
    var file = nlapiCreateFile('ERP__Payments__.csv', 'CSV', csvFile);
    file.setFolder(3232716);
    var newFileId = nlapiSubmitFile(file);
    nlapiLogExecution('debug','Payment file created ', newFileId);
    // var newEmail = nlapiSendEmail(25149, 'robert@habit5.com', 'Esker PO Headers', csvFile, null, null, null, null);
}
