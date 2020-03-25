function inventoryHtml(request, response) {

    var inventoryitemSearch = nlapiSearchRecord("item", null,
        [
            ["custitemcustitemwcr_itemtype","anyof","14"]
        ],
        [
            new nlobjSearchColumn("itemid").setSort(false),
            new nlobjSearchColumn("displayname"),
            new nlobjSearchColumn("salesdescription"),
            new nlobjSearchColumn("type"),
            new nlobjSearchColumn("baseprice"),
            new nlobjSearchColumn("quantityonhand")
        ]
    );
// var inventoryHtmlString = "";
    // var itemArray = [];
    // for (var eachSearchRow = 0; eachSearchRow < inventoryitemSearch.length; eachSearchRow++) {
    //     itemArray.push({
    //         'internalid': inventoryitemSearch[eachSearchRow].getValue('internalid'),
    //         'itemid': inventoryitemSearch[eachSearchRow].getValue('itemid'),
    //         'displayname': inventoryitemSearch[eachSearchRow].getValue('displayname'),
    //         'quantityonhand': inventoryitemSearch[eachSearchRow].getValue('quantityonhand'),
    //         'baseprice': inventoryitemSearch[eachSearchRow].getValue('baseprice')
    //     });
    //  }
    
    var ItemList = [];
    // sort of hashinh here to get items into their slots
    for(i=0;i<inventoryitemSearch.length;i++){
        try{
        itemNumber = inventoryitemSearch[i].getValue('itemid').split('F0')[1]
        if(isNaN(itemNumber)){
        if(itemNumber.includes('A')){
            itemNumber = itemNumber.split('A')[0]
        }
        if(itemNumber.includes('-')){
            itemNumber = itemNumber.split('-')[0]
        }
    }
      if(ItemList[itemNumber] == null ){
        ItemList[itemNumber] = [];
        ItemList[itemNumber].push({
            'internalid': inventoryitemSearch[i].getValue('internalid'),
            'itemid': inventoryitemSearch[i].getValue('itemid'),
            'displayname': inventoryitemSearch[i].getValue('displayname'),
            'quantityonhand': inventoryitemSearch[i].getValue('quantityonhand'),
            'baseprice': inventoryitemSearch[i].getValue('baseprice')
        });
      }
      else{
        ItemList[itemNumber].push({
            'internalid': inventoryitemSearch[i].getValue('internalid'),
            'itemid': inventoryitemSearch[i].getValue('itemid'),
            'displayname': inventoryitemSearch[i].getValue('displayname'),
            'quantityonhand': inventoryitemSearch[i].getValue('quantityonhand'),
            'baseprice': inventoryitemSearch[i].getValue('baseprice')
        });
      }
    }
    catch(err){
        nlapiLogExecution('DEBUG', 'Error', err + ' of  '+ itemNumber + 'is not good.');
    }
      }
    var responseReadyArray = JSON.stringify(ItemList);
    response.write(responseReadyArray);





   
}









