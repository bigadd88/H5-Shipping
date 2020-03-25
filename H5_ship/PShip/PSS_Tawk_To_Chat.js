function renderChat(){
	if (request.getMethod() == 'GET') {
		var file = nlapiLoadFile(166);
      	var contents = file.getValue();
      	response.write(contents);
	}
}