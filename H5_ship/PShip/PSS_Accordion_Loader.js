function renderPage(request, response) {
    if (request.getMethod() == 'GET') {
      var recordId = request.getParameter('recId');
      var file = nlapiLoadFile(122);
      var contents = file.getValue();
 function getListValues(listScriptId) {
      var searchColumn = new nlobjSearchColumn('name');
      var searchResults = nlapiSearchRecord(listScriptId, null, null, searchColumn);
      var listArray = new Array();
      for (i in searchResults) {
        listArray[searchResults[i].id] = searchResults[i].getValue(searchColumn);
    }
    return listArray;
}
      var packageList = getListValues('customlist_pss_package_type');
      var linHazmat = new Array();
      var linPicCount = new Array();
      var linType = new Array();
      var linNum = new Array();
      var linDesc = new Array();
      var linWeight = new Array();
      var items = new Array();
      var fil = new Array();
      		fil[0] = new nlobjSearchFilter('custrecord_pss_shipment_parent', null, 'is', recordId);
      	var col = new Array();
      		col[0] = new nlobjSearchColumn('custrecord_pss_hazmat');
      		col[1] = new nlobjSearchColumn('custrecord_pss_piece_count');
      		col[2] = new nlobjSearchColumn('custrecord_pss_description');
      		col[3] = new nlobjSearchColumn('custrecord_pss_packagetype');
      		col[4] = new nlobjSearchColumn('custrecord_pss_inventoryunits');
      		col[5] = new nlobjSearchColumn('custrecord_pss_weight');
      	var packages = nlapiSearchRecord('customrecord_pss_shipment_line', null, fil, col);
      	for (var x = 0; x < packages.length; x++){
          	var linHazmat = packages[x].getValue('custrecord_pss_hazmat');
          	var linPicCount = packages[x].getValue('custrecord_pss_piece_count');
          	var linType = packages[x].getText('custrecord_pss_package_type');
          	var linNum = packages[x].getValue('custrecord_pss_inventoryunits');
          	var linDesc = packages[x].getValue('custrecord_pss_description');
          	var linWeight = packages[x].getValue('custrecord_pss_weight');
      		items += '<tr><td>' + linHazmat + '</td><td>' + linPicCount + '</td><td>' + linNum + '</td><td>' + linType + '</td><td>' + linDesc + '</td><td>' + linWeight + '</td></tr>';
        }
      	nlapiLogExecution('DEBUG','Line Item Count', 'We counted: ' + items + ' lines!!!');
      	var newcont = contents.replace("<itmstr>", items);
        var newcont = contents.replace("<recid>", recordId);
        response.write(newcont);
        nlapiLogExecution('DEBUG', 'HTML Rendered', 'Success!');
    }
}