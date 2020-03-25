function doCat(request,response){
  var itemSearch = nlapiSearchRecord("item",null,
  [
     ["custitem_h5_site_catalog","anyof","1"]
  ],
  [
     new nlobjSearchColumn("itemid").setSort(false),
     new nlobjSearchColumn("displayname"),
     new nlobjSearchColumn("salesdescription"),
     new nlobjSearchColumn("type"),
     new nlobjSearchColumn("baseprice"),
     new nlobjSearchColumn("internalid")
  ]
  );
  var inventoryitemSearch = nlapiSearchRecord("inventoryitem",null,
  [
     ["type","anyof","InvtPart"],
     "AND",
     ["class","anyof","253"],
     "AND",
     ["description","startswith","XS-100"]
  ],
  [
     new nlobjSearchColumn("itemid"),
     new nlobjSearchColumn("displayname"),
     new nlobjSearchColumn("salesdescription"),
     new nlobjSearchColumn("type"),
     new nlobjSearchColumn("baseprice"),
     new nlobjSearchColumn("internalid")
  ]
  );

  var returnObj ={
                  'search1':itemSearch,
                  'search2':inventoryitemSearch
                }
  nlapiLogExecution('debug',returnObj);
  var str = JSON.stringify(returnObj);
  nlapiLogExecution('debug',str);
  response.write(str);

}
