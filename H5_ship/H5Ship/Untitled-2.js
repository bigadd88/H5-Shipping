var SEARCHMODULE, UIMODULE;
 
/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 *@NModuleScope Public
 */
define(['N/search', 'N/ui/serverWidget'], runSuitelet);
 
//********************** MAIN FUNCTION **********************
function runSuitelet(search, ui){
	SEARCHMODULE = search;
	UIMODULE = ui;
    
	var returnObj = {};
	returnObj.onRequest = execute;
	return returnObj;
}
 
function execute(context){
	//SEARCHMODULE.load(123);
	if (context.request.method == 'GET') {
		context.response.write('Hello World'); //Example writing HTML string
		return;
	} else {
		var form = UIMODULE.createForm({ title: 'Demo Suitelet Form' }); //Example writing form object
		context.response.writePage(form);
	}
}


var SEARCHMODULE, UIMODULE;
/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 *@NModuleScope Public
 *@Authors Addison and Sam
 */
define(['N/search', 'N/record Module', 'N/ui/serverWidget', 'N/http'], search, record, runSuitelet, http);

function runSuitelet(search, ui){
	SEARCHMODULE = search;
    UIMODULE = ui;
    
    //load the current cord ** Shipment record
    var cr = require("N/currentRecord");
    var record = cr.get();
    var pkgcount = [];
    var nmfcNum = [];
    var nmfcShortLine = [];
    var pkgFreightClass = [];
    var packType = [];
    var pkgNumber = [];
    var pkgWeight = [];
    var pkgnmfcLineNum = [];
    var pkgLength = [];
    var pkgWidth = [];
    var pkgHeight = [];

    
    
    var fill = [];

    var mycustomRecSearch = search.create({
        type: search.Type.CUSTOM_RECORD + '112',
        title: 'Shipment custom record search',
        columns: ['custrecord_h5_hazmat', 'custrecord_h5_nmfc_number']
    })

    var myCustomRecordSearch = search.create({
        type: search.Type.CUSTOM_RECORD + '6';
        title: 'My Search Title',
        columns: ['custrecord1']
    }).run().each(function(result) {
        // Process each result
        return true;
    });
});

    var mySearchFilter = search.createFilter({
        name: 'entity',
        operator: search.Operator.ISEMPTY,
    });


    new nolobjSearchFilter(
        filterId,
        joinId,
        operator,
        value1,
        value2
    );

    s.createFilter({
        name: String,
        join: String,
        operator: search.Operator,
        value: any | any[],
        formula: String,
        summary: search.Summary
    });






























    // var salesRepId = record.getValue({
    //     fieldId: "salesrep"
    // });



    // var salesRepRec = r.load({
    //     type: r.Type.EMPLOYEE,
    //     id: salesRepId,
    //     isDynamic: false,
    //     defaultValues: null
    // });
    
    // var salesRepEmail = salesRepRec.getValue({
    //     fieldId: "email"
    // });
    
    // if (salesRepEmail) {
    //     sendAwesomeNotification(salesRepEmail);
    // }
















	var returnObj = {};
	returnObj.onRequest = execute;
	return returnObj;
}
