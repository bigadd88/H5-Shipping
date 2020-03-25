var recType = 32;
var glAcct = 138;
var proCode = 'PRIOR';//PRIOR
var cliCode = 'PRILG';//PRILG

function palletCalc(){
  var palwidth = 40;
  var pallength = 48;
  var palheight = 48;
  var palvol = Number(palwidth * pallength * palheight);
  return palvol;
};