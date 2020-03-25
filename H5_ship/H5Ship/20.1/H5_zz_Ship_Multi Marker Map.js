function renderMap(){
	if (request.getMethod() == 'GET') {
		var fil = new Array();
        fil[0] = new nlobjSearchFilter('custrecord_h5_dest_lat', null, 'isnotempty');
		var col = new Array();
		col[0] = new nlobjSearchColumn('internalid');
		col[1] = new nlobjSearchColumn('custrecord_h5_dest_lat');
		col[2] = new nlobjSearchColumn('custrecord_h5_dest_lng');

        var locs = new Array();
        var lat = new Array();
        var lng = new Array();

		var seaRes = nlapiSearchRecord('customrecord_h5_shipment', 'customsearch_h5_mapped_shipments', fil, col);
		for (i = 0; i < seaRes.length; i++){
			lat = seaRes[i].getValue('custrecord_h5_dest_lat');
			lng = seaRes[i].getValue('custrecord_h5_dest_lng');
			locs += '{lat: ' + lat + ',' + 'lng: ' + lng + '},';
        }
        var mmLocs = 'var locations = [' + locs + ']';
		nlapiLogExecution('DEBUG', 'Locations: ', mmLocs);
		var file = nlapiLoadFile(152);
      	var contents = file.getValue();
        var mmOutput = contents.replace('nsMMLocs', mmLocs);
      	response.write(mmOutput);
	}
}