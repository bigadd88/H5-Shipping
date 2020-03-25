function renderPage(request, response) {
    if (request.getMethod() == 'GET') {
      //resolving destination record ID
      var recordId = request.getParameter('pssmaporigin');
      var req = nlapiLoadRecord('customrecord_h5_shipment', recordId);
      var custId = req.getFieldValue('custrecord_h5_consignee');
      //get address lines
      var cust = nlapiLoadRecord('customer', custId);
      cust.selectLineItem('addressbook',1);
      var custLine = cust.viewCurrentLineItemSubrecord('addressbook','addressbookaddress');

      //prep address for URL
      var strAddy = custLine.getFieldValue('addr1');
      var repAddy = strAddy.split(' ').join('+');

      var strCity = custLine.getFieldValue('city');
      var repCity = strCity.split(' ').join('+');

      //create URL request string
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?'
      url += 'address='
      url += repAddy
      url += ','
      url += '+' + repCity
      url += ','
      url += '+' + custLine.getFieldValue('state');
      url += '&key=AIzaSyD7zgGRz9SGftLzqgJqY9JYPllgbVUaeJk'

      //make the call to google maps api
      var request = nlapiRequestURL(url);
	  //parse response and assign lat lng
	  var obj = JSON.parse(request.getBody());
      var lat = obj.results[0].geometry.location.lat;
      var lng = obj.results[0].geometry.location.lng;
	  //load base map file
      var file = nlapiLoadFile(145);
      var contents = file.getValue();

      //append new destination
	  var newDest = contents.replace('destination: {lat: 33.6266108, lng: -81.7061104}', 'destination: {lat: ' + lat + ', lng: ' + lng + '}')
      response.write(newDest);
      nlapiLogExecution('DEBUG', 'Shipment Addresses', 'CustomerID: ' + custId + ' Address LatLng: ' + lat + ' ' + lng);
    }
}