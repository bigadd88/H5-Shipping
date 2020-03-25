    // JavaScript Document
    function primaryPalletLabel1(request, response) {
        if (request.getMethod() == 'GET') {
            var recId = request.getParameter('recName');
            var recId = 1;
            var logoURL = 'https://cdn.shopify.com/s/files/1/0015/3750/7373/files/logo-header_2x_e1ef4dd4-a736-4249-afbd-5275f2b7e573_250x.png?v=1551889193';
            var record = nlapiLoadRecord('customrecord_h5_pallet', recId, null, null);
            var palletNumber = record.getFieldValue('custrecord_h5_pallet_number');
            var itemInternalId = record.getFieldValue('custrecord_h5_pallet_item_parent');
            var itemNumber = nlapiLookupField('item',itemInternalId, 'itemid');
            var itemDisplay = nlapiLookupField('item',itemInternalId, 'displayname');
            var workOrderInternalId = record.getFieldValue('custrecord_h5_pallet_work_order');
            var workOrderNumber = nlapiLookupField('workorder', workOrderInternalId, 'tranid');
            var prodDate = nlapiLookupField('workorder', workOrderInternalId, 'trandate');
            var quantity = record.getFieldValue('custrecord_h5_pallet_quantity');
            var weight = record.getFieldValue('custrecord_h5_pallet_weight');



            // var fieldTrimmed = recNum.substr(10, 7);
            // var fixNULLinText = record.getFieldValue('custrecord_xxx');
            // if (fixNULLinText === null){fixNULLinText = '';}
            // var prntFixedAMP = variableWithAMP.replace('&','&amp;');

            /* Section to loop thru line items if needed
            var items = [];
            var packages = nlapiSearchRecord('customrecord_pss_shipment_line', null, fil, col);
            for (var x = 0; x < packages.length; x++) {
                pkgcount.push(packages[x].getValue('custrecord_pss_pkgnumber'));
                var linPicCount = packages[x].getValue('custrecord_pss_piece_count');
                var calcExtendedTotal = (Math.round(Number(linInventoryUnits) * Number(linUnitPrice) * 100)/100);
                totLPic += Number(linPicCount);
                totPalletCount += Number(linPalletCount);
                totInvUnit += Number(linInventoryUnits);
                //netWeight += Number(linWeight);
                netWeight += Math.ceil(itemUnitWeight * linInventoryUnits);
                totWeight += Number(linWeight);
                totAmount += Number(calcExtendedTotal);
                //var totAmountDisplay = AddCommas(totAmount);
                items += '<tr>';
                items += '<td align="left" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s17" style="padding-top: 2pt">' + linDesc.replace('&','&amp;') +'</p></td>';
                items += '<td align="center" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s2" style="padding-top: 2pt">' + linPalletCount +'</p></td>';
                items += '<td align="center" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s2" style="padding-top: 2pt">' + linHTS +'</p></td>';
                items += '<td align="right" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s2" style="padding-top: 2pt">' + linInventoryUnits +'</p><p>'+linSalesUnit+'</p></td>';
                items += '<td align="right" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s2" style="padding-top: 2pt">' + itemUnitWeight +'</p></td>';
                items += '<td align="right" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s2" style="padding-top: 2pt">' + Math.ceil(itemUnitWeight * linInventoryUnits) +'</p></td>';
                items += '<td align="right" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s2" style="padding-top: 2pt">' + linUnitPrice +'</p></td>';
                items += '<td align="right" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s2" style="padding-top: 2pt">' + AddCommas((Math.round(linInventoryUnits * linUnitPrice * 100)/100)) +'</p></td></tr>';
              }
            var pkgcnt = Math.max.apply(null, pkgcount);
            var netWeightlb = Math.round(netWeight);
            var netWeightkg = Math.round((netWeight / 2.2046226218));
            var totPalletWeightlb = Math.round(totPalletCount * 74);
            var totWeightlb = Math.round(netWeightlb + totPalletWeightlb);
            var totWeightkg = Math.round((totWeightlb / 2.2046226218));
            var hotTots = '<tr><td>Total Package Count:' + '</td><td>' + pkgcnt + '</td><td>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td><td>' + 'Total Weight:' + '</td><td>' + totWeight + 'lbs' + '</td></tr>';
            nlapiLogExecution('DEBUG', 'Line Item Count', 'lines array: ' + items + '');
            */

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
              xml += '<body size="letter-landscape" margin="0.15in">';

              xml += '<table width="650" style="border-collapse:collapse;margin-left:0.00pt" cellspacing="0"><tr><td colspan="1" align="left"><img width="100" height="100" src="' + logoURL + '"/></td>';
              xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="center" colspan="4">';
              xml += '<p class="s5" align="center">' + itemNumber +'</p>';
              xml += '<p class="s5" align="center">' + itemDisplay +'</p>';
              // xml += '<barcode codetype="code39x" showtext="true" value="' + itemInternalId + '" align="center"></barcode>';
              xml += '<barcode codetype="code128" showtext="true" value="' + itemNumber + '" align="center"></barcode>';
              xml += '</td></tr></table>';
            xml += '<table width="650"  style="border-collapse:collapse;margin-left:0.00pt" cellspacing="0"><tr height="60"><td colspan="1" align="left"></td>';
            xml += '<td colspan="4">';
            xml += '</td></tr></table>';
              xml += '<table width="650" style="border-collapse:collapse;margin-left:0.00pt" cellspacing="0"><tr><td colspan="1" align="left"></td>';
              xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="center" colspan="4">';
              xml += '<p class="s5" align="center">WO#: ' + workOrderNumber +'</p>';
              xml += '<p class="s5" align="center">Production Date: ' + prodDate +'</p>';
              xml += '<p class="s5" align="center">Pallet #: ' + palletNumber +'</p>';
              // xml += '<barcode codetype="code39x" showtext="true" value="' + itemInternalId + '" align="center"></barcode>';
              xml += '<barcode codetype="code128" showtext="true" value="' + palletNumber + '" align="center"></barcode>';
              xml += '</td></tr></table>';
            xml += '<table width="650" style="border-collapse:collapse;margin-left:0.00pt" cellspacing="0"><tr height="60"><td colspan="1" align="left"></td>';
            xml += '<td colspan="4">';
            xml += '</td></tr></table>';
              xml += '<table width="650" style="border-collapse:collapse;margin-left:0.00pt" cellspacing="0"><tr>';
              xml += '<td  colspan="1">';
              xml += '<p class="s5" align="left">Quantity '+quantity+'_____</p>';
              xml += '</td></tr></table>';

             /* line item table
              xml += '<table width="500" style="border-collapse:collapse;margin-left:6.00pt" cellspacing="0">'
              xml += '<tr style="height:20pt">';
              xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
              xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: left;">Description</p>';
              xml += '</td>';
              xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
              xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: left;">Pallets</p>';
              xml += '</td>';
              xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
              xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">HTS Number</p>';
              xml += '</td>';
              xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
              xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">Quantity</p>';
              xml += '</td>';
              xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
              xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">Item Wt (lb)</p>';
              xml += '</td>';
              xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
              xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">Net Wt (lb)</p>';
              xml += '</td>';
              xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
              xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">'+currencyDisplay+'$ Price</p>';
              xml += '</td>';
              xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
              xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">'+currencyDisplay+'$ Value</p>';
              xml += '</td>';
              xml += '</tr>';
              xml += items;
              xml += '<tr style="height:19pt">';
              xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="6">';
              xml += '<p class="s12" style="padding-top: 2pt;padding-left: 300pt;text-indent: 0pt;text-align: right;">INVOICE TOTAL</p>';
              xml += '</td>';
              xml += '<td align="right" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="2">';
              xml += '<p class="s12" style="padding-top: 2pt;padding-left: 0pt">'+currencyDisplay+' $ ' + AddCommas(totAmount) + '</p>';
              xml += '</td>';
              xml += '</tr>';
              xml += '</table>'
              */
              xml += '</body>';
              xml += '</pdf>';

              //end of ttemplate begining of render
                var file = nlapiXMLToPDF(xml);
                var contents = file.getValue();
                var renderer = nlapiCreateTemplateRenderer(contents);
                renderer.setTemplate(contents);
                var renderPDF = renderer.renderToString();
                response.setContentType('PDF', recId + '.pdf', 'inline');
                response.write(renderPDF);
                nlapiLogExecution('DEBUG', 'PDF Rendered', 'Intl Commercial Invoice was rendered!');

        } // JavaScript source code
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
