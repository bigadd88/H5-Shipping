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
            title: 'Project: getCoffee'
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
    return "<div style='width:100%' class='container-fluid'> " +
        //Replace with your HTML
        "<div class='card text-center'><div class=card-header><ul class='card-header-pills nav nav-pills'><li class=nav-item><a class='nav-link disabled'href=#>Oculus</a></ul></div><div class=card-body><h5 class=card-title>Oculus</h5><p class=card-text>Please choose a report to begin viewing.</p></div></div><div class=card-deck><div class=card><div class=card-body><h5 class=card-title>Order Process Velocity</h5><canvas id='myChart1' style='max-width: 500px;'></canvas></div><div class=card-footer><small class=text-muted>Last updated X mins ago</small></div></div><div class=card><div class=card-body><h5 class=card-title>Current Top X Sellers</h5><canvas id='myChart2' style='max-width: 500px;'></canvas></div><div class=card-footer><small class=text-muted>Last updated X mins ago</small></div></div><div class=card><div class=card-body><h5 class=card-title>Sales By Channel</h5><canvas id='myChart3' style='max-width: 500px;'></canvas></div><div class=card-footer><small class=text-muted>Last updated X mins ago</small></div></div></div>"

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
        //$(window).on('load', injectHTML); //Replaces Suitelet's body with custom HTML once the window has fully loaded(Required)
      	$(document).ready(injectHTML);
      	//document.getElementById('outerwrapper').innerHTML = getBody();
        waitForLibraries(['swal'], runCustomFunctions); //Runs additional logic after required libraries have loaded (Optional)
    });

    return;
    //*********** HELPER FUNCTIONS ***********


    /**
     * Loads Libraries that will be placed on header (Optional)
     */
    function injectHeaderScripts(){
        console.log('loadHeaderLibraries START');
        //loadjscssfile("https://code.jquery.com/jquery-1.11.3.min.js");
        loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.js");
        loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.css");
        //loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css");
      	loadjscssfile("https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css");
        //loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap-theme.min.css");
        loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js");
      	//here lies mdb.js
      	//loadjscssfile("https://4463904.app.netsuite.com/core/media/media.nl?id=5333466&c=4463904&h=1d9861856af808eb545a&_xt=.js");
      	//here lies mdb.min.js
      	loadjscssfile("https://4463904.app.netsuite.com/core/media/media.nl?id=5333467&c=4463904&h=e4fea2c267b36577d7ec&_xt=.js");
      	//here be popper.min.js
      	loadjscssfile("https://4463904.app.netsuite.com/core/media/media.nl?id=5333470&c=4463904&h=1ac756da85aeed91a46c&_xt=.js");
        loadjscssfile("https://4463904.app.netsuite.com/core/media/media.nl?id=5325086&c=4463904&h=4c3fbcf8bcae238818f8&_xt=.js");
      	loadjscssfile("https://system.na1.netsuite.com/core/media/media.nl?id=4677265&c=4463904&h=78c0ebd3a6ea8966587b&_xt=.js");
      	loadjscssfile("https://4463904.app.netsuite.com/core/media/media.nl?id=5334140&c=4463904&h=2d618202b450e3e82516&_xt=.js");
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
        //var empId = getParameter('empid');
      	//console.log(empId);
      	//addEmpProfile(empId);
      	staggerLoadCharts();
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
        jQuery("#outerwrapper")[0].outerHTML = html;
        //document.getElementById('outerwrapper'),innerHTML = html;
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
