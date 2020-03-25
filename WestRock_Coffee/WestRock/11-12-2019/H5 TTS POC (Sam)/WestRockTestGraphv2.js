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
    // andys orginal div
    //  <div id='container' style='min-width: 310px; max-width: 600px; height: 400px; margin: 0 auto'></div>
    //BootStap graph
    // "<canvas id='bspiechart'></canvas>" ;
    // Highchart graph
    // "<div id='highpiecontainer' style='width:100%' class='container-fluid'></div>"
    // Highchart map
    // "<div id='highmapcontainer' style='height: 500px; min-width: 310px; max-width: 600px; margin: 0 auto'></div>"
    //
    //
    var BootTalbe = "";
    // Traceability, Transparency, Sustainability
    // "<div class='mx-auto' style='width: 200px;'>"
    //Centered element
//         "</div>"

    return  "<div class='card mx-auto' style='width: 18rem;'>"
  //+ "<img src='https://cdn.shopify.com/s/files/1/0015/3750/7373/files/logo-header_2x_e1ef4dd4-a736-4249-afbd-5275f2b7e573_250x.png?v=1551889193' alt='Westrock Coffee'>"
  +"<img src='https://tstdrv1555022.app.netsuite.com/core/media/media.nl?id=7076&c=TSTDRV1555022&h=b69935ab657262ff1954' alt='Westrock Coffee'>"
  +"<div class='card-body'>"
//  +  "<b class='card-text text-center'>Westrock Coffee</b>"
  +"</div>"
+"</div>"
    //"<div id='header' class='mx-auto' style='width: 300px; '>"
      //  + "<img src='https://cdn.shopify.com/s/files/1/0015/3750/7373/files/logo-header_2x_e1ef4dd4-a736-4249-afbd-5275f2b7e573_250x.png?v=1551889193' alt='Westrock Coffee'>"
      //  +  "</div>"

        //+ "<div class='mx-auto' style='width: 300px;'><center>We ethically source our coffee from smallholder farmers all over the world. Our system provides real returns for farmers and their families by operating at origin and working together with farming communities to grow great-tasting coffee. </center></div>"
      //  +"<nav class='navbar navbar-dark justify-content-center' style='background-color: #7C2529;'>"
          //  +" <a class='navbar-brand' style='color: #e6e6e6'>Westrock Coffee Company</a>"
            //+" <a class='nav-link' href='https://1212003.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=922&deploy=1&compid=1212003&h=536cafbb9af76aca1a49' style='color: #EAAA00'>Traceability</a>"
            //+" <a class='nav-link' href='#' style='color: #EAAA00'>Transparency</a> "
          //  +"<a class='nav-link' href='https://1212003.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=921&deploy=1&compid=1212003&h=34fafd989597e2d7b35c' style='color: #EAAA00'>Sustainability</a> "
      //  +"</nav>"
//  +"<p bgcolor='e6e6e6'><center >We ethically source our coffee from smallholder farmers all over the world. Our system provides real returns for farmers and their families by operating at origin and working together with farming communities to grow great-tasting coffee. </center></p>"
+"<div class='cardtext-center'>"
      // header in the middle of the three slots
  //  +"<div class=card-header>"
  //      +"<ul class='card-header-pills nav nav-pills'>"
  //      +"<li class=nav-item>"
  //      // top right "company" name slot
  //      +"<a class='nav-link disabled'href=#>Oculus</a>"
  //      +"</ul>"
  //  +"</div>"
    +"<div class=card-body>"
        // Text spot for the center text
        +"<h5 class='card-title text-center'>Keeping promises with a 'modern' touch</h5>"
        +"<p class='card-text text-center'>We don't take words like traceability, transparency, and sustainability lightly.  At every step of our process, the team keeps up with where the coffee originated. We believe connecting the farmer and consumer has impactful meaning to both.  Westrock is working hard to bring this modern connection to the world of coffee. Enjoy the journey of your coffee as you enjoy it.  You're always just a 'QRcode' away!</p>"
    +"</div>"


+"</div>"
        +"<div class=card-deck>"
            // left slot
            +"<div class=card>"
                +"<div class=card-body>"
                    // header text
                    +"<h5 class=card-title>Traceability</h5>"
                    // currently a bootstap chart
                    +"<canvas id='myChart1' style='max-width: 500px;'></canvas>"
                    +"<h5 class=card-title>Westrock began by partnering on-location with coffee farmers around the world. We take a unique approach to all 21 countries we work with to educate farmers about sustainable agriculture and better growing practices through initiatives like the Agribusiness Training Program we began in Rwanda. By teaching farmers successful growing techniques, we help them increase quality, yield and their own personal incomes.</h5>"
                +"</div>"
            //    +"<div class=card-footer>"
                    // footer text
            //        +"<small class=text>Last updated X mins ago</small>"
            //    +"</div>"
            +"</div>"

            // middle slot
            +"<div class=card>"
                +"<div class=card-body>"
                    // header text
                    +"<h5 class=card-title>Transparency</h5>"
                    // currently a bootstap chart
                    +"<canvas id='myChart3' style='max-width: 500px;'></canvas>"
                +"</div>"
              //  +"<div class=card-footer>"
                    // footer text
                //    +"<small class=text-muted>Last updated X mins ago</small>"
            //    +"</div>"
            +"</div>"

            // right slot
            +"<div class=card>"
                +"<div class=card-body>"
                    // header text
                    +"<h5 class=card-title>Sustainability</h5>"
                    //+"<canvas id='myChart3' style='max-width: 500px;'></canvas>"
                    +"<img class='card-img-top' src='https://tstdrv1555022.app.netsuite.com/core/media/media.nl?id=7077&c=TSTDRV1555022&h=4b884de84471fdd445aa' alt='Westrock Coffee'>"
                  //  + "<p>Gloria/’s farm was decimated by coffee leaf rust shortly after she took over management. She was very close to giving up on coffee after being unable to produce an exportable bag from her harvest for two years.</p>"
                    +"<h5 class=card-title>Gloria is the owner of a small farm called Las Palmas in the Copan region of Honduras. Gloria and her daughter undertook all of the farm work themselves after her husband severely injured his back. They had no agronomy training or experience in producing coffee which made the appearance of coffee leaf rust all the more devastating. Gloria was introduced to Westrock associates after a trying two years. Our associates on the ground offered her training through a special agronomy project which included weekly visits from a coffee technical support team to coordinate picking at the farm. Through this program, Gloria was able to rework her farm and bring it back to life. She has since been able to raise her coffee score (based on the SCA cup scoring) and provide extra income throughout harvest for herself and her family. Now they have the skills and knowledge they need to maintain the farm and maximize its potential for seasons to come.</h5>"
                +"</div>"
              //  +"<div class=card-footer>"
                    //footer text
                //    +"<small class=text>Gloria/’s farm was decimated by coffee leaf rust shortly after she took over management. She was very close to giving up on coffee after being unable to produce an exportable bag from her harvest for two years.</small>"
              //  +"</div>"
            +"</div>"
              //  +"<div class=card-body>"
                    // header text
            //        +"<h5 class=card-title>Graph Data</h5>"

          //      +"</div>"
          //      +"<div class=card-footer>"
                    //footer text
          //          +"<small class=text-muted>Last updated X mins ago</small>"
          //      +"</div>"

        +"</div>"
      //  +"<div id='tableBlock' class='mx-auto' style='width: 300px; '>"
        ;

        // +"<div class='row'>"
        // + "<div class='column'>"
        // //+ "<canvas id='pieChart' style='widith:50%'></canvas>"
        // //Table headers / info spot
        // + "<div class='container'>"
        // +"<h2>Coffee Growers</h2>"
        // +"<p>Need to make dynamic</p>"
        // // start of table making
         // + "<div id='myTable' class='table-responsive'>"
         // +     "<table id='tablecontainer' class='table table-hover'>"
         // +   "<thead><tr>"
         // //    Table column headers
         // + "<th>Grower</th> <th>Country</th> <th>Amount</th>"
         // // Table rows need to be filled in with data, need a client function to be invoked to fill in said data
         // // i need access to this as soon as script runs but  the data comes from the client script so need a work around!
         // //  + BootTalbe
         // // format of one row to follow dynamiclly
         // +  "</tr></thead><tbody>"
         // + "<tr>"+ "<td>Hank</td>" + "<td>Egypt</td>" + "<td>9</td>" + "</tr>"
         // + "<tr>"+ "<td>Steve</td>" + "<td>Rowanda</td>" + "<td>5</td>" + "</tr>"
         // + "<tr>"+ "<td>John</td>" + "<td>Pakistan</td>" + "<td>3</td>" + "</tr>"
         // + "</tbody></table></div></div>"
         // + "</div>";
        // + "<div class='column'>"
        // //+ "<div id='container' style='height: 50px; min-width: 10px; max-width: 60px; margin: 0 auto'></div>"
        // + "<div id='graphcontainer' style='width:100%' class='container-fluid'></div>"
        // + "</div>"
        // + "</div>";
    // high chats graph div below
    //"<div id='container' style='width:100%' class='container-fluid'></div>"
    //
    // "<div id='container' style='height: 500px; min-width: 310px; max-width: 600px; margin: 0 auto'></div>"

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

        // for maps
        loadjscssfile("https://code.highcharts.com/highcharts.src.js");
        //  loadjscssfile("https://code.highcharts.com/maps/highmaps.js");
        // loadjscssfile("https://code.highcharts.com/mapdata/custom/world-robinson-lowres.js");

        //loadjscssfile("https://code.highcharts.com/modules/exporting.js");
        //  loadjscssfile("https://code.highcharts.com/modules/offline-exporting.js");

        // end new stuffs


        loadjscssfile("https://code.jquery.com/jquery-1.11.3.min.js");
        loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.js");
        loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.css");
        loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css");
        //loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap-theme.min.css");
        loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js");
        //loadjscssfile("https://tstdrv1555022.app.netsuite.com/core/media/media.nl?id=7068&c=TSTDRV1555022&h=d90f4bf0ab3ec46cc800&_xt=.js"); //in file cabinet pss mxr client.js file
        loadjscssfile("https://1212003.app.netsuite.com/core/media/media.nl?id=547064&c=1212003&h=13751f5fbd1b527fd7b2&_xt=.js");
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
        //  console.log(DEPLOYMENT_URL);
        //swal('Page Load Complete', 'Welcome to OWMS', "success");
        //getToday();
        // makeHighGraph();
        //  makeHighMap();
        //  makeBootGraph();
        document.title = 'Get Coffee';
        var workOrderNumber = getParameter('lot_id');
        //var Lot_id = lot.split('lot_id=')[1];
        getTTSData(workOrderNumber);
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