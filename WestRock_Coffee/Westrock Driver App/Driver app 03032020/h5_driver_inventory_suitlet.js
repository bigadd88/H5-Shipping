function inventoryHtml(request, response){
    
    var inventoryitemSearch = nlapiSearchRecord("inventoryitem",null,
[
   ["type","anyof","InvtPart"], 
   "AND", 
   ["locationquantityonhand","greaterthan","0"]
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
// var itemNumber = [];
// var itemDisplayName= [];
// var itemQuantity = [];
// var itemPrice= [];


var inventoryHtmlString = "";

for(var eachSearchRow = 0; eachSearchRow < inventoryitemSearch.length; eachSearchRow++){

    var itemNumber = inventoryitemSearch[eachSearchRow].getValue('itemid');
    var itemDisplayName = inventoryitemSearch[eachSearchRow].getValue('displayname');
    var itemQuantity = inventoryitemSearch[eachSearchRow].getValue('baseprice');
    var itemPrice = inventoryitemSearch[eachSearchRow].getValue('quantityonhand');

    inventoryHtmlString += '<tr><td class="pt-3-half">' + itemNumber + '</td><td class="pt-3-half">' + itemDisplayName + '</td><td class="pt-3-half">' + itemPrice + '</td><td class="pt-3-half">' + itemQuantity + '</td></tr>';
    
}

response.write(inventoryHtmlString);
}








