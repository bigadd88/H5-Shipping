function afterSubmit(){
	var woId = nlapiGetRecordId();
	var woObj = nlapiLoadRecord('workorder', woId);
	var woTranId = woObj.getFieldValue('tranid');



	var inventorydetailSearch = nlapiSearchRecord("inventorydetail",null,
		[
			["transaction.type","anyof","WorkOrd"],
			"AND",
			["transaction.transactionnumbernumber","equalto",woTranId],
			"AND",
			["item.custitemcustitemwcr_itemtype","anyof","8"]
		],
		[
			new nlobjSearchColumn("internalid"),
			new nlobjSearchColumn("inventorynumber").setSort(false),
			new nlobjSearchColumn("binnumber"),
			new nlobjSearchColumn("quantity"),
			new nlobjSearchColumn("itemcount"),
			new nlobjSearchColumn("item"),
			new nlobjSearchColumn("type","transaction",null),
			new nlobjSearchColumn("internalid","transaction",null),
			new nlobjSearchColumn("entity","transaction",null),
			new nlobjSearchColumn("transactionnumber","transaction",null),
			new nlobjSearchColumn("inventorynumber","inventoryNumber",null)
		]
	);

	response.write(JSON.stringify(inventorydetailSearch));
}




