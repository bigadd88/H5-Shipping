function suitelet(request, response) {
var uname = (request.getParameter('username') == null) ? '' : request.getParameter('username').toLowerCase();
var pcnum = (request.getParameter('paycornum') == null) ? '' : request.getParameter('paycornum');
var user_ip = request.getHeader('NS-Client-IP');
var empValid = 0;
var form = '';
	form = nlapiCreateForm('Consignment Sales Processing', false);
var htmlHeader = form.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');

var html = '<!DOCTYPE html>'
+ '<html>'
+ '<head>'
+ '<title>Priority Shipment Pooling App</title>'
+ '<link rel="icon" type="image/x-icon" href="http://prioritysuite.com/favicon.ico">'
+ '</head>'
+ '<body>'
+ '<div id="logo">'
+ '<table cellpadding="4" cellspacing="0" align="center">'
+ '<tr><td colspan="2" align="center"><img src="http://prioritysuite.com/images/psuite.gif"></td></tr>'
+ '<tr><td align="right">Your IP is</td><td align="left">' + user_ip + '</td></tr>'
+ '</div>'
+ '<table><tr><td>';
+ '<input type="button" value="Submit"></td>';
+ '<td><input type="button" value="Reset"></td>';
+ '<td><input type="button" value="Mark All"></td>';
+ '<td><input type="button" value="UnMark All"></td>';
+ '<td><input type="button" value="Generate Bill to Consignor"></td>';
+ '</tr>';
+ '</table>';
+ '</body>'
+ '</html>';
    form.addField('custpage_lblproductrating', 'inlinehtml')
           .setLayoutType('normal', 'startrow')
           .setDefaultValue(html);


    var sublist = form.addSubList('sublist', 'inlineeditor', 'Inline Editor Sublist', 'tab1');

    // add fields to the sublist
    sublist.addField('internalid', 'integer', 'ID');
    sublist.addField('status', 'text', 'Sale Status');
    sublist.addField('consignee', 'text', 'Item');
    sublist.addField('shipdate', 'integer', 'Date of Sale');
    sublist.addField('deliverydate', 'integer', 'Item Receipt Date');
    sublist.addField('leastcost', 'integer', 'Amt to Consignor');
    sublist.addField('carrier', 'integer', 'Date');
    //sublist.setLineItemValues(soResults);
response.write(html);
}


