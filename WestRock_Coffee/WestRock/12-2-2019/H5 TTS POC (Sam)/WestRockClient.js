function getToday(){
  var todayDate = new Date();
  var dateField = document.getElementById('logindate');
  dateField.placeholder = todayDate;
}

function nextPage(){
  var uName = document.getElementById('uname').value;
  var pWord = document.getElementById('pword').value;
  var slUrl = 'https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=661&deploy=1&compid=TSTDRV1555022&h=903868f98adeb822bed5';
  slUrl += '&unam=' + uName;
  slUrl += '&pwor=' + pWord;
  var logReq = nlapiRequestURL(slUrl);
  var respBody = logReq.getBody();
  if (respBody = 200){
    swal('Welcome ' + uName + ' enjoy your day!');
    window.location = 'https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=662&deploy=1&compid=TSTDRV1555022&h=dccf07881815cb163a2b';
  }
  else {
    swal('You have entered invalid credentials, please try again.');
  }
}

function getSelectedValues(){
  var totalCost = [];
  var ratesTable = document.getElementById('ratestable');
  for (i = 2; i <= ratesTable.rows.length;i++){
    var selected = document.getElementById('selBox'+i).checked;
    if (selected == true){
      totalCost.push(Number(document.getElementById('selTotCost'+i).innerHTML));
    }
  }
  var totRate = total(totalCost);
  console.log('Your total cost is ' + totRate);
  var page3Url = 'https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=665&deploy=1&compid=TSTDRV1555022&h=a3e80bc18eb4e104d6ab';
  page3Url += '&totrate=' + totRate;
  window.location = page3Url;
}

function total(arr) {
  if(!Array.isArray(arr)) return;
  let totalNumber = 0;
  for (let i=0,l=arr.length; i<l; i++) {
     totalNumber+=arr[i];
  }
  return totalNumber;
}

function appendRateTotal(totalRate){
  var rateTotalDiv = document.getElementById('rateholder');
  rateTotalDiv.innerHTML = '<h1>Rate Total is $' + totalRate + '<h1>';
}

function makeHighGraph(lot){

  //choose highest amt of coffee
  var Databoys = [ 25, 35, 40];
  var DataBoys = [5,3,9];
  var high =0;
  for(var i=0; i<Databoys.length;i++){
  	var next = Databoys[i];
    if(next>high){
    high = next;
    }
  }

  var dataHold =[];

  // These next coming data sets should comne out of a netsutie call to grab the data off our tracking sheets

  var POOs = [ "VALENCIA CARDONA LUIS EUGENIO","VELASQUEZ VASQUEZ DARIO DE JESUS","ARIAS ALZATE LUIS FERNANDO"];
  var Familys = ["John","Steve","Hank"];
  var Stories = ["has a big family with lots of kids", "a small family that works by themselfs","He employs half the town here"];

  // Robert can do this from priortiyShip, We will need a photo of farmers in a netsuite file as well as the data above here
  var PictureLink = ["family img","her img","prettylady img"];

  // The sliced/selected should be of the grower where we think the most coffee could have came from
  //  The 'high' var from above will pick which value gets made into our DataHold array so we may pass it
  // This loop will fill in the obj array that we need to fill in the graph
  for(var i=0;i<POOs.length;i++){
    			if(Databoys[i] != high){
            dataHold.push(
            {
            	POO: POOs[i],
              y: DataBoys[i],
              Grower_Family: Familys[i],
              Story: Stories[i],
              Picturelink : PictureLink[i]
        }
        );
        } else {
         dataHold.push(
            {
            	POO: POOs[i],
              y: DataBoys[i],
              sliced: true,
        			selected: true,
              Grower_Family: Familys[i],
              Story: Stories[i],
              Picturelink : PictureLink[i]
        }
        );
        }

                }

  var ToShow ={
      chart: {
          type: 'pie'
      },
      title: {
          text: 'Where your coffee came from'
      },
      subtitle: {
          text: 'An insight into what you drink'
      },
      plotOptions: {
          series: {
              dataLabels: {
                  enabled: true,
                  format: '{point.POO}: {point.y:.1f}%'
              }
          }
      },

      tooltip: {
          headerFormat: '<span style="font-size:11px"> <b>{series.POO}</b></span><br>',
          pointFormat: '{point.Grower_Family}   <br>' + '{point.Story} <br>' + '{point.Picturelink}'
      },



      series: [
          {
              name: "Coffee Grower",
              colorByPoint: true,
              data: dataHold
          }
      ]

  };

  // Create the chart
 Highcharts.chart('container', ToShow);


  //pie




}

function makeBootGraph(){
      var DataBoys = [15,30,55];
      var POOs = [ "VALENCIA CARDONA LUIS EUGENIO","VELASQUEZ VASQUEZ DARIO DE JESUS","ARIAS ALZATE LUIS FERNANDO"];

  var myPieChart = new Chart('pieChart', {
    type: 'pie',
    data: {
      labels: POOs,
      datasets: [{
        data: DataBoys,
        backgroundColor: ["#EAAA00", "#7c501a", "#8b0000"],
        hoverBackgroundColor: ["#EAAA00", "#7c501a", "#8b0000"]
      }]
    },
    options: {
      responsive: true
    }
  });
}

function makeHighMap(){
  // Instantiate the map
Highcharts.mapChart('map', {
    chart: {
        map: 'custom/africa',
        borderWidth: 1
    },

    title: {
        text: 'Coffee Grower Locations'
    },

    subtitle: {
        text: 'Demo of seeing where your coffee came form'
    },

    legend: {
        enabled: false
    },

    series: [{
        name: 'Country',
        data: [
            ['eg', 1],
            ['ng',1],
            ['rw',1],

        ],
        dataLabels: {
            enabled: true,
            color: '#FF0000',
            formatter: function () {
                if (this.point.value) {
                    return this.point.name;
                }
            }
        },
        tooltip: {
            headerFormat: '',
            pointFormat: ''
        }
    }]
});

}
