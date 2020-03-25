function beforeLoad(type, form){
	//if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
	//	var currentRecordId = nlapiGetRecordId();
	//}
  	addAckButton(form);
	//nlapiLogExecution('DEBUG', 'Current Broker Bid Record', 'Transaction ID: ' + currentRecordId);
    //
    }

function addAckButton(form){
  form.setScript('customscript_pss_broker_bid_blue');
  form.addButton('custpage_addAckButton', 'Broker Bid Acknowledgement', 'brokerbidack()');
}

/*function brokerbidack() {
	var recName = nlapiGetRecordId();
  	var url = nlapiResolveURL('SUITELET','customscript_pss_brokerbidack','customdeploy_pss_brokerbidack');
	url += '&recName=' + recName,
		window.open(url);
}*/

function brokerbidack(){
	var recId = nlapiGetRecordId();
  var bidRec = nlapiLoadRecord('customrecord_pss_broker_bid_response', recId);
	var shipRecId = bidRec.getFieldValue('custrecord_pss_bid2shipment_link');
  var vendorId = bidRec.getFieldValue('custrecord_pss_broker_vendorid');
	var contactName = bidRec.getFieldValue('custrecord_pss_bid_contactname');
	var contactEmail = bidRec.getFieldValue('custrecord_pss_bid_contactemail');
	var bidStatus = bidRec.getFieldValue('custrecord_pss_brokerbid_status');
	var bidAmount = bidRec.getFieldValue('custrecord_pss_bid_amount');
	var bidCurrency = bidRec.getFieldValue('custrecord_pss_bid_currency');
  var bidCurrencyText = nlapiLookupField('currency',bidCurrency,'symbol');
  console.log('initial variables set');
	nlapiLogExecution('DEBUG', 'Activated!', 'Function called from bid response!'+recId);
  //close the other bids
  var bidId = [];
  var bidsToClose = nlapiSearchRecord("customrecord_pss_broker_bid_response",null,[["custrecord_pss_bid2shipment_link","anyof",shipRecId]],[new nlobjSearchColumn("name").setSort(false)]);
  for (var i = 0;i < bidsToClose.length; i++){
    bidId.push(bidsToClose[i].id);
    var bid = nlapiLoadRecord('customrecord_pss_broker_bid_response', bidId[i], null, null);
    bid.setFieldValue('custrecord_pss_brokerbid_status', 4);
    nlapiSubmitRecord(bid);
  }
  console.log('close bids');
	//update bid response record
  bidRec.setFieldValue('custrecord_pss_brokerbid_status', 3);
	nlapiSubmitRecord(bidRec);
  //update parent shipment
	var shipmentRecord = nlapiLoadRecord('customrecord_pss_shipment',shipRecId);
	shipmentRecord.setFieldValue('custrecord_pss_carrier',vendorId);
	shipmentRecord.setFieldValue('custrecord_pss_shipment_selcost',bidAmount);
	shipmentRecord.setFieldValue('custrecord_pss_ship_cur',bidCurrency);
	shipmentRecord.setFieldValue('custrecord_pss_shipment_status',2);
	nlapiSubmitRecord(shipmentRecord);

  //send email awarding bid
  var recNum = shipmentRecord.getFieldValue('name');
  var shipDate = shipmentRecord.getFieldValue('custrecord_pss_ship_date');
	var refatpickup = shipmentRecord.getFieldValue('custrecord_pss_reference_pickup');
	if (refatpickup === null){refatpickup = '';}
	var refatdelivery = shipmentRecord.getFieldValue('custrecord_pss_reference_delivery');
	if (refatdelivery === null){refatdelivery = '';}
	var shipperAddressee = shipmentRecord.getFieldValue('custrecord_pss_shipper_addressee');
	var shipperAddr1 = shipmentRecord.getFieldValue('custrecord_pss_shipper_addr_1');
	var shipperAddr2 = shipmentRecord.getFieldValue('custrecord_pss_shipper_addr_2');
	if (shipperAddr2 === null){shipperAddr2 = '';}
	var shipperCity = shipmentRecord.getFieldValue('custrecord_pss_shipper_city');
	var shipperState = shipmentRecord.getFieldValue('custrecord_pss_shipper_state');
	var shipperZip = shipmentRecord.getFieldValue('custrecord_pss_shipper_zip');
	var shipperCountry = shipmentRecord.getFieldValue('custrecord_pss_shipper_country');
  //var consigneeName = shipmentRecord.getFieldText('custrecord_pss_consignee');
	var consigneeAddressee = shipmentRecord.getFieldValue('custrecord_pss_consignee_addree');
	var consigneeAddr1 = shipmentRecord.getFieldValue('custrecord_pss_consignee_addr1');
	var consigneeAddr2 = shipmentRecord.getFieldValue('custrecord_pss_consignee_addr2');
	if (consigneeAddr2 === null){consigneeAddr2 = '';}
	var consigneeCity = shipmentRecord.getFieldValue('custrecord_pss_consignee_city');
	var consigneeState = shipmentRecord.getFieldValue('custrecord_pss_consignee_state');
	var consigneeZip = shipmentRecord.getFieldValue('custrecord_pss_consignee_zip');
	var consigneeCountry = shipmentRecord.getFieldValue('custrecord_pss_consignee_country');
	var splitSIMS = shipmentRecord.getFieldValue('custrecord_pss_special_instructions');
    if (splitSIMS === null){splitSIMS = '';}
	var ownerId = shipmentRecord.getFieldValue('custrecord_pss_custservteamlead');
  var selAccessorials = shipmentRecord.getFieldValue('custrecord_pss_accessorials');
	console.log('Accessorials seleted: ' + selAccessorials);


	if (selAccessorials != null) {
		var selAccNamesPrnt = new Array();
		var accFil = new Array();
		accFil[0] = new nlobjSearchFilter('internalid', null, 'anyof', selAccessorials);
		var accCol = new Array();
		accCol[0] = new nlobjSearchColumn('name');
		var selAccNames = nlapiSearchRecord('customrecord_pss_accessorials', null, accFil, accCol);
		for (var j = 0; j < selAccNames.length; j++){
			selAccNamesPrnt += selAccNames[j].getValue('name') + '<br />';
		}
	} else {selAccNamesPrnt = '';}


	console.log('Accessorials print string: ' + selAccNamesPrnt);
	var specInstMSP = [];
  var linHazmat = [];
	var linPicCount = [];
	var linType = [];
	var linNum = [];
	var linDesc = [];
	var linNMFC = [];
	var linLength = [];
	var linWidth = [];
	var linHeight = [];
	var linWeight = [];
	var items = [];
	var totLPC = 0;
	var totLPic = 0;
	var totWeight = 0;
	var pkgcount = [];
	var fil = [];
	  fil[0] = new nlobjSearchFilter('custrecord_pss_shipment_parent', null, 'is', shipRecId);
	var col = [];
	  col[0] = new nlobjSearchColumn('custrecord_pss_hazmat');
	  col[1] = new nlobjSearchColumn('custrecord_pss_nmfc_number');
	  col[2] = new nlobjSearchColumn('custrecord_pss_ship_line_item_desc');
	  col[3] = new nlobjSearchColumn('custrecord_pss_packagetype');
	  col[4] = new nlobjSearchColumn('custrecord_pss_pkgnumber');
	  col[5] = new nlobjSearchColumn('custrecord_pss_weight');
	  col[6] = new nlobjSearchColumn('custrecord_pss_nmfc_number_line');
	  col[7] = new nlobjSearchColumn('custrecord_pss_freight_class_value');
	  col[8] = new nlobjSearchColumn('custrecord_pss_piece_count');
	  col[9] = new nlobjSearchColumn('custrecord_pss_length');
	  col[10] = new nlobjSearchColumn('custrecord_pss_width');
	  col[11] = new nlobjSearchColumn('custrecord_pss_height');
	var packages = nlapiSearchRecord('customrecord_pss_shipment_line', null, fil, col);
	for (var x = 0; x < packages.length; x++){
	    pkgcount.push(packages[x].getValue('custrecord_pss_piece_count'));
	    var linHazmat = packages[x].getValue('custrecord_pss_hazmat');
	    var linPicCount = packages[x].getValue('custrecord_pss_nmfc_number');
	    var linType = packages[x].getText('custrecord_pss_packagetype');
	    var linNum = packages[x].getValue('custrecord_pss_piece_count');
	    var linDesc = packages[x].getValue('custrecord_pss_ship_line_item_desc');
	    var linWeight = packages[x].getValue('custrecord_pss_weight');
	    var linLength = packages[x].getValue('custrecord_pss_length');
	var linWidth = packages[x].getValue('custrecord_pss_Width');
	var linHeight = packages[x].getValue('custrecord_pss_Height');
	var linNMFC = packages[x].getValue('custrecord_pss_freight_class_value');
	    //totLPic += Number(linNum);
	    totWeight += Number(linWeight);
	  items += '<tr><td align="center">' + linNum + '</td><td align="left">' + linType + '</td><td align="left">' + linHazmat + '</td><td align="left">' + linDesc + '</td><td align="left">' + linPicCount + '</td><td align="left">' + linNMFC + '</td><td align="left">' + linLength + '</td><td align="left">' + linWidth + '</td><td align="left">' + linHeight + '</td><td align="left">' + linWeight + '</td></tr>';
	  }
	//var pkgcnt = pkgcount.reduce(getSum);
	var pkgcnt = packages.length;
	//var pkgcnt = Math.max.apply(null,pkgcount);
	var hotTots = '<tr><td>Total Package Count:' + '</td><td font-size: 14pt>' + pkgcnt + '</td><td>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td><td>' + 'Total Weight:' + '</td><td font-size: 14pt>' + totWeight + ' lbs' + '</td></tr>';
	//nlapiLogExecution('DEBUG','Line Item Count', 'We counted: ' + items + ' lines!!!');
	//begin template well formed HTML
  var emailSubject = 'Bid Accepted - ' + recNum;
	var emailBody = '<body style="width: 400px">';
	emailBody += '<table><tr>';
	emailBody += '<td><img src="http://pliteq.com/images/pliteq.gif"/></td>';
	emailBody += '<td><b>Shipment Ref: ' + shipRecId + ' </b></td>';
  emailBody += '</tr></table>';
  emailBody += '<table><tr>';
	emailBody += '<td>You have been awarded this shipment for: <b>'+ bidCurrencyText + ' ' + bidAmount + '</b></td>';
	emailBody += '</tr></table>';
	//start of upper main table
	emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
	emailBody += '<td valign="top">';
	//start of ship from table - ajr
	emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
	emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">Ship From</th>';
	emailBody += '</tr>';
	emailBody += '<tr><td valign="left">' + 'Pliteq Inc.' + '<br />';
	emailBody += '<tr><td valign="left">' + shipperAddressee + '<br />';
	emailBody += '<tr><td valign="left">' + shipperAddr1 + '<br />';
	emailBody += '<tr><td valign="left">' + shipperAddr2 + '<br />';
	emailBody += shipperCity + ', ' + shipperState + ' ' + shipperZip + '<br />';
	emailBody += '<tr><td valign="left">' + shipperCountry + '<br />';
	emailBody += '</td>';
	emailBody += '</tr></table>';
	//start of ship to table - ajr
	emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
	emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">Ship To</th>';
	emailBody += '</tr>';
	emailBody += '<tr><td valign="left">' + consigneeAddressee + '<br />';
	emailBody += '<tr><td valign="left">' + consigneeAddr1 + '<br />';
	emailBody += '<tr><td valign="left">' + consigneeAddr2 + '<br />';
	emailBody += consigneeCity + ', ' + consigneeState + ' ' + consigneeZip + '<br />';
	emailBody += '<tr><td valign="left">' + consigneeCountry + '<br />';
	emailBody += '</td>';
	emailBody += '</tr></table>';
	emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
	emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">References</th>';
	emailBody += '</tr>';
	emailBody += '<tr>';
	emailBody += '<td>Ship Date #:&nbsp;' + shipDate + '</td>';
	emailBody += '</tr>';
	emailBody += '<tr>';
	emailBody += '<td>Origin Reference #:&nbsp;' + refatpickup + '</td>';
	emailBody += '</tr>';
	emailBody += '<tr>';
	emailBody += '<td>Destination Reference #:&nbsp;' + refatdelivery + '</td>';
	emailBody += '</tr>';
	emailBody += '<tr>';
	emailBody += '<td></td>';
	emailBody += '</tr></table>';
	//start of Accessorials table - ajr
	emailBody += '<table style="width: 100%; font-size: 10pt;"><tr>';
	emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">Accessorials</th>';
	emailBody += '</tr>';
	emailBody += '<tr>';
	emailBody += '<td>' + selAccNamesPrnt + '</td>';
	emailBody += '';
	emailBody += '</tr></table>';
	//end of upper main table
	emailBody += '</td>';
	emailBody += '</tr></table>';
	//start of special instructions table
	emailBody += '<table style="width: 100%; height:50px; font-size: 10pt;border:1px"><tr>';
	emailBody += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">SPECIAL INSTRUCTIONS:</th>';
	emailBody += '<td valign="top"><b>' + splitSIMS + '</b><br /></td>';
	emailBody += '</tr>';
	emailBody += '<tr><td>TOTAL WEIGHT: '+ totWeight +'</td></tr>';
	emailBody += '<tr><td>TOTAL PIECES: '+ pkgcnt +'</td></tr>';
	emailBody += '</table>';
	//start of line items table
	emailBody += '<table style="width:100%;font-size:8pt;margin-top: 10px;">';
	emailBody += '<thead>';
	emailBody += '<tr>';
	emailBody += '<th align="center" valign="middle" style="text-align:left">Package</th>';
	emailBody += '<th style="padding: 4px 4px;text-align:left">Type</th>';
	emailBody += '<th style="padding: 4px 4px;text-align:left">HM</th>';
	emailBody += '<th style="padding: 4px 4px;text-align:left">Description</th>';
	emailBody += '<th style="padding: 4px 4px;text-align:left">NMFC</th>';
	emailBody += '<th style="padding: 4px 4px;text-align:left">Class</th>';
	emailBody += '<th style="padding: 4px 4px;text-align:left">L</th>';
	emailBody += '<th style="padding: 4px 4px;text-align:left">W</th>';
	emailBody += '<th style="padding: 4px 4px;text-align:left">H</th>';
	emailBody += '<th style="padding: 4px 4px;text-align:left">Weight</th>';
	emailBody += '</tr>';
	emailBody += '</thead>';
	emailBody += items;
	emailBody += '<tr style="width:100%;border:1px"><td></td></tr>';
	//emailBody += hotTots;
	emailBody += '</table></body>';
  var rec = [];
  rec['recordtype']='customrecord_pss_broker_bid_response'; //script id of the custom record type
  rec['record'] = recId;
  nlapiSendEmail(ownerId,contactEmail,emailSubject,emailBody,null,null,rec,null,'true');
  location.reload();
}
