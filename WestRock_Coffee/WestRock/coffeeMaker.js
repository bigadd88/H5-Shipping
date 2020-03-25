function coffeeMakerSheet(request, response){
  if (request.getMethod() == 'GET') {
    var xml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n';




    var recId = request.getParameter('recName');
    var woRec = nlapiLoadRecord('workorder', recId);
    var assemblyItemId = woRec.getFieldValue('assemblyitem');

    var assemblyItemNumber  = nlapiLookupField('item', assemblyItemId, 'name');
    var assemblyItemName = nlapiLookupField('item', assemblyItemId, 'displayname');

    var workOrderTranId = woRec.getFieldValue('tranId');
    var prodDate = woRec.getFieldValue('trandate');
    var greenLots = woRec.getFieldValue('custbody_wcr_green_coffee_lots');
    var greenInventoryNumbers = nlapiSearchRecord('inventorynumber',null,
        [
            ["internalid","anyof", greenLots]
        ],
        [
            new nlobjSearchColumn("inventorynumber")
        ]
    );
    var greenLotNames = [];
    for (x=0;x<greenInventoryNumbers.length;x++){
        greenLotNames.push(greenInventoryNumbers[x].getValue('inventorynumber'));
    }
  var greenLotNames = [1111,2222,3333,4444]













    var itemFields = ['displayname', 'itemid', 'custitemcustitemwcr_casecountperpallet'];
    var itemFieldsReturned = nlapiLookupField('item', assemblyItemId, itemFields);
    var displayName = itemFieldsReturned.displayname;
    var itemId = itemFieldsReturned.itemid;
    var quantity = itemFieldsReturned.custitemcustitemwcr_casecountperpallet;



    xml += '<pdf>';
    xml += '<link name="verdana" type="font" subtype="opentype" src="${nsfont.verdana}" src-bold="${nsfont.verdana_bold}" bytes="2" />';
    xml += '<head>';
    xml += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>';
    xml += '<meta name="title" value="Pallet Label"/>';
    xml += '<meta name="layout" value="single-page"/>';
    xml += '<style type="text/css"> * {margin:0; padding:0; text-indent:0; }';
    xml += 'h2 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 9pt; }';
    xml += 'p { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 7pt; margin:0pt; }';
    xml += 'h1 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 13pt; }';
    xml += 'a { color: #00F; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: underline; font-size: 7pt; }';
    xml += '.s1 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 5pt; }';
    xml += '.s2 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 9pt; }';
    xml += '.s3 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 9pt; }';
    xml += '.s4 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 12pt; }';
    xml += '.s5 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 24pt; }';
    xml += 'table#t01, th#t01, td#t01 { border: .5pt black; border-collapse: collapse; empty-cells: show; } th#t01, td#t01 { padding: 10px; text-align: left; }';
    xml += '</style>';
    xml += '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />';
    xml += '</head>';
    xml += '<body size="letter-landscape" margin="0.15in">';
    xml += '<table width="100%" style="border-collapse:collapse;margin-left:0.00pt;" cellspacing="0"><tr><td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="center" colspan="4"><p class="s5" align="center" style="font-size:36px;">' + assemblyItemName + '</p></td></tr></table>';
    xml += '<table id="t01" style="width:50%; display: inline; vertical-align:middle;"><tr id="t01"><th rowspan="2" id="t01">NO WHOLE BEAN VERFICATION</th><td id="t01">GRINDER</td><td id="t01">LOADER</td></tr><tr><td id="t01">_________</td><td id="t01">_________</td></tr><tr><th rowspan="2" id="t01">Bottom Bag Check</th><td id="t01">GRINDER</td><td id="t01">LOADER</td></tr><tr><td id="t01">_________</td><td id="t01">_________</td></tr></table>';
    xml += '<table style="width:50%; display: inline; padding-left: 60pt; padding-top: 5pt;"><tr><th><p class="s3" style="padding-right: 30pt;">Work Order #</p></th><th><p class="s3">Work Order code 128</p></th></tr><tr><td><p class="s3">Lot 1</p></td><td> <barcode codetype="code39x" showtext="true" value="' + greenLotNames[0] + '" align="center"></barcode></td></tr><tr><td><p class="s4">Lot 2</p></td><td> <barcode codetype="code39x" showtext="true" value="' + greenLotNames[1] + '" align="center"></barcode></td></tr><tr><td><p class="s4">Lot 3</p></td><td> <barcode codetype="code39x" showtext="true" value="' + greenLotNames[2] + '" align="center"></barcode></td></tr><tr><td><p class="s4">Lot 4</p></td><td> <barcode codetype="code39x" showtext="true" value="' + greenLotNames[3] + '" align="center"></barcode></td></tr><tr><td><p class="s4">Bin</p></td></tr><tr><td><p class="s4">Grinder</p></td></tr><tr><td><p class="s4">Loader</p></td></tr></table>';
    xml += '<table style="width: 513px; height: 139px;"><tbody><tr style="height: 53px;"><td style="width: 188px; height: 53px;">&nbsp;Roasted Date</td><td style="width: 135px; height: 53px;">&nbsp;</td><td style="width: 118px; height: 53px;"><p>&nbsp;Time Start Grind</p></td><td style="width: 189px; height: 53px;"><p></p></td></tr><tr style="height: 43px;"><td style="width: 188px; height: 43px;">&nbsp;Ground Date</td><td style="width: 135px; height: 43px;">&nbsp;</td><td style="width: 118px; height: 43px;">Time End Grind</td><td style="width: 189px; height: 43px;"></td></tr><tr style="height: 43px;"><td style="width: 188px; height: 43px;">&nbsp;</td><td style="width: 135px; height: 43px;">&nbsp;</td><td style="width: 118px; height: 43px;">Gross Weight Pulled</td><td style="width: 189px; height: 43px;"></td></tr><tr style="height: 35px;"><td style="width: 188px; height: 35px;">Loaded Date</td><td style="width: 135px; height: 35px;">&nbsp;</td><td style="width: 118px; height: 35px;"><p>Time Start</p><p>Load</p><p>Time End Load</p></td><td style="width: 189px; height: 35px;">&nbsp;</td></tr></tbody></table>';
xml += '<table width="100%" style="padding-bottom: 5px; border-collapse:collapse;margin-left:0.00pt;" cellspacing="0"><tr><td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="left" colspan="4"><p class="s5" align="center" style="font-size:36px;">Net Coffee Weight:</p></td></tr></table>';
    xml += '<span style="font-size:24px; padding-top: 5px; float: left; padding-right: 300px;">LOT #LotNumber</span><span style="font-size:24px; padding-top: 5px; float: right;">LotNumber Code 128</span><br></br>';
    xml += '<span style="font-size:24px; padding-top: 5px; float: left; padding-right: 300px;">Color Test #1</span><span style="font-size:24px; padding-top: 5px; float: right;">Color Test #2</span>';
    xml += '</body>';
    xml += '</pdf>';
    var file = nlapiXMLToPDF(xml);
    var contents = file.getValue();
    var renderer = nlapiCreateTemplateRenderer(contents);
    renderer.setTemplate(contents);
    var renderPDF = renderer.renderToString();
    response.setContentType('PDF', '.pdf', 'inline');
    response.write(renderPDF);
  }
}
