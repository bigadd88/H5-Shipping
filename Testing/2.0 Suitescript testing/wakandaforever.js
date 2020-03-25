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
 //

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

    // Addison ship rate HTML return  "<div class='card'><h5 class='card-header info-color white-text text-center py-4'> <strong>Create Assembly Item</strong></h5><div class='card-body px-lg-5 pt-0'><form class='md-form' style='color: #757575;'> <input type='text' id='fromZip' class='form-control'> <label for='materialContactFormName'>From Zip</label><input type='email' id='toZip' class='form-control'> <label for='materialContactFormEmail'>To Zip</label> <input type='text' id='pieces' class='form-control'> <label for='materialContactFormName'>Pieces</label><input type='email' id='weight' class='form-control'> <label for='materialContactFormEmail'>Weight</label><div class='form-check'> <input type='checkbox' class='form-check-input' id='materialContactFormCopy'> <label class='form-check-label' for='materialContactFormCopy'>Full Service</label></div><div class='form-check'> <input type='checkbox' class='form-check-input' id='materialContactFormCopy'> <label class='form-check-label' for='materialContactFormCopy'>Same Day</label></div><div class='form-check'> <input type='checkbox' class='form-check-input' id='materialContactFormCopy'> <label class='form-check-label' for='materialContactFormCopy'>Saturday</label></div><div class='form-check'> <input type='checkbox' class='form-check-input' id='materialContactFormCopy'> <label class='form-check-label' for='materialContactFormCopy'>AM Request</label></div><div class='form-check'> <input type='checkbox' class='form-check-input' id='materialContactFormCopy'> <label class='form-check-label' for='materialContactFormCopy'>RMA</label></div><div class='form-check'> <input type='checkbox' class='form-check-input' id='materialContactFormCopy'> <label class='form-check-label' for='materialContactFormCopy'>Blind</label></div> <button class='btn btn-outline-info btn-rounded btn-block z-depth-0 my-4 waves-effect' type='submit'>Submit</button></form></div></div>";

  return "<div class='card'><h5 class='card-header info-color white-text text-center py-4'> <strong>Create Assembly Items</strong></h5><div class='card-body px-lg-5 pt-0'><form class='md-form' style='color: #757575;'> <label for='materialContactFormName'>New Item Number</label> <input type='text' id='newItemNumber' class='form-control'> <label for='materialContactFormEmail'>UPC</label> <input type='text' id='upc' class='form-control'> <label for='materialContactFormName'>Display Name</label> <input type='text' id='displayName' class='form-control'> <label for='materialContactFormEmail'>Description</label> <input type='text' id='description' class='form-control'> <label for='materialContactFormEmail'>Product Type</label> <input type='text' id='productType' class='form-control'> <label for='materialContactFormEmail'>Fabric Type</label> <input type='text' id='fabricType' class='form-control'> <label for='materialContactFormEmail'>Royal ID</label> <input type='text' id='royalID' class='form-control'> <label for='materialContactFormEmail'>Team Code</label> <input type='text' id='teamCode' class='form-control'> <label for='materialContactFormEmail'>Stitch Color</label> <input type='text' id='stichColor' class='form-control'> <label for='materialContactFormEmail'>SKU</label> <input type='text' id='sku' class='form-control'> <label for='materialContactFormEmail'>File Name</label> <input type='text' id='fileName' class='form-control'> <button class='btn btn-outline-info btn-rounded btn-block z-depth-0 my-4 waves-effect' type='submit'>Submit</button></form></div></div>";

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
        var toZip = getParameter('toZip');
        var fromZip = getParameter('fromZip');
        var weight = getParameter('weight');

        fillZip(toZip, fromZip, weight);

        // WE WILL GIVE THIS SCRIPT A PARAMETER AND SEND IT BACK HERE
        document.title = 'Create Assembly Item';
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
