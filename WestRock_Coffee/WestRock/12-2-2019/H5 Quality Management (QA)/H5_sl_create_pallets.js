function createPallets(request, response) {
    if (request.getMethod() == 'GET') {
        var recId = request.getParameter('recName');
        var workOrderNumber = nlapiLookupField('workorder', recId, 'tranid');
        var workOrderQuantity = nlapiLookupField('workorder', recId, 'quantity');
        var workOrderDate = nlapiLookupField('workorder', recId, 'trandate');

        //correct date to get MMDDYYYY format
        date = workOrderDate.split('/');
        var month = date[0].length==1 ? "0"+date[0] : date[0];
        var day = date[1].length==1 ? "0"+date[1] : date[1];
        var year = date[2].substr(2,2);
        var workOrderDate = month + day + year;

        var itemId = nlapiLookupField('workorder', recId, 'item');
        var itemName = nlapiLookupField('item', itemId, 'name');
        var caseCount = nlapiLookupField('item', itemId, 'custitemcustitemwcr_casecountperpallet');
        if (caseCount == ""){caseCount = 24};

        var tiHi = nlapiLookupField('item', itemId, 'custitemcustitemwcr_tihi');
        var itemDisplayName = nlapiLookupField('item', itemId, 'displayname');




        var findExistingPallets = nlapiSearchRecord("customrecord_h5_pallet",null,
            [
                // ["custrecord_h5_pallet_work_order","anyof", 2871501]
                    ["custrecord_h5_pallet_work_order","anyof", recId]
            ],
            [
                new nlobjSearchColumn("custrecord_h5_pallet_number", null, "MAX")
            ]
        );
        var highestNumber = findExistingPallets[0].getValue('custrecord_h5_pallet_number', null, 'MAX');
        if (highestNumber != ""){
            
            var numSegment = highestNumber.split('-');
            var num = Number(numSegment[1]) + 1;
            if (num < 10){
                newNumber = '00' + num.toString();
            }
            else {
                newNumber = '0' + num.toString();
            }


            var palletNumber = workOrderDate + '-' + newNumber + '-' + workOrderNumber;
            var pallet = nlapiCreateRecord('customrecord_h5_pallet');
            pallet.setFieldValue('name', palletNumber);
            pallet.setFieldValue('custrecord_h5_pallet_number', palletNumber);
            pallet.setFieldValue('custrecord_h5_pallet_item_parent', itemId);
            pallet.setFieldValue('custrecord_h5_pallet_work_order', recId);
            pallet.setFieldValue('custrecord_h5_pallet_quantity', Number(caseCount));
            pallet.setFieldValue('custrecord_h5_pallet_status', 1);
            pallet.setFieldValue('custrecord_h5_pallet_ti_hi', tiHi);
            pallet.setFieldValue('custrecord_h5_pallet_case_count', Number(caseCount));
            pallet.setFieldValue('custrecord_h5_pallet_weight', 1000);
            var newPalletId = nlapiSubmitRecord(pallet);
            response.write('Pallets were previously created. 1 new pallet added.');
        }
        else {

            var palletsToCreate = 5 + Math.ceil(Number(workOrderQuantity) / Number(caseCount));
            if (palletsToCreate < 5 || palletsToCreate > 50){
                palletsToCreate = 30;
            }
            var newNumber2 = '';
            for (var x = 0; x < palletsToCreate; x++) {
                var num = x + 1;
                if (num < 10){
                    newNumber2 = '00' + num.toString();
                }
                else {
                    newNumber2 = '0' + num.toString();
                }
                var palletNumber = workOrderDate + '-' + newNumber2 + '-' + workOrderNumber;
                var pallet = nlapiCreateRecord('customrecord_h5_pallet');
                pallet.setFieldValue('name', palletNumber);
                pallet.setFieldValue('custrecord_h5_pallet_number', palletNumber);
                pallet.setFieldValue('custrecord_h5_pallet_item_parent', itemId);
                pallet.setFieldValue('custrecord_h5_pallet_work_order', recId);
                pallet.setFieldValue('custrecord_h5_pallet_quantity', Number(caseCount));
                pallet.setFieldValue('custrecord_h5_pallet_status', 1);
                pallet.setFieldValue('custrecord_h5_pallet_ti_hi', tiHi);
                pallet.setFieldValue('custrecord_h5_pallet_case_count', Number(caseCount));
                pallet.setFieldValue('custrecord_h5_pallet_weight', 1000);
                var newPalletId = nlapiSubmitRecord(pallet);
            }
            response.write('Created ' + palletsToCreate + ' Pallets.');
        }

    }
}