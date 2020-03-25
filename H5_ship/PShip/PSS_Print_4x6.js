function print4x6Label(request, response){
    if (request.getMethod() == 'GET') {
        //begin template well formed XML - ajr
        var xml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n';
        xml += '<pdf>';
        xml += '<link name="verdana" type="font" subtype="opentype" src="${nsfont.verdana}" src-bold="${nsfont.verdana_bold}" bytes="2" />';
        xml += '<head>';
      	xml += '<meta name="title" value="Kraft 4x6 Label"/>';
        xml += '</head>';
        xml += '<body padding="0.9in 0.5in 0.1in 0.5in" size="A6">';
        xml += '<table style="width: 100%; font-size: 8pt; border-bottom: solid black"><tr>';
        xml += '<th style="font-size: 16pt; vertical-align: middle; padding: 5px 6px 3px; font-weight: bold;"></th>';
        xml += '</tr>';
      	xml += '<tr><td style="font-size: 6pt; vertical-align: top">KRAFT Tool, Inc.<br />8325 Hedgelane Terrace<br />Shawnee, KS 66227<br />913-422-4848</td></tr>';
      	xml += '<tr><td><b>SHIP TO:</b><br /></td></tr>';
      	xml += '<tr style="align: center"><td style="align: center">Priority Logistics, Inc.<br />PO Box 26682<br /><b>Overland Park, KS 66225</b></td>';
        xml += '</tr></table>';
      	xml += '<table style="width: 100%; font-size: 8pt"><tr>';
      	xml += '<th style="align: center; font-size: 6pt">(420) Ship to Postal Code</th>';
      	xml += '</tr></table>';
      	xml += '<barcode codetype="code128" showtext="false" value="8675099" align="center"></barcode>';
      	xml += '<table style="width: 100%; font-size: 8pt; border-bottom: thick solid black"><tr>';
      	xml += '<th style="align: center; font-size: 6pt">(420) 66225</th>';
      	xml += '</tr></table>';
      	//start of carrier tracking section
      	xml += '<table style="width: 100%; font-size: 16pt; border-bottom: solid black"><tr>';
      	xml += '<td><b>CARRIER</b><br />TRACKING NUMBER<br /></td>';
      	xml += '<td></td>';
      	xml += '</tr></table>';
      	xml += '<table style="width: 100%"><tr>';
      	xml += '<td></td>';
      	xml += '</tr></table>';
      	xml += '<barcode codetype="code128" showtext="true" value="1z3243252513153" align="left"></barcode>';
      	xml += '<table style="width: 100%; border-bottom: thick solid black"><tr>';
      	xml += '<td></td>';
      	xml += '</tr></table>';
      	xml += '<table style="width: 100%"><tr>';
      	xml += '<th style="align: center; font-size: 10pt"><b>PO# PXXXXX</b></th>';
      	xml += '</tr></table>';
      	xml += '<table style="width: 100%"><tr>';
      	xml += '<td style="font-size: 8pt; vertical-align: top">330.0 lbs<br />1 of 1<br />PO PXXXXX<br />PPD</td>';
      	xml += '<td style="font-size: 6pt; vertical-align: bottom">PSS Thermal v1.2 ZEB2 10/6</td>';
      	xml += '</tr></table>';
        xml += "</body></pdf>";
        //end of template - begining of rendering function and output - ajr
        var file = nlapiXMLToPDF(xml);
        var contents = file.getValue();
        var renderer = nlapiCreateTemplateRenderer(contents);
        renderer.setTemplate(contents);
        var renderPDF = renderer.renderToString();
        response.setContentType('PDF', 'printOut.pdf', 'inline');
        response.write(renderPDF);
        nlapiLogExecution('DEBUG', 'PDF Rendered', 'Label was rendered!');
    }
}