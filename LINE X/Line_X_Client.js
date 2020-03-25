function buildNav(){
  document.getElementById('navi').innerHTML = "<nav class='navbar' style='background-color: #FFF200'> <a class='navbar-brand' style='color: #000000'>Line X Menu</a><a id=us class='navbar-brand' style='color: #000000'></a></nav>";
}

function getToday(){
  var todayDate = new Date();
  var dateField = document.getElementById('logindate');
  dateField.placeholder = todayDate;
}

function loginAuth(){
  var uName = document.getElementById('uname').value;
  var pWord = document.getElementById('pword').value;
  var slUrl = 'https://3617346-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1377&deploy=1&compid=3617346_SB1&h=dc09dc06522ec05058e5';
  slUrl += '&username=' + uName;
  slUrl += '&password=' + pWord;
  var logReq = nlapiRequestURL(slUrl);
  var respBody = logReq.getBody();
  if (respBody == uName){
    //swal('Welcome ' + uName + ' enjoy your day!');
    newLo = 'https://3617346-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1379&deploy=1&compid=3617346_SB1&h=93e1c38a82b418dda43f';
    newLo += '&uname='+uName;
    window.location = newLo;
  }
  else {
    swal({title:'Entered credentials are invalid, please try again.'});
  }
}

function placeCust(){
  var uname = getParameter('uname');
  console.log(uname);
  document.getElementById('us').innerHTML = uname;
}

function goReorder(){
  newLo = 'https://3617346-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1368&deploy=1&compid=3617346_SB1&h=55e3c7c781ca6b49bba3'
  name = getParameter('uname');
  newLo += '&uname='+name;
  window.location = newLo;
}

function goCatalogue(){
  newLo = 'https://3617346-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1380&deploy=1&compid=3617346_SB1&h=753b6e05a6ab5b6069b8'
  name = getParameter('uname');
  newLo += '&uname='+name;
  window.location = newLo;
}

function doCatalogue(){
  var jobOne = nlapiRequestURL('https://3617346-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1381&deploy=1&compid=3617346_SB1&h=2d8fbe4b9f5d9ba825c5');
  var obj = JSON.parse(jobOne.getBody());
  console.log(obj);
  var obj1 = obj.search1;
  var obj2 = obj.search2;
  // build table for html
  // send HTML to front

  var tabledata = buildTableData(obj1);
  var tabledata2 =buildTableData(obj2);

// for(var i=0; i<obj1.length;i++){
//   tabledata += '<tr><td align="left"> <input id="amt'+i+'"  type="text">  </td><td align="right"><p id="name'+i+'"> '+obj1[i].columns.salesdescription +'</p> <p style="display:none" id="internalid'+i+'">'+obj1[i].id+'</p>  </td> '+/*<td style="display:none" id="internalid'+i+'">'+obj[i].id+'</td>*/'</tr>';
// }
// for(var i=0; i<obj2.length;i++){
//   tabledata2 += '<tr><td align="left"> <input id="amt'+i+'"  type="text">  </td><td align="right"><p id="name'+i+'"> '+obj2[i].columns.salesdescription +'</p> <p style="display:none" id="internalid'+i+'">'+obj2[i].id+'</p>  </td> '+/*<td style="display:none" id="internalid'+i+'">'+obj[i].id+'</td>*/'</tr>';
// }


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
