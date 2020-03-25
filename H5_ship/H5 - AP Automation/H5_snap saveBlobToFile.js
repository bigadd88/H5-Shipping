function saveBlobToFile(request, response){
    nlapiLogExecution('debug', 'started');
    var fileContents = request.getBody();
    nlapiLogExecution('debug', 'received ', fileContents);
    var fileObj = nlapiCreateFile('snapshot.htm', 'HTMLDOC', fileContents);
    nlapiLogExecution('debug', 'fileObj ', fileObj);
    fileObj.setFolder('159');
    newFileId = nlapiSubmitFile(fileObj);
    nlapiLogExecution('debug', 'fileId ', newFileId);
    response.write(newFileId);

}