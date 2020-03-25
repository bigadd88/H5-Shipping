function saveSig(request,response){


    var contents = request.getBody();
    var sigFile = nlapiCreateFile('sig3.png', 'PNGIMAGE', contents);
    sigFile.setFolder(334162);
    newId = nlapiSubmitFile(sigFile);
    response.write(newId);
}