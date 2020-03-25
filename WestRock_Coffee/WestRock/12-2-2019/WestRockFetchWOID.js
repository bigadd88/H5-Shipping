function getWOID(request,response){
  var WOID = request.getParameter('lot_id');
  var findWorkorderId = nlapiSearchRecord('workorder',null,
      [
          ['type','anyof','WorkOrd'],
          'AND',
          ['mainline','is','T'],
          'AND',
          ['transactionnumbernumber','equalto',WOID]
      ],
      [
          new nlobjSearchColumn('internalid')
      ]
  );


  var detailsArray = [];
  var lotArray = [];
  var woId = findWorkorderId[0].id;
  var woObj = nlapiLoadRecord('workorder',woId);
  var woArray = woObj.getLineItemCount('item');

  for (i =1; i <= woArray; i++){
    if(woObj.viewLineItemSubrecord('item', 'inventorydetail', i) !=null){
    detailsArray.push(woObj.viewLineItemSubrecord('item', 'inventorydetail', i).id);
  }
  }

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

  var jsonData = {
    'farmers' : farmers,
    'contributionEstimated' : contributionEstimated
  }
  var jsonString = JSON.stringify(jsonData);
  response.write(jsonString.toString());
  return jsonString;

}
