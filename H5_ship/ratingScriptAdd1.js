var ENCODEMODULE, RUNTIMEMODULE, UIMODULE, URLMODULE, DEPLOYMENT_URL;
/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 *@NModuleScope Public
 */
define(["N/encode", "N/runtime", 'N/ui/serverWidget', 'N/url'], runSuitelet);

//********************** MAIN FUNCTION **********************
function runSuitelet(encode, runtime, ui, url){
    ENCODEMODULE= encode;
    RUNTIMEMODULE= runtime;
    UIMODULE = ui;
    URLMODULE = url;
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
    bodyAreaField.defaultValue = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    bodyAreaField.defaultValue += '<script>var script = document.createElement(\'script\');script.setAttribute(\'type\', \'text/javascript\');script.appendChild(document.createTextNode(\"' + scriptToInject + '\" ));document.body.appendChild(script);</script>';
    return form;
}

/**
 * Gets HTML that will be injected into the Suitelet. Use an HTML minifier tool to achieve this one string output.
 * @returns {string} HTML String
 */




function getBody(){

    return  "<div><form id='rendered-form'><div class='rendered-form'><div class='fb-text form-group field-text-1572278306936'><label for='text-1572278306936' class='fb-text-label'>Text Field</label><input type='text' class='form-control' name='text-1572278306936' value='Ideal Express LLC Rating' id='text-1572278306936'></div><div class='fb-text form-group field-text-1572278659607'><label for='text-1572278659607' class='fb-text-label'>From Zip</label><input type='text' class='form-control' name='text-1572278659607' id='text-1572278659607'></div><div class='fb-text form-group field-text-1572278655292'><label for='text-1572278655292' class='fb-text-label'>To Zip</label><input type='text' class='form-control' name='text-1572278655292' id='text-1572278655292'></div><div class='fb-text form-group field-text-1572278661794'><label for='text-1572278661794' class='fb-text-label'>Pieces</label><input type='text' class='form-control' name='text-1572278661794' id='text-1572278661794'></div><div class='fb-text form-group field-text-1572278729290'><label for='text-1572278729290' class='fb-text-label'>Weight</label><input type='text' class='form-control' name='text-1572278729290' id='text-1572278729290'></div><div class='fb-radio-group form-group field-radio-group-1572278765240'><label for='radio-group-1572278765240' class='fb-radio-group-label'>Radio Group</label><div class='radio-group'><div class='fb-radio'><input name='radio-group-1572278765240' id='radio-group-1572278765240-0' value='option-1' type='radio'><label for='radio-group-1572278765240-0'>Full service</label></div><div class='fb-radio'><input name='radio-group-1572278765240' id='radio-group-1572278765240-1' type='radio'><label for='radio-group-1572278765240-1'>Same Day</label></div><div class='fb-radio'><input name='radio-group-1572278765240' id='radio-group-1572278765240-2' value='option-3' type='radio' checked='checked'><label for='radio-group-1572278765240-2'>Saturday</label></div><div class='fb-radio'><input name='radio-group-1572278765240' id='radio-group-1572278765240-3' type='radio'><label for='radio-group-1572278765240-3'>Am Request</label></div><div class='fb-radio'><input name='radio-group-1572278765240' id='radio-group-1572278765240-4' type='radio'><label for='radio-group-1572278765240-4'>RMA</label></div><div class='fb-radio'><input name='radio-group-1572278765240' id='radio-group-1572278765240-5' type='radio'><label for='radio-group-1572278765240-5'>BLIND</label></div></div></div><div class='fb-checkbox-group form-group field-checkbox-group-1572278901047'><label for='checkbox-group-1572278901047' class='fb-checkbox-group-label'>Checkbox Group</label><div class='checkbox-group'><div class='fb-checkbox'><input name='checkbox-group-1572278901047[]' id='checkbox-group-1572278901047-0' value='option-1' type='checkbox' checked='checked'><label for='checkbox-group-1572278901047-0'>Option 1</label></div><div class='fb-checkbox'><input name='checkbox-group-1572278901047[]' id='checkbox-group-1572278901047-1' type='checkbox'><label for='checkbox-group-1572278901047-1'></label></div><div class='fb-checkbox'><input name='checkbox-group-1572278901047[]' id='checkbox-group-1572278901047-2' type='checkbox'><label for='checkbox-group-1572278901047-2'></label></div><div class='fb-checkbox'><input name='checkbox-group-1572278901047[]' id='checkbox-group-1572278901047-3' type='checkbox'><label for='checkbox-group-1572278901047-3'></label></div><div class='fb-checkbox'><input name='checkbox-group-1572278901047[]' id='checkbox-group-1572278901047-4' type='checkbox'><label for='checkbox-group-1572278901047-4'></label></div><div class='fb-checkbox'><input name='checkbox-group-1572278901047[]' id='checkbox-group-1572278901047-5' type='checkbox'><label for='checkbox-group-1572278901047-5'></label></div></div></div></div></form></div>";

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
        $(document).ready(injectHTML); //Replaces Suitelet's body with custom HTML once the window has fully loaded(Required)
        waitForLibraries(['swal'], runCustomFunctions); //Runs additional logic after required libraries have loaded (Optional)
    });

    return;
    //*********** HELPER FUNCTIONS ***********


    /**
     * Loads Libraries that will be placed on header (Optional)
     */


    function injectHeaderScripts(){
        console.log('loadHeaderLibraries START');

         loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.4/umd/popper.min.js");  // NO EFFECTS ON DESKTOP
         loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js"); //  NO EFFECTS ON DESKTOP
         loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.8.7/js/mdb.min.js");               // NEED

         loadjscssfile("https://code.jquery.com/jquery-1.11.3.min.js"); // NO effects on DESKTOP
         loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.js"); // NEED
         loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.css"); // NEED
         loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"); // NEED FOR STYLING
         //loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap-theme.min.css");
         loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"); // NEED
         loadjscssfile("https://tstdrv1555022.app.netsuite.com/core/media/media.nl?id=7085&c=TSTDRV1555022&h=778929ae43cb92935134&_xt=.js"); // CLIENT SCRIPT

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

        // WE WILL GIVE THIS SCRIPT A PARAMETER AND SEND IT BACK HERE
        document.title = 'Rating';
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
