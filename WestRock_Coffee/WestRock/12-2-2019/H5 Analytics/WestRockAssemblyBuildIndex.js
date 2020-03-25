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

    return  "<div class='card mx-auto' style='width: 18rem;'>"
  // +"<img id='logo' src='https://tstdrv1555022.app.netsuite.com/core/media/media.nl?id=7076&c=TSTDRV1555022&h=b69935ab657262ff1954' alt='Westrock Coffee'>"

        // dataPicker Field start date<>   watch out for length, and on change might trigger on each character
        // dataPicker Field end date<>
        // +"<h5 class='card-title text-center'>Assembly Item Internal ID</h5>"
        // + "<input id='item' class='form-control' type='text' value='' name='item'>"
        +"<h5 class='card-title text-center'>From Date</h5>"
        + "<input id='fromDate' class='form-control' type='date' value='2019-09-01' name='fromDate' placeholder='2019-09-01' onchange='testonchange()' >"
        +"<h5 class='card-title text-center'>To Date</h5>"
        + "<input id='toDate' class='form-control' type='date' value='2019-09-30' name='toDate' placeholder='2019-09-30' onchange='todateonchange()' autocomplete='off'>"


  +"<div class='card-body'>"
  +"</div>"
+"</div>"
// +"<div class='cardtext-center'>"
//     +"<div class=card-body>"
//         // Text spot for the center text
//         +"<h5 class='card-title text-center'>Keeping promises with a 'modern' touch</h5>"
//         +"<p class='card-text text-center'>We don't take words like traceability, transparency, and sustainability lightly.  At every step of our process, the team keeps up with where the coffee originated. We believe connecting the farmer and consumer has impactful meaning to both.  Westrock is working hard to bring this modern connection to the world of coffee. Enjoy the journey of your coffee as you enjoy it.  You're always just a 'QRcode' away!</p>"
//     +"</div>"
//
//
// +"</div>"
//         +"<div class=card-deck>"
//             // left slot
//             +"<div class=card>"
//                 +"<div class=card-body>"
//                     // header text
//                     +"<h5 class=card-title>Traceability</h5>"
//                     // currently a bootstap chart
//                     +"<canvas id='myChart1' style='max-width: 500px;'></canvas>"
//                     +"<h5 class=card-title>Westrock begin by partnering on-location with coffee farmers around the world. We take a unique approach to all 21 countries we work with to educate farmers about sustainable agriculture and better growing practices through initiatives like the Agribusiness Training Program we began in Rwanda. By teaching farmers successful growing techniques, we help them increase quality, yield and their own personal incomes.</h5>"
//                 +"</div>"
//             //    +"<div class=card-footer>"
//                     // footer text
//             //        +"<small class=text>Last updated X mins ago</small>"
//             //    +"</div>"
//             +"</div>"

            // middle slot
            +"<div class='card'>"
                +"<div class='card-body'>"
                      +"<h5 class='card-title text-center'>Data Summary</h5>"
                      +"<table id= 'tableBlock2' class= 'table' width='100%' height='100%' cellspacing='2' cellpadding='2' border='0' align='center' bgcolor='#dddddd' style='font-size:16px'></table>"
                +"</div>"
            +"</div>"

            +"<div class=card>"
                +"<div class=card-body>"
                    // header text
                    +"<h5 class='card-title text-center'>Assembly Build Cost Detail</h5>"
                    // currently a bootstap chart
                  //  +"<canvas id='myChart3' style='max-width: 500px;'></canvas>"
                  +"<table id='tableBlock1' class= 'table' width='100%' cellspacing='2' cellpadding='2' border='0' align='center' bgcolor='#dddddd' style='font-size:16px'></table>"
                +"</div>"
            +"</div>";

            // right slot
        //     +"<div class=card>"
        //         +"<div class=card-body>"
        //             // header text
        //             +"<h5 class=card-title>Sustainability</h5>"
        //             +"<img class='card-img-top' src='https://tstdrv1555022.app.netsuite.com/core/media/media.nl?id=7077&c=TSTDRV1555022&h=4b884de84471fdd445aa' alt='Westrock Coffee'>"
        //             +"<h5 class=card-title>Gloria is the owner of a small farm called Las Palmas in the Copan region of Honduras. Gloria and her daughter undertook all of the farm work themselves after her husband severely injured his back. They had no agronomy training or experience in producing coffee which made the appearance of coffee leaf rust all the more devastating. Gloria was introduced to Westrock associates after a trying two years. Our associates on the ground offered her training through a special agronomy project which included weekly visits from a coffee technical support team to coordinate picking at the farm. Through this program, Gloria was able to rework her farm and bring it back to life. She has since been able to raise her coffee score (based on the SCA cup scoring) and provide extra income throughout harvest for herself and her family. Now they have the skills and knowledge they need to maintain the farm and maximize its potential for seasons to come.</h5>"
        //         +"</div>"
        //
        //     +"</div>"
        //
        // +"</div>"



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

         loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.4/umd/popper.min.js");  // NO EFFECTS ON DESKTOP
         loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js"); //  NO EFFECTS ON DESKTOP
         loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.8.7/js/mdb.min.js");               // NEED

         loadjscssfile("https://code.jquery.com/jquery-1.11.3.min.js"); // NO effects on DESKTOP
         loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.js"); // NEED
         loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.css"); // NEED
         loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"); // NEED FOR STYLING
         //loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap-theme.min.css");
         loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"); // NEED
         loadjscssfile("https://1212003.app.netsuite.com/core/media/media.nl?id=560345&c=1212003&h=c56f2c8c31cd44411b94&_xt=.js"); // CLIENT SCRIPT
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
        // getParameter('blah')
        var workOrderNumber = getParameter('woid');

        getTTSData(workOrderNumber);
        console.log('Ran getTTSData');
        document.title = 'Finished Goods Cost Summary';
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
