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

    // return "<div class='card'><h5 class='card-header info-color white-text text-center py-4'><strong>Create Assembly Items</strong></h5><div class='card-body px-lg-5 pt-0'><div class='md-form' style='color: #757575;'> <label for='itemName'>New Item Number</label> <input type='text' id='newItemNumber' class='form-control'> <label for='UPC'>UPC</label> <input type='text' id='upc' class='form-control'> <label for='displayName'>Display Name</label> <input type='text' id='displayName' class='form-control'> <label for='description'>Description</label> <input type='text' id='description' class='form-control'> <label for='SKU'>SKU</label> <input type='text' id='sku' class='form-control'> <label for='fileName'>File Name</label> <input type='text' id='fileName' class='form-control'> <br> <label for='options'>Please Select Options</label> <select id='productType' class='mdb-select md-form'><option value='' disabled selected>Product Type</option><option value='4'>BAL</option><option value='3'>BB</option><option value='1'>BBL</option><option value='13'>BN</option><option value='12'>CS</option><option value='7'>CT</option><option value='11'>DC</option><option value='9'>EW</option><option value='2'>FT</option><option value='6'>FTR</option><option value='8'>GTR</option><option value='14'>Sock (CW)</option><option value='5'>TB</option><option value='10'>TS</option><option value='15'>WGTR</option> </select> <select id='fabricType' class='mdb-select md-form'><option value='' disabled selected>Fabric Type</option><option value='20'>AS</option><option value='10'>BANNER</option><option value='19'>DSTT</option><option value='5'>FHR</option><option value='2'>FLC</option><option value='11'>HG</option><option value='13'>HNM</option><option value='14'>HNP</option><option value='23'>HP</option><option value='17'>HT</option><option value='16'>HV</option><option value='15'>MB</option><option value='9'>MT</option><option value='24'>NA</option><option value='7'>NL</option><option value='6'>NP</option><option value='8'>NY</option><option value='22'>Other</option><option value='18'>PS</option><option value='4'>RB</option><option value='3'>SG</option><option value='1'>TT</option><option value='25'>WGTR</option> </select> <select id='royaltyId' class='mdb-select md-form'><option value='' disabled selected>Royalty ID</option><option value='17'>AB</option><option value='11'>AG</option><option value='19'>AH</option><option value='33'>ANAV3</option><option value='1'>AP</option><option value='24'>ATLV</option><option value='25'>BALV</option><option value='14'>BC</option><option value='26'>BOSV</option><option value='27'>CHIV</option><option value='3'>CLC</option><option value='2'>CLCR</option><option value='29'>CLEV</option><option value='28'>CWSV</option><option value='30'>DETV</option><option value='16'>Fermata</option><option value='31'>HOUV</option><option value='5'>IND</option><option value='49'>ISU</option><option value='9'>JSD</option><option value='15'>KH</option><option value='6'>KR</option><option value='47'>KT</option><option value='34'>LAV2</option><option value='4'>LF</option><option value='10'>MILB</option><option value='35'>MINV</option><option value='20'>MLB</option><option value='46'>MONV</option><option value='36'>NYV</option><option value='37'>NYYV</option><option value='32'>OAKV2</option><option value='13'>OV</option><option value='38'>PHIV</option><option value='39'>PITV</option><option value='12'>RT</option><option value='21'>SB</option><option value='7'>SD</option><option value='23'>SDV</option><option value='42'>SEAV</option><option value='41'>SFV</option><option value='40'>SFV2</option><option value='18'>SPARTAN</option><option value='8'>SR</option><option value='43'>STLV</option><option value='44'>TEXV</option><option value='45'>TORV</option><option value='48'>UMI</option><option value='50'>VT</option> </select> <select id='teamCode' class='mdb-select md-form'><option value='' disabled selected>Team Code</option><option value='1'>AL</option><option value='64'>ALBI</option><option value='99'>ANA</option><option value='65'>ARI</option><option value='2'>ARK</option><option value='3'>ARS</option><option value='4'>ARZ</option><option value='56'>ASP</option><option value='67'>ATL</option><option value='5'>AUB</option><option value='66'>BAL</option><option value='57'>BLUB</option><option value='68'>BOS</option><option value='6'>BYU</option><option value='30'>CHAR</option><option value='31'>CHAT</option><option value='70'>CHI</option><option value='72'>CIN</option><option value='98'>CINM1</option><option value='7'>CL</option><option value='73'>CLE</option><option value='74'>COL</option><option value='62'>COLCL</option><option value='71'>CWS</option><option value='75'>DET</option><option value='32'>DURB</option><option value='33'>ELPC</option><option value='45'>FLA</option><option value='8'>FSU</option><option value='34'>HARTY</option><option value='58'>HBS</option><option value='25'>HOU</option><option value='44'>IOWA</option><option value='110'>ISU</option><option value='35'>JJS</option><option value='86'>KANN</option><option value='77'>KC</option><option value='9'>KS</option><option value='26'>KSU</option><option value='100'>LA</option><option value='78'>LAA</option><option value='79'>LAD</option><option value='112'>LAV2</option><option value='36'>LEHI</option><option value='10'>LOU</option><option value='51'>LOUB</option><option value='11'>LSU</option><option value='12'>MCS</option><option value='27'>MEM</option><option value='37'>MEMP</option><option value='80'>MIA</option><option value='81'>MIL</option><option value='82'>MIN</option><option value='106'>MIZ</option><option value='38'>MNTB</option><option value='14'>MS</option><option value='13'>MST</option><option value='52'>MYRT</option><option value='24'>NB</option><option value='103'>NDSU</option><option value='39'>NORN</option><option value='83'>NYM</option><option value='84'>NYY</option><option value='85'>OAK</option><option value='20'>OHIO</option><option value='15'>OKC</option><option value='16'>OKS</option><option value='53'>OMAS</option><option value='55'>PEDC</option><option value='87'>PHI</option><option value='102'>PHIM</option><option value='88'>PIT</option><option value='54'>PSD</option><option value='28'>PUR</option><option value='59'>RMV</option><option value='40'>SAM</option><option value='89'>SD</option><option value='91'>SEA</option><option value='90'>SF</option><option value='48'>STA</option><option value='92'>STL</option><option value='17'>TAM</option><option value='93'>TB</option><option value='101'>TCDD</option><option value='104'>TCU</option><option value='18'>TEN</option><option value='94'>TEX</option><option value='43'>TLSA</option><option value='41'>TMH</option><option value='95'>TOR</option><option value='42'>TRT</option><option value='21'>TT</option><option value='60'>UCF</option><option value='23'>UCL</option><option value='105'>UGA</option><option value='29'>UIW</option><option value='109'>UMI</option><option value='108'>UND</option><option value='46'>UOK</option><option value='47'>UOM</option><option value='49'>UOV</option><option value='50'>UOW</option><option value='19'>USC</option><option value='107'>VB</option><option value='111'>VT</option><option value='61'>WISC</option><option value='96'>WSH</option><option value='22'>WV</option> </select> <select id='stitchColor' class='mdb-select md-form'><option value='' disabled selected>Stitch Color</option><option value='87'>Aqua</option><option value='5'>Black</option><option value='33'>Black</option><option value='75'>Black/Camel</option><option value='44'>Black/Gold</option><option value='106'>Black/Red</option><option value='21'>Black/Turquoise</option><option value='61'>Black/White</option><option value='91'>Blue</option><option value='43'>Blue Purple</option><option value='50'>Blue/Red</option><option value='38'>Brown</option><option value='8'>Burgundy</option><option value='15'>Camel</option><option value='53'>Camel/Burgundy</option><option value='121'>Carmel</option><option value='76'>Charcoal</option><option value='96'>Cream</option><option value='69'>Dark Grey</option><option value='2'>Dark Grey</option><option value='52'>Dark Grey</option><option value='60'>Dark Grey/White</option><option value='34'>Dragon</option><option value='85'>Dragons Tears</option><option value='3'>Gold</option><option value='54'>Gold/Kelly</option><option value='20'>Gold/Navy</option><option value='105'>Gold/Orange</option><option value='37'>Gold/Red</option><option value='18'>Gold/Royal</option><option value='68'>Gold/Turquoise</option><option value='89'>Gray</option><option value='77'>Green</option><option value='108'>Green/Red</option><option value='35'>Grey</option><option value='11'>Hot Pink</option><option value='113'>Hot Pink/Lavender</option><option value='124'>Hot Pink/Light Blue</option><option value='118'>Hot Pink/Navy</option><option value='48'>Hot Pink/Orange</option><option value='98'>Hot Pink/Turquoise</option><option value='22'>Hunter</option><option value='86'>Hunter Green</option><option value='95'>Kelley</option><option value='71'>Kelly</option><option value='27'>Kelly</option><option value='72'>Kelly Green</option><option value='32'>Kelly/Black</option><option value='36'>Kelly/Gold</option><option value='51'>Kelly/Purple</option><option value='107'>Kelly/Turquoise</option><option value='120'>Kelly/White</option><option value='25'>Lavender</option><option value='57'>Lavender/Gold</option><option value='14'>Light Blue</option><option value='64'>Light Blue/Gold</option><option value='65'>Light Blue/Gold</option><option value='97'>Light Blue/Navy</option><option value='73'>Light Gray</option><option value='10'>Light Grey</option><option value='62'>Light Grey/Navy</option><option value='24'>Light Pink</option><option value='41'>Light Pink</option><option value='78'>Light Purple</option><option value='42'>Light Yellow</option><option value='28'>Lime</option><option value='58'>Magenta</option><option value='92'>Maroon</option><option value='16'>Mint</option><option value='79'>Mint/Burgundy</option><option value='29'>Mint/Light Pink</option><option value='123'>Mint/Turquoise</option><option value='12'>Navy</option><option value='80'>Navy/Light Grey</option><option value='84'>Neon Yellow</option><option value='88'>OD Green</option><option value='46'>Off White</option><option value='9'>Olive</option><option value='13'>Orange</option><option value='114'>Orange/Green</option><option value='39'>Orange/Kelly</option><option value='81'>Pink</option><option value='17'>Purple</option><option value='102'>Purple/Gold</option><option value='103'>Purple/Light Yellow</option><option value='23'>Purple/Mint</option><option value='99'>Purple/Red</option><option value='45'>Purple/Turquoise</option><option value='1'>Red</option><option value='26'>Red/Black</option><option value='40'>Red/Blue</option><option value='63'>Red/Dark Grey</option><option value='109'>Red/Green</option><option value='111'>Red/Orange</option><option value='100'>Red/Purple</option><option value='56'>Red/Royal</option><option value='30'>Red/Turquoise</option><option value='59'>Red/White</option><option value='6'>Royal</option><option value='117'>Royal/Green</option><option value='55'>Royal/Red</option><option value='74'>Royal/White</option><option value='67'>Royal/White</option><option value='90'>Tan</option><option value='94'>Teal</option><option value='70'>Turquoise</option><option value='7'>Turquoise</option><option value='122'>Turquoise/Black</option><option value='119'>Turquoise/Purple</option><option value='4'>White</option><option value='19'>White/Black</option><option value='115'>White/Blue</option><option value='47'>White/Dark Grey</option><option value='116'>White/Dragon</option><option value='66'>White/Hot Pink</option><option value='101'>White/Light Blue</option><option value='49'>White/Light Pink</option><option value='104'>White/Orange</option><option value='93'>White/Purple</option><option value='31'>White/Red</option><option value='112'>White/Royal</option><option value='83'>White/Turquoise</option><option value='82'>Yellow</option><option value='110'>Yellow/Red</option> </select></div><div> <input id='login' class='btn btn-primary' type='button' name='Submit' value='Submit' onclick='createAssemblyItem()'></div></div></div>";
    //version original
    return "<div class='card'><h5 class='card-header info-color white-text text-center py-4'><strong>Create Assembly Items</strong></h5><div class='card-body px-lg-5 pt-0'><div class='md-form' style='color: #757575;'> <label for='itemName'>New Item Number</label> <input type='text' id='newItemNumber' class='form-control'> <label for='UPC'>UPC</label> <input type='text' id='upc' class='form-control'> <label for='displayName'>Display Name</label> <input type='text' id='displayName' class='form-control'> <label for='description'>Description</label> <input type='text' id='description' class='form-control'> <label for='SKU'>SKU</label> <input type='text' id='sku' class='form-control'> <label for='fileName'>File Name</label> <input type='text' id='fileName' class='form-control'> <br> <label for='options'>Please Select Options</label> <select id='productType' class='mdb-select md-form'><option value='' disabled selected>Product Type</option><option value='4'>BAL</option><option value='3'>BB</option><option value='1'>BBL</option><option value='13'>BN</option><option value='12'>CS</option><option value='7'>CT</option><option value='11'>DC</option><option value='9'>EW</option><option value='2'>FT</option><option value='6'>FTR</option><option value='8'>GTR</option><option value='14'>Sock (CW)</option><option value='5'>TB</option><option value='10'>TS</option><option value='15'>WGTR</option> </select> <select id='fabricType' class='mdb-select md-form'><option value='' disabled selected>Fabric Type</option><option value='20'>AS</option><option value='10'>BANNER</option><option value='19'>DSTT</option><option value='5'>FHR</option><option value='2'>FLC</option><option value='11'>HG</option><option value='13'>HNM</option><option value='14'>HNP</option><option value='23'>HP</option><option value='17'>HT</option><option value='16'>HV</option><option value='15'>MB</option><option value='9'>MT</option><option value='24'>NA</option><option value='7'>NL</option><option value='6'>NP</option><option value='8'>NY</option><option value='22'>Other</option><option value='18'>PS</option><option value='4'>RB</option><option value='3'>SG</option><option value='1'>TT</option><option value='25'>WGTR</option> </select> <select id='royaltyId' class='mdb-select md-form'><option value='' disabled selected>Royalty ID</option><option value='17'>AB</option><option value='11'>AG</option><option value='19'>AH</option><option value='33'>ANAV3</option><option value='1'>AP</option><option value='24'>ATLV</option><option value='25'>BALV</option><option value='14'>BC</option><option value='26'>BOSV</option><option value='27'>CHIV</option><option value='3'>CLC</option><option value='2'>CLCR</option><option value='29'>CLEV</option><option value='28'>CWSV</option><option value='30'>DETV</option><option value='16'>Fermata</option><option value='31'>HOUV</option><option value='5'>IND</option><option value='49'>ISU</option><option value='9'>JSD</option><option value='15'>KH</option><option value='6'>KR</option><option value='47'>KT</option><option value='34'>LAV2</option><option value='4'>LF</option><option value='10'>MILB</option><option value='35'>MINV</option><option value='20'>MLB</option><option value='46'>MONV</option><option value='36'>NYV</option><option value='37'>NYYV</option><option value='32'>OAKV2</option><option value='13'>OV</option><option value='38'>PHIV</option><option value='39'>PITV</option><option value='12'>RT</option><option value='21'>SB</option><option value='7'>SD</option><option value='23'>SDV</option><option value='42'>SEAV</option><option value='41'>SFV</option><option value='40'>SFV2</option><option value='18'>SPARTAN</option><option value='8'>SR</option><option value='43'>STLV</option><option value='44'>TEXV</option><option value='45'>TORV</option><option value='48'>UMI</option><option value='50'>VT</option> </select> <select id='teamCode' class='mdb-select md-form'><option value='' disabled selected>Team Code</option><option value='1'>AL</option><option value='64'>ALBI</option><option value='99'>ANA</option><option value='65'>ARI</option><option value='2'>ARK</option><option value='3'>ARS</option><option value='4'>ARZ</option><option value='56'>ASP</option><option value='67'>ATL</option><option value='5'>AUB</option><option value='66'>BAL</option><option value='57'>BLUB</option><option value='68'>BOS</option><option value='6'>BYU</option><option value='30'>CHAR</option><option value='31'>CHAT</option><option value='70'>CHI</option><option value='72'>CIN</option><option value='98'>CINM1</option><option value='7'>CL</option><option value='73'>CLE</option><option value='74'>COL</option><option value='62'>COLCL</option><option value='71'>CWS</option><option value='75'>DET</option><option value='32'>DURB</option><option value='33'>ELPC</option><option value='45'>FLA</option><option value='8'>FSU</option><option value='34'>HARTY</option><option value='58'>HBS</option><option value='25'>HOU</option><option value='44'>IOWA</option><option value='110'>ISU</option><option value='35'>JJS</option><option value='86'>KANN</option><option value='77'>KC</option><option value='9'>KS</option><option value='26'>KSU</option><option value='100'>LA</option><option value='78'>LAA</option><option value='79'>LAD</option><option value='112'>LAV2</option><option value='36'>LEHI</option><option value='10'>LOU</option><option value='51'>LOUB</option><option value='11'>LSU</option><option value='12'>MCS</option><option value='27'>MEM</option><option value='37'>MEMP</option><option value='80'>MIA</option><option value='81'>MIL</option><option value='82'>MIN</option><option value='106'>MIZ</option><option value='38'>MNTB</option><option value='14'>MS</option><option value='13'>MST</option><option value='52'>MYRT</option><option value='24'>NB</option><option value='103'>NDSU</option><option value='39'>NORN</option><option value='83'>NYM</option><option value='84'>NYY</option><option value='85'>OAK</option><option value='20'>OHIO</option><option value='15'>OKC</option><option value='16'>OKS</option><option value='53'>OMAS</option><option value='55'>PEDC</option><option value='87'>PHI</option><option value='102'>PHIM</option><option value='88'>PIT</option><option value='54'>PSD</option><option value='28'>PUR</option><option value='59'>RMV</option><option value='40'>SAM</option><option value='89'>SD</option><option value='91'>SEA</option><option value='90'>SF</option><option value='48'>STA</option><option value='92'>STL</option><option value='17'>TAM</option><option value='93'>TB</option><option value='101'>TCDD</option><option value='104'>TCU</option><option value='18'>TEN</option><option value='94'>TEX</option><option value='43'>TLSA</option><option value='41'>TMH</option><option value='95'>TOR</option><option value='42'>TRT</option><option value='21'>TT</option><option value='60'>UCF</option><option value='23'>UCL</option><option value='105'>UGA</option><option value='29'>UIW</option><option value='109'>UMI</option><option value='108'>UND</option><option value='46'>UOK</option><option value='47'>UOM</option><option value='49'>UOV</option><option value='50'>UOW</option><option value='19'>USC</option><option value='107'>VB</option><option value='111'>VT</option><option value='61'>WISC</option><option value='96'>WSH</option><option value='22'>WV</option> </select> <select id='stitchColor' class='mdb-select md-form'><option value='' disabled selected>Stitch Color</option><option value='87'>Aqua</option><option value='5'>Black</option><option value='33'>Black</option><option value='75'>Black/Camel</option><option value='44'>Black/Gold</option><option value='106'>Black/Red</option><option value='21'>Black/Turquoise</option><option value='61'>Black/White</option><option value='91'>Blue</option><option value='43'>Blue Purple</option><option value='50'>Blue/Red</option><option value='38'>Brown</option><option value='8'>Burgundy</option><option value='15'>Camel</option><option value='53'>Camel/Burgundy</option><option value='121'>Carmel</option><option value='76'>Charcoal</option><option value='96'>Cream</option><option value='69'>Dark Grey</option><option value='2'>Dark Grey</option><option value='52'>Dark Grey</option><option value='60'>Dark Grey/White</option><option value='34'>Dragon</option><option value='85'>Dragons Tears</option><option value='3'>Gold</option><option value='54'>Gold/Kelly</option><option value='20'>Gold/Navy</option><option value='105'>Gold/Orange</option><option value='37'>Gold/Red</option><option value='18'>Gold/Royal</option><option value='68'>Gold/Turquoise</option><option value='89'>Gray</option><option value='77'>Green</option><option value='108'>Green/Red</option><option value='35'>Grey</option><option value='11'>Hot Pink</option><option value='113'>Hot Pink/Lavender</option><option value='124'>Hot Pink/Light Blue</option><option value='118'>Hot Pink/Navy</option><option value='48'>Hot Pink/Orange</option><option value='98'>Hot Pink/Turquoise</option><option value='22'>Hunter</option><option value='86'>Hunter Green</option><option value='95'>Kelley</option><option value='71'>Kelly</option><option value='27'>Kelly</option><option value='72'>Kelly Green</option><option value='32'>Kelly/Black</option><option value='36'>Kelly/Gold</option><option value='51'>Kelly/Purple</option><option value='107'>Kelly/Turquoise</option><option value='120'>Kelly/White</option><option value='25'>Lavender</option><option value='57'>Lavender/Gold</option><option value='14'>Light Blue</option><option value='64'>Light Blue/Gold</option><option value='65'>Light Blue/Gold</option><option value='97'>Light Blue/Navy</option><option value='73'>Light Gray</option><option value='10'>Light Grey</option><option value='62'>Light Grey/Navy</option><option value='24'>Light Pink</option><option value='41'>Light Pink</option><option value='78'>Light Purple</option><option value='42'>Light Yellow</option><option value='28'>Lime</option><option value='58'>Magenta</option><option value='92'>Maroon</option><option value='16'>Mint</option><option value='79'>Mint/Burgundy</option><option value='29'>Mint/Light Pink</option><option value='123'>Mint/Turquoise</option><option value='12'>Navy</option><option value='80'>Navy/Light Grey</option><option value='84'>Neon Yellow</option><option value='88'>OD Green</option><option value='46'>Off White</option><option value='9'>Olive</option><option value='13'>Orange</option><option value='114'>Orange/Green</option><option value='39'>Orange/Kelly</option><option value='81'>Pink</option><option value='17'>Purple</option><option value='102'>Purple/Gold</option><option value='103'>Purple/Light Yellow</option><option value='23'>Purple/Mint</option><option value='99'>Purple/Red</option><option value='45'>Purple/Turquoise</option><option value='1'>Red</option><option value='26'>Red/Black</option><option value='40'>Red/Blue</option><option value='63'>Red/Dark Grey</option><option value='109'>Red/Green</option><option value='111'>Red/Orange</option><option value='100'>Red/Purple</option><option value='56'>Red/Royal</option><option value='30'>Red/Turquoise</option><option value='59'>Red/White</option><option value='6'>Royal</option><option value='117'>Royal/Green</option><option value='55'>Royal/Red</option><option value='74'>Royal/White</option><option value='67'>Royal/White</option><option value='90'>Tan</option><option value='94'>Teal</option><option value='70'>Turquoise</option><option value='7'>Turquoise</option><option value='122'>Turquoise/Black</option><option value='119'>Turquoise/Purple</option><option value='4'>White</option><option value='19'>White/Black</option><option value='115'>White/Blue</option><option value='47'>White/Dark Grey</option><option value='116'>White/Dragon</option><option value='66'>White/Hot Pink</option><option value='101'>White/Light Blue</option><option value='49'>White/Light Pink</option><option value='104'>White/Orange</option><option value='93'>White/Purple</option><option value='31'>White/Red</option><option value='112'>White/Royal</option><option value='83'>White/Turquoise</option><option value='82'>Yellow</option><option value='110'>Yellow/Red</option> </select></div><div> <input id='login' class='btn btn-primary' type='button' name='Submit' value='Submit' onclick='createAssemblyItem()'></div></div></div>";
    //version from Ideal
    // return  "<div class='card-deck'><div class='card border border-white'></div><div class='card text-white bg-dark mb-3'><div class='card-body'><div id='myTable' class='table-responsive' style='width:100%'><table id='tablecontainer' class='table-responsive table-hover' ><tbody><tr><td colspan='3' align='left'><b>Ideal Express LLC Rating</b></td></tr><tr><td><br></td></tr><tr><td>From Zip</td><td>To Zip</td></tr><tr><td><input id='fromZip'></input></td><td><input id='toZip'></input></td></tr><tr><td>Pieces</td><td>Weight</td><td></td></tr><tr><td><input id='pieces'></input></td><td><input id='weight'></input></td></tr><tr><td>FULL SERVICE</td><td><input type='Checkbox' id='FS'></input></td><td></td></tr><tr><td>SAME DAY</td><td><input type='Checkbox' id='SameDay'></input></td><td></td></tr><tr><td>SATURDAY</td><td><input type='Checkbox' id='Sat'></input></td><td></td></tr><tr><td>AM request</td><td><input type='Checkbox' id='AM'></input></td><td></td></tr><tr><td>RMA</td><td><input type='Checkbox' id='RMA'></input></td><td></td></tr><tr><td>BLIND</td><td><input type='Checkbox' id='Blind'></input></td><td></td></tr></tbody></table></div></div> <Button class='btn btn-dark' onclick=createAssemblyItem()> Get Rate </Button><div><h5 id='price'></h5></div></div><div class='card border border-white'></div></div></div>";
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

        // Material Select Initialization
        // $(document).ready(function() {
        //     $('.mdb-select').materialSelect();
        // });

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
        loadjscssfile("https://tstdrv1555013.app.netsuite.com/core/media/media.nl?id=1323&c=TSTDRV1555013&h=bfedd3556c135cd25b19&_xt=.js"); // CLIENT SCRIPT

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
        junkListOptions();
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
