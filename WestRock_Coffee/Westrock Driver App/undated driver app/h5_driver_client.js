  // CLient Script
  // 1.0 logic
  //          COMMENT YOUR CODE
  //
  //
  //             Sections
  //  Nav Bar             function buildNav()
  //
  //  Login Auth          function loginAuth()
  //
  //  Page Nav            function goInvTransfer()
  //
  //  loginAuth           function loginAuth()
  //
  //  Table helpers       function addInventoryItem()
  //
  // driver pick          function showCustomerList()

  // Nav bar handlings
  function buildNav(){
    // grabs the navi element and fills in visual HTML
        document.getElementById('navi').innerHTML = "<nav class='navbar navbar-dark' style='background-color: #A22A2F'> <a href='javascript:goMenu()'class='navbar-brand' style='color: white'>West Rock Driver App</a><p id='us' class='navbar-brand' style='color: white'></p><p style='display: none;' id='empId'></p></nav>";
  }

  function placeCust(){
    // Places the User in the nav bar
    // it also hides the Emp ID there

    var uname = getParameter('uname');
    var empiId = getParameter('empId');
    console.log(uname);
    document.getElementById('us').innerHTML = uname;
    document.getElementById('empId').value = empiId;

  }

  function parameterHandling(){
    // gets our parameters from the url
    // sends them back in parameter from
    var str = '';
    name = getParameter('uname');
    empId = getParameter('empId');
    str += '&uname='+name;
    str += '&empId='+empId;
    return str;
  }

  // Login Auth
  function loginAuth(){
    // Sends to 1.0 username and spits back good or bad
    // if good we pass to menu
    var uName = document.getElementById('uname').value;
    var pWord = document.getElementById('pword').value;
    var slUrl = 'https://1212003-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=997&deploy=1&compid=1212003_SB1&h=a8c056994569454713aa';
    slUrl += '&username=' + uName;
    slUrl += '&password=' + pWord;
    var logReq = nlapiRequestURL(slUrl);
    var respBody = logReq.getBody();
    respBody = JSON.parse(respBody);
    if(respBody.return == 400){
      // invalid user
      swal({title:'Wrong Username and or Password',message:'You have entered invalid credentials, please try again.'});
    }
    else if (respBody.return == 200){
      // sends to Menu Page
      newLo = 'https://1212003-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1000&deploy=1&compid=1212003_SB1&h=67e49743e031e9933d12';
      newLo += '&uname='+respBody.name;
      newLo += '&empId='+respBody.id;
      window.location = newLo;
    }
    else {
      // wtf error
      // should make this email one of us
      swal({title:'oops',message:'I dont know what happened there, please try again.'});
    }
  }

  function getToday(){
    // today in login screen
    var todayDate = new Date();
    var dateField = document.getElementById('logindate');
    dateField.placeholder = todayDate;
  }



  // This section is For page Navigation
  function goMenu(){
  // builds the menu html
    document.getElementById('contentToChange').innerHTML = "<button type='button' class='btn btn-dark btn-lg btn-block' onClick='goInvTransfer();' > Inventory Transfer</button><button type='button' class='btn btn-dark btn-lg btn-block' onClick='goSavedPicks();' >Saved Picks</button><button type='button' class='btn btn-dark btn-lg btn-block' onClick='goInvoice();' >New Pick</button><button type='button' class='btn btn-dark btn-lg btn-block' onClick='goCatalogue();' > Go to Catalog Page</button><div id=user class='mx-auto'></div>";
  }

  function goInvTransfer(){
    document.getElementById('contentToChange').innerHTML = `<div id=topBody><div class='card'><h3 class='card-header text-center font-weight-bold text-uppercase py-4'>Inventory Transfer</h3><div class='card-body'><div id='table' class='table'> <span class='table-add float-right mb-3 mr-2'> <button class='btn btn-success btn-rounded btn-sm my-0' onClick='addInventoryItem();'>Add Inventory Item</button> </span><table id='tableInventory' class='table table-bordered table-responsive-md table-striped text-center'><thead><tr><th class='text-center'>Inventory Item</th><th class='text-center'>Quanity</th><th class='text-center'>Remove</th></tr></thead><tbody id='tableBody'></tbody></table><div> <span class='table-add float-right mb-3 mr-2'> <button type='button' onClick='removeInventory();' class='btn btn-success btn-rounded btn-sm my-0'>Transfer Inventory</button> </span></div></div></div></div><div class='formLabel'>Custom Form *</div> <select class='browser-default custom-select'><option selected>Custom Inventory Transfer</option><option value='1'>One</option><option value='2'>Two</option><option value='3'>Three</option> </select><div class='formLabel'>Select Date</div><div class='md-form'> <input placeholder='' type='text' id='date-picker-example' class='form-control datepicker'> <label for='date-picker-example'></label></div><div class='formLabel'>Posting Period</div> <select class='browser-default custom-select'><option selected>Open this select menu</option><option value='1'>One</option><option value='2'>Two</option><option value='3'>Three</option> </select><div class='formLabel'>Subsidiary</div> <select class='browser-default custom-select'><option selected>Open this select menu</option><option value='1'>One</option><option value='2'>Two</option><option value='3'>Three</option> </select><div class='formLabel'>Ref Number:</div><div class='formLabel'>To Be Generated</div><div class='formLabel'>Memo</div><div class='form-group'> <label for='exampleFormControlTextarea2'></label><textarea class='form-control rounded-0'id='exampleFormControlTextarea2' rows='3'></textarea></div><div class='formLabel'>From Location</div> <select class='browser-default custom-select'><option selected>Open this select menu</option><option value='1'>One</option><option value='2'>Two</option><option value='3'>Three</option> </select><div class='formLabel'>To Location</div> <select class='browser-default custom-select'><option selected>Open this select menu</option><option value='1'>One</option><option value='2'>Two</option><option value='3'>Three</option> </select><div class='formLabel'>Customer Type</div><div class='form-group'> <label for='exampleFormControlTextarea2'></label><textarea class='form-control rounded-0' id='exampleFormControlTextarea2' rows='3'></textarea></div></div><div id=contentToChange> <button type='button' class='btn btn-dark btn-lg btn-block' onClick='goMenu();'>Menu Page</button> <button type='button' class='btn btn-dark btn-lg btn-block' onClick='goCatalogue();'> Go to Catalog Page</button><div id=user class='mx-auto'></div></div>`;

  }

  function goCatalogue(){
    // Build catalog HTML
    document.getElementById('contentToChange').innerHTML = `<div id=topBody><div class='card'><h3 class='card-header text-center font-weight-bold text-uppercase py-4'>Catalog</h3><div class='card-body'><div id='table' class='table'> <span class='table-add float-right mb-3 mr-2'> <button class='btn btn-success btn-rounded btn-sm my-0' onClick='DisplayAvaibleItems();'>Show AvaibleItems</button> </span><table id='tableInventory' class='table table-bordered table-responsive-md table-striped text-center'><thead><tr><th class='text-center'>Item</th><th class='text-center'>Quanity</th><th class='text-center'>Price</th><th class='text-center'>Remove</th></tr></thead><tbody id='tableBody'></tbody></table></div></div></div></div><div> <button type='button' class='btn btn-dark btn-lg btn-block' onClick='goReorder();'> Inventory Transfer Page</button><div id=user class='mx-auto'></div></div><div> <button id='save'>Save</button><button id='clear'>Clear</button></div>`;
    // constructor functions for new page
    // none here but we could auto pop with Avaible Items info
    //  DisplayAvaibleItems()

  }



  function goInvoice(){
    // build newPick html
    document.getElementById('contentToChange').innerHTML =`<div id=topBody><div class='card'><h3 class='card-header text-center font-weight-bold text-uppercase py-4'>New Pick</h3><div class='card-body'><div id='table' class='table'> <span class='table-add float-right mb-3 mr-2'> <button id='addItem' class='btn btn-success btn-rounded btn-sm my-0' onClick='addInventoryItem();'>Add Item</button> </span><table id='tableInventory' class='table table-bordered table-responsive-md table-striped text-center'><thead><tr><th class='text-center'>Item</th><th class='text-center'>Quantity</th><th class='text-center'>Price</th><th class='text-center'>Remove</th></tr></thead><tbody id='tableBody'></tbody></table><div> <span class='table-add float-right mb-3 mr-2'> <button id='saveItem' type='button' onClick='savePickRecord();' class='btn btn-success btn-rounded btn-sm my-0'>Save Pick</button> </span> <span class='table-add float-right mb-3 mr-2'></span></div></div></div></div><div class='formLabel'>Customer</div><div id='customer'> <select id='customerSelectId' class='browser-default custom-select'></select></div><div class='formLabel'>Select Date</div><div id='date' class='md-form'> <input type='date' id='date-picker-example' class='form-control datepicker'> <label for='date-picker-example'></label></div></div><div id='buttonHolder'> <button type='button' class='btn btn-dark btn-lg btn-block' onClick='createInvoice();'>Create Invoice</button></div>`;
    // constructor functions for new page
    showCustomerList(); // add customers to the list
    document.getElementById('date-picker-example').valueAsDate = new Date(); // throw todays date in
  }

  function createInvoice(){
    // on this we will first update the price based on qty 
    var grandTotal=0;
    var flip = true;
    var table = document.getElementById('tableBody');
    for(i=0; i< table.rows.length;i++){
      var qty    = Number(table.rows[i].children[1].children[0].value);
      var price  = Number(table.rows[i].children[2].children[0].value);
      var total  = qty*price;
      grandTotal += total;
      if(flip){
        table.rows[i].style.backgroundColor ='white'
        flip= false
      }
      else{
        table.rows[i].style.backgroundColor ='#d3d3d3'
        flip= true
      }
      table.rows[i].children[2].children[0].value = total;
      table.rows[i].innerHTML= '<tr><td><p id="item"> '+ table.rows[i].children[0].children[0].value +' </p></td><td><p id="quantity">'+ qty +'</p></td><td ><p id="price">'+ total +'</p></td><td><input type="button" onclick="removeRow(this)" class="btn btn-danger btn-rounded btn-sm" value="delete"></td></tr>'
    }
      row = table.insertRow();  
      row.innerHTML = '<tr><td><p id="item"></p></td><td><p id="quantity"></p></td><td ><p id="price">'+'Total: '+grandTotal+'</p></td><td><input type="button" onclick="removeRow(this)" class="btn btn-danger btn-rounded btn-sm" value="delete"></td></tr>';
    
    // then take all the fields and change there types so its impossble to edit
    document.getElementById('buttonHolder').innerHTML =`<div style='position: relative;width: 330px;height: 364px;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none;'> <img src='https://1212003.app.netsuite.com/core/media/media.nl?id=698005&c=1212003&h=cc55a162848b1f2662f9' style='position: absolute;left: 0;top: 0;' width=330 height=364 /> <canvas id='signature-pad' style='position: absolute;left: 0;top: 0;width:330px;height:364px;' width=330 height=364></canvas></div><div> <button id='clear'>Clear</button></div><button type='button' class='btn btn-dark btn-lg btn-block' onClick='submitInvoice();'>submit Invoice</button>`;
    signaturePadClient()
    document.getElementById('addItem').style.display = 'none';
    document.getElementById('saveItem').style.display = 'none';
    selected = document.getElementById('customerSelectId')
    document.getElementById('customer').innerHTML = selected.options[selected.selectedIndex].text +', '+ selected.value
    date = document.getElementById('date')
    document.getElementById('date').innerHTML  = '<p>'+ date.children[0].value +'</p>'


  }
  function submitInvoice(){
        signaturePad =document.getElementById('signature-pad')
        var data = signaturePad.toDataURL('image/png').split(',')[1];
        // Send data to server
        url = 'https://1212003-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1001&deploy=1&compid=1212003_SB1&h=94577ab2e9d2c56b36e8';
        response = nlapiRequestURL(url, data).getBody();
        alert(response);
  }
  function goSavedPicks(){
    // Let us search and fill in data
    // but first lets get them where they were
    goInvoice()
    // ok so now we have the page open but the datas missing
    // lets go grab it!
    // and fill in where ids match

  }


  // Table functions
  var TABLEROWS = 0;
  function addInventoryItem(){
    // Adds a row after click
    // builds in our addItem button on the new pick page
    var table = document.getElementById('tableBody');
    row = table.insertRow();                                                // PENDING AFTER CODE TO CHANGE id="item",id="quantity",id="price" to id="item[]",id="quantity[]",id="price[]" html should then save these values to an array
    row.innerHTML += '<tr><td><input id="item"type="text"onchange="validateItem(this);"></td><td><input id="quantity"type="tel"></td><td ><input id="price"type="text"></td><td><input type="button" onclick="removeRow(this)" class="btn btn-danger btn-rounded btn-sm" value="delete"></td></tr>'
    TABLEROWS++;
  }

  function validateItem(r) {
  // var itemId = r.parentNode.parentNode;
  itemNumber = r.value
  // Leadings 0s will throw off just the number
  if(isNaN(Number(itemNumber))){
    itemNumber = r.value
    if(itemNumber.includes('F0')){
      itemNumber = itemNumber.split('F0')[1];
  }
    if(itemNumber.includes('A')){
      itemNumber = itemNumber.split('A')[0];
  }
  if(itemNumber.includes('-')){
      itemNumber = itemNumber.split('-')[0];
  }
  }
  else{
    itemNumber = +itemNumber;

  }
  if(itemObj[itemNumber]){
      row = r.parentNode.parentNode
      row.style.backgroundColor = "green";
      row.getElementsByTagName('input')[2].value = itemObj[itemNumber][0].baseprice
      
  }
  else{
      r.parentNode.parentNode.style.backgroundColor = "red";
  }

  }

  function removeRow(r){
    // removes the row you clicked on
    console.log(r)
    var i = r.parentNode.parentNode.rowIndex;  // this gets the rows index
    console.log(i)
    document.getElementById("tableBody").deleteRow(i-1); // this deletes the row and accounts for headers offset
    TABLEROWS--;
  }

  function DisplayAvaibleItems(){
    // this was showInventory()  if problems occur
    var responseInventory = nlapiRequestURL('https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=190&deploy=1&compid=TSTDRV1555013&h=65c68a442826ea30b523');
    var responseBody = responseInventory.getBody();
    var table = document.getElementById('tableBody');
    table.innerHTML = responseBody;


  }


  // driver pick functions
  function showCustomerList(){
    // displays a list of customers in the customers drop down onPick page
    var responseCustomerList = nlapiRequestURL('https://1212003-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1003&deploy=1&compid=1212003_SB1&h=6ae7f560b084427115ff');
    var responseBodyCustomerList = responseCustomerList.getBody();
    document.getElementById('customerSelectId').innerHTML = responseBodyCustomerList;

  }

  function savePickRecord(){
    // Takes the info off the Pick form and saves it to Netsuite
    // this code will change when we make changes to the  addInventoryItem() function
    var itemArray = [];
    if(item.length != null){
      // if the item array has multipul lines in it we run here
    for(var i = 0; i < tableBody.rows.length; i++){
        console.log(i)
        console.log(item + ' ' + quantity + ' ' + price)
        // here we make a new json obj of the information were saving and save it to the itemArray array
      itemArray.push({
            "item": item[i].value,
            "quantity": quantity[i].value,
            "price": price[i].value
        });
      }
    }else{
      // if theres only one item then we just get its value directly
      itemArray.push({
        "item": item.value,
        "quantity": quantity.value,
        "price": price.value
    });
    }
    // add some other feilds from the form
      var obj = {
        'customer': document.getElementById('customerSelectId').value,
        'date': document.getElementById('date-picker-example').value,
        'items': itemArray
      }
      // JSON and send off
        var str = JSON.stringify(obj);
        var response = nlapiRequestURL('https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=193&deploy=1&compid=TSTDRV1555013&h=78ab533859d5d1bf1635', str);
        responseBody = response.getBody();
        // return to home screen
        goMenu();

  }

  function signaturePadClient(){
      //
      var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
          backgroundColor: 'rgba(255,255, 255, 0)',
          penColor: 'rgb(0, 0, 0)'
        });
      // var saveButton = document.getElementById('save');
        var cancelButton = document.getElementById('clear');

        

        cancelButton.addEventListener('click', function (event) {
          signaturePad.clear();
        });
  }

  var itemObj;
  function loadInventoryArray(){
    // this was showInventory()  if problems occur
    var loadInventoryArray = nlapiRequestURL('https://1212003-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1002&deploy=1&compid=1212003_SB1&h=767b8d6a18e349eb10ac');
    var responseBody = loadInventoryArray.getBody();
    itemObj = JSON.parse(responseBody);
  }


  // UNUSED CODE TO DELTE PENDING APPROVAL so i will not comment

  //  function showEmployeeList(){
  //    // this is not being used were query the emp list before
  //     var responseEmployeeList = nlapiRequestURL('https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=195&deploy=1&compid=TSTDRV1555013&h=92a5cad5dca029885c45');
  //     var responseBodyList = responseEmployeeList.getBody();

  //     var selectIdEmployeeList = document.getElementById('employeeSelectId');
  //     selectIdEmployeeList.innerHTML = responseBodyList;

  //     }
  //     // these are sams functions from GODF so ill not comment
  // function buildSO(TableAmt){
  //   var customer = getParameter('uname');
  //   var requestURL = 'https://3617346-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1382&deploy=1&compid=3617346_SB1&h=e8ce3da0697fbcdbf71e';
  //   requestURL += '&cust='+customer;
  //   var sent =0;
  // // need to loop thorugh how many ever items in the list there are and grab the values from there ID
  // // if the ID is >1 then we will grab the namme field
  // // the name field is the same i iteration as the field attached to it
  // for(var j=1;j<TableAmt;j++){
  //   console.log('tablecontainer'+j);
  //   var doc = document.getElementById('tablecontainer'+j).rows;
  //   for(var i =1;i<doc.length;i++){
  //     var lookfor = 'amt'+(i-1);
  //     var itemAmt = document.getElementById(lookfor).value;
  //     if(itemAmt != ''){
  //       console.log(itemAmt);
  //       var foundIn = 'internalid' +(i-1);
  //       var itemID = document.getElementById(foundIn).innerHTML;
  //       console.log(itemID);

  //       var req = '&item'+(sent)+'='+itemAmt+','+itemID;
  //       console.log(req);
  //       requestURL += req;
  //       sent++;
  //     }
  // }
  // }
  // requestURL += '&sent='+sent;
  //   console.log(requestURL);
  //   nlapiRequestURL(requestURL);
  // swal({title:'Order Created'});

  // // send data to suitlet and build SO pass back internal ID of SO

  // }
  // function doCatalogue(){
  //   var jobOne = nlapiRequestURL('https://3617346-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1383&deploy=1&compid=3617346_SB1&h=62672f53238a2401bf6b');
  //   var obj = JSON.parse(jobOne.getBody());
  //   console.log(obj);
  //   var obj1 = obj.search1;
  //   var obj2 = obj.search2;
  //   // build table for html
  //   // send HTML to front

  //   var tabledata  = buildTableData(obj1);
  //   var tabledata2 =buildTableData(obj2);


  // tabledataTOpass ={'table1':tabledata,
  //                   'table1Items': obj1.length,
  //                   'table2':tabledata2,
  //                   'table2Items': obj2.length
  //                   }
  // var fulltable = finishTable(tabledataTOpass);
  // document.getElementById('contentToChange').innerHTML = fulltable;

  // }

  // function finishTable(dataPassed){
  //   // this is hard coded
  //   // this knows its getting a data with 2 tables to build
  //   var tablesSent =1;
  //   var data1 = dataPassed.table1;
  //   var data2 = dataPassed.table2;
  //   // start of card deck
  //   var content = "<div class='card-deck'>";
  //   // building indv cards
  //   var tableBlock1 = buildTableDiv(data1,tablesSent,dataPassed.table1Items);
  //   tablesSent++;
  //   var tableBlock2 = buildTableDiv(data2,tablesSent ,dataPassed.table2Items);
  //   tablesSent++;
  //   var tableBlock3 = buildTableDiv(data1,tablesSent ,dataPassed.table1Items);
  //   tablesSent++;
  //   // put cards in content
  //   content += tableBlock1;
  //   content += tableBlock2;
  //   content += tableBlock3;
  //   content += "</div>";
  //   content += "<button type='button' class='btn btn-lg btn-block' onClick='buildSO("+tablesSent+");'> Submit </button>";
  //       // return a card-deck with a table inside each card
  //         return content;
  // }
  // // this is to name table sections for multipul tables
  // const map =[ 'na','A','B','C','D','E','F','G','H','I','J',];
  // function buildTableDiv(data,i ,j){
  //   // data:the table rows built out, i: how many tables, j how many items it contains
  //   // This builds whole sections and buts the table data in there
  //   // need to write headeders
  //   console.log(j);
  //   if(j>6){
  //   var table = "<div class='card'>"
  //               +"<div id='myTable' style='position: relative; height: 400px; overflow: auto;display: block;'>" sytle='width:100%'
  //                 +"<p style=' text-align: center;font-weight: bold; font-size: 150%;'>"+map[i]+"</p>"
  //                 +"<table id='tablecontainer"+i+"' class='table table-hover '>"
  //                 +"<thead >"
  //                     +"<tr>"
  //                     +"<th><p style=' text-align: center;'>Quantity</p></th>"
  //                     +"<th><p style=' text-align: center;'>Items</p></th>"
  //                     +"</tr>"
  //                 +"</thead>"
  //                 +"<tbody >"
  //                    + data
  //                 +"</tbody>"
  //               +"</table>"
  //               +"</div>"
  //               +"</div>";
  //   }
  //   else{
  //     var table = "<div class='card'>"
  //                 +"<div id='myTable'>" sytle='width:100%'
  //                   +"<p style=' text-align: center;font-weight: bold; font-size: 150%;'>"+map[i]+"</p>"
  //                   +"<table id='tablecontainer"+i+"' class='table table-hover '>"
  //                   +"<thead >"
  //                       +"<tr>"
  //                       +"<th><p style=' text-align: center;'>Quantity</p></th>"
  //                       +"<th><p style=' text-align: center;'>Items</p></th>"
  //                       +"</tr>"
  //                   +"</thead>"
  //                   +"<tbody>"
  //                      + data
  //                   +"</tbody>"
  //                 +"</table>"
  //                 +"</div>"
  //                 +"</div>";
  //   }
  //   return table
  // }


  // function buildTableData(obj){
  //   // give this function an obj and format and itll spit back with all the table rows
  //   var tabledata = '';
  //   for(var i=0; i<obj.length;i++){
  //     tabledata += '<tr><td align="left"> <input id="amt'+i+'"  type="text">  </td><td align="right"><p style=" text-align: center;" id="name'+i+'"> '+obj[i].columns.salesdescription +'</p> <p style="display:none" id="internalid'+i+'">'+obj[i].id+'</p>  </td> '+/*<td style="display:none" id="internalid'+i+'">'+obj[i].id+'</td>*/'</tr>';
  //   }
  //   return tabledata
  // }

  // END UNUSED CODE

  // function presentSummary(){
  //   //save file then pull up the file

  //       var jsonString = '{"customer":"21","date":"2020-03-03","items":[{"item":"1","quantity":"2","price":"3"}]}';




  //   <h3 class='card-header text-center font-weight-bold text-uppercase py-4'>Invoice Summary</h3>
  //   <div class='formLabel'>Customer</div>
  //   <div class='formLabel'>' + customerName +'</div>
  //   <div class='formLabel'>' + invoiceDate +'</div>
  //   <div class='card'>
  //       <div class='card-body'>
  //           <div id='table' class='table'> <span class='table-add float-right mb-3 mr-2'></span>
  //               <table id='tableInventory' class='table table-bordered table-responsive-md table-striped text-center'>
  //                   <thead>
  //                       <tr>
  //                           <th class='text-center'>Item</th>
  //                           <th class='text-center'>Quantity</th>
  //                           <th class='text-center'>Price</th>
  //                           <th class='text-center'>Total</th>
  //                       </tr>
  //                   </thead>
  //                   <tbody id='tableBody'>
  //                       <tr>
  //                           <td class="pt-3-half"><input id="item" type="text"></td>
  //                           <td class="pt-3-half"><input id="quantity" type="number"></td>
  //                           <td class="pt-3-half"><input id="price" type="number"></td>
  //                           <td><input type="button" onclick="removeRow(this)" class="btn btn-danger btn-rounded btn-sm"
  //                                   value="delete"></td>
  //                       </tr>
  //                   </tbody>
  //               </table>
  //               <div><span class='table-add float-right mb-3 mr-2'><button type='button' onClick='savePickRecord();'
  //                           class='btn btn-success btn-rounded btn-sm my-0'>Submit Invoice Summary</button></span><span
  //                       class='table-add float-right mb-3 mr-2'></span></div>
  //           </div>
  //       </div>
  //   </div>
  //   }



  //is client
