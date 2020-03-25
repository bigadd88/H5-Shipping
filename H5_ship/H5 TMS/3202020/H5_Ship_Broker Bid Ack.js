function brokerbidack(request, response){
	var recId = request.getParameter('recName');
	nlapiLogExecution('DEBUG', 'Activated!', 'Function called from bid response!'+recId);
}
