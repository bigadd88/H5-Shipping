function statusPortlet(portletObj, column) { 
 portlet.setTitle('Todays Shipments'); 
 var content = '<iframe src="https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=43&deploy=1" frameborder="0" width="1000" height="300"></iframe>'; 
portlet.setHtml(content); 
}