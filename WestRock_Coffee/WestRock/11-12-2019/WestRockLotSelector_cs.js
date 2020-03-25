function FieldChanged(type, name)
{
if(name === 'custpage_h5_lot_id'){
  var lotID = nlapiGetFieldValue('custpage_h5_lot_id');
  reload(lotID);
}
}

function reload(lotID){
      var URL = nlapiResolveURL('SUITELET', 'customscript_h5_assembly_cost', 'customdeploy_h5_assembly_cost');
     URL += '&custpage_assembly_build=' + lotID;
    // window.open(URL, '_self', false);
    window.location.href = URL;
      return;
}
