function beforeLoad(type, form){
    if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
        var currentRecordId = nlapiGetRecordId();
    }

    addCostHistoryButton(form);

}

function addCostHistoryButton(form){
    form.setScript('customscript_h5_item_blue');
    form.addButton('custpage_costhistory', 'H5-Cost History', 'AssemblyIndex()');
}

function AssemblyIndex(){
    var recId = nlapiGetRecordId();
    var url = nlapiResolveURL('SUITELET', 'customscript_h5_wo_to_assembly', 'customdeploy_h5_wo_to_assembly');
    url += '&woid=' + recId,
        window.open(url);
}