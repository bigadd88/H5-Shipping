function tableRate(w,tZ,fZ,aA,pieces){
  /*
      w = weight
      tZ = to Zip
      fZ = from Zip
      aA = accessorial array
      pallets = pallet count
      pieces = piece count
  */
  tZ = tZ.toString();
  fZ = fZ.toString();
  var premium =0;
  tableOfRates = [[135,165,200,250,275,285,305,325,345,365,405],
                  [165,200,250,275,285,305,325,345,365,385,525],
                  [200,250,275,285,305,325,345,365,385,405,600] ,
                  [250,275,285,305,325,345,375,400,485,505,650] ,
                  [425,445,465,485,505,525,545,575,600,650,1000],
                  [650,650,650,650,650,650,650,650,650,650,1000]
                ]
  miles =nlapiRequestURL('http://www.zipcodeapi.com/rest/2YZl6o8BExuIMsUh0xHSTxtRnivvMavanl734Rg1FyWvoGAr9JVCM05VuXig4a1x/distance.json/'+tZ+'/'+fZ+'/mile');
  miles = JSON.parse(miles.body);
  miles = miles.distance;
  if(tZ.includes('941') || tZ.includes('940') || fZ.includes('941') || fZ.includes('940') ){
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
  if(aA[1] == true){
    // dock to dock
    accessorialCost += 0;
  }
  if(aA[2] == true){
    // same day
    accessorialCost += 100;
  }
  if(aA[3] == true){
    // SATURDAY
    accessorialCost += 150;
  }
  if(aA[4] == true){
    // AM only for some zips
    if(miles <= 1){
      accessorialCost += 50;
    }
    else if(miles <= 3){
      accessorialCost += 75;
    }
  }
  if(aA[5] == true){
    // RMA
    accessorialCost += 50;
  }
  if(aA[6] == true){
    // Blind
    accessorialCost += 35;
  }
  if(aA[0] == true){
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
// hello world
}


function fillZip(zip1, zip2, weight){
  document.getElementById('toZip').value = zip1;
  document.getElementById('fromZip').value = zip2;
  document.getElementById('weight').value = weight;

}



function dataPass(){
  var fromZip = document.getElementById('fromZip').value;
  var toZip = document.getElementById('toZip').value;
  var weight = document.getElementById('weight').value;
//  var pallets = document.getElementById('pallets').value;
  var pieces = document.getElementById('pieces').value;
  var accessorialArray = []
   accessorialArray.push(document.getElementById('FS').checked);
  // accessorialArray.push(document.getElementById('DTD').checked);
  accessorialArray.push(false);
   accessorialArray.push(document.getElementById('SameDay').checked);
   accessorialArray.push(document.getElementById('Sat').checked);
   accessorialArray.push(document.getElementById('AM').checked);
   accessorialArray.push(document.getElementById('RMA').checked);
   accessorialArray.push(document.getElementById('Blind').checked);
  // accessorialArray.push(document.getElementById('StandBy').checked);
   console.log(accessorialArray);
   document.getElementById('price').innerHTML = 'Price to ship: $ '+tableRate(weight,fromZip,toZip,accessorialArray,pieces);


}
