function Before_Load(type, form) {
    if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
        //AddPackagesButton(form);
        AddLabel1Button(form);
        AddLabel2Button(form);
        //AddP44RatesButton(form);
        nlapiLogExecution('debug','buttons defined','buttons defined');
    }
}

function AddLabel1Button(form){
    form.setScript('customscript_h5_shipmentline_blue');
    form.addButton('custpage_label1Button', 'Box Label', 'printboxlabel()');
    nlapiLogExecution('debug','Box Label','trggered');
}

function AddLabel2Button(form){
    form.setScript('customscript_h5_shipmentline_blue');
    form.addButton('custpage_label2Button', 'Pallet Label', 'printpalletlabel()');
}

function printboxlabel(){
    var shipLineId = nlapiGetRecordId();
    nlapiLogExecution('debug','Box Label on shiplineId ','shipLineId');
    console.log('box label ');
    var labelId = nlapiLookupField('customrecord_h5_shipment_line',shipLineId,'custrecord_h5_label_box');
    var scriptId = nlapiLookupField('customrecord_h5_label',labelId,'custrecord_h5_label_script_id');
    var deployId = nlapiLookupField('customrecord_h5_label',labelId,'custrecord_h5_label_deploy_id');
    var recName = nlapiLookupField('customrecord_h5_shipment_line',shipLineId,'custrecord_h5_shipment_parent');
    var url = nlapiResolveURL('SUITELET', scriptId, deployId);
    url += '&recName=' + shipLineId,
        window.open(url);
}

function printpalletlabel(){
    var shipLineId = nlapiGetRecordId();
    var labelId = nlapiLookupField('customrecord_h5_shipment_line',shipLineId,'custrecord_h5_label_pallet');
    var scriptId = nlapiLookupField('customrecord_h5_label',labelId,'custrecord_h5_label_script_id');
    var deployId = nlapiLookupField('customrecord_h5_label',labelId,'custrecord_h5_label_deploy_id');
    var recName = nlapiLookupField('customrecord_h5_shipment_line',shipLineId,'custrecord_h5_shipment_parent');
    var url = nlapiResolveURL('SUITELET', scriptId, deployId);
    url += '&recName=' + shipLineId,
        window.open(url);
}