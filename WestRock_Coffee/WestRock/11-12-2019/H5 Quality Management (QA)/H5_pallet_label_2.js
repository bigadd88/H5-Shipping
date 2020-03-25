    // JavaScript Document
    function primaryPalletLabel2(request, response) {
        if (request.getMethod() == 'GET') {
            var recId = request.getParameter('recName');
            var woFields = ['tranid', 'trandate', 'item'];
            var woFieldsReturned = nlapiLookupField('workorder', recId, woFields);
            var assemblyItemId = woFieldsReturned.item;
            var workOrderTranId = woFieldsReturned.tranid;
            var prodDate = woFieldsReturned.trandate;

            var itemFields = ['displayname', 'itemid', 'custitemcustitemwcr_casecountperpallet'];
            var itemFieldsReturned = nlapiLookupField('item', assemblyItemId, itemFields);
            var displayName = itemFieldsReturned.displayname;
            var itemId = itemFieldsReturned.itemid;
            var quantity = itemFieldsReturned.custitemcustitemwcr_casecountperpallet;










            var pallets = nlapiSearchRecord("customrecord_h5_pallet",null,
                [
                    ["custrecord_h5_pallet_work_order","anyof", recId]
                ],
                [
                    new nlobjSearchColumn("id").setSort(false),
                    new nlobjSearchColumn("custrecord_h5_pallet_number"),
                    new nlobjSearchColumn("custrecord_h5_pallet_item_parent"),
                    new nlobjSearchColumn("custrecord_h5_pallet_work_order"),
                    new nlobjSearchColumn("custrecord_h5_pallet_quantity"),
                ]
            );
            var palletNumberArray = [];
            for (x=0;x<pallets.length;x++){
                palletNumberArray.push(pallets[x].getValue('custrecord_h5_pallet_number'));
            }


            var logoURL = 'https://cdn.shopify.com/s/files/1/0015/3750/7373/files/logo-header_2x_e1ef4dd4-a736-4249-afbd-5275f2b7e573_250x.png?v=1551889193';

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
              xml += '.s4 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 12pt; }';
              xml += '.s5 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; font-size: 24pt; }';
              xml += '</style>';
              xml += '</head>';
            for (x=0;x < palletNumberArray.length; x++) {
                xml += '<body size="letter-landscape" margin="0.15in">';
                xml += '<table width="650" style="border-collapse:collapse;margin-left:0.00pt" cellspacing="0"><tr><td colspan="1" align="left"><img width="100" height="100" src="' + logoURL + '"/></td>';
                xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="center" colspan="4">';
                xml += '<p class="s5" align="center">' + itemId + '</p>';
                xml += '<p class="s5" align="center">' + displayName + '</p>';
                // xml += '<barcode codetype="code39x" showtext="true" value="' + itemInternalId + '" align="center"></barcode>';
                xml += '<barcode codetype="code128" showtext="true" value="' + itemId + '" align="center"></barcode>';
                xml += '</td></tr></table>';
                xml += '<table width="650"  style="border-collapse:collapse;margin-left:0.00pt" cellspacing="0"><tr height="60"><td colspan="1" align="left"></td>';
                xml += '<td colspan="4">';
                xml += '</td></tr></table>';
                xml += '<table width="650" style="border-collapse:collapse;margin-left:0.00pt" cellspacing="0"><tr><td colspan="1" align="left"></td>';
                xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="center" colspan="4">';
                xml += '<p class="s5" align="center">WO#: ' + workOrderTranId + '</p>';
                xml += '<p class="s5" align="center">Production Date: ' + prodDate + '</p>';
                xml += '<p class="s5" align="center">Pallet #: ' + palletNumberArray[x] + '</p>';
                // xml += '<barcode codetype="code39x" showtext="true" value="' + palletNumberArray[x] + '" align="center"></barcode>';
                xml += '<barcode codetype="code128" showtext="true" value="' + palletNumberArray[x] + '" align="center"></barcode>';
                xml += '</td></tr></table>';
                xml += '<table width="650" style="border-collapse:collapse;margin-left:0.00pt" cellspacing="0"><tr height="60"><td colspan="1" align="left"></td>';
                xml += '<td colspan="4">';
                xml += '</td></tr></table>';
                xml += '<table width="650" style="border-collapse:collapse;margin-left:0.00pt" cellspacing="0"><tr>';
                xml += '<td  colspan="1">';
                xml += '<p class="s5" align="left">Quantity ' + quantity + ' or _____</p>';
                xml += '</td></tr></table>';
                xml += '</body>';
            }
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
