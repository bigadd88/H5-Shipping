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
            title: 'Get Coffee'
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
  // andys orginal div
  //  <div id='container' style='min-width: 310px; max-width: 600px; height: 400px; margin: 0 auto'></div>
  // current is Bootstap div + Highchart map div
  return "<canvas id='pieChart'></canvas>" ;
 + "<div id='map' style='min-width: 310px; max-width: 600px; height: 400px; margin: 0 auto'></div>";
 // high chats graph div below
   //"<div id='container' style='width:100%' class='container-fluid'></div>"

    /* "<div style='width:100%' class='container-fluid'> " +
        "<nav class='navbar navbar-dark' style='background-color: #002d73'> <a class='navbar-brand' style='color: #e6e6e6'>Priority Logistics North America Rate Optimizer</a> <a class='nav-link' href='#' style='color: #e6e6e6'>Get Rates</a> <a class='nav-link' href='#' style='color: #e6e6e6'>Login to TMS</a> <a class='nav-link' href='#' style='color: #e6e6e6'>Track a Shipment</a> <a class='nav-link' href='#' style='color: #e6e6e6'>Contact your Logistics Coordinator</a> </nav><div id='poheader' class='container'><div class='form-group row justify-content-md-center'><div id='headcol1' class='col col-lg-2'></div><div id='headcol2' class='col-md-auto'><h1>Live API Call Rates - Endless Possibilities</h1>Ship Date mm/dd/yyyy: <input id='shipdate' class='form-control' type 'date' placeholder='Ship Date' onchange=''></div><div id='headcol3' class='col col-lg-2'></div><div id='loadedInfo' class='form-group row justify-content-md-center'><div id='headRow2Col1' class='col-md-auto'> Origin City: <input id='origcity' class='form-control' type='text' value='Lenexa'> Origin Zip: <input id='origzip' class='form-control' type='text' value='66227'></div><div id='headRow2Col2' class='col-md-auto'> Destination City: <input id='destcity' class='form-control' type='text' value='Apodaca'> Destination Zip: <input id='destzip' class='form-control' type='text' value='66648'></div><div id='headRow2Col3' class='col-md-auto'> Weight: <input id='weight' class='form-control' type='text' value='2000'> Class: <input id='frclass' class='form-control' type='text' value='55'></div></div></div> <input id='rateselect' class='btn btn-primary' type='button' name='submit' value='Get Rates' onclick='getRates()'></div>" + "</div>"; */

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
    });

    return;
    //*********** HELPER FUNCTIONS ***********


    /**
     * Loads Libraries that will be placed on header (Optional)
     */


    function injectHeaderScripts(){
        console.log('loadHeaderLibraries START');
        // new stuffs
        // for graphs
       loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.4/umd/popper.min.js");
       loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js");
       loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.8.7/js/mdb.min.js");
       loadjscssfile("https://code.highcharts.com/highcharts.src.js");
        // for maps
        loadjscssfile("https://code.highcharts.com/maps/highmaps.js");
        loadjscssfile("https://code.highcharts.com/modules/exporting.js");
        loadjscssfile("https://code.highcharts.com/modules/offline-exporting.js");
        loadjscssfile("https://code.highcharts.com/mapdata/custom/world.js");
        // end new stuffs


        loadjscssfile("https://code.jquery.com/jquery-1.11.3.min.js");
        loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.js");
        loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.css");
        loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css");
        //loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap-theme.min.css");
        loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js");
      	loadjscssfile("https://1212003.app.netsuite.com/core/media/media.nl?id=546305&c=1212003&h=65a79e82c2e7a292cbcc&_xt=.js");
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
      	//getToday();
      //  makeHighGraph();
        makeBootGraph();
        //makeHighMap();
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
