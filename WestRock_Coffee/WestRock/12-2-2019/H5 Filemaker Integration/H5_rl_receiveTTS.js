    // Purpose - recieves json from Filemaker and creates TTS Greenlot records
    function restfulJSONParser(data) {
        nlapiLogExecution('debug','script invoked', 'started');
        //parse data from object
        // var temp = JSON.stringify(data);
        // var jsdata = JSON.parse(temp2);
        // toSlack(temp);
        var ICOtemp = data['ICO Number'];
        var ICOfixed = ICOtemp.replace(/,/g,' -');
        billOfLading = data['Bill of Lading #'];

        var existingMovement = nlapiSearchRecord("customrecord_h5_tts_green_lot_movement",null,
            [
                ["custrecord_h5_bl_number_movement","is",billOfLading]
            ],
            [
                new nlobjSearchColumn("custrecord_h5_bl_number_movement")
            ]
        );
        if(existingMovement == null){
            nlapiLogExecution('debug','New BOL, proceed', 'creating ' +billOfLading);
        var logFile = nlapiCreateFile(billOfLading + '.json', 'JSON', data);
        logFile.setFolder(289306);
        var newLogFileId = nlapiSubmitFile(logFile);
        //First create the movement record
        var movementRec = nlapiCreateRecord('customrecord_h5_tts_green_lot_movement');
        movementRec.setFieldValue('custrecord_h5_bl_number_movement', data['Bill of Lading #']);
        movementRec.setFieldValue('custrecord_h5_move_sref', data['S Ref']);
        movementRec.setFieldValue('custrecord_h5_move_mill2port', data['Date Shipped from Dry Mill to Port']); //date field
        movementRec.setFieldValue('custrecord_h5_move_transportco_mill2port', data['Transportation Company from Dry Mill to Port']);
        movementRec.setFieldValue('custrecord_h5_move_origin_port', data['Port of Loading']);
        movementRec.setFieldValue('custrecord_h5_move_date_receivedatport', data['Date Container Received at Port']); //date field
        movementRec.setFieldValue('custrecord_h5_move_date_containerships', data['Date Container Ships']); //date field
        movementRec.setFieldValue('custrecord_h5_move_marineshipper', data['Name of Marine Shipper']);
        movementRec.setFieldValue('custrecord_h5_move_date_arrivesinusport', data['Date Arrives in Port in US']); //date field
        movementRec.setFieldValue('custrecord_h5_move_us_port', data['Destination']);
        movementRec.setFieldValue('custrecord_h5_move_date_arrivedinwh', data['Date Arrived in Warehouse']); //date field
        movementRec.setFieldValue('custrecord_h5_move_destinationwh', data['Destination Warehouse']);
        movementRec.setFieldValue('custrecord_h5_move_ico', ICOfixed);
        movementRec.setFieldValue('custrecord_h5_move_origin_country', data['Origin']);
        var newMovementRecId = nlapiSubmitRecord(movementRec);
        nlapiLogExecution('debug','Movement Record Created', 'internal id: ' + newMovementRecId);
        //Now create CSV and trigger CSV Import of bulk farmer contribution data
        var str = 'S Ref,ICO Number,Lot ID,Blueprint Farmer ID,Farmer ID,Farmer Name,Cooperative,Dry Parchment Kgs,Estimated Green Kgs,Amount Paid,Currency Paid,Date Paid,Total USD,Volume Contributed to Lot,Origin,BL Number\n';
        for(i=0; i < data.ContributionArray.length; i++){
            str += data['S Ref'] + ',';
            str += ICOfixed + ',';
            str += ICOfixed + ',';
            str += data.ContributionArray[i]['Blueprint Farmer ID | Falcon use only'] + ',';
            str += data.ContributionArray[i]['Farmer ID'] + ',';
            str += data.ContributionArray[i]['Farmer Name'] + ',';
            if(data.ContributionArray[i]['Cooperative/Farmer Group Name (if applicable)'] == ""){
                str += 'not provided,';
            } else {
            str += data.ContributionArray[i]['Cooperative/Farmer Group Name (if applicable)'] + ',';
            }
            str += data.ContributionArray[i]['Dry Parchment Delivered (Kgs)'] + ',';
            str += data.ContributionArray[i]['Green Delivered (Kgs)'] + ',';
            str += data.ContributionArray[i]['Amount Paid'] + ',';
            str += data.ContributionArray[i]['Currency Paid'] + ',';
            str += data.ContributionArray[i]['Date Paid'] + ',';
            str += data.ContributionArray[i]['Total USD'] + ',';
            str += data.ContributionArray[i]['Volume Contributed to Lot'] + ',';
            str += data['Origin'] + ',';
            str += data['Bill of Lading #'] + '\n';
        }
        // var newEmail = nlapiSendEmail(11689, 'robert@habit5.com', 'Sample email and attachment', str, null, null, null, null);
        var csvFile = nlapiCreateFile(billOfLading + '.csv', 'CSV', str);
        csvFile.setFolder(289306);
        var newFileId = nlapiSubmitFile(csvFile);

        // var newEmail = nlapiSendEmail(11689, 'robert@habit5.com', 'JSON Data', temp, null, null, null, null);
        var newEmail = nlapiSendEmail(11689, 'robert@habit5.com,logistics@falconcoffees.com,katie@falconcoffees.com', 'TTS Green Lot being Imported', '', null, null, null, csvFile);

        var import1 = nlapiCreateCSVImport();
        import1.setMapping('custimport_h5_tts_viascript');
        import1.setPrimaryFile(nlapiLoadFile(newFileId));
        nlapiSubmitCSVImport(import1);
        nlapiLogExecution('debug','script invoked', 'finished');
        // toSlack(str);
        return (200);
        }
        else {
            nlapiLogExecution('debug','duplication BOL dedected', billOfLading + ' already in database');
            return (400);
        }
    }

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    function subDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    }
    function toSlack(data){
        var slackRawMessage1 = {
            "text": ' ' + data + ' '
        }
        var slackMessage1 = JSON.stringify(slackRawMessage1);
        var slackResponse = nlapiRequestURL('https://hooks.slack.com/services/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', slackMessage1, 'Content-type: application/json');
    }