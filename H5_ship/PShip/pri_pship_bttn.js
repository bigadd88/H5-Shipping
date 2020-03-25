function RequestRates(request, response) {
    var resp = MakeReq(request.getParameter('shipmentID'));
    nlapiLogExecution('DEBUG', 'GetRates', 'Req Done');
    response.write(resp);
    //response.write(request.getParameter('keycode'));
    //response.write(request.getParameter('shipmentID'));
    //nlapiLogExecution('DEBUG', 'GetRates', 'Suitelet Hit');
    //if (request.getParameter('keycode') != 'youcalledthewolf' &&
    //    request.getParameter('shipmentID') != '') {
    //    nlapiLogExecution('DEBUG', 'GetRates', 'Passed Params');
    //    var resp = GetRates(request.getParameter('shipmentID'));
    //    nlapiLogExecution('DEBUG', 'GetRates', 'Req Done');
    //    response.write(resp);
    //} else {
    //    response.write('true');
    //}
}

function MakeReq(shipmentID) {
    try {
        //var shipmentID = '101201303';
        var profileCode = 'KRFTR';
        var originZip = '65270';
        var destinationZip = '64116';
        var weight = 410
        var sclass = 50;
        var clientCode = 'KRFT';

        //URL of end point
        var url = "http://ec2-52-33-148-2.us-west-2.compute.amazonaws.com/api/Rates?";
        url += "&originZip=" + originZip;
        url += "&destinationZip=" + destinationZip;
        url += "&weight=" + weight;
        url += "&shipmentClass=" + sclass;
        url += "&profileCode=" + profileCode;
        url += "&clientCode=" + clientCode;

        //Authorization header
        var authorization = "NLAuth nlauth_account=TSTDRV1555031,nlauth_email=pship@priority-logistics.com,nlauth_signature=Priority2017!,nlauth_role=3";

        //Create the request headers
        var headers = new Array();
        headers['Content-Type'] = 'application/json';
        headers['Authorization'] = authorization;
        headers['User-Agent-x'] = 'SuiteScript Call';

        nlapiLogExecution('DEBUG', 'GetRates', 'Send Request' + url);
        var message = nlapiRequestURL(url, "", headers, "GET"); //calling the service

        nlapiLogExecution('DEBUG', 'GetRates', 'CODE: ' + message.getCode());

        nlapiLogExecution('DEBUG', 'GetRates', 'BODY: ' + message.getBody());

        if (message.getCode() == 200) {
            var obj = JSON.parse(message.getBody());

            nlapiLogExecution('DEBUG', 'GetRates', 'Rates Returned: ' + parseInt(obj.length));
            if (message.getCode() === 200) {
                var rates = (message.getBody());
                for (i = 0; i < parseInt(obj.length) ; i++) {
                    var ErrorMessage = obj[i].ErrorMessage;
                    var carrier = obj[i].CarrierName;
                    var SCAC = obj[i].SCAC;
                    var GrossCharge = obj[i].GrossCharge;
                    var NetCharge = obj[i].NetCharge;
                    var FuelSurcharge = obj[i].FuelSurcharge;
                    var Discount = obj[i].Discount;
                    var TotalShipmentCost = obj[i].TotalShipmentCost;
                    var TransitDays = obj[i].TransitDays;
                    var DeliveryDate = obj[i].DeliveryDate;
                    var CarrierQuoteNo = obj[i].CarrierQuoteNo;
                    var ServiceLevelDescription = obj[i].ServiceLevelDescription;
                    var PaymentType = obj[i].PaymentType;
                    var RateType = obj[i].RateType;

                    var rateLine = nlapiCreateRecord('customrecord_pli_ratepass_line');

                    nlapiLogExecution('DEBUG', 'PRI GetRates', 'Rate Pass Created ID: ' + rateLine);




                    rateLine.setFieldValue(
                        'custrecord_pri_ratepass_shipment_id',
                        shipmentID);

                    rateLine.setFieldValue(
                        'custrecord_pri_so_parent_id',
                        nlapiGetRecordId());

                    rateLine.setFieldValue(
                        'custrecord_pri_ratepass_id',
                        i + 1);

                    rateLine.setFieldValue(
                        'custrecord_pri_ratepass_carrier',
                        carrier);

                    rateLine.setFieldValue(
                        'custrecord_pri_ratepass_total_cost',
                        TotalShipmentCost);

                    rateLine.setFieldValue(
                        'custrecord_pri_ratepass_origin_zip',
                        originZip);

                    rateLine.setFieldValue(
                        'custrecord_pri_ratepass_destination_zip',
                        destinationZip);

                    rateLine.setFieldValue(
                        'custrecord_pri_ratepass_weight',
                        weight);

                    rateLine.setFieldValue(
                        'custrecord_pri_ratepass_class',
                        sclass);

                    rateLine.setFieldValue(
                        'custrecord_pri_ratepass_pf_code',
                        profileCode);

                    rateLine.setFieldValue(
                        'custrecord_pri_ratepass_client_code',
                        clientCode);

                    nlapiSubmitRecord(rateLine);

                    nlapiLogExecution('DEBUG', 'PRI GetRates', 'Rate Pass Submitted');
                }
            }
        }

    } catch (exception) {
        nlapiLogExecution('ERROR', 'PRI PRIME ERROR', exception);
    }

    return "true";
}

function GenerateShipment() {
    try {
        if (nlapiGetRecordId() != '') {


            //Once the sales order is created we generate a shipment record
            var shipmentRec = nlapiCreateRecord('customrecord_pri_shipment');

            shipmentRec.setFieldValue(
                'custrecord_pri_so_parent_id',
                nlapiGetRecordId());

            //Set to outbound
            shipmentRec.setFieldValue(
                'custrecord_pri_shipment_type',
                2);

            //Prepaid
            shipmentRec.setFieldValue(
                'custrecord_pri_billing_type',
                1);

            //Name field
            shipmentRec.setFieldValue(
                'name', "Test");

            //Planning
            shipmentRec.setFieldValue(
                'custrecord_pri_shipment_status',
                1);

            //location
            shipmentRec.setFieldValue(
                'custrecord_pri_shipper',
                1);

            //Customer
            shipmentRec.setFieldValue(
                'custrecord_pri_consignee',
                nlapiGetFieldValue('entity'));


        }
    } catch (error) {

    }
}


function beforeLoad_Shipment(type, form) {
    var currentContext = nlapiGetContext();

    AddRateButtonToShipment(type, form, currentContext);

    AddPrintLabelButtonToShipment(type, form, currentContext);

    //AddRateRequestSublist(type, form, currentContext);
}

function AddRateButtonToShipment(type, form) {
    try {
        form.addButton('custpage_rateitbutton', 'Rate it', 'OnCLick_RequestRates()');
        form.setScript('customscript_pri_req_rates');
    }
    catch (error) {
        nlapiLogExecution('ERROR', 'Before Load Shipment', error);
    }
}

function AddPrintLabelButtonToShipment(type, form) {
    try {
        form.addButton('custpage_printlabelbutton', 'Print Labels', 'OnCLick_PrintLabels()');
        form.setScript('customscript_pri_ue_shipment');
    }
    catch (error) {
        nlapiLogExecution('ERROR', 'Before Load Shipment', error);
    }
}

function OnClick_RequestRates() {
    var isValid = ValidateShipment();

    if (!isValid) {
        Ext.Msg.show({
            title: 'WARNING',
            msg: 'You are rating a shipment with missing information!<br/>  Please verify the shipment and continue.',
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.QUESTION,
            maxWidth: 500,
            width: 500,
        });
    } else {
        Ext.MessageBox.minWidth = 300;
        Ext.Msg.confirm(
            'Priority PRIME Rate Request',
            'Request rates?',
    function ReqRateHandler(btn) {
        if (btn == 'yes') {
            SendRequestToSuitelet();
            return true;
        }
        else {
            return false;
        }
    }
    );
    }
}

function OnClick_PrintLabels() {
}

function SendRequestToSuitelet() {
    Ext.Msg.wait('Requesting your rates!', 'Please wait');
    try {

        var url = nlapiResolveURL(
            'SUITELET',
            'customscript_pri_req_rates',
            'customdeploy_pri_req_rates') + '&keycode=youcalledthewolf&shipmentID=' + nlapiGetRecordId();

        var dataFromRestlet = nlapiRequestURL(
            url,
            null,
            null,
            handleResponse);


    }
    catch (e) {
        Ext.Msg.hide();
        throw nlapiCreateError('Error Talking to Suitelet', e.name + ' ' + e.message, false);
    }
}

function handleResponse(response) {
    Ext.Msg.hide();
    Ext.Msg.alert('Status', 'Request Completed!');
    if (response.getCode() == 200) {
        var xmlText = response.getBody();
        var xmlHTTPReq = nlapiStringToXML(xmlText);
        var msgNode = nlapiSelectNode(xmlHTTPReq, "//*[name()='mynode']");
        var returnedVal = nlapiSelectValue(msgNode, "//*[name()='mynodevalue']");
    }
    else {
        Ext.Msg.alert("Staus is..." + response.getCode());
    }
}

function ValidateShipment() {


    return true;
}

function AddRateRequestSublist(type, form, currentContext) {

    form.addTab('custpage_requestratestab', 'My Rates');

    var resultsSublist = form.addSubList(
        'custpage_summarystatusresults',
        'staticlist',
        'Request History',
        'custpage_requestratestab');

    //add fields to the sublist
    resultsSublist.addField('view', 'url', 'View', null).setLinkText('View');

    resultsSublist.addField('custpage_pri_ratepass_id', 'text', 'Request ID');

    resultsSublist.addField('custpage_pri_ratepass_carrier', 'text', 'Carrier');

    resultsSublist.addField('custpage_ratepass_origin', 'text', 'Origin');

    resultsSublist.addField('custpage_ratepass_destination', 'text', 'Destination');

    resultsSublist.addField('custpage_ratepass_weight', 'text', 'Weight');

    resultsSublist.addField('custpage_ratepass_class', 'text', 'Class');

    resultsSublist.addField('custpage_ratepass_cost', 'text', 'Cost');

    resultsSublist.addButton('custpage_rateit', 'Rate It', 'OnCLick_RequestRates()');

    form.addField('custpage_leastcost', 'text', 'Least Cost', null, 'custpage_requestratestab');

    // define search filters
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_pri_ratepass_shipment_id', null, 'is', '' + nlapiGetRecordId() + '');

    // return
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_pri_ratepass_id');
    columns[1] = new nlobjSearchColumn('custrecord_pri_ratepass_carrier');
    columns[2] = new nlobjSearchColumn('custrecord_pri_ratepass_origin_zip');
    columns[3] = new nlobjSearchColumn('custrecord_pri_ratepass_destination_zip');
    columns[4] = new nlobjSearchColumn('custrecord_pri_ratepass_weight');
    columns[5] = new nlobjSearchColumn('custrecord_pri_ratepass_class');
    columns[6] = new nlobjSearchColumn('custrecord_pri_ratepass_total_cost');

    var searchresults = nlapiSearchRecord(
    'customrecord_pli_ratepass_line', null, filters, columns);

    for (var i = 0 ; searchresults != null && i < searchresults.length; i++) {
        var result = searchresults[i];
        var recordType = result.getRecordType();
        var columns = result.getAllColumns();
        var id = result.getValue(columns[0]);
        var carrier = result.getValue(columns[1]);
        var ozip = result.getValue(columns[2]);
        var dzip = result.getValue(columns[3]);
        var weight = result.getValue(columns[4]);
        var cls = result.getValue(columns[5]);
        var cost = result.getValue(columns[6]);

        var netsuiteSiteUrl = 'https://system.na1.netsuite.com';
        var id = result.getId();
        var viewUrl = netsuiteSiteUrl + nlapiResolveURL('RECORD', recordType, id, false);
        //var editUrl = netsuiteSiteUrl + nlapiResolveURL('RECORD', recordType, id, true);

        resultsSublist.setLineItemValue('view', i + 1, viewUrl);
        //resultsSublist.setLineItemValue('created', i + 1, created);
        resultsSublist.setLineItemValue('custpage_pri_ratepass_id', i + 1, id);
        resultsSublist.setLineItemValue('custpage_pri_ratepass_carrier', i + 1, carrier);
        resultsSublist.setLineItemValue('custpage_ratepass_origin', i + 1, ozip);
        resultsSublist.setLineItemValue('custpage_ratepass_destination', i + 1, dzip);
        resultsSublist.setLineItemValue('custpage_ratepass_weight', i + 1, weight);
        resultsSublist.setLineItemValue('custpage_ratepass_class', i + 1, cls);
        resultsSublist.setLineItemValue('custpage_ratepass_cost', i + 1, cost);
    }

}

function beforeLoad_Customer(type, form) {
    var currentContext = nlapiGetContext();

    AddQuickButtonToShipment(type, form, currentContext);

}

function AddQuickButtonToShipment(type, form) {
    try {
        form.addButton('custpage_quickratebutton', 'Freight Quote', 'OnCLick_GetQuickQuote()');
        form.setScript('customscript_pri_ue_rate_shipment_bttn');
    }
    catch (error) {
        nlapiLogExecution('ERROR', 'Before Load Shipment', error);
    }
}

function OnCLick_GetQuickQuote() {

    var url = 'https://rest.na1.netsuite.com/app/site/hosting/restlet.nl?script=3&deploy=2';

    var width = '800';
    var height = '500';
    var title = '';
    // Open the popup
    nlExtOpenWindow(url, '', width, height, '', null, title);

}

function QuickQuote(request, response) {
    var form,
        list,
        i,
        htmlResults = '';

    if (request.getMethod() == 'GET') {
        var oZip = '';
        var dZip = '';


        form = nlapiCreateForm('Request Rates', false);

        var htmlHeader = form.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
        //htmlHeader
        //    .setDefaultValue("<p style='font-size:20px'>PRO#: " + proNumb + "<br>BillTo:  " + billTo + "</p>");

        form.addField('custpage_profile', 'text', 'Profile', null);

        form.addField('custpage_clientcode', 'text', 'Client Code', null);

        form.addField('custpage_origzip', 'text', 'Origin Zip', null);

        form.addField('custpage_destzip', 'text', 'Destination Zip', null);

        form.addField('custpage_weight', 'text', 'Weight', null);

        form.addField('custpage_class', 'text', 'Class', null);

        form.addSubmitButton('Get Rates');

        var sublist = form.addSubList('sublist', 'inlineeditor', 'Inline Editor Sublist', 'tab1');

        // add fields to the sublist
        sublist.addField('internalid', 'integer', 'Carrier');
        sublist.addField('status', 'text', 'Service Level');
        sublist.addField('type', 'text', 'Transit Days');
        sublist.addField('tranid', 'integer', 'Cost');
        //sublist.setLineItemValues(soResults);

        response.writePage(form);

    } else {  // POST  



        var responseXMLcode1 = (message.getCode());
        var responseXML1 = (message.getBody());

        //response.write(responseXMLcode1);

        var obj = JSON.parse(responseXML1);

        //response.write(responseXML1);
        //        response.write(parseInt(obj.length) + " Rates Returned" + "<br>");

        //       for (i = 0; i < parseInt(obj.length) ; i++) {
        //         response.write(obj[i].CarrierName + "<br>");
        //    }


        var list = nlapiCreateList('Rate Results');

        // You can set the style of the list to grid, report, plain, or normal, or you can get the
        // default list style that users currently have specified in their accounts.
        list.setStyle(request.getParameter('style'));

        var column = list.addColumn('selector', 'text', '', 'center');
        list.addColumn('name_display', 'text', 'Carrier', 'left');
        list.addColumn('servicelevel', 'text', 'Service Level', 'left');
        list.addColumn('trandate', 'text', 'Transit Day', 'left');
        list.addColumn('amount', 'currency', 'Shipping Cost', 'right');


        for (i = 0; i < parseInt(obj.length) ; i++) {
            var res = new Object();
            res['selector'] = 'Choose Rate';
            res['name_display'] = obj[i].CarrierName;
            res['servicelevel'] = obj[i].ServiceLevelDescription;
            res['trandate'] = obj[i].TransitDays;
            res['amount'] = parseFloat(obj[i].NetCharge + obj[i].FuelSurcharge);
            list.addRow(res);
        }
        response.writePage(list);

    }
}