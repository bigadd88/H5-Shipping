function createQASampleRecord(request,response){
    var woId = request.getParameter('woid');
  nlapiLogExecution('debug','Sample creation started on WO# ', woId);
    var newItemId = nlapiLookupField('workorder', woId, 'item');
    var woNumber = nlapiLookupField('workorder', woId, 'tranid');
    var lotExpirationDate = nlapiLookupField('workorder', woId, 'custbody_wcr_lot_exp_date');
    var labSample = nlapiCreateRecord('customrecord_h5_qve_sample_record');
    var itemType = nlapiLookupField('assemblyitem',newItemId,'custitemcustitemwcr_itemtype');
    var brewTestRequired = nlapiLookupField('assemblyitem',newItemId,'custitem_h5_brew_test_required');
    labSample.setFieldValue('customform', '43');
    labSample.setFieldValue('custrecord_h5_item', newItemId);
    labSample.setFieldValue('custrecord_h5_wo', woId);
    labSample.setFieldValue('custrecord_h5_item_type', itemType);
    labSample.setFieldValue('custrecord_h5_product_specs', nlapiLookupField('assemblyitem', newItemId, 'custitemwcr_productspecs'));
    labSample.setFieldValue('custrecord_h5_uom', nlapiLookupField('assemblyitem', newItemId, 'saleunit'));

    var pastSamples = nlapiSearchRecord("customrecord_h5_qve_sample_record",null,
        [
            ["custrecord_h5_wo","anyof",woId]
        ],
        [
            new nlobjSearchColumn("id").setSort(false),
            new nlobjSearchColumn("custrecord_h5_sample_type")
        ]
    );

    if (pastSamples != null){
        var testMasterLines = nlapiSearchRecord("customrecord_h5_qve_quality_check",null,
            [
                ["custrecord_h5_qc_item_parent","anyof", newItemId],
                "AND",
                ["custrecord_h5_qc_frequency","anyof","1"]
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
        labSample.setFieldValue('custrecord_h5_sample_type', '2');
    }
    else {
        var testMasterLines = nlapiSearchRecord("customrecord_h5_qve_quality_check",null,
            [
                ["custrecord_h5_qc_item_parent","anyof", newItemId],
                "AND",
                ["custrecord_h5_qc_frequency","anyof","1","2"]
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
        labSample.setFieldValue('custrecord_h5_sample_type', '1');
    }





    var labSampleId = nlapiSubmitRecord(labSample);
    //now create test lines
    for (var x = 0; x < testMasterLines.length; x++){
        var sampleLine = nlapiCreateRecord('customrecord_h5_qve_sample_test');
        sampleLine.setFieldValue('custrecord_h5_sample_parent_id', labSampleId);
        // sampleLine.setFieldValue('custrecord_h5_test_type', 1);
        sampleLine.setFieldValue('custrecord_h5_test', testMasterLines[x].getValue('custrecord_h5_qc_name'));
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

    // var brewMachines = [
    //     'Keurig 200 unit 1',
    //     'Keurig 200 unit 2',
    //     'Keurig 400 unit 1',
    //     'Keurig 400 unit 2',
    //     'Keurig K-Elite unit 1',
    //     'Keurig K-Elite unit 2',
    //     'Keurig K-Cafe unit 1',
    //     'Keurig K-Cafe unit 2',
    //     'Keurig K-Select unit 1',
    //     'Keurig K-Select unit 2'
    // ]
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