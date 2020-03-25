function coffeeMakerSheet(request, response){
  if (request.getMethod() == 'GET') {
    var recId = request.getParameter('recName');
    var woRec = nlapiLoadRecord('workorder', recId);
    var assemblyItemId = woRec.getFieldValue('assemblyitem');

    var assemblyItemNumber  = nlapiLookupField('item', assemblyItemId, 'name');
    var assemblyItemName = nlapiLookupField('item', assemblyItemId, 'displayname');
    var superSackLotPrefix = woRec.getFieldValue('custbody_h5_roasting_lot_naming_prefix');
    var qtyToPrint = Number(woRec.getFieldValue('custbody_h5_placardstoprint'));
    var workOrderTranId = woRec.getFieldValue('tranid');
    var prodDate = woRec.getFieldValue('trandate');
    var greenLots = woRec.getFieldValues('custbody_wcr_green_coffee_lots');
    var fixedGreenLots = [];
    for (b=0;b<greenLots.length;b++){
      fixedGreenLots.push(parseInt(greenLots[b]));
    }
    //
    // nlapiLogExecution('debug', 'greenLotLookup 01', lot0);
    // nlapiLogExecution('debug', 'greenLotLookup 02', lot1);
    // nlapiLogExecution('debug', 'greenLotLookup 03', lot2);
    var greenInventoryNumbers = nlapiSearchRecord('inventorynumber',null,
        [
            ["internalid","anyof", fixedGreenLots]
        ],
        [
            new nlobjSearchColumn("inventorynumber")
        ]
    );
    var greenLotNames = [];
    for (x=0;x<greenInventoryNumbers.length;x++){
        greenLotNames.push(greenInventoryNumbers[x].getValue('inventorynumber'));
      nlapiLogExecution('debug', 'greenLotNames', greenInventoryNumbers[x].getValue('inventorynumber'));
    }
    var xml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n';
    xml += '<pdf>';
    xml += '<link name="verdana" type="font" subtype="opentype" src="${nsfont.verdana}" src-bold="${nsfont.verdana_bold}" bytes="2" />';
    xml += '<head>';
    xml += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>';
    xml += '<meta name="title" value="Super Sack LOT"/>';
    xml += '<meta name="layout" value="single-page"/>';
    xml += '<style type="text/css"> * {margin:0; padding:0; text-indent:0; }';
    xml += 'h2 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 9pt; }';
    xml += 'p { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 7pt; margin:0pt; }';
    xml += 'h1 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 13pt; }';
    xml += 'a { color: #00F; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: underline; font-size: 7pt; }';
    xml += '.s1 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 5pt; }';
    xml += '.s2 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 9pt; }';
    xml += '.s3 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 18pt; }';
    xml += '.s4 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 12pt; }';
    xml += '.s5 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 24pt; }';
    xml += 'table#t01, th#t01, td#t01 { border: .1pt black; border-collapse: collapse; empty-cells: show; } th#t01, td#t01 { padding: 10px; text-align: left; }';
    xml += 'table#t02, th#t02, td#t02 { border: .1pt black; border-collapse: collapse; empty-cells: show; } th#t02, td#t02 { padding: 20px; text-align: left; }';
    xml += '</style>';
    xml += '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />';
    xml += '</head>';
    var pageCount = 0;
    for (c=0;c<qtyToPrint;c++) {
      pageCount += 1;
      xml += '<body size="letter-landscape" margin="0.15in">';
      //top banner
      xml += '<div><table width="100%" style="border-collapse:collapse;margin-left:0.00pt;" cellspacing="0">';
      xml += '<tr>';
      xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="center" colspan="4">';
      xml += '<p class="s5" align="center" style="font-size:36px;">' + assemblyItemName + '</p>';
      xml += '</td>';
      xml += '</tr>';
      xml += '</table></div>';
      //start of table with 2 rows 2 columns
      xml += '<table>';
      xml += '<tr>';
      xml += '<td>';
      //top left table
      xml += '<div>';
      xml += '<table id="t01" style="width:100%; display: inline; vertical-align:top;">';
      xml += '<tr id="t01">';
      xml += '<td rowspan="2" id="t01">NO WHOLE BEAN VERFICATION</td>';
      xml += '<td id="t01">GRINDER</td>';
      xml += '<td id="t01">LOADER</td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td id="t02"></td>';
      xml += '<td id="t02"></td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td rowspan="2" id="t01">Bottom Bag Check</td>';
      xml += '<td id="t01">GRINDER</td>';
      xml += '<td id="t01">LOADER</td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td id="t02"></td>';
      xml += '<td id="t02"></td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td rowspan="1" id="t01">Roasted Date</td>';
      xml += '<td rowspan="1" id="t01">Time Start Grind</td>';
      xml += '<td rowspan="1" id="t01">Time End Grind</td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td rowspan="1" id="t01"></td>';
      xml += '<td rowspan="1" id="t02"></td>';
      xml += '<td rowspan="1" id="t02"></td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td rowspan="1" id="t01">Ground Date </td>';
      xml += '<td rowspan="1" id="t01">Gross Weight Pulled</td>';
      xml += '<td rowspan="1" id="t01">Loaded Date </td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td  id="t01"></td>';
      xml += '<td  id="t02"></td>';
      xml += '<td id="t02"></td>';
      xml += '</tr>';

      xml += '<tr>';
      xml += '<td rowspan="1" colspan="1" id="t01">Time Start Load</td>';
      xml += '<td rowspan="1" colspan="2" id="t01">Time Finish load</td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td rowspan="1" colspan="1" id="t02"></td>';
      xml += '<td rowspan="1" colspan="2" id="t02"></td>';
      xml += '</tr>';
      xml += '</table>';
      xml += '</div>';
      //end of top left
      xml += '</td>';
      xml += '<td>';
      //top right table
      xml += '<div>';
      xml += '<table style="width:100%; display: inline; padding-left: 10pt; padding-top: 0pt;">';
      xml += '<tr>';
      xml += '<td>';
      xml += '<p class="s4" align="right">Work Order</p>';
      xml += '</td>';
      xml += '<td>';
      xml += '<barcode codetype="code128" showtext="true" value="' + workOrderTranId + '" align="center"></barcode>';
      xml += '</td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td>';
      xml += '<p class="s4" align="right">Lot 1</p>';
      // xml += '<p class="s4" align="right">'+greenLotNames[0]+'</p>';
      xml += '</td>';
      xml += '<td>';
      xml += '<barcode codetype="code128" showtext="true" value="' + greenLotNames[0] + '" align="center"></barcode>';
      xml += '</td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td>';
      xml += '<p class="s4" align="right">Lot 2</p>';
      xml += '</td>';
      xml += '<td>';
      // xml += '<p class="s4" align="right">'+greenLotNames[1]+'</p>';
      xml += '<barcode codetype="code128" showtext="true" value="' + greenLotNames[1] + '" align="center"></barcode>';
      xml += '</td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td>';
      xml += '<p class="s4" align="right">Lot 3</p>';
      xml += '</td>';
      xml += '<td>';
      // xml += '<p class="s4" align="right">'+greenLotNames[2]+'</p>';
      xml += '<barcode codetype="code128" showtext="true" value="' + greenLotNames[2] + '" align="center"></barcode>';
      xml += '</td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td>';
      xml += '<p class="s4" align="right">Lot 4</p>';
      xml += '</td>';
      xml += '<td>';
      // xml += '<p class="s4" align="right">'+greenLotNames[3]+'</p>';
      xml += '<barcode codetype="code128" showtext="true" value="' + greenLotNames[3] + '" align="center"></barcode>';
      xml += '</td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td>';
      xml += '<p class="s4" align="right">Bin</p>';
      xml += '</td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td>';
      xml += '<p class="s4" align="right">Grinder</p>';
      xml += '</td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td>';
      xml += '<p class="s4" align="right">Loader</p>';
      xml += '</td>';
      xml += '</tr>';
      xml += '</table>';
      xml += '</div>';
      //end of top right
      xml += '</td>';
      xml += '</tr>';
      //start row 2
      xml += '<tr>';
      xml += '<td>';
      //middle left table
      xml += '</td>';
      xml += '<td>';
      xml += '</td>';
      xml += '</tr>';
      xml += '</table>';
      xml += '<footer style="padding-top: 15px;">';
      //bottom table
      xml += '<div><table width="100%" style="padding-bottom: 5px; border-collapse:collapse;margin-left:0.00pt;" cellspacing="0">';
      xml += '<tr>';
      xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="left" colspan="4">';
      xml += '<p class="s5" align="center" style="font-size:36px;">Net Coffee Weight:</p>';
      xml += '</td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td rowspan="1" style="font-size:18px;">';
      xml += '<p class="s3" align="center" style="font-size:24px;">LOT # ' + superSackLotPrefix + pageCount + '</p>';
      xml += '</td>';
      xml += '<td><barcode codetype="code128" showtext="true" value="' + superSackLotPrefix + pageCount + '" align="center"></barcode></td>';
      xml += '</tr>';
      xml += '</table></div>';
      xml += '<div><table width="50%" style="padding-bottom: 5px; border-collapse:collapse;margin-left:0.00pt;" cellspacing="0">';
      xml += '<tr id="t01">';
      xml += '<td rowspan="2" id="t01">Color Test</td>';
      xml += '<td id="t01">#1</td>';
      xml += '<td id="t01">#2</td>';
      xml += '</tr>';
      xml += '<tr>';
      xml += '<td id="t02"></td>';
      xml += '<td id="t02"></td>';
      xml += '</tr>';
      xml += '</table></div>';
      xml += '</footer>';
      xml += '</body>';
    }
    xml += '</pdf>';
    var file = nlapiXMLToPDF(xml);
    var contents = file.getValue();
    var renderer = nlapiCreateTemplateRenderer(contents);
    renderer.setTemplate(contents);
    var renderPDF = renderer.renderToString();
    response.setContentType('PDF', 'GrinderPlacard_WorkOrder_'+workOrderTranId+'.pdf', 'inline');
    response.write(renderPDF);
  }


}
