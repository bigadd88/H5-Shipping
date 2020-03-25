function idealRater(request, response) {
  /* example JSON body
  send to https://tstdrv1555013.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=174&deploy=1&compid=TSTDRV1555013&h=885e713517f9b7759f3f
  Header:  Content-Type application/json

    { "weight": "500",
      "toZip": "94545",
      "fromZip": "94545",
      "accessorialArray": {
          "fullService": "1",
          "sameDay": "1",
          "saturday": "1",
          "amRequest": "1",
          "RMA": "1",
          "blind": "1"
      },
      "pieces": "5"}
   */


  var type = request.getMethod();
  var body = request.getBody();
  var parsedJSON = JSON.parse(body);
  var w = parsedJSON.weight;
  var tZ = parsedJSON.toZip;
  var fZ = parsedJSON.fromZip;
  var aA = parsedJSON.accessorialArray;
  var pieces = parsedJSON.pieces;



  nlapiLogExecution('debug', 'bodyValue', w + tZ + fZ + aA + pieces);
  var rateReturned = tableRate(w,tZ,fZ,aA,pieces);

  var messageToReturn = {
    "weight": w,
    "toZip": tZ,
    "fromZip": fZ,
    "accessorialArray": {
      "fullService": aA.fullService,
      "sameDay": aA.sameDay,
      "saturday": aA.saturday,
      "amRequest": aA.amRequest,
      "RMA": aA.RMA,
      "blind": aA.blind
    },
    "pieces": pieces,
    "idealRate": rateReturned
  };
  var returnJSON = JSON.stringify(messageToReturn);


  response.write(returnJSON);
}

function tableRate(w,tZ,fZ,aA,pieces){
  var fullService = aA.fullService;
  var sameDay = aA.sameDay;
  var saturday = aA.saturday;
  var amRequest = aA.amRequest;
  var RMA = aA.RMA;
  var blind = aA.blind;
  var dockToDock = "";
  // var tZgood = tZ.toString();
  // var fZgood = fZ.toString();
  var tZ3 = tZ.substr(0, 3);
  var fZ3 = fZ.substr(0, 3);
  var premium =0;
  tableOfRates = [[135,165,200,250,275,285,305,325,345,365,405],
    [165,200,250,275,285,305,325,345,365,385,525],
    [200,250,275,285,305,325,345,365,385,405,600] ,
    [250,275,285,305,325,345,375,400,485,505,650] ,
    [425,445,465,485,505,525,545,575,600,650,1000],
    [650,650,650,650,650,650,650,650,650,650,1000]
  ]
  var getMiles =nlapiRequestURL('http://www.zipcodeapi.com/rest/vlSLdUBdbFqKIcyEdnBHNNLQlfI3qobvzlQjvr6WoXCWoTXUmUXzsUa4I1eAKrD3/distance.json/'+tZ+'/'+fZ+'/mile');
  var milesBody = JSON.parse(getMiles.body);
  var miles = milesBody.distance;
  if(tZ3 == '941' || tZ3 == '940' || fZ3 == '941' || fZ3 == '940'){
  // if(tZ == "94545"){
  premium = 100;
  }
  if( miles<=30){
    miles = 0;
  }
  else if( miles<=60){
    miles = 1;
  }
  else if(miles<=90){
    miles = 2;
  }
  else if(miles<=120){
    miles = 3;
  }
  else if( miles<=150){
    miles = 4;
  }
  else {
    miles = 5;
  }
  if( w<=500){
    w = 0;
  }
  else if( w<=1000){
    w = 1;
  }
  else if( w<=1500){
    w = 2;
  }
  else if( w<=2000){
    w = 3;
  }
  else if( w<=2500){
    w = 4;
  }
  else if( w<=3000){
    w = 5;
  }
  else if( w<=3500){
    w = 6;
  }
  else if( w<=4000){
    w = 7;
  }
  else if( w<=5000){
    w = 8;
  }
  else if( w<=7000){
    w = 9;
  }
  else {
    w =10;
  }
  accessorialCost = 0;
  if(dockToDock == "1"){
    // dock to dock
    accessorialCost += 0;
  }
  if(sameDay == "1"){
    // same day
    accessorialCost += 100;
  }
  if(saturday == "1"){
    // SATURDAY
    accessorialCost += 150;
  }
  if(amRequest == "1"){
    // AM only for some zips
    if(miles <= 1){
      accessorialCost += 50;
    }
    else if(miles <= 3){
      accessorialCost += 75;
    }
  }
  if(RMA == "1"){
    // RMA
    accessorialCost += 50;
  }
  if(blind == "1"){
    // Blind
    accessorialCost += 35;
  }
  if(fullService == "1"){
    // Full SERVICE has more value than just below
    return tableOfRates[miles][0] + premium + (pieces * 35) + accessorialCost;
  }
  if(tableOfRates[miles][w] ==1000){
    // if price needs to be quoted return such
    return 'Call for Quote';
  }
  priceOfTravel = tableOfRates[miles][w];
  totalPrice = priceOfTravel + premium + accessorialCost;
  return totalPrice;

}

