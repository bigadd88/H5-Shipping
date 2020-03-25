function coffeeMakerSheet(request, response){
  if (request.getMethod() == 'GET') {

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
    xml += '<body size="letter-landscape" margin="0.15in"><div class="row"><div class="col-md-6"><table width="500" style="border-collapse:collapse;margin-left:0.00pt float: left;" cellspacing="0"><tr><td colspan="1" align="left"></td><td style="border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" align="center" colspan="4">';
    xml += '<p class="s5" align="center" style="font-size:36px;">MEZA</p></td><tr><th>Lot #</th><td>Lot Insert lot number</td><td>Lot Insert lot Code #</td></tr><tr><th>Lot #</th><td>Lot Insert lot number</td><td>Lot Insert lot Code #</td></tr><tr><th>Lot #</th><td>Lot Insert lot number</td><td>Lot Insert lot Code #</td></tr><tr><th>Lot #</th><td>Lot Insert lot number</td><td>Lot Insert lot Code #</td></tr></table></div><div class="col-md-6"><table style="display: inline-block;">';
    xml += '<h3>Work Order #</h3><h5>Work Order Code</h5><tr><td>Lot #</td><td>Lot 1</td><tr><td>Lot Insert lot Code #</td></tr></tr><tr><th>Lot #</th><td>Lot 2</td><td>Lot Insert lot Code #</td></tr><tr><th>Lot #</th><td>Lot 3</td><td>Lot Insert lot Code #</td></tr><tr><th>Lot #</th><td>Lot 4</td><td>Lot Insert lot Code #</td></tr></table></div><p>Work Order #</p><p>WorkOrder Code 128</p><div></body>';
    xml += '</pdf>';
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    var file = nlapiXMLToPDF(xml);
    var contents = file.getValue();
    var renderer = nlapiCreateTemplateRenderer(contents);
    renderer.setTemplate(contents);
    var renderPDF = renderer.renderToString();
    response.setContentType('PDF', recId + '.pdf', 'inline');
    response.write(renderPDF);

  }
}
