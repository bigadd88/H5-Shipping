function getLogin(request, response){

  var uname = request.getParameter('username');
  var pword = request.getParameter('password');
  nlapiLogExecution('DEBUG', 'Auth Request made by ' + uname);
  var customerSearch = nlapiSearchRecord("customer",null,
[
   ["email","is",uname]
],
[
   new nlobjSearchColumn("entityid").setSort(false),
   new nlobjSearchColumn("altname"),
   new nlobjSearchColumn("email"),
   new nlobjSearchColumn("phone")
]
);
  if (!customerSearch) {
    nlapiLogExecution('DEBUG', 'User login rejected', uname + ' ' + 'login has been rejected.');
    response.write('400');
  }
  else if (customerSearch.length === 1){
  	nlapiLogExecution('DEBUG', 'User is connected', uname + ' ' + 'is logged in.');
    response.write(uname);
    //return respObj;
  }
}
