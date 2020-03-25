function print4x6Label(request, response){
    if (request.getMethod() == 'GET') {
      var recId = request.getParameter('recName');
      var logoURL = 'http://static1.squarespace.com/static/59c5ae06f6576e0477afe509/59c65927f43b55ff86b5eaef/59c6abde8419c269b81ca801/1506279268039/?format=1500w';
      var record = nlapiLoadRecord('customrecord_pss_shipment', recId, null, null);
      var recNum = record.getFieldValue('name');
      var recNumTrimmed = recNum.substr(10, 7);
      var carrierText = record.getFieldText('custrecord_pss_carrier');
      var shipDate = record.getFieldValue('custrecord_pss_ship_date');
      var refatpickup = record.getFieldValue('custrecord_pss_reference_pickup');
      var carrierPRO = record.getFieldValue('custrecord_pss_carrier_pro');
      var customsBroker = record.getFieldValue('custrecord_pss_customsbroker');
      var bookingNum = record.getFieldValue('custrecord_pss_intlbookingnum');
      var portOfEntry = record.getFieldValue('custrecord_pss_portofentry');
      if (portOfEntry === null){portOfEntry = '';}
      var refatdelivery = record.getFieldValue('custrecord_pss_reference_delivery');
      var customsInstructions = record.getFieldValue('custrecord_pss_customs_instructions');
      if (customsInstructions === null){customsInstructions = '';}
      var shipperAddressee = record.getFieldValue('custrecord_pss_shipper_addressee');
      var shipperAddr1 = record.getFieldValue('custrecord_pss_shipper_addr_1');
      var shipperAddr2 = record.getFieldValue('custrecord_pss_shipper_addr_2');
      if (shipperAddr2 === null){shipperAddr2 = '';}
      var shipperCity = record.getFieldValue('custrecord_pss_shipper_city');
      var shipperState = record.getFieldValue('custrecord_pss_shipper_state');
      var shipperZip = record.getFieldValue('custrecord_pss_shipper_zip');
      var shipperCountry = record.getFieldValue('custrecord_pss_shipper_country');
      var consigneeName = record.getFieldValue('custrecord_pss_consignee_addree');
      var consigneeAddr1 = record.getFieldValue('custrecord_pss_consignee_addr1');
      var consigneeAddr2 = record.getFieldValue('custrecord_pss_consignee_addr2');
      if (consigneeAddr2 === null){consigneeAddr2 = '';}
      var consigneeCity = record.getFieldValue('custrecord_pss_consignee_city');
      var consigneeState = record.getFieldValue('custrecord_pss_consignee_state');
      var consigneeZip = record.getFieldValue('custrecord_pss_consignee_zip');
      var consigneeCountry = record.getFieldValue('custrecord_pss_consignee_country');
      var salesTransId = record.getFieldValue('custrecord_pss_so_parent_id');
      var estimateNum = nlapiLookupField('estimate',salesTransId,'tranid');
      if (estimateNum === null){estimateNum = '';}
      var orderNum = nlapiLookupField('salesorder',salesTransId,'tranid');
      if (orderNum === null){orderNum = '';}
      var itemfulfillmentNum = nlapiLookupField('itemfulfillment',salesTransId,'tranid');
      if (itemfulfillmentNum === null){itemfulfillmentNum = '';}
      var linHazmat = new Array();
      var linPicCount = new Array();
      var linType = new Array();
      var linNum = new Array();
      var linDesc = new Array();
      var linHTS = new Array();
      var linWeight = new Array();
      var linUnitPrice = new Array();
      var linExtendedTotal = new Array();
      var items = new Array();
      var totLPC = 0;
      var totLPic = 0;
      var totInvUnit = 0;
      var totWeight = 0;
      var totAmount = 0;
      var pkgcount = new Array();
      var fil = new Array();
      fil[0] = new nlobjSearchFilter('custrecord_pss_shipment_parent', null, 'is', recId);
      var col = new Array();
      col[0] = new nlobjSearchColumn('custrecord_pss_pkgnumber');
      col[1] = new nlobjSearchColumn('custrecord_pss_piece_count');
      col[2] = new nlobjSearchColumn('custrecord_pss_ship_line_item_desc');
      col[3] = new nlobjSearchColumn('custrecord_pss_packagetype');
      col[4] = new nlobjSearchColumn('custrecord_pss_weight');
      col[5] = new nlobjSearchColumn('custrecord_pss_unitprice');
      col[6] = new nlobjSearchColumn('custrecord_pss_extendedtotal');
      col[7] = new nlobjSearchColumn('custrecord_pss_inventoryunits');
      var packages = nlapiSearchRecord('customrecord_pss_shipment_line', null, fil, col);
      for (var x = 0; x < packages.length; x++) {
          pkgcount.push(packages[x].getValue('custrecord_pss_pkgnumber'));
          var linPicCount = packages[x].getValue('custrecord_pss_piece_count');
          var linInventoryUnits = packages[x].getValue('custrecord_pss_inventoryunits');
          var linHTS = packages[x].getValue('custrecord_pss_htsnumber');
          var linDesc = packages[x].getValue('custrecord_pss_ship_line_item_desc');
          var linType = packages[x].getText('custrecord_pss_packagetype');
          var linWeight = packages[x].getValue('custrecord_pss_weight');
          var linNum = packages[x].getValue('custrecord_pss_pkgnumber');
          var linUnitPrice = packages[x].getValue('custrecord_pss_unitprice');
          var linExtendedTotal = packages[x].getValue('custrecord_pss_extendedtotal');
          totLPic += Number(linPicCount);
          totInvUnit += Number(linInventoryUnits);
          totWeight += Number(linWeight);
          totAmount += Number(linExtendedTotal);
        }
      var perPalletWeight = Math.round(totWeight / totLPic);  
      //begin template well formed XML - ajr
      var xml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n';
        xml += '<pdf>';
        xml += '<link name="verdana" type="font" subtype="opentype" src="${nsfont.verdana}" src-bold="${nsfont.verdana_bold}" bytes="2" />';
        xml += '<head>';
      	xml += '<meta name="pssLabel" value="PSS 4x6 Label"/>';
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
        xml += '<p class="s17" align="center">';
        xml += 'Pallet <pagenumber/> of '+totLPic;
        xml += '</p>';
        xml += '</macro>';
        xml += '</macrolist>';
        xml += '</head>';
        xml += '<body padding="0.1in 0.1in 0.6in 0.1in" size="A6" footer="myfooter" footer-height="2em">';

        var i = 0;
        while (i < totLPic) {
          

        xml += '<pbr />'; //pagebreak
        xml += '<table style="border-collapse:collapse;margin-left:6.02pt" cellspacing="0">';
        xml += '<tr style="height:72pt">';
        xml += '<td><img src="' + logoURL + '" height="42" width="42"/></td>';
        xml += '<td>';
        xml += '<p class="s14" style="padding-top: 15pt;padding-left: 10pt;text-indent: 0pt;text-align: left;">Ship From:</p>';
        xml += '<p class="s14" style="padding-top: 0pt;padding-left: 10pt;text-indent: 0pt;text-align: left;">PShip Customer</p>';
        xml += '<p class="s14" style="padding-top: 0pt;padding-left: 10pt;text-indent: 0pt;text-align: left;">' + shipperAddr1 + '</p>';
        xml += '<p class="s14" style="padding-top: 0pt;padding-left: 10pt;text-indent: 0pt;text-align: left;">' + shipperAddr2 + '</p>';
        xml += '<p class="s14" style="padding-top: 0pt;padding-left: 10pt;text-indent: 0pt;text-align: left;">' + shipperCity + ', ' + shipperState + ' ' + shipperZip + '</p>';
        xml += '</td></tr></table>';
        xml += '<table><tr style="height:40pt">';
        xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">';
        xml += '<p class="s1" style="padding-top: 0pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">SHIPPED TO, CONSIGNEE</p>';
        xml += '<p class="s2" style="padding-top: 0pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">' + consigneeName + '</p>';
        xml += '<p class="s2" style="padding-top: 0pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">' + consigneeAddr1 + '</p>';
        xml += '<p class="s2" style="padding-top: 0pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">' + consigneeAddr2 + '</p>';
        xml += '<p class="s2" style="padding-top: 0pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">' + consigneeCity + ', ' + consigneeState + ' ' + consigneeZip + '</p>';
        xml += '</td>';
        xml += '<td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:0pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">';
        xml += '<p class="s1" style="padding-top: 0pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">References</p>';
        xml += '<p class="s2" style="padding-top: 0pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">Order #: '+estimateNum+orderNum+itemfulfillmentNum+'</p>';
        xml += '<p class="s2" style="padding-top: 0pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">Consignee Ref #: ' + refatdelivery + '</p>';
        xml += '<p class="s2" style="padding-top: 0pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">Carrier: ' + carrierText + '</p>';
        xml += '<p class="s2" style="padding-top: 0pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">Carrier PRO #: ' + carrierPRO + '</p>';
        xml += '</td></tr></table>';

        xml += '<table style="width: 100%; font-size: 8pt"><tr>';
      	xml += '<th style="align: left; font-size: 6pt">Consignee PO #</th>';
      	xml += '</tr></table>';
      	xml += '<barcode codetype="code128" showtext="true" value="' + refatdelivery + '" align="left"></barcode>';
      	xml += '<table style="width: 100%; font-size: 8pt; border-bottom: thick solid black"><tr>';
      	xml += '</tr></table>';
        xml += '<table style="width: 100%; border-bottom: thick solid black"><tr><td></td></tr></table>';
        xml += '<table style="width: 100%; font-size: 8pt"><tr>';
      	xml += '<th style="align: left; font-size: 6pt">Carrier PRO #</th>';
      	xml += '</tr></table>';
      	xml += '<barcode codetype="code128" showtext="true" value="' + carrierPRO + '" align="left"></barcode>';
      	xml += '<table style="width: 100%; font-size: 8pt; border-bottom: thick solid black"><tr>';
      	xml += '</tr></table>';
        xml += '<table style="width: 100%; border-bottom: thick solid black"><tr><td></td></tr></table>';
        xml += '<table style="width: 100%; font-size: 8pt"><tr>';
      	xml += '<th style="align: left; font-size: 6pt">Order #</th>';
      	xml += '</tr></table>';
      	xml += '<barcode codetype="code128" showtext="true" value="' +estimateNum+orderNum+itemfulfillmentNum+ '" align="left"></barcode>';
      	xml += '<table style="width: 100%; font-size: 8pt; border-bottom: thick solid black"><tr>';
      	xml += '</tr></table>';
      	xml += '<table style="width: 100%; border-bottom: thick solid black"><tr><td></td></tr></table>';
      	//start of carrier tracking section
      	//xml += '<table style="width: 100%; font-size: 16pt; border-bottom: solid black"><tr>';
      	//xml += '<td>CARRIER PRO NUMBER<br /></td>';
      	//xml += '</tr></table>';
      	//xml += '<table style="width: 100%"><tr>';
      	//xml += '<td></td>';
      	//xml += '</tr></table>';
      	//xml += '<barcode codetype="code128" showtext="true" value="'+carrierPRO+'" align="left"></barcode>';
      	//xml += '<table style="width: 100%; border-bottom: thick solid black"><tr><td></td></tr></table>';
        //xml += '<table style="width: 100%; font-size: 16pt; border-bottom: solid black"><tr>';
        //xml += '<td>Pliteq Order #<br /></td>';
        //xml += '</tr></table>';
        //xml += '<table style="width: 100%"><tr>';
        //xml += '<td></td>';
        //xml += '</tr></table>';
        //xml += '<barcode codetype="code128" showtext="true" value="'+estimateNum+orderNum+itemfulfillmentNum+'" align="left"></barcode>';
        //xml += '<table style="width: 100%; border-bottom: thick solid black"><tr><td></td></tr></table>';
      	//xml += '<table style="width: 100%"><tr>';
        //xml += '<th style="align: center; font-size: 10pt"><b>Pliteq Order # '+estimateNum+orderNum+itemfulfillmentNum+'</b></th>';
        //xml += '</tr></table>';
      	xml += '<table style="width: 100%">';
      	xml += '<tr><td style="font-size: 8pt; vertical-align: top">Units Shipped: <b>'+totLPic+'</b></td></tr>';
        xml += '<tr><td style="font-size: 8pt; vertical-align: top">Unit Weight: <b>'+ perPalletWeight +'</b> lbs each</td></tr>';
        xml += '<tr><td style="font-size: 8pt; vertical-align: top">Total Shipment Weight: <b>'+totWeight+'</b> lbs</td></tr>';
      	xml += '</table>';

        
        i++;
        }

        xml += "</body>";
        xml += "</pdf>";
        //end of template - begining of rendering function and output - ajr
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
