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
    bodyAreaField.defaultValue = '<meta name="viewport" content="width=device-width, initial-scale=1.0"><script>var script = document.createElement(\'script\');script.setAttribute(\'type\', \'text/javascript\');script.appendChild(document.createTextNode(\"' + scriptToInject + '\" ));document.body.appendChild(script);</script>';
    return form;
}

/**
 * Gets HTML that will be injected into the Suitelet. Use an HTML minifier tool to achieve this one string output.
 * @returns {string} HTML String
 */
function getBody(){
    return "<div id='mainBody' class='mx-auto' style='width: 18rem;'>"
        //Replace with your HTML
        + "<div class='card-fluid'><img id='heroimg' class='card-img-top' src='' alt=''><div class='card-body'><h5 id='imgcardtitle' class='card-title'></h5><p id='herotext' class='card-text'></div></div><div id='righttable' class=''><table id='toptab' class='table table-borderless'><th class='table-secondary' colspan='4'><b>Key Coffee Facts</b></th><tr id='ttrow1'><td id='roastedval1' colspan='1'></td><td id='roasted1' colspan='3'>Harvest to Roast Days</td></tr><tr id='ttrow2'><td id='horizontalBar' colspan='1'><a href='#' data-toggle='modal' data-target='#chartModal'></a></td><td id='farmers1' colspan='3'>Farmers Contributing</td></tr><tr id='ttrow3'><td id='expDate1' colspan='3'>Lot Expiration Date</td><td id='expDateval1' colspan='1'></td></tr><tr id='ttrow4'><td id='originCountryLabel' colspan='3'>Country of Origin</td><td id='originCountryValue' colspan='1'></td></tr></table><table id='midtab' class='table table-borderless'><th class='table-secondary' colspan='4'><b>Key Journey Dates</b></th><tr id='tmrow1'><td id='date1' colspan='2'>First Harvest</td><td id='dateval1' colspan='2'><a href='#' data-toggle='modal' data-target='#date1Modal'></a></td></tr><tr id='tmrow2'><td id='date2' colspan='2'>First Mill Receipt</td><td id='dateval2' colspan='2'><a href='#' data-toggle='modal' data-target='#date2Modal'></a></td></tr><tr id='tmrow3'><td id='date3' colspan='2'>Last Mill Receipt</td><td id='dateval3' colspan='2'><a href='#' data-toggle='modal' data-target='#date3Modal'></a></td></tr><tr id='tmrow4'><td id='date4' colspan='2'>Delivery to Port</td><td id='dateval4' colspan='2'><a href='#' data-toggle='modal' data-target='#date4Modal'></a></td></tr><tr id='tmrow5'><td id='date5' colspan='2'>Ship Leaves Port</td><td id='dateval5' colspan='2'><a href='#' data-toggle='modal' data-target='#date5Modal'></a></td></tr><tr id='tmrow6'><td id='date6' colspan='2'>Arrived in US Port</td><td id='dateval6' colspan='2'><a href='#' data-toggle='modal' data-target='#date6Modal'></a></td></tr></table><table id='bottab' class='table table-borderless'><th class='table-secondary' colspan='4'><b>Other Interesting Facts</b></th><tr id='tbrow1'><td id='fact1image' class='image-fluid'><img id='coffeecup' src='https://1212003.app.netsuite.com/core/media/media.nl?id=598729&c=1212003&h=c8cff50aa50bf823a522'></td><td id='fact1'><a href='#' data-toggle='modal' data-target='#coffeeProfile'>The coffee in your cup</a></td></tr><tr id='tbrow2'><td id='fact2' colspan='2'><a href='#' data-toggle='modal' data-target='#coffeeEnvironment'>Concerned for the Environment</a></td></tr><tr id='tbrow3'><td id='fact3' colspan='2'><a href='#' data-toggle='modal' data-target='#coffeeUses'>Other Uses</a></td></tr></table></div>"
        //footer and modal containers
        + "<div id='docfoot' class='container-fluid blockquote-footer text-muted'></div><div class='fade modal' role='dialog' aria-hidden='true' aria-labelledby='date1ModalLabel' id='date1Modal' tabindex='-1'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='date1ModalLabel'>First Harvest</h5> <button class='close' data-dismiss='modal' type='button' aria-label='Close'><span aria-hidden='true'></span></button></div><div class='modal-body'><p>Farmers harvested the coffee that was blended to create your brew. Coffee grows inside a cherry on a tree. One tree can produce thousands of cherries per season, each ripening at a different time. Farmers pick ripe cherries from their trees daily, remove the fruit from the bean and dry it for about three weeks before selling the coffee to our partnering suppliers.</div><div class='modal-footer'> <button class='btn btn-secondary' data-dismiss='modal' type='button'>Close</button></div></div></div></div><div class='fade modal' role='dialog' aria-hidden='true' aria-labelledby='date2ModalLabel' id='date2Modal' tabindex='-1'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='date2ModalLabel'>First Mill Receipt</h5> <button class='close' data-dismiss='modal' type='button' aria-label='Close'><span aria-hidden='true'></span></button></div><div class='modal-body'><p>Farmers began delivering their coffee on this date. Several weeks after harvest when the coffee is dry, farmers will deliver it to one of our supplier&#39s purchase points. The supplier runs a quality check on the coffee and pays the farmer. Then, the farmer&#39s delivery receipt number is linked to a lot ID, which includes other coffees of the same quality, certification status and delivery time frame.</div><div class='modal-footer'> <button class='btn btn-secondary' data-dismiss='modal' type='button'>Close</button></div></div></div></div><div class='fade modal' role='dialog' aria-hidden='true' aria-labelledby='date3ModalLabel' id='date3Modal' tabindex='-1'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='date3ModalLabel'>Last Mill Receipt</h5> <button class='close' data-dismiss='modal' type='button' aria-label='Close'><span aria-hidden='true'></span></button></div><div class='modal-body'><p>Farmers made their last deliveries for this batch of coffee on this date. Our supplier assigns a unique ID to each batch of coffee. This ID is linked to quality and traceability information, which differentiates the coffee from others during transport and storage.</div><div class='modal-footer'> <button class='btn btn-secondary' data-dismiss='modal' type='button'>Close</button></div></div></div></div><div class='fade modal' role='dialog' aria-hidden='true' aria-labelledby='date4ModalLabel' id='date4Modal' tabindex='-1'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='date4ModalLabel'>Delivery to Port</h5> <button class='close' data-dismiss='modal' type='button' aria-label='Close'><span aria-hidden='true'></span></button></div><div class='modal-body'><p>The coffee was dispatched for delivery to the ocean port. The export-ready coffee was loaded into a shipping container and placed onto a truck, which transported the coffee to the port of origin. All farmers&#39s coffee was blended together under a special shipment ID that is linked to farmers&#39s deliveries and roasting and packaging lot number.</div><div class='modal-footer'> <button class='btn btn-secondary' data-dismiss='modal' type='button'>Close</button></div></div></div></div><div class='fade modal' role='dialog' aria-hidden='true' aria-labelledby='date5ModalLabel' id='date5Modal' tabindex='-1'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='date5ModalLabel'>Ship Leaves Port</h5> <button class='close' data-dismiss='modal' type='button' aria-label='Close'><span aria-hidden='true'></span></button></div><div class='modal-body'><p>The coffee sailed for port in the United States.</div><div class='modal-footer'> <button class='btn btn-secondary' data-dismiss='modal' type='button'>Close</button></div></div></div></div><div class='fade modal' role='dialog' aria-hidden='true' aria-labelledby='date6ModalLabel' id='date6Modal' tabindex='-1'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='date6ModalLabel'>Arrives in US Port</h5> <button class='close' data-dismiss='modal' type='button' aria-label='Close'><span aria-hidden='true'></span></button></div><div class='modal-body'><p>The coffee arrived at port in the United States.</div><div class='modal-footer'> <button class='btn btn-secondary' data-dismiss='modal' type='button'>Close</button></div></div></div></div><div class='fade modal' role='dialog' aria-hidden='true' aria-labelledby='coffeeProfileLabel' id='coffeeProfile' tabindex='-1'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='coffeeProfileLabel'>Coffee Profile</h5> <button class='close' data-dismiss='modal' type='button' aria-label='Close'><span aria-hidden='true'></span></button></div><div class='modal-body'><p>Profile: Medium Dark Roast<br>Cupping Notes: Bright and fruity aroma with hints of citrus and caramel<br>Origin: Colombia</div><div class='modal-footer'> <button class='btn btn-secondary' data-dismiss='modal' type='button'>Close</button></div></div></div></div><div class='fade modal' role='dialog' aria-hidden='true' aria-labelledby='coffeeEnvironmentLabel' id='coffeeEnvironment' tabindex='-1'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='coffeeEnvironmentLabel'>Environmental Facts</h5> <button class='close' data-dismiss='modal' type='button' aria-label='Close'><span aria-hidden='true'></span></button></div><div class='modal-body'><p>All coffee sourced for this product has been grown on farms that are either Rainforest Alliance certified or Fair Trade certified. Both certifications and the farmers who have achieved them have strict standards for environmental stewardship. These standards focus on biodiversity and native forest protection, limited and safe use of agrochemicals, soil and water conservation and water management.</div><div class='modal-footer'> <button class='btn btn-secondary' data-dismiss='modal' type='button'>Close</button></div></div></div></div><div class='fade modal' role='dialog' aria-hidden='true' aria-labelledby='coffeeUsesLabel' id='coffeeUses' tabindex='-1'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='coffeeUsesLabel'>Other Coffee Uses</h5> <button class='close' data-dismiss='modal' type='button' aria-label='Close'><span aria-hidden='true'></span></button></div><div class='modal-body'><p>Did you know there several quick and creative ways for you to reuse your coffee grounds after you enjoy your brew.<br>1. Mix grounds with other organic matter to be used as mulch<br>2. Absorb strong odors in your garbage can with dried grounds<br>3. Add grounds into homemade soaps and scrubs for a natural exfoliant</div><div class='modal-footer'> <button class='btn btn-secondary' data-dismiss='modal' type='button'>Close</button></div></div></div></div><div class='fade modal' role='dialog' aria-hidden='true' aria-labelledby='chartModalLabel' id='chartModal' tabindex='-1'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='chartModalLabel'>Top 5 Farmer Contributions</h5> <button class='close' data-dismiss='modal' type='button' aria-label='Close'><span aria-hidden='true'></span></button></div><div class='modal-body'> <canvas id='farmerChart'></canvas></div><div class='modal-footer'> <button class='btn btn-secondary' data-dismiss='modal' type='button'>Close</button></div></div></div></div>"

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
        //$(window).bind('load', injectHTML); //Replaces Suitelet's body with custom HTML once the window has fully loaded(Required)
        $(document).ready(injectHTML); //ajr corrected for windows/android issues
        waitForLibraries(['swal'], runCustomFunctions); //Runs additional logic after required libraries have loaded (Optional)
    });

    return;
    //*********** HELPER FUNCTIONS ***********


    /**
     * Loads Libraries that will be placed on header (Optional)
     */
    function injectHeaderScripts(){
        console.log('loadHeaderLibraries START');
        loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.js");
        loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.css");
        loadjscssfile("https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css");
        loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js");
        loadjscssfile("https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js");
        loadjscssfile("https://1212003.app.netsuite.com/core/media/media.nl?id=595075&c=1212003&h=623d280b17f2d87835fe&_xt=.js");
        loadjscssfile("https://1212003.app.netsuite.com/core/media/media.nl?id=596135&c=1212003&h=195d6540d31e721ec9a8&_xt=.js");
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
        getToday();
        var lotnum = getParameter('lot_num');
        fetchLotNum(lotnum);
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
