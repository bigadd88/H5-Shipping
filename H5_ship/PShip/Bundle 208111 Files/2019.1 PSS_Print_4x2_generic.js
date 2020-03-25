function print4x2Generic(request, response){
    if (request.getMethod() == 'GET') {
        var recId = request.getParameter('recName');
        var logoURL = '';
        var shipLine = nlapiLoadRecord('customrecord_pss_shipment_line', recId, null, null);
        var SHIPLINE_pkgnumber = shipLine.getFieldValue('custrecord_pss_pkgnumber');
        var SHIPLINE_pallet_count = shipLine.getFieldValue('custrecord_pss_pallet_count');
        var SHIPLINE_piece_count = shipLine.getFieldValue('custrecord_pss_piece_count');
        var SHIPLINE_packagetype = shipLine.getFieldValue('custrecord_pss_packagetype');
        var SHIPLINE_ship_line_item_desc = shipLine.getFieldValue('custrecord_pss_ship_line_item_desc');
        var SHIPLINE_nmfc_number_line = shipLine.getFieldValue('custrecord_pss_nmfc_number_line');
        var SHIPLINE_freight_class_value = shipLine.getFieldValue('custrecord_pss_freight_class_value');
        var SHIPLINE_weight = shipLine.getFieldValue('custrecord_pss_weight');
        var SHIPLINE_length = shipLine.getFieldValue('custrecord_pss_length');
        var SHIPLINE_width = shipLine.getFieldValue('custrecord_pss_width');
        var SHIPLINE_height = shipLine.getFieldValue('custrecord_pss_height');
        var SHIPLINE_hazmat = shipLine.getFieldValue('custrecord_pss_hazmat');
        var SHIPLINE_shipment_parent = shipLine.getFieldValue('custrecord_pss_shipment_parent');
        var SHIPLINE_pcf = shipLine.getFieldValue('custrecord_pss_pcf');
        var SHIPLINE_nmfc_desc = shipLine.getFieldValue('custrecord_pss_nmfc_desc');
        var SHIPLINE_nmfc_number = shipLine.getFieldValue('custrecord_pss_nmfc_number');
        var SHIPLINE_package_department = shipLine.getFieldValue('custrecord_pss_package_department');
        var SHIPLINE_package_class = shipLine.getFieldValue('custrecord_pss_package_class');
        var SHIPLINE_inventoryunits = shipLine.getFieldValue('custrecord_pss_inventoryunits');
        var SHIPLINE_shipline_freight_class = shipLine.getFieldValue('custrecord_pss_shipline_freight_class');
        var SHIPLINE_nmfc_short_desc_line = shipLine.getFieldValue('custrecord_pss_nmfc_short_desc_line');
        var SHIPLINE_countryoforigin = shipLine.getFieldValue('custrecord_pss_countryoforigin');
        var SHIPLINE_unitprice = shipLine.getFieldValue('custrecord_pss_unitprice');
        var SHIPLINE_extendedtotal = shipLine.getFieldValue('custrecord_pss_extendedtotal');
        var SHIPLINE_htsnumber = shipLine.getFieldValue('custrecord_pss_htsnumber');
        var SHIPLINE_shipline_salesunit = shipLine.getFieldValue('custrecord_pss_shipline_salesunit');
        var SHIPLINE_itemunitweight = shipLine.getFieldValue('custrecord_pss_itemunitweight');
        var SHIPLINE_packingcontainer = shipLine.getFieldValue('custrecord_pss_packingcontainer');
        var SHIPLINE_itemcontainer = shipLine.getFieldValue('custrecord_pss_itemcontainer');
        var SHIPLINE_shipline_if_id = shipLine.getFieldValue('custrecord_pss_shipline_if_id');
        var SHIPLINE_salesorderlink = shipLine.getFieldValue('custrecord_pss_salesorderlink');
        var customerPO = nlapiLookupField('salesorder', SHIPLINE_salesorderlink, 'otherrefnum');
        var customerId = nlapiLookupField('salesorder', SHIPLINE_salesorderlink, 'entity');
        var customerName = nlapiLookupField('customer', customerId, 'companyname');
        var SHIPLINE_itemlink = shipLine.getFieldValue('custrecord_pss_itemlink');
        var itemDescription = nlapiLookupField('item', SHIPLINE_itemlink, 'itemid');
        var itemInnerUnits = nlapiLookupField('item', SHIPLINE_itemlink, 'custitem_pss_inner_container_units');
        var SHIPLINE_label_box = shipLine.getFieldValue('custrecord_pss_label_box');
        var SHIPLINE_label_pallet = shipLine.getFieldValue('custrecord_pss_label_pallet');
        var SHIPLINE_box_length = shipLine.getFieldValue('custrecord_pss_box_length');
        var SHIPLINE_box_width = shipLine.getFieldValue('custrecord_pss_box_width');
        var SHIPLINE_box_height = shipLine.getFieldValue('custrecord_pss_box_height');
        var SHIPLINE_box_weight = shipLine.getFieldValue('custrecord_pss_box_weight');

        //begin xml html layout
        var xml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n';
        xml += '<pdf>';
        xml += '<link name="verdana" type="font" subtype="opentype" src="${nsfont.verdana}" src-bold="${nsfont.verdana_bold}" bytes="2" />';
        xml += '<head>';
        xml += '<meta name="title" value="4x2 Generic ' + recId + '"/>';
        xml += '<style type="text/css"> * {margin:0; padding:0; text-indent:0; }';
        xml += 'h2 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 9pt; }';
        xml += 'p { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 7pt; margin:0pt; }';
        xml += 'h1 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 13pt; }';
        xml += 'a { color: #00F; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: underline; font-size: 7pt; }';
        xml += '.s1 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 5pt; }';
        xml += '.s2 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 9pt; }';
        xml += '.s3 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 9pt; }';
        xml += '.s4 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 12pt; }';
        xml += '.s5 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 12pt; }';
        xml += '.s6 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 6pt; vertical-align: -2pt; }';
        xml += '.s7 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 10pt; }';
        xml += '.s8 { color: black; font-family:"Times New Roman", serif; font-style: normal; font-weight: normal; font-size: 10pt; }';
        xml += '.s9 { color: black; font-family:"Times New Roman", serif; font-style: normal; font-weight: normal; font-size: 6pt; }';
        xml += '.s10 { color: black; font-family:Wingdings; font-style: normal; font-weight: normal; font-size: 10pt; }';
        xml += '.s12 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 8pt; }';
        xml += '.s13 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 7pt; }';
        xml += '.s14 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 8pt; }';
        xml += '.s16 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: lighter; font-size: 8pt; }';
        xml += '.s17 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 20pt; }';
        xml += '</style>';
        xml += '<macrolist>';
        xml += '<macro id="myfooter">';
        xml += '<p class="s2" align="center">';
        xml += 'Box <pagenumber/> of '+SHIPLINE_piece_count;
        xml += '</p>';
        xml += '</macro>';
        xml += '</macrolist>';
        xml += '</head>';
        xml += '<body padding="0.1in 0.1in 0.2in 0.1in" width="101mm" height="50mm" footer="myfooter" footer-height="0em">';

        var i = 0;
        while (i < SHIPLINE_piece_count) {
            xml += '<pbr />'; //pagebreak
            xml += '<table style="width: 100%"><tr>';
            xml += '<td style="border-top-style:solid;border-top-width:0pt;border-left-style:solid;border-left-width:0pt;border-bottom-style:solid;border-bottom-width:0pt;border-right-style:solid;border-right-width:0pt">';
            xml += '<p class="s2" align="center" style="padding-top: 5pt;padding-left: 0pt;text-indent: 0pt;">'+customerName+'</p>';
            xml += '<p class="s2" align="center" style="padding-top: 5pt;padding-left: 0pt;text-indent: 0pt;">PO#: '+customerPO+'</p>';
            xml += '<p class="s2" align="center" style="padding-top: 5pt;padding-left: 0pt;text-indent: 0pt;">'+ itemDescription +'</p>';
            xml += '<p class="s2" align="center" style="padding-top: 5pt;padding-left: 0pt;text-indent: 0pt;">TOTAL QTY: ' + itemInnerUnits + ' PCS</p>';
            xml += '<p class="s2" align="center" style="padding-top: 5pt;padding-left: 0pt;text-indent: 0pt;">1 each X ' + itemInnerUnits + ' inner bags</p>';
            xml += '</td></tr></table>';

            /*
            //bar codes and black lines
            xml += '<barcode codetype="code128" showtext="true" value="' + carrierPRO + '" align="left"></barcode>';
            xml += '<table style="width: 100%; font-size: 8pt; border-bottom: thick solid black"><tr></tr></table>';
            xml += '<table style="width: 100%; border-bottom: thick solid black"><tr><td></td></tr></table>';


            //layout without border
            xml += '<table style="width: 100%">';
            xml += '<tr><td style="font-size: 8pt; vertical-align: top">'+customerName+'</td></tr>';
            xml += '<tr><td style="font-size: 8pt; vertical-align: top"></td></tr>';
            xml += '<tr><td style="font-size: 8pt; vertical-align: top"></td></tr>';
            xml += '</table>';
            */

            i++;
        }

        xml += "</body>";
        xml += "</pdf>";
        //end of template
        var file = nlapiXMLToPDF(xml);
        var contents = file.getValue();
        var renderer = nlapiCreateTemplateRenderer(contents);
        renderer.setTemplate(contents);
        var renderPDF = renderer.renderToString();
        response.setContentType('PDF',  '-label.pdf', 'inline');
        response.write(renderPDF);
        nlapiLogExecution('DEBUG', 'PDF Rendered', 'Label was rendered!');
    }
}