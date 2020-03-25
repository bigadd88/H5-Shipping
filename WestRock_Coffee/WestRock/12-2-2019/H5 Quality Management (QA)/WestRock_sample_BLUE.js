function beforeLoad(type, form){
    // if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
    // 	var currentRecordId = nlapiGetRecordId();
    //
    //
    // }
    addDeleteButton(form);
}

function addDeleteButton(form){
    form.setScript('customscript_h5_ue_sample_blue');
    form.addButton('custpage_deletesample', 'Delete Sample', 'deleteSample()');
}

function deleteSample() {
    nlapiLogExecution('debug','starting delete');
    var sampleId = nlapiGetRecordId();
    // var sampleId = 3515;
    var labTests = nlapiSearchRecord("customrecord_h5_qve_sample_test",null,
        [
            ["custrecord_h5_sample_parent_id","anyof",sampleId]
        ],
        [
            new nlobjSearchColumn("id").setSort(false),
        ]
    );
    if (labTests != null){
        for (i=0;i<labTests.length;i++){
            nlapiDeleteRecord('customrecord_h5_qve_sample_test', labTests[i].getValue('id'));
        }
    }
    var brewTests = nlapiSearchRecord("customrecord_h5_qve_brew_test",null,
        [
            ["custrecord_h5_brew_sample_parent","anyof",sampleId]
        ],
        [
            new nlobjSearchColumn("id").setSort(false),
        ]
    );
    if (brewTests != null){
        for (i=0;i<labTests.length;i++){
            nlapiDeleteRecord('customrecord_h5_qve_brew_test', brewTests[i].getValue('id'));
        }
    }
    nlapiDeleteRecord('customrecord_h5_qve_sample_record', sampleId);
    window.location = 'https://1212003.app.netsuite.com/app/center/card.nl?sc=27&whence=';
}