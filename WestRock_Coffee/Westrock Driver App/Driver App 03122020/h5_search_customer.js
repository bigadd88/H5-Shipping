function customListSearch(request, response){
    var customerSearch = nlapiSearchRecord("customer",null,
        [
            ["subsidiary","anyof","6"]
        ],
    [
       new nlobjSearchColumn("altname").setSort(false),
        new nlobjSearchColumn("entityid"),
        new nlobjSearchColumn("companyname"),
       new nlobjSearchColumn("internalid"),
       new nlobjSearchColumn("email")
    ]
    );

    var customerString = '';
    for(var i = 0; i < 10; i++){
        var entityId = customerSearch[i].getValue('entityid');
        var custName = customerSearch[i].getValue('altname');
        var phone = customerSearch[i].getValue('phone');
        var internalId = customerSearch[i].getValue('internalid')

        customerString += '<option value="' + internalId + '">' + custName + '</option>';
    }


    response.write(customerString);
}
