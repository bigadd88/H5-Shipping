function clientFieldChanged(type, name, linenum){
    console.log('You changed a field');
    if(type == 'recmachcustrecord_h5_sample_parent_id'){ //checks if the field changed is under a sublist
        if(name == 'custrecord_h5_result'){ //checks if the result changed
            var lineMin = nlapiGetCurrentLineItemValue(type, 'custrecord_h5_min');
            var lineMax = nlapiGetCurrentLineItemValue(type, 'custrecord_h5_max');
            var lineResult = nlapiGetCurrentLineItemValue(type, 'custrecord_h5_result');
            if (lineResult != "") {
                if (lineMin != "") {
                    if (Number(lineMin) <= Number(lineResult) && Number(lineResult) <= Number(lineMax)) {
                        // alert('Whew, life is good.');
                    }
                    else {
                        alert('Test value ' + lineResult + ' is outside the acceptable min/max values.  Are you sure?  This pallet will be put on Hold.');
                        // nlapiSetFieldValue('custrecord_h5_hold_status', '1');
                    }
                }
                else if (lineResult.toUpperCase() == 'P'){
                    // alert('Promise me you are not just pencil whipping this, because I am a computer and I hate pencils.');
                }
                else if(lineResult.toUpperCase() == 'F'){
                    // alert('Test Fail Noted; Pallet will be put on Hold.');
                    // nlapiSetFieldValue('custrecord_h5_hold_status', '1');
                    
                } 
                else {
                    alert('Hey, I only accept P or F');
                }
            }

            // alert('you entered ' + lineResult + ' which is between ' + lineMin + ' and ' + lineMax);

            return true;
        }
    }
    if(name == 'custrecord_h5_hold_location'){
        console.log('You changed the location field');
        alert('You changed the Hold Location.  Are you putting this on hold?  Be sure to set the Hold Status');
    }
    if(name == 'custrecord_h5_pallet'){
        console.log('You changed the pallet field');
        var palletNum = nlapiGetFieldValue('custrecord_h5_pallet');
    }
    else return true;
}

function check4PalletNumber(){
    var palletNumber = nlapiGetFieldValue('custrecord_h5_pallet');
    var inactive = nlapiGetFieldValue('isinactive');
    var userSaysDelete = nlapiGetFieldValue('custrecord_h5_bad_sample_record');
    if (palletNumber == "" && inactive == "F" && userSaysDelete == "F"){
        alert('PALLET # MISSING !!!!!!');
        return false;
    }
    return true;
}