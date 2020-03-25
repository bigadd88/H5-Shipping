// Restlet for Alexa to get Number of shipments in transit
function generateResponse(response) {
  	var fil = new Array();
  		fil[0] = new nlobjSearchFilter('custrecord_pss_shipment_status', null, 'is', 3);
  	var col = new Array();
  		col[0] = new nlobjSearchColumn('internalid');
	var seaRes = nlapiSearchRecord('customrecord_pss_shipment', null, fil, col);
  	//for (var i = 0; i < seaRes.length; i++){
     //var inTransVal = seaRes[i].getValue('internalid');
    //}
	var jsonObj = {'inTrans' : seaRes.length};
  	return jsonObj
}
