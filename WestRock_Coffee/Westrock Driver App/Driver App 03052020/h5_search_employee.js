function h5_driver_employee_lookup(request, response){
    var uname = request.getParameter('username');
    
    var employeeSearch = nlapiSearchRecord("employee",null,
    [
        ["email","is",uname]
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


    if (!employeeSearch) {
        obj = {
            'return': 400
        }
        nlapiLogExecution('DEBUG', 'User login rejected', uname + ' ' + 'login has been rejected.');
      
      }
      else if (employeeSearch.length === 1){
        nlapiLogExecution('DEBUG', 'User is connected', uname + ' ' + 'is logged in.');
        
        obj = {
            'name': employeeSearch[0].getValue('entityid'),
            'id': employeeSearch[0].id,
            'return': 200
        }
      }
            response.write(JSON.stringify(obj));






  //  var employeeString = "";
    // for(var eachSearchRow = 0; eachSearchRow < employeeSearch.length; eachSearchRow++){
    //     var entityId = employeeSearch[eachSearchRow].getValue('entityid');
    //     var email = employeeSearch[eachSearchRow].getValue('email');
    //     var phone = employeeSearch[eachSearchRow].getValue('phone');
    //     employeeString += '<ul class="list-group"><li class="list-group-item">' + entityId + '</li><li class="list-group-item">' + email + '</li><li class="list-group-item">' + phone + '</li></ul>';
    // }

    //response.write(employeeString);


    }



