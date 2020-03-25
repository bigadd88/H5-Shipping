function getToday(){
  var dateObj = new Date().toLocaleDateString('en-us');
  var footer = document.getElementById('docfoot');
  footer.innerText = 'Farmer Direct Verified, Powered by Westrock';
  var lotNum = getParameter('lot_num');
  var coffeeData = getandsetData(lotNum);
  var harvDate = coffeeData.beginHarvest;
  var arvDate = coffeeData.arrivedUSPort;
  document.getElementById('herotext').innerText = coffeeData.product;
  document.getElementById('heroimg').setAttribute('src', coffeeData.image1);
  document.getElementById('heroimg').setAttribute('alt', coffeeData.paragraph2);
  document.getElementById('roastedval1').innerText = travelDays(harvDate, arvDate);
  document.getElementById('expDateval1').innerText = coffeeData.lotExpirationDate;
  document.getElementById('originCountryValue').innerText = coffeeData.originCountry;
  document.getElementById('dateval1').innerHTML = "<a href='#' data-toggle='modal' data-target='#date1Modal'>" + coffeeData.beginHarvest + "</a>";
  document.getElementById('dateval2').innerHTML = "<a href='#' data-toggle='modal' data-target='#date2Modal'>" + coffeeData.beginDeliveryToMill + "</a>";
  document.getElementById('dateval3').innerHTML = "<a href='#' data-toggle='modal' data-target='#date3Modal'>" + coffeeData.lastDeliveryToMill + "</a>";
  document.getElementById('dateval4').innerHTML = "<a href='#' data-toggle='modal' data-target='#date4Modal'>" + coffeeData.dispatchedForDelivery + "</a>";
  document.getElementById('dateval5').innerHTML = "<a href='#' data-toggle='modal' data-target='#date5Modal'>" + coffeeData.leftPort + "</a>";
  document.getElementById('dateval6').innerHTML = "<a href='#' data-toggle='modal' data-target='#date6Modal'>" + coffeeData.arrivedUSPort + "</a>";
  document.getElementById('horizontalBar').innerHTML = "<a href='#' data-toggle='modal' data-target='#chartModal'>" + coffeeData.farmersContributing + "</a>";
  setTimeout(hbarModal(coffeeData), 50);
}

function fetchLotNum(lotnum){
  var lotNum = lotnum;
  console.log(lotNum);
}

function getandsetData(lotNum){
  var getDataURL = 'https://1212003.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=967&deploy=1&compid=1212003&h=2546c2812561461ff47c';
  getDataURL += '&lot_id=' + lotNum;
  var respObj = nlapiRequestURL(getDataURL);
  var bodyObj = respObj.getBody();
  var parsedObj = JSON.parse(bodyObj);
  return parsedObj;
}

function nextPage(){
  var nextPgURL = 'https://1212003.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=966&deploy=1&compid=1212003&h=26e4a8dfa8b91ced7cc3';
  var worderNum = document.getElementById('wordernum').value;
  nextPgURL += '&lot_num=' + worderNum;
  window.location = nextPgURL;
}

function hbarModal(coffeeData){
  var chartLabels = coffeeData.top10Farmers;
  var chartData = coffeeData.top10Contributions;
  new Chart(document.getElementById("farmerChart"), {
	"type": "horizontalBar",
	"data": {
	"labels": chartLabels,
	"datasets": [{
	"label": "kgs of Coffee",
	"data": chartData,
	"fill": false,
	"backgroundColor": ["rgba(143,197,232)", "rgba(104,165,219)",
	"rgba(71,115,217)", "rgba(67,36,187)", "rgba(31,16,127)"
	],
	"borderColor": ["rgba(143,197,232)", "rgba(104,165,219)",
	"rgba(71,115,217)", "rgba(67,36,187)", "rgba(31,16,127)"
	],
	"borderWidth": 1
	}]
	},
	"options": {
	"scales": {
	"xAxes": [{
	"ticks": {
	"beginAtZero": true
	}
	}]
	}
	}
	});
}

function travelDays(harvDate, arvDate){
  var date1 = new Date(harvDate);
  var date2 = new Date(arvDate);
  var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);
  return diffDays;
}