function getWOID(request,response){
  var WOID = request.getParameter('wo_id');
  var fromDate = request.getParameter('fromDate');
  var toDate = request.getParameter('toDate');
  if (fromDate != null){
      var year = fromDate.charAt(0)+fromDate.charAt(1)+fromDate.charAt(2)+fromDate.charAt(3);
      var month = fromDate.charAt(5)+fromDate.charAt(6);
      var day = fromDate.charAt(8)+fromDate.charAt(9);
      var dateFrom = month+"/"+day+"/"+year;
  } else {
      var dateFrom ='09/01/2019';
  }
    if (toDate != null){
        var year = toDate.charAt(0)+toDate.charAt(1)+toDate.charAt(2)+toDate.charAt(3);
        var month = toDate.charAt(5)+toDate.charAt(6);
        var day = toDate.charAt(8)+toDate.charAt(9);
        var dateTo = month+"/"+day+"/"+year;
    } else {
        var dateTo = '09/30/2019';
    }
    // var WOID = '3743';
    // var dateFrom ='07/01/2019';
    // var dateTo = '09/30/2019';
    var search = nlapiLoadSearch('transaction', 'customsearch_h5_assemblybuildcostsumma_2');
    search.addFilter(new nlobjSearchFilter('trandate', null, 'within', dateFrom, dateTo));
    search.addFilter(new nlobjSearchFilter('anylineitem', null, 'anyof', WOID));
    // search.addFilter(new nlobjSearchFilter(['anylineitem','anyof',WOID]));
    var searchResults = search.runSearch();
    var resultIndex = 0;
    var resultStep = 1000;
    var resultSet;
    var assemblybuildSearch = [];
    var resultSet = [1,2];
    while (resultSet.length > 0){
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        resultIndex = resultIndex + resultStep;
        assemblybuildSearch = assemblybuildSearch.concat(resultSet);
    }



    // var assemblybuildSearch = nlapiSearchRecord('assemblybuild',null,
    // [
    //    ['type','anyof','Build'],
    //    'AND',
    //    ['trandate','within',dateFrom,dateTo],
    //    'AND',
    //    ['anylineitem','anyof',WOID],
    //    'AND',
    //    ['mainline','is','F']
    // ],
    // [
    //     new nlobjSearchColumn("internalid").setSort(true),
    //    new nlobjSearchColumn('item'),
    //    new nlobjSearchColumn('displayname','item',null),
    //    new nlobjSearchColumn('trandate'),
    //    new nlobjSearchColumn('type'),
    //    new nlobjSearchColumn('tranid'),
    //    new nlobjSearchColumn('entity'),
    //    new nlobjSearchColumn('quantity'),
    //    new nlobjSearchColumn('amount'),
    //    new nlobjSearchColumn('built')
    // ]
    // );
      var assemblyBuildIds = [];

      for(i=0;i<assemblybuildSearch.length;i++){
        // USED assemblybuildSearch[i].id in console
        assemblyBuildIds.push(assemblybuildSearch[i].getValue('displayname','item'));
      }
      var uniqueAssemblyIds = uniques(assemblyBuildIds);
      var multiDarray = [];
      for(var x=0;x<uniqueAssemblyIds.length;x++){
          multiDarray.push([]);
        }

      for(i=0;i<assemblybuildSearch.length;i++){
          for(var x=0;x<uniqueAssemblyIds.length;x++){
              // USED assemblybuildSearch[i].id in console
              if(assemblybuildSearch[i].getValue('displayname','item')==uniqueAssemblyIds[x]){
                //  multiDarray[x].push(assemblybuildSearch[i]);
                 multiDarray[x].push({
                   id : assemblybuildSearch[i].id,
                    assemblyid : assemblybuildSearch[i].getText('item'),
                    displayname : assemblybuildSearch[i].getValue('displayname','item'),
                    trandate : assemblybuildSearch[i].getValue('trandate'),
                    type : assemblybuildSearch[i].getValue('type'),
                    tranid : assemblybuildSearch[i].getValue('tranid'),
                    entity : assemblybuildSearch[i].getValue('entity'),
                    item : assemblybuildSearch[i].getValue('item'),
                   quantity: assemblybuildSearch[i].getValue('quantity'),
                   amount: assemblybuildSearch[i].getValue('amount'),
                   built: assemblybuildSearch[i].getValue('built')
                 })
              }
          }
    }

  var jsonData = {data:multiDarray}
  var jsonString = JSON.stringify(jsonData);
  response.write(jsonString.toString());
  return jsonString;

}

function uniques(arr) {
    var a = [];
    for (var i = 0, l = arr.length; i < l; i++){
        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
            a.push(arr[i]);
          }
    return a;
}
