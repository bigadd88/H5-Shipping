function createTimeIntervalQASampleRecord(request,response){
    var woId = request.getParameter('woid');
    var newItemId = nlapiLookupField('workorder', woId, 'item');
    var woNumber = nlapiLookupField('workorder', woId, 'tranid');
    var lotExpirationDate = nlapiLookupField('workorder', woId, 'custbody_wcr_lot_exp_date');
    var itemType = nlapiLookupField('assemblyitem',newItemId,'custitemcustitemwcr_itemtype');
    var brewTestRequired = nlapiLookupField('assemblyitem',newItemId,'custitem_h5_brew_test_required');
    var testMasterLines = nlapiSearchRecord("customrecord_h5_qve_quality_check",null,
        [
            ["custrecord_h5_qc_item_parent","anyof", newItemId],
            "AND",
            ["custrecord_h5_qc_frequency","anyof","3"]
        ],
        [
            new nlobjSearchColumn("id"),
            new nlobjSearchColumn("custrecord_h5_qve_check_sort_order").setSort(false),
            new nlobjSearchColumn("custrecord_h5_qc_item_parent"),
            new nlobjSearchColumn("custrecord_h5_qc_name"),
            new nlobjSearchColumn("custrecord_h5_qc_target"),
            new nlobjSearchColumn("custrecord_h5_qc_frequency"),
            new nlobjSearchColumn("custrecord_h5_qv_value_type"),
            new nlobjSearchColumn("custrecord_h5_qc_uom"),
            new nlobjSearchColumn("custrecord_h5_qc_min"),
            new nlobjSearchColumn("custrecord_h5_qc_max")
        ]
    );
    var labSample = nlapiCreateRecord('customrecord_h5_qve_sample_record');
    labSample.setFieldValue('customform', '43');
    labSample.setFieldValue('custrecord_h5_item', newItemId);
    labSample.setFieldValue('custrecord_h5_wo', woId);
    labSample.setFieldValue('custrecord_h5_item_type', itemType);
    labSample.setFieldValue('custrecord_h5_product_specs', nlapiLookupField('assemblyitem', newItemId, 'custitemwcr_productspecs'));
    labSample.setFieldValue('custrecord_h5_uom', nlapiLookupField('assemblyitem', newItemId, 'saleunit'));
    labSample.setFieldValue('custrecord_h5_sample_type', '3');
    var labSampleId = nlapiSubmitRecord(labSample);
    //now create test lines
    for (var x = 0; x < testMasterLines.length; x++){
        var sampleLine = nlapiCreateRecord('customrecord_h5_qve_sample_test');
        sampleLine.setFieldValue('custrecord_h5_sample_parent_id', labSampleId);
        sampleLine.setFieldValue('custrecord_h5_test_type', 3);
        sampleLine.setFieldValue('custrecord_h5_test', testMasterLines[x].getValue('custrecord_h5_qc_name'));
        // console.log(testMasterLines[x].getValue('custrecord_h5_qc_name'));
        // test.push(testMasterLines[x].getValue('custrecord_h5_qc_name'));
        var temp = testMasterLines[x].getValue('custrecord_h5_qc_name');
        if (temp.indexOf('Date') > -1){
            sampleLine.setFieldValue('custrecord_h5_target', lotExpirationDate + ' ' + woNumber);
        }
        else {
        sampleLine.setFieldValue('custrecord_h5_target', testMasterLines[x].getValue('custrecord_h5_qc_target'));
        }
        sampleLine.setFieldValue('custrecord_h5_frequency', testMasterLines[x].getValue('custrecord_h5_qc_frequency'));
        sampleLine.setFieldValue('custrecord_h5_value_type', testMasterLines[x].getValue('custrecord_h5_qv_value_type'));
        sampleLine.setFieldValue('custrecord_h5_uom_test', testMasterLines[x].getValue('custrecord_h5_qc_uom'));
        sampleLine.setFieldValue('custrecord_h5_min', testMasterLines[x].getValue('custrecord_h5_qc_min'));
        sampleLine.setFieldValue('custrecord_h5_max', testMasterLines[x].getValue('custrecord_h5_qc_max'));
        nlapiSubmitRecord(sampleLine);
    }
    if (brewTestRequired == "T") {
        var brewMachines = [
            'Lane 1',
            'Lane 2',
            'Lane 3',
            'Lane 4',
            'Lane 5',
            'Lane 6',
            'Lane 7',
            'Lane 8',
            'Lane 9',
            'Lane 10'
        ]
        for (var x = 0; x < brewMachines.length; x++) {
            var sampleLine = nlapiCreateRecord('customrecord_h5_qve_brew_test');
            sampleLine.setFieldValue('custrecord_h5_brew_sample_parent', labSampleId);
            sampleLine.setFieldValue('custrecord_h5_brew_machine', brewMachines[x]);
            // console.log(brewMachines[x]);
            nlapiSubmitRecord(sampleLine);
        }
    }
    // alert('Sample Record: created with ' + testMasterLines.length + ' quality check requirements');





    response.write(labSampleId);

}