function beforeLoad(type, form){
    if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
        var currentRecordId = nlapiGetRecordId();
    }

    addAssemblyAuditButton(form);

}

function addAssemblyAuditButton(form){
    form.setScript('customscript_h5_assemblybuild_blue');
    form.addButton('custpage_audit', 'H5-Yield Audit', 'AssemblyAudit()');
}

function AssemblyAudit(){
    var recId = nlapiGetRecordId();
    var url = nlapiResolveURL('SUITELET', 'customscript_h5_assembly_audit', 'customdeploy_h5_assembly_audit');
    url += '&assemblybuild=' + recId,
        window.open(url);
}