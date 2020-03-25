//get and return line data sets
function getLineData(request, response){
	var locId = request.getParamater('locid');
    	fil[0] = new nlobjSearchFilter('location', null, 'is', locId);
   		fil[1] = new nlobjSearchFilter('mainline', null, 'is', 'F');
    	fil[2] = new nlobjSearchFilter('taxline', null, 'is', 'F');
    	//fil[1] = new nlobjSearchFilter('custcol_pss_item_weight', null, 'isnotempty');
    var col = new Array();
   		col[0] = new nlobjSearchColumn('item');
   		col[1] = new nlobjSearchColumn('custcol_pss_item_weight');
   		col[2] = new nlobjSearchColumn('quantity');
   		col[3] = new nlobjSearchColumn('department');
   		col[4] = new nlobjSearchColumn('custrecord_pss_freight_class_value');
  	var lineData = nlapiSearchRecord('estimate', null, fil, col);
	response.write(lineData);
}