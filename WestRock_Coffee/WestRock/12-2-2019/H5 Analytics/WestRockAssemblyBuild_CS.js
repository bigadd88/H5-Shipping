function buildChart1(data){
	//doughnut
var ctxD = document.getElementById("myChart1").getContext('2d');
var myLineChart = new Chart(ctxD, {
  type: 'doughnut',
  data: data,
  options: {
    responsive: true
  }
});
}

function buildChart3(data){
	//bar
var ctxB = document.getElementById("myChart3").getContext('2d');
var myBarChart = new Chart(ctxB, {
  type: 'bar',
  data: data,
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});
}
var woNumber;
function getTTSData(workOrderNumber){
    // document.getElementById('item').value = workOrderNumber;
//  console.log("work order number is "+ workOrderNumber);
     woNumber = workOrderNumber;
  // var fromDate = fromDate.value;
  // var toDate = toDate.value;
//  call Suitelet H5-WO Grab WestRockAssemblyBuildGrab.js
  var requesturl = '/app/site/hosting/scriptlet.nl?script=931&deploy=1';
  requesturl += '&wo_id='+woNumber;
  // requesturl += '&fromDate='+fromDate;
  // requesturl += '&toDate='+toDate;
  var returnObj = nlapiRequestURL(requesturl);
  //console.log("returnObj: "+returnObj);
  var body = returnObj.getBody();
  //console.log("body: "+body);
  var data = JSON.parse(body);
  staggerLoadCharts(data);
}

function staggerLoadCharts(data){
var colorPallet = ['#A22A2F','#658B1D','#B45B34','#69372A','#382422','#E7A622'];
var backColor = [];
var hoverColor = [];
/*
#A22A2F Redish
#F6F5D7 Tan
#673919 Brown
#E7A622 Yellowish
#696464 Gray
#658B1D Green
#B45B34 light coffee
#69372A medium Coffee
#382422 Drak coffee
*/
/*
var placeHolder = [];
var count = data.data.length;
var current = [];
for(var i=0;i<data.data.length;i++){
  //                         ID of the Assembly looking for would go here
    if(data.data[i][0].assemblyid=='RC07002301'){
      for(var x=0;x<data.data[i].length;x++){
        current.push(data.data[i][x]);
      }
    }
}
*/
  // for(var i=0;i<count;i++){
  //   backColor.push(colorPallet[i]);
  //   hoverColor.push(shadeHexColor(colorPallet[i],.1));
  // }
  var cost =0;
  var qty =0;
  var built =0;
var fliper = true;
var tabledata1 ='';
for(var i =0;i<data.data.length;i++){
  var qtyTotals =0;
  var costTotals = 0;
  var builtTotals =0;
  for(var x=0;x<data.data[i].length;x++){
    if(data.data[i][x].quantity!=''){
       qtyTotals += Number(data.data[i][x].quantity);
       costTotals += Number(data.data[i][x].amount);
      // builtTotals += Number(data.data[i][x].built);
      if(i==1){
        built += Number(data.data[i][x].built);
      }
    }

  }
  qtyTotals = Math.round(Math.abs(qtyTotals));
  costTotals = Math.abs(costTotals);

  if(fliper){                                                                                                       // <td>"+built+"</td>
  tabledata1 += "<tr><td><p align='center'>"+data.data[i][0].displayname+"</p></td><td><p align='right'>"+AddCommas(qtyTotals)+"</p></td><td><p align='right'>"+AddCommas(Math.round(costTotals))+"</p></td></tr>";
  fliper = false;
} else{
  tabledata1 += "<tr bgcolor='#dddddd'><td><p align='center'>"+data.data[i][0].displayname+"</p></td><td><p align='right'>"+AddCommas(qtyTotals)+"</p></td><td><p align='right'>"+AddCommas(Math.round(costTotals))+"</p></td></tr>";
  fliper= true;
}

    cost += Number(costTotals);
    qty += Number(qtyTotals);
    built += builtTotals;
}
cost = h5round(Math.abs(cost));
qty = Math.abs(qty);
var avg = Number(cost)/Number(built);
avg = h5round(avg);
//
var tabledata2 = "<tr><td>Total Cost</td><td><p align='right'>"+AddCommas(cost)+"</p></td></tr><tr bgcolor='#dddddd'><td>Total Built</td><td><p align='right'>"+AddCommas(built)+"</p></td></tr><tr><td>Avg Cost Per Item</td><td><p align='right'>"+avg+"</p></td></tr>"


 Tables(tabledata1,tabledata2);
}

function h5round(int){
  var avg;
  var str = int.toString();
  if(str.includes('.')){
  var strSpl = str.split('.');
  var decimal = strSpl[1].charAt(0) + strSpl[1].charAt(1);
 avg = Number(strSpl[0]+'.'+decimal);
} else{
  avg = Number(int);
}
  return avg;
}
function doughnut(){
  imgsrc ='https://1212003.app.netsuite.com/core/media/media.nl?id=565241&c=1212003&h=37e8a2c112bcf061467e';

  document.getElementById('logo').src = imgsrc;
}

function testonchange(){
    var fromDate = document.getElementById('fromDate').value;
    var toDate = document.getElementById('toDate').value;
    console.log('date changed to: ' + fromDate);
    // var woNumber = document.getElementById('item').value;
//  call Suitelet H5-WO Grab WestRockAssemblyBuildGrab.js
    var requesturl = '/app/site/hosting/scriptlet.nl?script=931&deploy=1';
    requesturl += '&wo_id='+woNumber;
    requesturl += '&fromDate='+fromDate;
    requesturl += '&toDate='+toDate;
    console.log(requesturl);
    var returnObj = nlapiRequestURL(requesturl);
    //console.log("returnObj: "+returnObj);
    var body = returnObj.getBody();
    //console.log("body: "+body);
    var data = JSON.parse(body);
    staggerLoadCharts(data);

}


function Tables(tabledata1,tabledata2){
    var tableBlock1 =  "<div id='myTable' class='table-responsive' sytle='width:100%'>"
                  +"<table id='tablecontainer' class='table-responsive table-hover'>"
                  +"<thead>"
                      +"<tr><th><p align='center'>Product</p></th><th><p align='right'>Quantity</p></th><th><p align='right'>Cost</p></th></tr>"
                  +"</thead>"
                  +"<tbody>"
                     + tabledata1
                  +"</tbody>"
                +"</table>"
                +"</div>";
    var tableBlock2 = "<div id='myTable' class='table-responsive' sytle='width:100%'>"
                  +"<table id='tablecontainer' class='table-responsive table-hover'>"
                  +"<tbody>"
                     + tabledata2
                  +"</tbody>"
                +"</table>"
                +"</div>";
    document.getElementById("tableBlock1").innerHTML = tableBlock1;
    document.getElementById("tableBlock2").innerHTML = tableBlock2;
}

function shadeHexColor(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
function AddCommas(nStr) {
   nStr += '';
   var x = nStr.split('.');
   var x1 = x[0];
   var x2 = x.length > 1 ? '.' + x[1] : '';
   var rgx = /(\d+)(\d{3})/;
   while (rgx.test(x1)) {
       x1 = x1.replace(rgx, '$1' + ',' + '$2');
   }
   return x1 + x2;
}
