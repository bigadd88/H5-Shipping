function h5_driver_employee_lookup(request, response){
    var employeeSearch = nlapiSearchRecord("employee",null,
    [
    ], 
    [
       new nlobjSearchColumn("entityid").setSort(false), 
       new nlobjSearchColumn("email"), 
       new nlobjSearchColumn("phone"), 
       new nlobjSearchColumn("altphone"), 
       new nlobjSearchColumn("fax"), 
       new nlobjSearchColumn("supervisor"), 
       new nlobjSearchColumn("title"), 
       new nlobjSearchColumn("altemail")
    ]
    );

    var employeeString = "";
    for(var eachSearchRow = 0; eachSearchRow < employeeSearch.length; eachSearchRow++){
        var entityId = employeeSearch[eachSearchRow].getValue('entityid');
        var email = employeeSearch[eachSearchRow].getValue('email');
        var phone = employeeSearch[eachSearchRow].getValue('phone');
        employeeString += '<ul class="list-group"><li class="list-group-item">' + entityId + '</li><li class="list-group-item">' + email + '</li><li class="list-group-item">' + phone + '</li></ul>';
    }

    response.write(employeeString);

    }



