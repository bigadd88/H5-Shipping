function printBOL(request, response){
	if (request.getMethod() == 'GET') {
		var recId = request.getParameter('recName');
      	//var css = GenerateCSSForReport();
      	//get shipment information for template - ajr
		var record = nlapiLoadRecord('customrecord_pss_shipment', recId, null, null);
      	var recNum = record.getFieldValue('name');
        var origLoc = record.getFieldValue('custrecord_pss_location');
      	//var ShipperEnt = record.getFieldValue('custrecord_pss_shipper');
      	//var ShipperEntType = nlapiLookupField('entity', ShipperEnt, 'type');
      	//if (ShipperEntType === 'CustJob'){ShipperEntType = 'customer';}
      	var ConsEnt = record.getFieldValue('custrecord_pss_consignee');
      	var ConsType = nlapiLookupField('entity', ConsEnt, 'type');
      	if (ConsType === 'CustJob'){ConsType = 'customer';}
      	var BillToEnt = record.getFieldValue('custrecord_pss_freight_bill_to');
      	var BillToType = nlapiLookupField('entity', BillToEnt, 'type');
      	if (BillToType === 'CustJob'){BillToType = 'customer';}
      	//nlapiLogExecution('DEBUG', 'Shipper Entity Type', 'Entity Type is ' + ShipperEntType);
      	nlapiLogExecution('DEBUG', 'Consignee Entity Type', 'Entity Type is ' + ConsType);
      	nlapiLogExecution('DEBUG', 'Bill To Entity Type', 'Entity Type is ' + BillToType);
      	var carrierText = record.getFieldText('custrecord_pss_carrier');
      	var shipDate = record.getFieldValue('custrecord_pss_ship_date');
      	var refatpickup = record.getFieldValue('custrecord_pss_reference_pickup');
      	if (refatpickup === null){refatpickup = '';}
      	var refatdelivery = record.getFieldValue('custrecord_pss_reference_delivery');
        if (refatdelivery === null){refatdelivery = '';}
		//Build the Accessorial Array
      	var selAccessorials = record.getFieldValue('custrecord_pss_accessorials');
      	if (selAccessorials != ''){
          function stringToArray (selAccessorials){
  			//Use ChrCode 5 as a separator
  			var strChar5 = String.fromCharCode(5);
    		//Use the Split method to create an array,
   			//where Chrcode 5 is the separator/delimiter
   			var msStringArray = selAccessorials.split(strChar5);
        	return msStringArray;
			}
      		var selAccNamesPrnt = new Array();
      		var accFil = new Array();
      		accFil[0] = new nlobjSearchFilter('internalid', null, 'anyof', stringToArray(selAccessorials));
      		var accCol = new Array();
      		accCol[0] = new nlobjSearchColumn('name');
      		var selAccNames = nlapiSearchRecord('customrecord_pss_accessorials', null, accFil, accCol);
      		for (var i = 0; i < selAccNames.length; i++){
          	selAccNamesPrnt += selAccNames[i].getValue('name') + '<br />';
        	}
        } else {var selAccNamesPrnt = '';}
      	//get address lines for shipper and carrier - ajr
      	var shipper = nlapiLoadRecord('location', origLoc);
      	var shipName = 'Urban Surfaces ' + shipper.getFieldValue('name');
      	//var strShipName = shipName.replace('&', '&amp;');
    	var shipperAddr1 = record.getFieldValue('custrecord_pss_shipper_addr_1');
    	var shipperAddr2 = record.getFieldValue('custrecord_pss_shipper_addr_2');
      	if (shipperAddr2 === null){shipperAddr2 = '';}
    	var shipperCity = record.getFieldValue('custrecord_pss_shipper_city');
    	var shipperState = record.getFieldValue('custrecord_pss_shipper_state');
    	var shipperZip = record.getFieldValue('custrecord_pss_shipper_zip');
      	var consignee = nlapiLoadRecord(ConsType, ConsEnt);
      	var consigneeName = consignee.getFieldValue('shipaddressee');
      	var strConsName = consigneeName.replace('&', '&amp;');
    	var consigneeAddr1 = record.getFieldValue('custrecord_pss_consignee_addr1');
    	var consigneeAddr2 = record.getFieldValue('custrecord_pss_consignee_addr2');
      	if (consigneeAddr2 === null){consigneeAddr2 = '';}
    	var consigneeCity = record.getFieldValue('custrecord_pss_consignee_city');
    	var consigneeState = record.getFieldValue('custrecord_pss_consignee_state');
    	var consigneeZip = record.getFieldValue('custrecord_pss_consignee_zip');
        var billToRec = nlapiLoadRecord(BillToType, BillToEnt);
      	var BillToName = billToRec.getFieldValue('billaddressee');
      	var strBillToName = BillToName.replace('&', '&amp;');
    	var billToAddr1 = billToRec.getFieldValue('billaddr1');
    	var billToAddr2 = billToRec.getFieldValue('billaddr2');
      	if (billToAddr2 === null){billToAddr2 = '';}
    	var billToCity = billToRec.getFieldValue('billcity');
    	var billToState = billToRec.getFieldValue('billstate');
    	var billToZip = billToRec.getFieldValue('billzip');
      	nlapiLogExecution('DEBUG', 'Addresing Complete', 'Bill To Zip is ' + billToZip);
      	//get shipment lines information for template - ajr
      	var linHazmat = [];
      	var linPicCount = [];
      	var linType = [];
      	var linNum = [];
      	var linDesc = [];
      	var linNMFC = [];
      	var linWeight = [];
      	var items = [];
      	var totLPC = 0;
      	var totLPic = 0;
      	var totWeight = 0;
      	var pkgcount = [];
      	var fil = [];
      		fil[0] = new nlobjSearchFilter('custrecord_pss_shipment_parent', null, 'is', recId);
      	var col = [];
      		col[0] = new nlobjSearchColumn('custrecord_pss_hazmat');
      		col[1] = new nlobjSearchColumn('custrecord_pss_nmfc_number');
      		col[2] = new nlobjSearchColumn('custrecord_pss_ship_line_item_desc');
      		col[3] = new nlobjSearchColumn('custrecord_pss_packagetype');
      		col[4] = new nlobjSearchColumn('custrecord_pss_pkgnumber');
      		col[5] = new nlobjSearchColumn('custrecord_pss_weight');
      		col[6] = new nlobjSearchColumn('custrecord_pss_nmfc_number_line');
      		col[7] = new nlobjSearchColumn('custrecord_pss_freight_class_value');
      	var packages = nlapiSearchRecord('customrecord_pss_shipment_line', null, fil, col);
      	for (var x = 0; x < packages.length; x++){
          	pkgcount.push(packages[x].getValue('custrecord_pss_pkgnumber'));
          	var linHazmat = packages[x].getValue('custrecord_pss_hazmat');
          	var linPicCount = packages[x].getValue('custrecord_pss_nmfc_number');
          	var linType = packages[x].getText('custrecord_pss_packagetype');
          	var linNum = packages[x].getValue('custrecord_pss_pkgnumber');
          	var linDesc = packages[x].getValue('custrecord_pss_ship_line_item_desc');
          	var linWeight = packages[x].getValue('custrecord_pss_weight');
          	var linNMFC = packages[x].getValue('custrecord_pss_freight_class_value');
          	//totLPic += Number(linNum);
          	totWeight += Number(linWeight);
          items += '<tr><td align="center">' + linNum + '</td><td align="left">' + linType + '</td><td align="left">' + linHazmat + '</td><td align="left">' + linDesc + '</td><td align="left">' + linPicCount + '</td><td align="left">' + linNMFC + '</td><td align="left">' + linWeight + '</td></tr>';
        	}
      	var pkgcnt = Math.max.apply(null,pkgcount);
      	var hotTots = '<tr><td>Total Pallet Count:' + '</td><td>' + pkgcnt + '</td><td>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td><td>' + 'Total Weight:' + '</td><td>' + totWeight + 'lbs' + '</td></tr>';
      	nlapiLogExecution('DEBUG','Line Item Count', 'We counted: ' + items + ' lines!!!');
      	//begin template well formed XML - ajr
      	var xml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n';
     	xml += '<pdf>';
      	xml += '<link name="verdana" type="font" subtype="opentype" src="${nsfont.verdana}" src-bold="${nsfont.verdana_bold}" bytes="2" />';
     	xml += '<head>';
      	xml += '<meta name="title" value="Bill of Lading ' + recNum + '"/>';
      	xml += '</head>';
     	xml += '<body padding="0.9in 0.5in 0.1in 0.5in" size="Letter">';
      	xml += '<table style="width: 100%; font-size: 10pt;"><tr>';
		xml += '<td><b>Bill Of Lading - Short From - Not Negotiable</b></td>';
		xml += '<td><b>BOL Number:&nbsp; ' + recNum + ' </b></td>';
		xml += '</tr></table>';
		//start of upper main table
      	xml += '<table style="width: 100%; font-size: 10pt;"><tr>';
      	xml += '<td valign="top">';
      	//start of ship from table - ajr
      	xml += '<table style="width: 100%; font-size: 10pt;"><tr>';
      	xml += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">Ship From</th>';
      	xml += '</tr>';
      	xml += '<tr><td valign="left">' + shipName + '<br />';
      	xml += shipperAddr1 + '<br />' + shipperAddr2 + '<br />';
      	xml += shipperCity + ', ' + shipperState + ' ' + shipperZip + '<br />';
      	xml += '</td>';
      	xml += '</tr></table>';
      	//start of ship to table - ajr
      	xml += '<table style="width: 100%; font-size: 10pt;"><tr>';
      	xml += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">Ship To</th>';
      	xml += '</tr>';
      	xml += '<tr><td valign="left">' + strConsName + '<br />';
      	xml += consigneeAddr1 + '<br />' + consigneeAddr2 + '<br />';
      	xml += consigneeCity + ', ' + consigneeState + ' ' + consigneeZip + '<br />';
      	xml += '</td>';
      	xml += '</tr></table>';
      	//start of bill to table - ajr
      	xml += '<table style="width: 100%; font-size: 10pt;"><tr>';
      	xml += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">BILL 3rd PARTY PREPAID TO:</th>';
      	xml += '</tr>';
      	xml += '<tr><td>' + strBillToName + '<br />' + billToAddr1 + ' ' + billToAddr2 + '<br />' + billToCity + ', ' + billToState + ' ' + billToZip + '</td>';
      	xml += '</tr></table>';
      	xml += '</td>';
      	//start of carrier info table - ajr
      	xml += '<td valign="top">';
      	xml += '<table style="width: 100%; font-size: 10pt;"><tr>';
      	xml += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">Carrier Information:</th>';
      	xml += '</tr>';
      	xml += '<tr><td><b>' + carrierText + '</b></td></tr>';
        xml += '<tr><td>Pickup Date: ' + shipDate + '</td></tr>';
      	xml += '</table>';
      	//start of references table - ajr
      	xml += '<table style="width: 100%; font-size: 10pt;"><tr>';
		xml += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">References</th>';
		xml += '</tr>';
		xml += '<tr>';
		xml += '<td>Origin Reference #:&nbsp;' + refatpickup + '</td>';
		xml += '</tr>';
      	xml += '<tr>';
		xml += '<td>Destination Reference #:&nbsp;' + refatdelivery + '</td>';
		xml += '</tr></table>';
      	//start of Accessorials table - ajr
      	xml += '<table style="width: 100%; font-size: 10pt;"><tr>';
		xml += '<th style="font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold; background-color: #e3e3e3">Accessorials</th>';
		xml += '</tr>';
		xml += '<tr>';
		xml += '<td>' + selAccNamesPrnt + '</td>';
      	xml += '';
		xml += '</tr></table>';
      	//end of upper main table
      	xml += '</td>';
      	xml += '</tr></table>';
      	//start of special instructions table
      	xml += '<table style="width: 100%; height:50px; font-size: 10pt;border:1px"><tr>';
		xml += '<td valign="top"><b>SPECIAL INSTRUCTIONS: &nbsp;' + '' + '</b></td>';
		xml += '</tr>';
		xml += '</table>';
      	//start of line items table
      	xml += '<table style="width:100%;font-size:8pt;margin-top: 10px;">';
		xml += '<thead>';
		xml += '<tr>';
		xml += '<th align="center" valign="middle" style="text-align:left">Package</th>';
		xml += '<th style="padding: 4px 4px;text-align:left">Type</th>';
		xml += '<th style="padding: 4px 4px;text-align:left">HM</th>';
		xml += '<th style="padding: 4px 4px;text-align:left">Description</th>';
		xml += '<th style="padding: 4px 4px;text-align:left">NMFC</th>';
      	xml += '<th style="padding: 4px 4px;text-align:left">Class</th>';
		xml += '<th style="padding: 4px 4px;text-align:left">Weight</th>';
		xml += '</tr>';
		xml += '</thead>';
      	xml += items;
        xml += '<tr style="width:100%;border:1px"><td></td></tr>';
      	xml += hotTots;
		xml += '</table>';
      	//start of signature block - static text - no dynamic data -ajr
      	xml += '<table style="width: 100%; font-size: 8pt;border:1px"><tr>';
		xml += '<td valign="top"><span>*Mark with an X to designate hazardous materials as defines in title 49 of the code of Federal Regulations.</span></td>';
		xml += '</tr>';
		xml += '<tr>';
		xml += '<td valign="top"><b>Hazmat emergency contact #</b></td>';
		xml += '</tr></table>';
		xml += '<table cellpadding="0" cellspacing="0" style="width: 100%; font-size: 8pt;border:1px"><tr>';
		xml += '<td valign="top">Where the rate is dependent on value, shippers are required to state specifically in writing the agreed or declared value of the property as follows: &quot;The agreed or declared value of the property is specifically stated by the shipper to be not exceeding ___________ per ___________.&quot;</td>';
		xml += '</tr></table>';
		xml += '<table style="width: 100%; font-size: 8pt;border:1px"><tr>';
		xml += '<td><b>Note: Liability limitation for loss or damage in this shipment may be applicable. See 49 USC 14706(c)(1)(A) and (B)</b></td>';
		xml += '</tr></table>';
		xml += '<table style="width: 100%; font-size: 8pt;border:1px"><tr>';
		xml += '<td valign="top">';
		xml += '<table style="width: 100%;"><tr>';
		xml += '<td><b>For Freight Collect Shipments</b></td>';
		xml += '</tr>';
		xml += '<tr>';
		xml += '<td>If this shipment is to be delivered to the consignee, without recourse on the consignor, the consignor shall sign the following statement, The carrier may decline to make dekivery of this shipment without payment of freight and all other lawful charges.</td>';
		xml += '</tr>';
		xml += '<tr>';
		xml += '<td>Signature of Consignor:___________________________</td>';
		xml += '</tr>';
		xml += '<tr>';
		xml += '<td><b>Shipper Signature / Date</b></td>';
		xml += '</tr>';
		xml += '<tr>';
		xml += '<td>This is to certify that the above named materials are properly classified packaged, marked and labeled, and are in proper condition for transportation according to the applicable regulations of the Department of Transportation.</td>';
		xml += '</tr>';
		xml += '<tr>';
		xml += '<td>Signature of Shipper: _______________ Date:____________</td>';
		xml += '</tr></table>';
		xml += '</td>';
		xml += '<td valign="top">';
		xml += '<table style="width: 100%;"><tr>';
		xml += '<td><b>Carrier Signature/Date</b></td>';
		xml += '</tr>';
		xml += '<tr>';
		xml += '<td>Carrier acknowledges receipt of packages and required placards. Carrier certifies emergency response information was made available and/or carrier has the Department of Transportation emergency response guidebook or equivelant documentation in the vehicle. Property described above is received in good order, except as noted.</td>';
		xml += '</tr>';
		xml += '<tr>';
		xml += '<td>Carrier:_____________________ Date:______________</td>';
		xml += '</tr></table>';
		xml += '<table style="width: 100%;">';
		xml += '<tr>';
		xml += '<td><b>Receiver Signature/Date</b></td>';
		xml += '</tr>';
		xml += '<tr>';
		xml += '<td>Received in good condition without shortages or damages.</td>';
		xml += '</tr>';
		xml += '<tr>';
		xml += '<td>Receiver/Consignee:________________________</td>';
		xml += '</tr><tr>';
		xml += '<td>Date:___________________________</td>';
		xml += '</tr></table>';
		xml += '</td>';
		xml += '</tr>';
		xml += '</table>';
      	//begin of BOL footer - dynamic shipment ID - ajr
      	xml += '<table>';
		xml += '<tr><td><b>BOL Number:&nbsp;' + recNum + '</b></td></tr>';
		xml += '</table>';
     	xml += "</body></pdf>";
      	//end of template - begining of rendering function and output - ajr
     	var file = nlapiXMLToPDF(xml);
   		var contents = file.getValue();
   		var renderer = nlapiCreateTemplateRenderer(contents);
   		renderer.setTemplate(contents);
   		var renderPDF = renderer.renderToString();
      	response.setContentType('PDF', 'printOut.pdf', 'inline');
   		response.write(renderPDF);
   		nlapiLogExecution('DEBUG', 'PDF Rendered', 'Shipment number ' + recId + ' was rendered!');
}
function GenerateCSSForReport() {
    var css = "<style type='text/css'>";
    css += 'BODY { font-family:sans-serif; }';
    css += 'table {';
    css += 'font-family: sans-serif;';
    css += 'font-size: 9pt';
    css += 'table-layout: fixed;'
    css += 'th {';
    css += '    font-weight: bold;';
    css += '     font-size: 8pt;';
    css += '     vertical-align: middle;';
    css += '     padding: 5px 6px 3px;';
    css += '     background-color: #e3e3e3;';
    css += '    color: #333333;';
    css += '}';

    css += '  td {';
    css += '      padding: 4px 6px;';
    css += ' }';

    css += ' b {';
    css += '    font-weight: bold;';
    css += '    color: #333333;';
    css += '}';

    css += 'table.header td {';
    css += '     padding: 0;';
    css += '     font-size: 10pt;';
    css += ' }';

    css += '  table.footer td {';
    css += '      padding: 0;';
    css += '     font-size: 8pt;';
    css += ' }';

    css += ' table.itemtable th {';
    css += '     padding-bottom: 10px;';
    css += '     padding-top: 10px;';
    css += ' }';

    css += ' table.body td {';
    css += '     padding-top: 2px;';
    css += ' }';

    css += ' span.title {';
    css += '     font-size: 28pt;';
    css += ' }';

    css += ' span.number {';
    css += '     font-size: 16pt;';
    css += ' }';

    css += ' span.itemname {';
    css += '     font-weight: bold;';
    css += '     line-height: 150%;';
    css += ' }';

    css += ' hr {';
    css += '     width: 100%;';
    css += '     color: #d3d3d3;';
    css += '     background-color: #d3d3d3;';
    css += '     height: 1px;';
    css += ' }';

    css += "</style>"

    return css;
}

function getSum(total, num) {
    return total + num;
}
function FormatAmount(x) {
    if (x != null) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return '0';
}
}