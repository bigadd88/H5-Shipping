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

function buildChart2(data){
	//radar
var ctxR = document.getElementById("myChart2").getContext('2d');
var myRadarChart = new Chart(ctxR, {
  type: 'radar',
  data: {
    labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
    datasets: [{
        label: "My First dataset",
        data: [65, 59, 90, 81, 56, 55, 40],
        backgroundColor: [
          'rgba(105, 0, 132, .2)',
        ],
        borderColor: [
          'rgba(200, 99, 132, .7)',
        ],
        borderWidth: 2
      },
      {
        label: "My Second dataset",
        data: [28, 48, 40, 19, 96, 27, 100],
        backgroundColor: [
          'rgba(0, 250, 220, .2)',
        ],
        borderColor: [
          'rgba(0, 213, 132, .7)',
        ],
        borderWidth: 2
      }
    ]
  },
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
  data: data/*{
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  }*/,
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

function getTTSData(workOrderNumber){
  console.log("work order number is "+ workOrderNumber);
  var woNumber = workOrderNumber;
  var requesturl = 'https://1212003.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=924&deploy=1&compid=1212003&h=b3fbcee2c25c0e7f5f5f';
  requesturl += '&lot_id='+woNumber;
  var returnObj = nlapiRequestURL(requesturl);
  console.log("returnObj: "+returnObj);
  var body = returnObj.getBody();
  console.log("body: "+body);
  var data = JSON.parse(body);
  var farmers = data['farmers'];
  var contributionEstimated = data['contributionEstimated'];
/*
  var detailsArray = [];
  try{
    var woObj = nlapiLoadRecord('workorder',woId);

    var woArray = woObj.lineitems.item;
    for (i = 1; i < woArray.length; i++){
        detailsArray.push(woArray[i].inventorydetail);
    }
  } catch(err){
    console.log("nlapiLoadRecord failed  "+err);
    detailsArray.push("1319287");
  }
  var lotArray =[];
  try{

    for (i = 0; i < detailsArray.length; i++){
        var inventorydetailSearch = nlapiSearchRecord('inventorydetail',null,
            [
                ['internalid','anyof', detailsArray[i]]
            ],
            [
                new nlobjSearchColumn('inventorynumber').setSort(false)
            ]
        );
        lotArray.push(inventorydetailSearch[0].getText('inventorynumber'));
    }
  } catch(err){
    console.log("Second Search failed");
    lotArray.push("10/0145/0254", "3/0192/00721", "2/1495/0357E");
  }
  try {
    var farmers =[];
    var contributions = [];
    var contributionEstimated =[];
    for (i = 0; i < lotArray.length; i++){
        var greenLots = nlapiSearchRecord('customrecord_h5_tts_green_lot',null,
            [
                ['custrecord_h5_ico_number','startswith',lotArray[i]]
            ],
            [
                new nlobjSearchColumn('scriptid').setSort(false),
                new nlobjSearchColumn('internalid'),
                new nlobjSearchColumn('custrecord_h5_ico_number'),
                new nlobjSearchColumn('custrecord_h5_lot_id'),
                new nlobjSearchColumn('custrecord_h5_blueprint_farmer_id'),
                new nlobjSearchColumn('custrecord_h5_farmer_name'),
                new nlobjSearchColumn('custrecord_h5_cooperative'),
                new nlobjSearchColumn('custrecord_h5_estimated_green_kgs'),
                new nlobjSearchColumn('custrecord_h5_total_usd'),
                new nlobjSearchColumn('custrecord_h5_vol_contribution'),
                new nlobjSearchColumn('custrecord_h5_origin'),
            ]
        );
        for (x = 0; x < greenLots.length; x++) {
            farmers.push(greenLots[x].getValue('custrecord_h5_farmer_name'));
            contributions.push(greenLots[x].getValue('custrecord_h5_vol_contribution'));
            contributionEstimated.push(greenLots[x].getValue('custrecord_h5_estimated_green_kgs'));
        }
    }
  } catch(err){
    console.log("everything failed :(");
  }
*/
    staggerLoadCharts(farmers,contributionEstimated);
}

function staggerLoadCharts(farmers,contributions){

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
var placeHolder = [];
var count = farmers.length;
var contributed = contributions;
var farmerName = farmers;
  for(var i=0;i<count;i++){
    placeHolder.push(farmers[i].split(" ")[0]);
    backColor.push(colorPallet[i]);
    hoverColor.push(shadeHexColor(colorPallet[i],.1));
  }
/*
var tabledata = "";
for(var i=0;i<count;i++){
  tabledata += "<tr><td>"+farmerName[i]+"</td>+<td>"+contributed[i]+"</td></tr>";
}
*/
  var chart1data = {
    labels:  farmerName,
    datasets: [{
      data:  contributed,
      backgroundColor: backColor,
      hoverBackgroundColor: hoverColor
    }]
  };
  var chart3data = {
  labels:  /*farmerName*/placeHolder,
  datasets: [{
    label: 'kgs of Coffee',
    data: contributed,
    backgroundColor: backColor,
    borderColor: hoverColor,
    borderWidth: 1
  }]
}


	buildChart1(chart1data);
  	buildChart3(chart3data);
	//setTimeout(buildChart3(chart3data),500);
	//Table(tabledata);
}

function Table(tabledata){
    var tableBlock =  "<div id='myTable' class='table-responsive' sytle='width:100%'>"
                  +"<table id='tablecontainer' class='table-responsive table-hover'>"
                  +"<thead>"
                      +"<tr><th>Grower</th> <th>Provider</th> <th>Amount</th></tr>"
                  +"</thead>"
                  +"<tbody>"
                     + tabledata
                  //   + "<tr>"+ "<td>Hank</td>" + "<td>Egypt</td>" + "<td>9</td>" + "</tr>"
                  //   + "<tr>"+ "<td>Steve</td>" + "<td>Rowanda</td>" + "<td>5</td>" + "</tr>"
                  //   + "<tr>"+ "<td>John</td>" + "<td>Pakistan</td>" + "<td>3</td>" + "</tr>"
                  +"</tbody>"
                +"</table>"
                +"</div>";
    document.getElementById("tableBlock").innerHTML = tableBlock;
}

function shadeHexColor(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
