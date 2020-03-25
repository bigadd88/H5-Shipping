function SubmitForm(request) {
    var proNum = nlapiGetFieldValue('custpage_h5_pronum');
  var req = nlapiGetLineItemCount('custpage_sublist_id');
  for (var i = 1; i < req + 1; i++) {
      var vals = nlapiGetLineItemValue('custpage_sublist_id', 'custrecord_h5_ratepass_selected', i);
      if (vals == 'T') {
          var intId = nlapiGetLineItemValue('custpage_sublist_id', 'internalid', i);
      }
  }
  nlapiLogExecution('DEBUG', 'WhasamattaU', 'Rate Line Selected is: ' + intId);
  var recordLine = nlapiLoadRecord('customrecord_h5_ratepass_line', intId);
  var shipParentId = recordLine.getFieldValue('custrecord_h5_ratepass_shipment_id');
  var serviceLevel = recordLine.getFieldValue('custrecord_h5_service_level_desc');
  var totCost = recordLine.getFieldValue('custrecord_h5_total_shipment_cost');
  var selSCAC = recordLine.getFieldValue('custrecord_h5_scac');
    var selBatId = recordLine.getFieldValue('custrecord_h5_batch_id');
    //trim ProNumber based on Vendor
    if (selSCAC === 'YFSY'){
    proNum = proNum.slice(-10);
  } else if (selSCAC === 'CNWY'){
    proNum = proNum.slice(-1);
  }
  recordLine.setFieldValue('custrecord_h5_ratepass_selected', 'T');
  nlapiSubmitRecord(recordLine);
  nlapiLogExecution('DEBUG', 'Rate Pass Values', serviceLevel + ':' + totCost + ':' + selSCAC + ':' + selBatId);
  var shipPrec = nlapiLoadRecord('customrecord_h5_shipment', shipParentId);
  shipPrec.setFieldValue('custrecord_h5_selected_slevel', serviceLevel);
  shipPrec.setFieldValue('custrecord_h5_shipment_selcost', totCost);
    shipPrec.setFieldValue('custrecord_h5_sel_rated_batch', selBatId);
    shipPrec.setFieldValue('custrecord_h5_carrier_pro', proNum);
    var fil = new Array();
        fil[0] = new nlobjSearchFilter('custentity_h5_scac', null, 'is', selSCAC);
    var col = new Array();
        col[0] = new nlobjSearchColumn('internalid');
    var sResults = nlapiSearchRecord('vendor', null, fil, col);
    for (var i=0; i < sResults.length; i++){
        shipPrec.setFieldValue('custrecord_h5_carrier', sResults[i].getValue('internalid'));
      }
  nlapiSubmitRecord(shipPrec);
    var parTrans = nlapiLookupField('customrecord_h5_shipment', shipParentId, 'custrecord_h5_so_parent_id');
    //var postMsg = updtParTran(parTrans);
  nlapiLogExecution('DEBUG', 'NuttinU?', 'Shipment Parent Updated: ' + parTrans);
window.top.Ext.WindowMgr.getActive().close();
window.location.reload(true);
}