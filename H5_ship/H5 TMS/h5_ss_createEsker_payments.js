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



    for(i=0; i < completeResultSet.length; i++){
        csvFile += completeResultSet[i].getValue('internalid', 'subsidiary') + ';'; //CompanyCode__
        csvFile += completeResultSet[i].getValue('entityid', 'vendor') + ';'; //VendorNumber__
        csvFile += completeResultSet[i].getValue('invoicenum', 'paidtransaction').replace('Bill #','') + ';'; //InvoiceNumber__
        var tranDateRaw = completeResultSet[i].getValue('trandate', null);
        var tranDateSplit = tranDateRaw.split('/');
        var tranDate = tranDateSplit[2] + '-' + tranDateSplit[0] + '-' + tranDateSplit[1];
        csvFile += tranDate + ';'; //PaymentDate__
        csvFile += 'Check' + ';'; //Payment method__
        csvFile += completeResultSet[i].getValue('transactionname', null).replace('Bill Payment #','') + '\n'; //Payment Reference__
    }
    var file = nlapiCreateFile('ERP__Payments__.csv', 'CSV', csvFile);
    file.setFolder(3232716);
    var newFileId = nlapiSubmitFile(file);
    nlapiLogExecution('debug','Payment file created ', newFileId);
    // var newEmail = nlapiSendEmail(25149, 'robert@habit5.com', 'Esker PO Headers', csvFile, null, null, null, null);
}
