function customListSearch(request, response){
    var customerSearch = nlapiSearchRecord("customer",null,
    [
    ], 
    [
       new nlobjSearchColumn("entityid").setSort(false), 
       new nlobjSearchColumn("companyname"), 
       new nlobjSearchColumn("internalid"),
       new nlobjSearchColumn("email")
    ]
    );

    var customerString = '';
    for(var i = 0; i < customerSearch.length; i++){
        var entityId = customerSearch[i].getValue('entityid');
        var email = customerSearch[i].getValue('email');
        var phone = customerSearch[i].getValue('phone');
        var interalId = customerSearch[i].getValue('internalid')

        customerString += '<option value="' + interalId + '">' + entityId + '</option>';
    }


    response.write(customerString);
}
