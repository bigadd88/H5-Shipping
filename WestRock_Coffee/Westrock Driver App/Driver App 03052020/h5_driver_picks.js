function getPicks(request, response){
    empId = request.getParameter('empId')
    var pickSearch = nlapiSearchRecord("customrecord_h5_driver_pick",null,
                [
                ["custrecord_h5_pick_driver","anyof",empId]
                ], 
                [
                new nlobjSearchColumn("name").setSort(false), 
                new nlobjSearchColumn("scriptid"), 
                new nlobjSearchColumn("custrecord_h5_pick_driver"), 
                new nlobjSearchColumn("custrecord_h5_pick_location"), 
                new nlobjSearchColumn("custrecord_h5_pick_status"), 
                new nlobjSearchColumn("custrecord_h5_pick_data")
                ]
                );
    obj = {
        'data': pickSearch[0].getValue('custrecord_h5_pick_data')
    }

    response.write(JSON.stringify(obj));

}