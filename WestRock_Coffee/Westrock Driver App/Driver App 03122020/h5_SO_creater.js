function makeSO(request,response){

  // RECIEVE
  // &cust=Floorscape&item1=5,26715&item2=4,26717&item3=3,26718&sent=sent
  var customer = request.getParameter('cust');
  var sent = Number(request.getParameter('sent'));
  var customerSearch = nlapiSearchRecord("customer",null,
[
   ["entityid","is",customer]
],
[
   new nlobjSearchColumn("entityid").setSort(false),
   new nlobjSearchColumn("altname"),
   new nlobjSearchColumn("address"),
   new nlobjSearchColumn('internalid')
]
);
  nlapiLogExecution('DEBUG', 'User is connected', sent);
  var custID = customerSearch[0].getValue('entityid')


  var so = nlapiCreateRecord('salesorder');
// DATE SETTING
  var date = new Date();
  var refnum = 'online'+date;
  var day = date.getDate();
  var month = date.getMonth() +1;
  var year = date.getFullYear();
  var netDate = month +'/'+ day +'/'+ year;
  // INTO SALES FIELDS
  var address = customerSearch[0].getValue('address');
  var internalID = customerSearch[0].getValue('internalid')
  so.setFieldValue('custbody_customer',customer);
  so.setFieldValue('custbody_customerid',custID);
  so.setFieldValue('location',118);
  so.setFieldValue('entity', internalID);
  so.setFieldValue('trandate',netDate);
  so.setFieldValue('shipaddress',address);
  so.setFieldValue('otherrefnum',refnum);
  so.setFieldValue('orderstatus','A')
// need to loop thorugh how many ever items in the list there are and grab the values from there ID
// if the ID is >1 then we will grab the namme field
// the name field is the same i iteration as the field attached to it

  for(var i =0;i<sent;i++){
      var param = 'item'+i;
      var itemINFO = request.getParameter(param);
      var itemINFO = itemINFO.split(',');
      so.selectNewLineItem('item');
      so.setCurrentLineItemValue('item','item', itemINFO[1]);
      so.setCurrentLineItemValue('item', 'amount', itemINFO[0]);
      so.setCurrentLineItemValue('item','isbillable', 'T');
      so.commitLineItem('item');
}
var id = nlapiSubmitRecord(so, true);
}
// Send Cust, And Items find cust info from a seach
// send items via params ?
