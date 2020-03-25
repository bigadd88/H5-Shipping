var ENCODEMODULE, RUNTIMEMODULE, UIMODULE, URLMODULE, DEPLOYMENT_URL;
/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 *@NModuleScope Public
 */
define(["N/encode", "N/runtime", 'N/ui/serverWidget', 'N/url', 'N/record'], runSuitelet);
//define(["N/encode", "N/runtime", 'N/ui/serverWidget', 'N/url', 'N/record', 'N/currentRecord', 'N/search'], runSuitelet);

//, record, currentRecord, search
// RECORD = record;
// CURRENTRECORD = currentRecord;
// SEARCH = search;

//********************** MAIN FUNCTION **********************
function runSuitelet(encode, runtime, ui, url, record){
    ENCODEMODULE= encode;
    RUNTIMEMODULE= runtime;
    UIMODULE = ui;
    URLMODULE = url;
    RECORD = record;

	var returnObj = {};
	returnObj.onRequest = execute;
	return returnObj;
}

function execute(context){
    DEPLOYMENT_URL = getDeploymentURL();

    try {
        if (context.request.method == 'GET') {
            var form = getInjectableForm();
            context.response.writePage(form);
            return;
        }

        return;
    } catch (e) {
        log.error("ERROR", e.toString());
        context.response.write(e.toString());
    }

    return;
}

function getInjectableForm(){
    //*********** Create Form ***********
    var form = UIMODULE.createForm({
            title: ' '
        });
    var bodyAreaField = form.addField({
        id : 'custpage_bodyareafield',
        type : UIMODULE.FieldType.INLINEHTML,
        label : 'Body Area Field'
    });

    //*********** Prepare HTML and scripts to Inject ***********
    var body = getBody();
    clientCode = clientCode.replace('$PAGEBODY$', body).replace('$DEPLOYMENT_URL$', DEPLOYMENT_URL);
    var base64ClientCode = toBase64(clientCode);
    var scriptToInject = 'console.log(\'Added bottom script element\');';
    scriptToInject += "eval( atob(\'" + base64ClientCode + "\') );";

    //*********** Injecting HTML and scripts into an the Body Area Field ***********
    bodyAreaField.defaultValue = '<meta name="viewport" content="width=device-width, initial-scale=1.0"><script>var script = document.createElement(\'script\');script.setAttribute(\'type\', \'text/javascript\');script.appendChild(document.createTextNode(\"' + scriptToInject + '\" ));document.body.appendChild(script);</script>';
    return form;
}

/**
 * Gets HTML that will be injected into the Suitelet. Use an HTML minifier tool to achieve this one string output.
 * @returns {string} HTML String
 */
function getBody(){
    return "<div style='width:50%' class='container-fluid'> "
        //Replace with your HTML
        //+"<div id=navi></div>"
        +"<div id=topBody>"
        //+ "<button type='button' class='btn btn-dark btn-lg btn-block' onClick='addRowButton();' >Add Row</button>"
        //
        +"<div class='card'><h3 class='card-header text-center font-weight-bold text-uppercase py-4'>Catalog</h3><div class='card-body'><div id='table' class='table'> <span class='table-add float-right mb-3 mr-2'><button class='btn btn-success btn-rounded btn-sm my-0' onClick='showInventory();'>Show Avaible Items</button></span><table id='tableInventory' class='table table-bordered table-responsive-md table-striped text-center'><thead><tr><th class='text-center'>Item</th><th class='text-center'>Quanity</th><th>Price</th><th class='text-center'>Remove</th></tr></thead><tbody id='tableBody'></tbody></table></div></div></div>"
        //+"<div class='card'><h3 class='card-header text-center font-weight-bold text-uppercase py-4'>Inventory Transfer</h3><div class='card-body'><div id='table' class='table'> <span class='table-add float-right mb-3 mr-2'><button class='btn btn-success btn-rounded btn-sm my-0' onClick='addInventoryItem();'>Add Inventory Item</button></span><table id='tableInventory' class='table table-bordered table-responsive-md table-striped text-center'><thead><tr><th class='text-center'>Inventory Item</th><th class='text-center'>Quanity</th><th class='text-center'>Remove</th></tr></thead><tbody id='tableBody'><tr><td class='pt-3-half' contenteditable='true'></td><td class='pt-3-half' contenteditable='true'></td><td> <span class='table-remove'><button type='button' onClick='removeInventory();' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr></tbody></table><div><span class='table-add float-right mb-3 mr-2'><button type='button' onClick='removeInventory();' class='btn btn-success btn-rounded btn-sm my-0'>Transfer Inventory</button></span></div></div></div></div>"
        //+"<div class='card'><h3 class='card-header text-center font-weight-bold text-uppercase py-4'>Inventory Transfer</h3><div clss='card-body'><div id='table' class='table'> <span class='table-add float-right mb-3 mr-2'><img height='42' width='42' onClick='addInventoryItem();' src='https://tstdrv1555013.app.netsuite.com/core/media/media.nl?id=1499&c=TSTDRV1555013&h=429b74c27ea03117b2b3'></img></span><table id='tableInventory' class='table table-bordered table-responsive-md table-striped text-center'><thead><tr><th class='text-center'>Inventory Item</th><th class='text-center'>Quanity</th><th class='text-center'>Remove</th></tr></thead><tbody id='tableBody'><tr><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' onClick='removeInventory();' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr><tr class='hide'><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr></tbody></table></div></div></div>"
        //+"<div class='card'><h3 class='card-header text-center font-weight-bold text-uppercase py-4'>Inventory Transfer</h3><div class='card-body'><div id='table' class='table-editable'> <span class='table-add float-right mb-3 mr-2'><a href='#!' onClick='addInventoryItem();' class='text-success'><img src='https://tstdrv1555013.app.netsuite.com/core/media/media.nl?id=1499&c=TSTDRV1555013&h=429b74c27ea03117b2b3'></img></a></span><table id='tableInventory' class='table table-bordered table-responsive-md table-striped text-center'><thead><tr><th class='text-center'>Inventory Item</th><th class='text-center'>Quanity</th><th class='text-center'>Remove</th></tr></thead><tbody><tr><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' onClick='removeInventory();' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr><tr class='hide'><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr></tbody></table></div></div></div>"
        //+"<div class='card'><h3 class='card-header text-center font-weight-bold text-uppercase py-4'>Inventory Transfer</h3><div class='card-body'><div id='table' class='table-editable'> <span class='table-add float-right mb-3 mr-2'><a href='#!' class='text-success'><img src='https://tstdrv1555013.app.netsuite.com/core/media/media.nl?id=1499&c=TSTDRV1555013&h=429b74c27ea03117b2b3'></img></a></span><table id='tableInventory' class='table table-bordered table-responsive-md table-striped text-center'><thead><tr><th class='text-center'>Inventory Item</th><th class='text-center'>Quanity</th><th class='text-center'>Remove</th></tr></thead><tbody><tr><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' onClick='removeInventory();' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr><tr class='hide'><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr></tbody></table></div></div></div>"
        //+"<div class='card'><h3 class='card-header text-center font-weight-bold text-uppercase py-4'>Inventory Transfer</h3><div class='card-body'><div id='table' class='table-editable'> <span class='table-add float-right mb-3 mr-2'><a href='#!' class='text-success'><i class='fas fa-plus fa-2x' aria-hidden='true'></i></a></span><table id='tableInventory' class='table table-bordered table-responsive-md table-striped text-center'><thead><tr><th class='text-center'>Inventory Item</th><th class='text-center'>Quanity</th><th class='text-center'>Remove</th></tr></thead><tbody><tr><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' onClick='removeInventory();' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr><tr class='hide'><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr></tbody></table></div></div></div>"
        //+"<div class='card'><h3 class='card-header text-center font-weight-bold text-uppercase py-4'>Inventory Transfer</h3><div class='card-body'><div id='inventoryTransfer' class='table-editable'><span class='table-add'><button type='button' onClick='addInventoryItem();' class='btn btn-danger btn-rounded btn-sm my-0'>ADD ITEM</button></span><table id='tableInventory' class='table table-bordered table-responsive-md table-striped text-center'><thead><tr><th class='text-center'>Inventory Item</th><th class='text-center'>Quanity</th><th class='text-center'>Remove</th></tr></thead><tbody><tr><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' onClick='removeInventory();' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr><tr class='hide'><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr></tbody></table></div></div></div>"
        //+"<div class='card'><h3 class='card-header text-center font-weight-bold text-uppercase py-4'>Inventory Transfer</h3><div class='card-body'><div id='table' class='table-editable'><span class='table-add'><button type='button' onClick='addInventoryItem();' class='btn btn-danger btn-rounded btn-sm my-0'>Add Inventory Item</button></span><table id='tableInventory' class='table table-bordered table-responsive-md table-striped text-center'><thead><tr><th class='text-center'>Inventory Item</th><th class='text-center'>Quanity</th><th class='text-center'>Remove</th></tr></thead><tbody><tr><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' onClick='removeInventory();' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr><tr class='hide'><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr></tbody></table></div></div></div>"
        //+"<div class='card'><h3 class='card-header text-center font-weight-bold text-uppercase py-4'>Inventory Transfer</h3><div class='card-body'><div id='table' class='table-editable'><span class='.table-add'><button type='button' onClick='addInventoryItem();' class='btn btn-danger btn-rounded btn-sm my-0'>Add Inventory Item</button></span><table id='tableInventory' class='table table-bordered table-responsive-md table-striped text-center'><thead><tr><th class='text-center'>Inventory Item</th><th class='text-center'>Quanity</th><th class='text-center'>Remove</th></tr></thead><tbody><tr><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' onClick='removeInventory();' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr><tr class='hide'><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr></tbody></table></div></div></div>"
        //+"<div class='card'><h3 class='card-header text-center font-weight-bold text-uppercase py-4'>Inventory Transfer</h3><div class='card-body'><div id='table' class='table-editable'> <span class='table-add float-right mb-3 mr-2'><a href='#!' class='text-success'><p>Add New Item</p></a></span><table id='tableInventory' class='table table-bordered table-responsive-md table-striped text-center'><thead><tr><th class='text-center'>Inventory Item</th><th class='text-center'>Quanity</th><th class='text-center'>Remove</th></tr></thead><tbody><tr><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' onClick='removeInventory();' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr><tr class='hide'><td class='pt-3-half' contenteditable='true'>BARCODE</td><td class='pt-3-half' contenteditable='true'>X</td><td> <span class='table-remove'><button type='button' class='btn btn-danger btn-rounded btn-sm my-0'>Remove</button></span></td></tr></tbody></table></div></div></div>"
        //+"<div class='formLabel'>Custom Form *</div> <select class='browser-default custom-select'><option selected>Custom Inventory Transfer</option><option value='1'>One</option><option value='2'>Two</option><option value='3'>Three</option> </select><div class='formLabel'>Select Date</div><div class='md-form'> <input placeholder='' type='text' id='date-picker-example' class='form-control datepicker'> <label for='date-picker-example'></label></div><div class='formLabel'>Posting Period</div> <select class='browser-default custom-select'><option selected>Open this select menu</option><option value='1'>One</option><option value='2'>Two</option><option value='3'>Three</option> </select><div class='formLabel'>Subsidiary</div> <select class='browser-default custom-select'><option selected>Open this select menu</option><option value='1'>One</option><option value='2'>Two</option><option value='3'>Three</option> </select><div class='formLabel'>Ref Number:</div><div class='formLabel'>To Be Generated</div><div class='formLabel'>Memo</div><div class='form-group'> <label for='exampleFormControlTextarea2'></label><textarea class='form-control rounded-0' id='exampleFormControlTextarea2' rows='3'></textarea></div><div class='formLabel'>From Location</div> <select class='browser-default custom-select'><option selected>Open this select menu</option><option value='1'>One</option><option value='2'>Two</option><option value='3'>Three</option> </select><div class='formLabel'>To Location</div> <select class='browser-default custom-select'><option selected>Open this select menu</option><option value='1'>One</option><option value='2'>Two</option><option value='3'>Three</option> </select><div class='formLabel'>Customer Type</div><div class='form-group'> <label for='exampleFormControlTextarea2'></label><textarea class='form-control rounded-0' id='exampleFormControlTextarea2' rows='3'></textarea></div>"
        //+"<div class='formLabel'>Customer</div> <select class='browser-default custom-select'><option selected>...</option><option value='1'>One</option><option value='2'>Two</option><option value='3'>Three</option> </select><div class='formLabel'>Select Date</div><div class='md-form'> <input placeholder='' type='text' id='date-picker-example' class='form-control datepicker'> <label for='date-picker-example'></label></div><div class='formLabel'>Posting Period</div> <select class='browser-default custom-select'><option selected>Open this select menu</option><option value='1'>One</option><option value='2'>Two</option><option value='3'>Three</option> </select><div class='formLabel'>Location</div> <select class='browser-default custom-select'><option selected>Open this select menu</option><option value='1'>One</option><option value='2'>Two</option><option value='3'>Three</option> </select>"
        +"</div>"
        +"<div id=contentToChange>"

        + "<button type='button' class='btn btn-dark btn-lg btn-block' onClick='goMenu();' >Menu Page</button>"
        + "<button type='button' class='btn btn-dark btn-lg btn-block' onClick='goReorder();' > Inventory Transfer Page</button>"
        //+"<input id='login' class='btn btn-primary' type='button' style='background-color: #E7A622 ' name='login' value='LogIn' onclick='goCatalogue();'></div>"
        //+"<div id=user class='mx-auto'></div>"
        //+"<div style='position: relative;width: 330px;height: 364px;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none;'>"
        //+"<img src='https://1212003.app.netsuite.com/core/media/media.nl?id=698005&c=1212003&h=cc55a162848b1f2662f9' style='position: absolute;left: 0;top: 0;' width=330 height=364/>"
        //+"<canvas id='signature-pad' style='position: absolute;left: 0;top: 0;width:330px;height:364px;' width=330 height=364></canvas></div>"
        //+"<div style='position: relative;width: 330px;height: 364px;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none;'>"
        //+"<img src='https://1212003.app.netsuite.com/core/media/media.nl?id=698005&c=1212003&h=cc55a162848b1f2662f9' style='position: absolute;left: 0;top: 0;' width=330 height=364/>"
       // +"<canvas id='signature-pad' style='position: absolute;left: 0;top: 0;width:330px;height:364px;' width=330 height=364></canvas></div>"
       // +"<div><button id='save'>Save</button><button id='clear'>Clear</button></div>"
        +"</div>"
        //+"<script>const $tableID=$('#table');const $BTN=$('#export-btn');const $EXPORT=$('#export');const newTr=`<tr class='hide'><td class='pt-3-half'contenteditable='true'>Example</td><td class='pt-3-half'contenteditable='true'>Example</td><td class='pt-3-half'contenteditable='true'>Example</td><td class='pt-3-half'contenteditable='true'>Example</td><td class='pt-3-half'contenteditable='true'>Example</td><td class='pt-3-half'><span class='table-up'><a href='#!'class='indigo-text'><i class='fas fa-long-arrow-alt-up'aria-hidden='true'></i></a></span><span class='table-down'><a href='#!'class='indigo-text'><i class='fas fa-long-arrow-alt-down'aria-hidden='true'></i></a></span></td><td><span class='table-remove'><button type='button'class='btn btn-danger btn-rounded btn-sm my-0 waves-effect waves-light'>Remove</button></span></td></tr>`;$('.table-add').on('click','i',()=>{const $clone=$tableID.find('tbody tr').last().clone(true).removeClass('hide table-line');if($tableID.find('tbody tr').length===0){$('tbody').append(newTr);} $tableID.find('table').append($clone);});$tableID.on('click','.table-remove',function(){$(this).parents('tr').detach();});$tableID.on('click','.table-up',function(){const $row=$(this).parents('tr');if($row.index()===1){return;} $row.prev().before($row.get(0));});$tableID.on('click','.table-down',function(){const $row=$(this).parents('tr');$row.next().after($row.get(0));});jQuery.fn.pop=[].pop;jQuery.fn.shift=[].shift;$BTN.on('click',()=>{const $rows=$tableID.find('tr:not(:hidden)');const headers=[];const data=[];$($rows.shift()).find('th:not(:empty)').each(function(){headers.push($(this).text().toLowerCase());});$rows.each(function(){const $td=$(this).find('td');const h={};headers.forEach((header,i)=>{h[header]=$td.eq(i).text();});data.push(h);});$EXPORT.text(JSON.stringify(data));});</script>"
        + "</div>";
}







var clientCode  = 'run(); ' + function run() {
    console.log('Running client code');

    //*********** GLOBAL VARIABLES ***********
    $ = jQuery;
    DEPLOYMENT_URL = '$DEPLOYMENT_URL$';
    THISURL = $(location).attr('href');

    //*********** After DOM loads run this: ***********
    $(function() {
        injectHeaderScripts(); //Loads Libraries that will be placed on header (Optional)
        $(window).bind('load', injectHTML); //Replaces Suitelet's body with custom HTML once the window has fully loaded(Required)
        waitForLibraries(['swal'], runCustomFunctions); //Runs additional logic after required libraries have loaded (Optional)
        $tableID.on('click', '.table-remove', function () {

            $(this).parents('tr').detach();
          });
    });

    return;
    //*********** HELPER FUNCTIONS ***********


    /**
     * Loads Libraries that will be placed on header (Optional)
     */
    function injectHeaderScripts(){
        console.log('loadHeaderLibraries START');
        loadjscssfile("https://code.jquery.com/jquery-1.11.3.min.js");
        //Added next line to try and link inventory transfer
        loadjscssfile("https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js")
        loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.js");
        loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.css");
        loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css");
        //loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap-theme.min.css");
        loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js");
        //loadjscssfile("https://3617346-sb1.app.netsuite.com/core/media/media.nl?id=5083710&c=3617346_SB1&h=c2beb88cd512491b990d&_xt=.css")
        loadjscssfile("https://tstdrv1555013.app.netsuite.com/core/media/media.nl?id=1490&c=TSTDRV1555013&h=67e749fc88c5610fbdac&_xt=.js");
        loadjscssfile("https://cdn.jsdelivr.net/npm/signature_pad@2.3.2/dist/signature_pad.min.js");
        console.log('loadHeaderLibraries END');

        //*********** HELPER FUNCTION ***********
         function loadjscssfile(filename) {
            var filetype = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
            if (filetype == "js") { //if filename is a external JavaScript file
                var fileref = document.createElement('script')
                fileref.setAttribute("type", "text/javascript")
                fileref.setAttribute("src", filename)
            } else if (filetype == "css") { //if filename is an external CSS file
                var fileref = document.createElement("link")
                fileref.setAttribute("rel", "stylesheet")
                fileref.setAttribute("type", "text/css")
                fileref.setAttribute("href", filename)
            }
            if (typeof fileref != "undefined"){
                document.getElementsByTagName("head")[0].appendChild(fileref)
            }
            console.log(filename + ' plugin loaded');
        }
    }

    function runCustomFunctions() {
        console.log('clientFunctions START');
        var DEPLOYMENT_URL = '$DEPLOYMENT_URL$';
        //swal('Page Load Complete', 'Welcome to OWMS', "success");
        buildNav();
        placeCust();
        signaturePadClient();
       // goCatalogue();
       //inventoryTransfer();
       //showInventory();


    }

    function waitForLibraries(libraries, functionToRun){
        var loadedLibraries = 0;
        for (var i in libraries) {
            var library = libraries[i];
            if(eval('typeof ' + library)!='undefined'){
                loadedLibraries++;
            }
        }

        window.setTimeout(function(){
            if(loadedLibraries != libraries.length){
                waitForLibraries(libraries, functionToRun);
            } else{
                console.log(library + ' loaded');
                functionToRun();
            }
          },500);
    }

    function injectHTML(){
        var html = ' $PAGEBODY$ '; //This string will be replaced by the Suitelet
        jQuery("#main_form")[0].outerHTML = html;
    }
}

/**
 * Gets deployment URL. Useful for sending POST requests to this same suitelet.
 * @returns {string} Deployment URL
 */
function getDeploymentURL(){
    return URLMODULE.resolveScript({
        scriptId: RUNTIMEMODULE.getCurrentScript().id,
        deploymentId: RUNTIMEMODULE.getCurrentScript().deploymentId,
        returnExternalUrl: false,
    });
}

function toBase64(stringInput){
    return ENCODEMODULE.convert({
        string: stringInput,
        inputEncoding: ENCODEMODULE.Encoding.UTF_8,
        outputEncoding: ENCODEMODULE.Encoding.BASE_64
    });
}

function getToday(){
    var todayDate = new Date();
    var dateField = document.getElementById('logindate');
    dateField.placeholder = todayDate;
}

