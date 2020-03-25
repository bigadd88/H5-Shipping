// Purpose - recieves json from emailparser and creates TTS Greenlot records
function restfulJSONParser(request, response) {
    nlapiLogExecution('DEBUG', 'Method is: ', request.getMethod());
    var reqData = request.getBody();
    var jsdata = JSON.parse(reqData);
    var newAttachment = nlapiCreateFile('helloworld.csv', 'CSV', 'Hello,World\nHello,World');
    var newEmail = nlapiSendEmail(11689, 'robert@habit5.com', 'Sample email and attachment', 'Please see the attached file', null, null, null, newAttachment);
    toSlack(reqData);
    response.write(200);
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function subDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}
function toSlack(data){
    var slackRawMessage1 = {
        "text": ' ' + data + ' '
    }
    var slackMessage1 = JSON.stringify(slackRawMessage1);
    var slackResponse = nlapiRequestURL('https://hooks.slack.com/services/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', slackMessage1, 'Content-type: application/json');
}

function recLRData(request, response){
    nlapiLogExecution('DEBUG', 'Method is: ', request.getMethod());
    nlapiLogExecution('DEBUG','Script Start', 'Game on!');
    var reqData = request.getBody();
    nlapiLogExecution('DEBUG','Progress Indicator', reqData.toString());
    var jsReq = JSON.parse(reqData);
    var parsedData = jsReq.order_number;
    nlapiLogExecution('DEBUG','Script Fin', 'Jobs Done');
    response.write(200);
}


function csvImportFunc(){

    var customerCSVImport = nlapiCreateCSVImport();

    customerCSVImport.setMapping("1");

// setMapping(id) – id (parameter): Internal ID of the Field Map created Step 1.

// Navigate to: Setup > Import/Export > Saved CSV Imports.

    customerCSVImport.setPrimaryFile(nlapiLoadFile(2766));

    /*

    setPrimaryFile(file) – file {string} (parameter):



    The internal ID, as shown in the file cabinet, of the CSV file containing data to be imported, referenced by nlapiLoadFile. For example: setPrimaryFile(nlapiLoadFile(73)

    Or

    Raw string of the data to be imported. For Example



    fileString = "company name, isperson, subsidiary, externalid\ncompanytest001, FALSE, Parent Company, companytest001";

    setPrimaryFile(fileString);



    */

    customerCSVImport.setOption("jobName", "job1Import");

    nlapiSubmitCSVImport(customerCSVImport);

}