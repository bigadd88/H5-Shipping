function aftsubShipment() {
    if (type == 'delete' || type == 'create') {
    } else {
        var sampleId = nlapiGetRecordId();
        var sampleRecType = nlapiGetRecordType();
        var sampleRec = nlapiLoadRecord(sampleRecType, sampleId);
        var inactive = sampleRec.getFieldValue('isinactive');
        nlapiLogExecution('debug', 'inactive value', inactive);
        if (inactive != "T") {
            var testLines = nlapiSearchRecord("customrecord_h5_qve_sample_test", null,
                [
                    ["custrecord_h5_sample_parent_id", "anyof", sampleId]
                ],
                [
                    new nlobjSearchColumn("id").setSort(false),
                    new nlobjSearchColumn("custrecord_h5_sample_parent_id"),
                    new nlobjSearchColumn("custrecord_h5_result"),
                    new nlobjSearchColumn("custrecord_h5_test"),
                    new nlobjSearchColumn("custrecord_h5_target"),
                    new nlobjSearchColumn("custrecord_h5_uom_test"),
                    new nlobjSearchColumn("custrecord_h5_frequency"),
                    new nlobjSearchColumn("custrecord_h5_value_type"),
                    new nlobjSearchColumn("custrecord_h5_min"),
                    new nlobjSearchColumn("custrecord_h5_max")
                ]
            );


            // var sampleRec.lineitems.recmachcustrecord_h5_sample_parent_id = 'sampleRec.lineitems.recmachcustrecord_h5_sample_parent_id';
            var resultsEntered = 0;
            for (i = 0; i < testLines.length; i++) {
                if (testLines[i].getValue('custrecord_h5_result') != "") {
                    // console.log(testLines[i].getValue('custrecord_h5_result'));
                    resultsEntered++;
                }
            }
            var brewLines = nlapiSearchRecord("customrecord_h5_qve_brew_test", null,
                [
                    ["custrecord_h5_brew_sample_parent", "anyof", sampleId]
                ],
                [
                    new nlobjSearchColumn("id").setSort(false),
                    new nlobjSearchColumn("custrecord_h5_brew_sample_parent"),
                    new nlobjSearchColumn("custrecord_h5_brew_machine"),
                    new nlobjSearchColumn("custrecord_h5_brew_result")
                ]
            );
            //adding check in case there are no brew results
            var brewLinesReturned = 0;
            var brewsRecorded = 0;
            if (brewLines != null) {
                for (x = 0; x < brewLines.length; x++) {
                    if (brewLines[x].getValue('custrecord_h5_brew_result') != "") {
                        brewsRecorded++;
                    }
                    brewLinesReturned = brewLines.length;
                }
            } else {
                brewsRecorded = 1;
                brewLinesReturned = 1;

            }


            if (resultsEntered + brewsRecorded == testLines.length + brewLinesReturned) {
                nlapiLogExecution('debug', 'resultsEntered', resultsEntered);
                sampleRec.setFieldValue('custrecord_h5_testing_status', '2');

                nlapiSubmitRecord(sampleRec);
            }
        }
    }
}