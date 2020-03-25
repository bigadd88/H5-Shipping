// JavaScript Document
function intlCommercialInvoice(request, response) {
    if (request.getMethod() == 'GET') {
        var recId = request.getParameter('recName');
        var logoURL = 'http://pliteq.com/images/pliteq.gif';
        var record = nlapiLoadRecord('customrecord_h5_shipment', recId, null, null);
        var recNum = record.getFieldValue('name');
        var recNumTrimmed = recNum.substr(10, 7);
        var carrierText = record.getFieldText('custrecord_h5_carrier');
        var shipDate = record.getFieldValue('custrecord_h5_ship_date');
        var refatpickup = record.getFieldValue('custrecord_h5_reference_pickup');
        var customsBroker = record.getFieldValue('custrecord_h5_customsbroker');
        var bookingNum = record.getFieldValue('custrecord_h5_intlbookingnum');
        if (bookingNum === null){bookingNum = '';}
        var portOfEntry = record.getFieldValue('custrecord_h5_portofentry');
        if (portOfEntry === null){portOfEntry = '';}
        var containerId = record.getFieldValue('custrecord_h5_containerid');
        var sealNum = record.getFieldValue('custrecord_h5_sealnum');
        var incoTerm = record.getFieldText('custrecord_h5_incoterms');
        var skidSize = record.getFieldValue('custrecord_h5_skid_size_forcontainer');
        var refatdelivery = record.getFieldValue('custrecord_h5_reference_delivery');
        var customsInstructions = record.getFieldValue('custrecord_h5_customs_instructions');
        if (customsInstructions === null){customsInstructions = '';}
        var shipperAddressee = record.getFieldValue('custrecord_h5_shipper_addressee');
        var shipperAddr1 = record.getFieldValue('custrecord_h5_shipper_addr_1');
        var shipperAddr2 = record.getFieldValue('custrecord_h5_shipper_addr_2');
        if (shipperAddr2 === null){shipperAddr2 = '';}
        var shipperCity = record.getFieldValue('custrecord_h5_shipper_city');
        var shipperState = record.getFieldValue('custrecord_h5_shipper_state');
        var shipperZip = record.getFieldValue('custrecord_h5_shipper_zip');
        var shipperCountry = record.getFieldValue('custrecord_h5_shipper_country');
        if (shipperCountry === 'CA'){shipperCountry = 'Canada';}
        var consigneeAddressee = record.getFieldValue('custrecord_h5_consignee_addree');
        var consigneeAddr1 = record.getFieldValue('custrecord_h5_consignee_addr1');
        var consigneeAddr2 = record.getFieldValue('custrecord_h5_consignee_addr2');
        if (consigneeAddr2 === null){consigneeAddr2 = '';}
        var consigneeCity = record.getFieldValue('custrecord_h5_consignee_city');
        var consigneeState = record.getFieldValue('custrecord_h5_consignee_state');
        if (consigneeState === null){consigneeState = '';}
        var consigneeZip = record.getFieldValue('custrecord_h5_consignee_zip');
        if (consigneeZip === '00000'){consigneeZip = '';}
        if (consigneeZip === null){consigneeZip = '';}
        var consigneeCountry = record.getFieldValue('custrecord_h5_consignee_country');
        if (consigneeCountry === 'AE') {
            consigneeCountry = 'UAE';
            } else if (consigneeCountry === 'SG') {
            consigneeCountry = 'Singapore';
            } else if (consigneeCountry === 'Qatar') {
            consigneeCountry = 'Qatar';
            } else if (consigneeCountry === 'GB') {
            consigneeCountry = 'Great Britain';
            } else if (consigneeCountry === 'CA') {
            consigneeCountry = 'Canada';
        }   else {consigneeCountry = record.getFieldValue('custrecord_h5_consignee_country');
            }
        var notificationPartyName = record.getFieldText('custrecord_h5_notificationparty');
        var notificationPartyId = record.getFieldValue('custrecord_h5_notificationparty');
        var notificationPartyAddr1 = record.getFieldValue('custrecord_h5_notificationparty_addr1');
        if (notificationPartyAddr1 === null){notificationPartyAddr1 = '';}
        var notificationPartyAddr2 = record.getFieldValue('custrecord_h5_notificationparty_addr2');
        if (notificationPartyAddr2 === null){notificationPartyAddr2 = '';}
        var notificationPartyCity = record.getFieldValue('custrecord_h5_notificationparty_city');
        if (notificationPartyCity === null){notificationPartyCity = '';}
        var notificationPartyState = record.getFieldValue('custrecord_h5_notificationparty_state');
        if (notificationPartyState === null){notificationPartyState = '';}
        var notificationPartyZip = record.getFieldValue('custrecord_h5_notificationparty_zip');
        if (notificationPartyZip === null){notificationPartyZip = '';}
        var notificationPartyCountry = record.getFieldValue('custrecord_h5_notificationparty_country');
        if (notificationPartyCountry === 'AE'){notificationPartyCountry = 'UAE';}
        else if (notificationPartyCountry === 'SG') {
            notificationPartyCountry = 'Singapore';
        } else if (notificationPartyCountry === 'Qatar') {
            notificationPartyCountry = 'Qatar';
        } else if (notificationPartyCountry === null) {
            notificationPartyCountry = '';
        } else if (notificationPartyCountry === 'CA') {
            notificationPartyCountry = 'Canada';
        } else if (notificationPartyCountry === 'GB') {
            notificationPartyCountry = 'Great Britain';
        }   else {notificationPartyCountry = record.getFieldValue('custrecord_h5_notificationparty_country');}
        var notificationPartyPhone = record.getFieldValue('custrecord_h5_notificationparty_phone');
        if (notificationPartyPhone === null){notificationPartyPhone = '';}
        var notificationPartyMOB = record.getFieldValue('custrecord_h5_notificationparty_mob');
        if (notificationPartyMOB === null){notificationPartyMOB = '';}
        var notificationPartyOther1 = record.getFieldValue('custrecord_h5_notificationparty_other1');
        if (notificationPartyOther1 === null){notificationPartyOther1 = '';}
        var notificationPartyOther2 = record.getFieldValue('custrecord_h5_notificationparty_other2');
        if (notificationPartyOther2 === null){notificationPartyOther2 = '';}
        var ownerName = record.getFieldText('custrecord_h5_custservteamlead');
        var ownerId = record.getFieldValue('custrecord_h5_custservteamlead');
        var ownerTitle = nlapiLookupField('employee',ownerId,'title');
        var prntownerTitle = ownerTitle.replace('&','&amp;');
        var currencyDisplay = record.getFieldText('custrecord_h5_ship_cur');
        nlapiLogExecution('DEBUG', 'CSR', 'CSR Name and Title' + ownerId + '');

        //get shipment lines information for template - ajr
        var linHazmat = new Array();
        var linPicCount = new Array();
        var linPalletCount = new Array();
        var linType = new Array();
        var linNum = new Array();
        var linDesc = new Array();
        var linHTS = new Array();
        var linWeight = new Array();
        var linUnitPrice = new Array();
        var linExtendedTotal = new Array();
        var items = new Array();
        var itemUnitWeight = new Array();
        var totLPC = 0;
        var totPalletCount = 0;
        var totLPic = 0;
        var totInvUnit = 0;
        var netWeight = 0;
        var totWeight = 0;
        var totAmount = 0;
        var pkgcount = new Array();
        var fil = new Array();
        fil[0] = new nlobjSearchFilter('custrecord_h5_shipment_parent', null, 'is', recId);
        var col = new Array();
        col[0] = new nlobjSearchColumn('custrecord_h5_pkgnumber');
        col[1] = new nlobjSearchColumn('custrecord_h5_piece_count');
        col[2] = new nlobjSearchColumn('custrecord_h5_ship_line_item_desc');
        col[3] = new nlobjSearchColumn('custrecord_h5_packagetype');
        col[4] = new nlobjSearchColumn('custrecord_h5_weight');
        col[5] = new nlobjSearchColumn('custrecord_h5_unitprice');
        col[6] = new nlobjSearchColumn('custrecord_h5_extendedtotal');
        col[7] = new nlobjSearchColumn('custrecord_h5_inventoryunits');
        col[8] = new nlobjSearchColumn('custrecord_h5_htsnumber');
        col[9] = new nlobjSearchColumn('custrecord_h5_itemunitweight');
        col[10] = new nlobjSearchColumn('custrecord_h5_pallet_count');
        col[11] = new nlobjSearchColumn('custrecord_h5_shipline_salesunit');
        var packages = nlapiSearchRecord('customrecord_h5_shipment_line', null, fil, col);
        for (var x = 0; x < packages.length; x++) {
            pkgcount.push(packages[x].getValue('custrecord_h5_pkgnumber'));
            var linPicCount = packages[x].getValue('custrecord_h5_piece_count');
            var linPalletCount = packages[x].getValue('custrecord_h5_pallet_count');
            var linInventoryUnits = packages[x].getValue('custrecord_h5_inventoryunits');
            var linHTS = packages[x].getValue('custrecord_h5_htsnumber');
            var linDesc = packages[x].getValue('custrecord_h5_ship_line_item_desc');
            var linType = packages[x].getText('custrecord_h5_packagetype');
            var linWeight = packages[x].getValue('custrecord_h5_weight');
            var linNum = packages[x].getValue('custrecord_h5_pkgnumber');
            var linSalesUnit = packages[x].getText('custrecord_h5_shipline_salesunit');
            var linUnitPrice = packages[x].getValue('custrecord_h5_unitprice');
            var linExtendedTotal = packages[x].getValue('custrecord_h5_extendedtotal');
            var itemUnitWeight = packages[x].getValue('custrecord_h5_itemunitweight');
            totLPic += Number(linPicCount);
            totPalletCount += Number(linPalletCount);
            totInvUnit += Number(linInventoryUnits);
            //netWeight += Number(linWeight);
            netWeight += Math.ceil(itemUnitWeight * linInventoryUnits);
            totWeight += Number(linWeight);
            totAmount += Number(linExtendedTotal);
            //var totAmountDisplay = AddCommas(totAmount);

            items += '<tr>';
            items += '<td align="left" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s17" style="padding-top: 2pt">' + linDesc.replace('&','&amp;') +'</p></td>';
            items += '<td align="center" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s2" style="padding-top: 2pt">' + linPalletCount +'</p></td>';
            items += '<td align="center" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s2" style="padding-top: 2pt">' + linHTS +'</p></td>';
            items += '<td align="right" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s2" style="padding-top: 2pt">' + linInventoryUnits +'</p><p>'+linSalesUnit+'</p></td>';
            items += '<td align="right" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s2" style="padding-top: 2pt">' + itemUnitWeight +'</p></td>';
            items += '<td align="right" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s2" style="padding-top: 2pt">' + Math.ceil(itemUnitWeight * linInventoryUnits) +'</p></td>';
            items += '<td align="right" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s2" style="padding-top: 2pt">' + linUnitPrice +'</p></td>';
            items += '<td align="right" style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1" rowspan="1"><p class="s2" style="padding-top: 2pt">' + AddCommas(Math.round(linInventoryUnits * linUnitPrice)) +'</p></td></tr>';
          }

        var pkgcnt = Math.max.apply(null, pkgcount);
        var netWeightlb = Math.round(netWeight);
        var netWeightkg = Math.round((netWeight / 2.2046226218));
        var totPalletWeightlb = Math.round(totPalletCount * 40);
        var totWeightlb = Math.round(netWeightlb + totPalletWeightlb);
        var totWeightkg = Math.round((totWeightlb / 2.2046226218));
        var hotTots = '<tr><td>Total Package Count:' + '</td><td>' + pkgcnt + '</td><td>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td><td>' + 'Total Weight:' + '</td><td>' + totWeight + 'lbs' + '</td></tr>';
        nlapiLogExecution('DEBUG', 'Line Item Count', 'lines array: ' + items + '');
        //begin template well formed XML - ajr
        try {
          var xml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n';
          xml += '<pdf>';
          xml += '<link name="verdana" type="font" subtype="opentype" src="${nsfont.verdana}" src-bold="${nsfont.verdana_bold}" bytes="2" />';
          xml += '<head>';
          xml += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>';
          xml += '<meta name="title" value="Customs Declaration"/>';
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
          xml += '.s17 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; font-size: 6pt; }';
          xml += '</style>';
          xml += '</head>';
          xml += '<body size="letter" margin="0.15in">';
          xml += '<table width="500" style="border-collapse:collapse;margin-left:6.00pt" cellspacing="0"><tr><td align="center"><img src="' + logoURL + '"/></td><td></td><td></td>';
          xml += '<td align="bottom">';
          xml += '<p class="s5">COMMERCIAL INVOICE</p>';
          xml += '<p class="s5"> Date:  ' + shipDate +'</p>';
          xml += '<p class="s5">' + recNum +'</p>';
          xml += '</td></tr></table>';
          /*xml += '<table width="500" style="border-collapse:collapse;margin-left:6.00pt" cellspacing="0">';
          xml += '<tr style="height:14pt">';
          xml += '</tr>';
          xml += '<tr style="width=100%;height:17pt">';
          xml += '<td style="width=50%">';
          xml += '<p class="s4" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;"> Date:  ' + shipDate +'</p>';
          xml += '</td>';
          xml += '<td style="width=50%">';
          xml += '<p class="s4" style="padding-top: 2pt;padding-left: 10pt;text-indent: 0pt;text-align: right;">' + recNum +'</p>';
          xml += '</td>';
          xml += '</tr>';
          xml += '</table>';
          */
          xml += '<table width="500" style="border-collapse:collapse;margin-left:6.00pt" cellspacing="0">';
          xml += '<tr  style="width=100%;height:72pt">';
          xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:0pt;border-right-style:solid;border-right-width:0pt" colspan="2">';
          xml += '<p class="s3" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">Shipper:</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">Pliteq, Inc.</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + shipperAddr1 + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + shipperAddr2 + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + shipperCity + ', ' + shipperState + ' ' + shipperZip + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + shipperCountry + '</p>';
          xml += '</td>';
          //xml += '</tr>';
          //xml += '<tr style="height:60pt">';
          xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:0pt;border-right-style:solid;border-right-width:1pt" colspan="2">';
          xml += '<p class="s3" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">Consignee:</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + consigneeAddressee + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + consigneeAddr1 + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + consigneeAddr2 + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + consigneeCity + '  ' + consigneeState + ' ' + consigneeZip + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + consigneeCountry + '</p>';
          xml += '</td>';
          xml += '</tr>';
          xml += '<tr style="height:80pt">';
          xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:0pt;border-right-style:solid;border-right-width:0pt" colspan="2">';
          xml += '<p class="s3" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">Notify Party:</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + notificationPartyName + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + notificationPartyAddr1 + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + notificationPartyAddr2 + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + notificationPartyCity + '  ' + notificationPartyState + ' ' + notificationPartyZip + '</p>';
          //xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + notificationPartyState + '</p>';
          //xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + notificationPartyZip + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + notificationPartyCountry + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + notificationPartyPhone + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + notificationPartyMOB + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + notificationPartyOther1 + '</p>';
          xml += '<p class="s2" style="padding-top: 0pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">' + notificationPartyOther2 + '</p>';
          xml += '</td>';
          //xml += '</tr>';
          //xml += '<tr style="width=100%;height:17pt">';
          xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:0pt;border-right-style:solid;border-right-width:1pt" colspan="2">';
          xml += '<p class="s2" style="padding-top: 2pt;padding-left: 20pt;text-indent: 0pt;text-align: left;"><b>Reference Information</b></p>';
          xml += '<p class="s2" style="padding-top: 2pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">Date: <b>' + shipDate +'</b></p>';
          xml += '<p class="s2" style="padding-top: 2pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">Commerical Inv # <b>' + recNumTrimmed +'</b></p>';
          xml += '<p class="s2" style="padding-top: 2pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">Booking # <b>' + bookingNum +'</b></p>';
          xml += '<p class="s2" style="padding-top: 2pt;padding-left: 20pt;text-indent: 0pt;text-align: left;">Country of Origin: <b>' + shipperCountry +'</b></p>';
          xml += '</td>';
          xml += '</tr>';
          /*xml += '<tr style="height:25pt">';
          xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:0pt;border-right-style:solid;border-right-width:0pt" colspan="2">';
          xml += '<br />';
          xml += '<p class="s3" style="padding-left: 5pt;text-indent: 0pt;line-height: 7pt;text-align: left;">Number of Packages:  ' + totPalletCount + '</p>';
          xml += '<br />';
          xml += '<p class="s3" style="padding-left: 5pt;text-indent: 0pt;line-height: 7pt;text-align: left;">Net Weight:  ' + netWeightlb + ' lbs or ' + netWeightkg + ' kgs</p>';
          xml += '<br />';
          xml += '<p class="s3" style="padding-left: 5pt;text-indent: 0pt;line-height: 7pt;text-align: left;">Gross Weight:  ' + totWeightlb + ' lbs or ' + totWeightkg + ' kgs</p>';
          xml += '<br />';
          xml += '<br />';
          xml += '</td>';
          xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:0pt;border-right-style:solid;border-right-width:1pt" colspan="2">';
          xml += '<br />';
          xml += '<p class="s3" style="padding-left: 5pt;text-indent: 0pt;line-height: 7pt;text-align: left;">Container :  ' + containerId + '</p>';
          xml += '<br />';
          xml += '<p class="s3" style="padding-left: 5pt;text-indent: 0pt;line-height: 7pt;text-align: left;">Seal #:  ' + sealNum + '</p>';
          xml += '<br />';
          xml += '<p class="s3" style="padding-left: 5pt;text-indent: 0pt;line-height: 7pt;text-align: left;">Incoterm:  ' + incoTerm + '</p>';
          xml += '<br />';
          xml += '<br />';
          xml += '</td>';
          xml += '</tr>';
          */
          xml += '</table>'

          xml += '<table width="500" style="border-collapse:collapse;table-layout:fixed;margin-left:6.00pt" cellspacing="0">'
          xml += '<tr style="height:20pt">';
          xml += '<td style="background-color: lightblue;border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: left;">Pallets/Units</p>';
          xml += '</td>';
          xml += '<td style="background-color: lightblue;border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">Net Weight</p>';
          xml += '</td>';
          xml += '<td style="background-color: lightblue;border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">Gross Weight</p>';
          xml += '</td>';
          xml += '<td style="background-color: lightblue;border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="2">';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">Container ID</p>';
          xml += '</td>';
          xml += '<td style="background-color: lightblue;border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">Seal #</p>';
          xml += '</td>';
          xml += '<td style="background-color: lightblue;border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">Incoterm</p>';
          xml += '</td>';
          xml += '</tr>';
          xml += '</table>'
          xml += '<table width="500" style="border-collapse:collapse;table-layout:fixed;margin-left:6.00pt" cellspacing="0">'
          xml += '<tr style="height:20pt">';
          xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: left;">' + totPalletCount + ' skids</p>';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: left;">' + skidSize + '</p>';
          xml += '</td>';
          xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">' + netWeightlb + ' lbs</p>';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">' + netWeightkg + ' kgs</p>';
          xml += '</td>';
          xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">' + totWeightlb + ' lbs</p>';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">' + totWeightkg + ' kgs</p>';
          xml += '</td>';
          xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="2">';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">' + containerId + '</p>';
          xml += '</td>';
          xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">' + sealNum + '</p>';
          xml += '</td>';
          xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">' + incoTerm + '</p>';
          xml += '</td>';
          xml += '</tr>';
          xml += '</table>'
          xml += '<table width="500" style="border-collapse:collapse;margin-left:6.00pt" cellspacing="0">'
          xml += '<tr style="height:20pt">';
          xml += '<td style="border-top-style:solid;border-top-width:.5pt;border-left-style:solid;border-left-width:.5pt;border-bottom-style:solid;border-bottom-width:.5pt;border-right-style:solid;border-right-width:.5pt" colspan="1">';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: left;"><b>Special Instructions:</b></p>';
          xml += '<p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: left;">' + customsInstructions + '</p>';
          xml += '</td>';
          xml += '</tr>';
          xml += '</table>'


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
          xml += '<p class="s12" style="padding-top: 2pt;padding-left: 2pt">'+currencyDisplay+'$' + AddCommas(Math.round(totAmount)) + '</p>';
          xml += '</td>';
          xml += '</tr>';
          xml += '</table>'
          xml += '<table width="500" style="border-collapse:collapse;margin-left:6.00pt" cellspacing="0">'
          xml += '<tr style="height:31pt">';
          xml += '<td>';
          xml += '<p class="s3" style="padding-top: 1pt;padding-left: 4pt;text-indent: 0pt;text-align: left;"></p>';
          xml += '<p class="s2" style="padding-top: 1pt;padding-left: 4pt;text-indent: 0pt;text-align: left;"></p>';
          xml += '</td>';
          xml += '</tr>';
          xml += '</table>'
          xml += '<table width="500" style="border-collapse:collapse;margin-left:6.00pt" cellspacing="0">'
          xml += '<tr style="height:31pt">';
          xml += '<td>';
          xml += '<p class="s3">Description of Goods</p>';
          xml += '<p class="s2">Sound Isolation Materials</p>';
          xml += '<br />';
          xml += '<p class="s2">These commodities are exported from '+currencyDisplay+' in accordance with the Export Administration Regulations. Diversion contrary to '+currencyDisplay+' Law is probibited.</p>';
          xml += '<br />';
          xml += '<br />';
          xml += '<br />';
          xml += '<p class="s14">I hereby declare that the information on this invoice is true and correct.</p>';
          xml += '<p class="s14">' + ownerName + '</p>';
          xml += '<p class="s14">'+prntownerTitle+'</p>';
          xml += '<br />';
          xml += '<br />';
          xml += '<p class="s16">T:416.449.0049 F:416.849.0415 - Royal Group Cresent, Vaughn, ON L4H 1X9</p>';
          xml += '<p class="s16">www.pliteq.com</p>';
          xml += '</td>';
          xml += '</tr>';
          xml += '</table>';
          xml += '</body>';
          xml += '</pdf>';

          //end of ttemplate begining of render
            var file = nlapiXMLToPDF(xml);
            var contents = file.getValue();
            var renderer = nlapiCreateTemplateRenderer(contents);
            renderer.setTemplate(contents);
            var renderPDF = renderer.renderToString();
            response.setContentType('PDF', recNum + '.pdf', 'inline');
            response.write(renderPDF);
            nlapiLogExecution('DEBUG', 'PDF Rendered', 'Intl Commercial Invoice was rendered!');
        } catch (err) {
            nlapiLogExecution('DEBUG', 'Error Caught', 'Error is ' + err);
        }
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
