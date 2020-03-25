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
    var itemArray = [];
    for (var eachSearchRow = 0; eachSearchRow < inventoryitemSearch.length; eachSearchRow++) {
        itemArray.push({
            'internalid': inventoryitemSearch[eachSearchRow].getValue('internalid'),
            'itemid': inventoryitemSearch[eachSearchRow].getValue('itemid'),
            'displayname': inventoryitemSearch[eachSearchRow].getValue('displayname'),
            'quantityonhand': inventoryitemSearch[eachSearchRow].getValue('quantityonhand'),
            'baseprice': inventoryitemSearch[eachSearchRow].getValue('baseprice')
        });
        //inventoryHtmlString += '<tr><td class="pt-3-half">' + itemNumber + '</td><td class="pt-3-half">' + itemDisplayName + '</td><td class="pt-3-half">' + itemPrice + '</td><td class="pt-3-half">' + itemQuantity + '</td></tr>';
    }
    var responseReadyArray = JSON.stringify(itemArray);
    response.write(responseReadyArray);
}









