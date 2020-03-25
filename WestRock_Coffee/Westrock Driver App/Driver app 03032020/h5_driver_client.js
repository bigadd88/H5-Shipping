function buildNav(){
document.getElementById('navi').innerHTML = "<nav class='navbar navbar-dark' style='background-color: #A22A2F'> <a class='navbar-brand' style='color: white'>West Rock Driver App</a><p id='us' class='navbar-brand' style='color: white'></p><p style='display: none;' id='empId'></p></nav>";
}


function getToday(){
  var todayDate = new Date();
  var dateField = document.getElementById('logindate');
  dateField.placeholder = todayDate;
}

function loginAuth(){
  var uName = document.getElementById('uname').value;
  var pWord = document.getElementById('pword').value;
  var slUrl = 'https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=195&deploy=1&compid=TSTDRV1555013&h=92a5cad5dca029885c45';
  slUrl += '&username=' + uName;
  slUrl += '&password=' + pWord;
  var logReq = nlapiRequestURL(slUrl);
  var respBody = logReq.getBody();
  respBody = JSON.parse(respBody);
  if(respBody.return == 400){
    swal({title:'invalid',message:'You have entered invalid credentials, please try again.'});
  }
  else if (respBody.return == 200){
    //swal('Welcome ' + uName + ' enjoy your day!');
    //Menu Page
    newLo = 'https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=183&deploy=1&compid=TSTDRV1555013&h=2d7fcfa3f4db1f841892';
     newLo += '&uname='+respBody.name;
     newLo += '&empId='+respBody.id;
    window.location = newLo;
  }
  else {
    swal({title:'invalid',message:'You have entered invalid credentials, please try again.'});
  }
}



function placeCust(){
  var uname = getParameter('uname');
  var empiId = getParameter('empId');
  console.log(uname);
  document.getElementById('us').innerHTML = uname;
  
  document.getElementById('empId').value = empiId;
  
}

function parameterHandling(){
  var str = '';
  name = getParameter('uname');
  empId = getParameter('empId');
  str += '&uname='+name;
  str += '&empId='+empId;
  return str;
}

function goReorder(){
  newLo = 'https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=188&deploy=1&compid=TSTDRV1555013&h=2e3f942af96a090a7268';
  newLo += parameterHandling();

  window.location = newLo;
}

function goCatalogue(){
  newCatalogPage = 'https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=184&deploy=1&compid=TSTDRV1555013&h=f1a4a249ccd0b67c30ac';
  newCatalogPage += parameterHandling();
  window.location = newCatalogPage;
}

function goSavedPicks(){
  newInvoicePage = 'https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=192&deploy=1&compid=TSTDRV1555013&h=b27a1a064adfbe37a3cb';
  newInvoicePage += parameterHandling();
  window.location = newInvoicePage;
}
function goInvoice(){
  newInvoicePage = 'https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=189&deploy=1&compid=TSTDRV1555013&h=4039adb0df3a311d2c02';
  newInvoicePage += parameterHandling();
  window.location = newInvoicePage;
}

function goMenu(){
  newMenuPage = 'https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=183&deploy=1&compid=TSTDRV1555013&h=2d7fcfa3f4db1f841892';
  newMenuPage += parameterHandling();
  window.location = newMenuPage;
}


var flip=true;
var TABLEROWS = 0;
function addInventoryItem(){

  var table = document.getElementById('tableBody');
  colorClass= " " 
  if(flip){
  colorClass= "class='thead-light'"
  flip=false;
  }


  row = table.insertRow();

  //itemCount = '';

  row.innerHTML += '<tr><td class="pt-3-half"contenteditable="true"><input id="item"type="text"></td><td class="pt-3-half"contenteditable="true"><input id="quantity"type="number"></td><td class="pt-3-half"contenteditable="true"><input id="price"type="number"></td><td><input type="button" onclick="removeRow(this)" class="btn btn-danger btn-rounded btn-sm" value="delete"></td></tr>'
  TABLEROWS++;


//itemCount = '';
}


function removeRow(r){
  console.log(r)
  var i = r.parentNode.parentNode.rowIndex;
  console.log(i)
  document.getElementById("tableBody").deleteRow(i-1);
}

function showInventory(){
  var responseInventory = nlapiRequestURL('https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=190&deploy=1&compid=TSTDRV1555013&h=65c68a442826ea30b523');
  var responseBody = responseInventory.getBody();

  var table = document.getElementById('tableBody');
  colorClass= " " 
  if(flip){
   colorClass= "class='thead-light'"
   flip=false;
  }

  table.innerHTML = responseBody;
  //row = table.insertRow(0);
  
  }



  function showEmployeeList(){
    var responseEmployeeList = nlapiRequestURL('https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=195&deploy=1&compid=TSTDRV1555013&h=92a5cad5dca029885c45');
    var responseBodyList = responseEmployeeList.getBody();
  
    var selectIdEmployeeList = document.getElementById('employeeSelectId');
    // colorClass= " " 
    // if(flip){
    //  colorClass= "class='thead-light'"
    //  flip=false;
    // }
  
    selectIdEmployeeList.innerHTML = responseBodyList;
    //row = table.insertRow(0);
    
    }

function showCustomerList(){
  var responseCustomerList = nlapiRequestURL('https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=196&deploy=1&compid=TSTDRV1555013&h=9111a7ae394ccc3f6185');
  var responseBodyCustomerList = responseCustomerList.getBody();

document.getElementById('customerSelectId').innerHTML = responseBodyCustomerList;
  
}

function savePickRecord(){
  var itemArray = [];
  if(item.length != null){
  for(var i = 0; i < tableBody.rows.length; i++){
      console.log(i)
      console.log(item + ' ' + quantity + ' ' + price)
    itemArray.push({
          "item": item[i].value,
          "quantity": quantity[i].value,
          "price": price[i].value
      });
    }
  }else{
    itemArray.push({
      "item": item.value,
      "quantity": quantity.value,
      "price": price.value
  });
  }
    var obj = {
      'customer': document.getElementById('customerSelectId').value,
      'date': document.getElementById('date-picker-example').value,
      'items': itemArray
    }
      var str = JSON.stringify(obj);
      var response = nlapiRequestURL('https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=193&deploy=1&compid=TSTDRV1555013&h=78ab533859d5d1bf1635', str);
      responseBody = response.getBody();
      
     window.location = 'https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=183&deploy=1&compid=TSTDRV1555013&h=2d7fcfa3f4db1f841892';
}

function todayPicker(){
  var field = document.querySelector('#date-picker-example');
var date = new Date();

field.value = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + 
    '-' + date.getDate().toString().padStart(2, 0);
}








function doCatalogue(){
  var jobOne = nlapiRequestURL('https://3617346-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1383&deploy=1&compid=3617346_SB1&h=62672f53238a2401bf6b');
  var obj = JSON.parse(jobOne.getBody());
  console.log(obj);
  var obj1 = obj.search1;
  var obj2 = obj.search2;
  // build table for html
  // send HTML to front

  var tabledata  = buildTableData(obj1);
  var tabledata2 =buildTableData(obj2);


tabledataTOpass ={'table1':tabledata,
                  'table1Items': obj1.length,
                  'table2':tabledata2,
                  'table2Items': obj2.length
                  }
var fulltable = finishTable(tabledataTOpass);
document.getElementById('contentToChange').innerHTML = fulltable;

}

function buildTableData(obj){
  var tabledata = '';
  for(var i=0; i<obj.length;i++){
    tabledata += '<tr><td align="left"> <input id="amt'+i+'"  type="text">  </td><td align="right"><p style=" text-align: center;" id="name'+i+'"> '+obj[i].columns.salesdescription +'</p> <p style="display:none" id="internalid'+i+'">'+obj[i].id+'</p>  </td> '+/*<td style="display:none" id="internalid'+i+'">'+obj[i].id+'</td>*/'</tr>';
  }
  return tabledata
}

const map =[ 'na','A','B','C','D','E','F','G','H','I','J',];
function buildTableDiv(data,i ,j){
  console.log(j);
  if(j>6){
  var table = "<div class='card'>"
              +"<div id='myTable' style='position: relative; height: 400px; overflow: auto;display: block;'>" /*sytle='width:100%'*/
                +"<p style=' text-align: center;font-weight: bold; font-size: 150%;'>"+map[i]+"</p>"
                +"<table id='tablecontainer"+i+"' class='table table-hover '>"
                +"<thead >"
                    +"<tr>"
                    +"<th><p style=' text-align: center;'>Quantity</p></th>"
                    +"<th><p style=' text-align: center;'>Items</p></th>"
                    +"</tr>"
                +"</thead>"
                +"<tbody >"
                   + data
                +"</tbody>"
              +"</table>"
              +"</div>"
              +"</div>";
  }
  else{
    var table = "<div class='card'>"
                +"<div id='myTable'>" /*sytle='width:100%'*/
                  +"<p style=' text-align: center;font-weight: bold; font-size: 150%;'>"+map[i]+"</p>"
                  +"<table id='tablecontainer"+i+"' class='table table-hover '>"
                  +"<thead >"
                      +"<tr>"
                      +"<th><p style=' text-align: center;'>Quantity</p></th>"
                      +"<th><p style=' text-align: center;'>Items</p></th>"
                      +"</tr>"
                  +"</thead>"
                  +"<tbody>"
                     + data
                  +"</tbody>"
                +"</table>"
                +"</div>"
                +"</div>";
  }
  return table
}

function finishTable(dataPassed){
  var tablesSent =1;
  var data1 = dataPassed.table1;
  var data2 = dataPassed.table2;
  var content = "<div class='card-deck'>";
  var tableBlock1 = buildTableDiv(data1,tablesSent,dataPassed.table1Items);
  tablesSent++;
  var tableBlock2 = buildTableDiv(data2,tablesSent ,dataPassed.table2Items);
  tablesSent++;
  var tableBlock3 = buildTableDiv(data1,tablesSent ,dataPassed.table1Items);
  tablesSent++;
  content += tableBlock1;
  content += tableBlock2;
  content += tableBlock3;
  content += "</div>";
  content += "<button type='button' class='btn btn-lg btn-block' onClick='buildSO("+tablesSent+");'> Submit </button>";

        return content;
}


function signaturePadClient(){
    var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'rgb(0, 0, 0)'
      });
      var saveButton = document.getElementById('save');
      var cancelButton = document.getElementById('clear');

      saveButton.addEventListener('click', function (event) {
        var data = signaturePad.toDataURL('image/png');

      // Send data to server instead...
        window.open(data);
      });

      cancelButton.addEventListener('click', function (event) {
        signaturePad.clear();
      });
}



function buildSO(TableAmt){
  var customer = getParameter('uname');
  var requestURL = 'https://3617346-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1382&deploy=1&compid=3617346_SB1&h=e8ce3da0697fbcdbf71e';
  requestURL += '&cust='+customer;
  var sent =0;
// need to loop thorugh how many ever items in the list there are and grab the values from there ID
// if the ID is >1 then we will grab the namme field
// the name field is the same i iteration as the field attached to it
for(var j=1;j<TableAmt;j++){
  console.log('tablecontainer'+j);
  var doc = document.getElementById('tablecontainer'+j).rows;
  for(var i =1;i<doc.length;i++){
    var lookfor = 'amt'+(i-1);
    var itemAmt = document.getElementById(lookfor).value;
    if(itemAmt != ''){
      console.log(itemAmt);
      var foundIn = 'internalid' +(i-1);
      var itemID = document.getElementById(foundIn).innerHTML;
      console.log(itemID);

      var req = '&item'+(sent)+'='+itemAmt+','+itemID;
      console.log(req);
      requestURL += req;
      sent++;
    }
}
}
requestURL += '&sent='+sent;
  console.log(requestURL);
  nlapiRequestURL(requestURL);
swal({title:'Order Created'});

// send data to suitlet and build SO pass back internal ID of SO

}

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