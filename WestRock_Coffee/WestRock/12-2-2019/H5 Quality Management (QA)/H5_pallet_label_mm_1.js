// JavaScript Document
function mmLabel1(request, response) {
    if (request.getMethod() == 'GET') {
        var recId = request.getParameter('recName');
        // var recId = nlapiGetRecordId();
        var record = nlapiLoadRecord('workorder', recId, null, null);
        var itemInternalId = record.getFieldValue('assemblyitem');
        var workOrderNumber = record.getFieldValue('tranid');
        var expDate = record.getFieldValue('custbody_wcr_lot_exp_date');
        var itemNumber = nlapiLookupField('item', itemInternalId, 'itemid');
        var itemDisplay = nlapiLookupField('item', itemInternalId, 'storedisplayname');
        var quantity = nlapiLookupField('item', itemInternalId, 'custitemcustitemwcr_casecountperpallet');
        var upcCode = nlapiLookupField('item', itemInternalId, 'upccode');

        var xml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n';
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
        xml += '.s4 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 36pt; }';
        xml += '.s5 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 48pt; }';
        xml += '</style>';
        xml += '</head>';

        xml += '<body size="letter-landscape" margin="0.15in">';
        xml += '<table width="650" style="border-collapse:collapse;margin-left:0.00pt" cellspacing="0"><tr><td colspan="1" align="left"></td>';
        xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="center" colspan="4">';
        xml += '<p class="s5" align="center">' + itemDisplay + '</p>';
        xml += '</td></tr></table>';
        xml += '<table width="650"  style="border-collapse:collapse;margin-left:0.00pt" cellspacing="0"><tr height="60"><td colspan="1" align="left"></td>';
        xml += '<td colspan="4">';
        xml += '</td></tr></table>';

        xml += '<table width="650" style="border-collapse:collapse;margin-left:0.00pt" cellspacing="0"><tr>';
        xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="left" colspan="2">';
        xml += '<p class="s4" align="left" valign="bottom">UPC:</p>';
        xml += '</td>';
        xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="center" colspan="2">';
        xml += '<p class="s5" align="center">' + upcCode + '</p>';
        xml += '</td>';
        xml += '</tr><tr>';
        xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="left" colspan="2">';
        xml += '<p class="s4" align="left" valign="bottom">Best if used by:</p>';
        xml += '</td>';
        xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="center" colspan="2">';
        xml += '<p class="s4" align="center">' + expDate + '</p>';
        xml += '</td>';
        xml += '</tr><tr>';
        xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="left" colspan="2">';
        xml += '<p class="s4" align="left" valign="bottom">Pallet Qty:</p>';
        xml += '</td>';
        xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="center" colspan="2">';
        xml += '<p class="s5" align="center">' + quantity + '</p>';
        xml += '</td>';
        xml += '</tr></table>';

        xml += '</body>';

        xml += '</pdf>';


        var file = nlapiXMLToPDF(xml);
        var contents = file.getValue();
        var renderer = nlapiCreateTemplateRenderer(contents);
        renderer.setTemplate(contents);
        var renderPDF = renderer.renderToString();
        response.setContentType('PDF', recId + '.pdf', 'inline');
        response.write(renderPDF);
    }
}

function AddCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
