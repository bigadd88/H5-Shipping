function getLogin(request, response){

  var uname = request.getParameter('username');
  var pword = request.getParameter('password');
  nlapiLogExecution('DEBUG', 'Auth Request made by ' + uname);
  var sResults = nlapiSearchRecord("employee",null,
  [
     ["custentity_h5_mobile_username","is",uname],
     "AND",
     ["custentity_h5_mobile_password","is",pword]
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
  if (!sResults) {
    nlapiLogExecution('DEBUG', 'User login rejected', uname + ' ' + 'login has been rejected.');
    response.write('400');
  }
  else if (sResults.length === 1){
  	nlapiLogExecution('DEBUG', 'User is connected', uname + ' ' + 'is logged in.');
    response.write('200');
    //return respObj;
  }
}
