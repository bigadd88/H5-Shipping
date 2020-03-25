/**
 *
 *@exports PSS/quick-rate-form/sl
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 *@NModuleScope SameAccount
 *
 *
 * renders a form for entry of basic rating query and returns the results in a table.
 * @copyright 2017 Priority Suite, LLC
 * @author Andrew Reeder <andy.reeder@priority-logistics.com>
 *
 * @governance XXX
 *
 * @param context
 *        {Object}
 * @param context.request
 *        {ServerRequest} incoming request object
 * @param context.response
 *        {ServerResponse} outgoing response object
 *
 * @return {void}
 *
 * @static
 * @function onRequest
 *
 */
define(["N/http", "N/ui/serverWidget", "N/url", "N/log"], function (http, ui, url, log){
    function onRequest(context){
        log.audit({title: 'Request recieved...'});
        var shipParentId = context.request.parameters.parentId;
        log.debug({title: 'shipParentId', details: shipParentId});
        if (context.request.method === 'GET'){
            context.response.writePage(generateForm(shipParentId));
        } else if (context.request.method === 'POST'){
            log.audit({title: 'Processing Post Method...'});
            var message = sendRequest(getFormData(context));
            var retlist = renderResults(message);
            context.response.writePage(retlist)
        }
    }

    function generateForm(shipParentId){
        log.audit({title: 'Ninja Form Render'});
        var form = ui.createForm({
            title: 'Enter Shipment Details'
        });
        form.addField({
            id: 'custpage_pss_qrdate',
            type: ui.FieldType.DATE,
            label: 'Shipment Date'
        });
        form.addField({
            id: 'custpage_pss_qrshipmentclass',
            type: ui.FieldType.TEXT,
            label: 'Freight Class',
            //source: 'customlist_pri_freightclass'
        });
        form.addField({
            id: 'custpage_pss_qrweight',
            type: ui.FieldType.TEXT,
            label: 'Weight'
        });
      	form.addField({
            id: 'custpage_pss_palletcount',
            type: ui.FieldType.TEXT,
            label: 'Pallet Count'
        });
        form.addField({
            id: 'custpage_pss_ocity',
            type: ui.FieldType.TEXT,
            label: 'Origin City'
        }); 
        form.addField({
            id: 'custpage_pss_ozip',
            type: ui.FieldType.TEXT,
            label: 'Origin Zip'
        });
        form.addField({
            id: 'custpage_pss_dcity',
            type: ui.FieldType.TEXT,
            label: 'Destination City'
        });  
        form.addField({
            id: 'custpage_pss_dzip',
            type: ui.FieldType.TEXT,
            label: 'Destination Zip'
        });
        form.addSubmitButton({
            label: 'Submit'
        });
        return form;
    }

    function getFormData(context) {
        log.audit({title: 'Getting Form Data...'});
        return {
            originCity: context.request.parameters.custpage_pss_ocity,
            originZip: context.request.parameters.custpage_pss_ozip,
            destinationCity: context.request.parameters.custpage_pss_dcity,
            destinationZip: context.request.parameters.custpage_pss_dzip,
            weight: context.request.parameters.custpage_pss_qrweight,
            shipmentClass: context.request.parameters.custpage_pss_qrshipmentclass,
            profileCode: 'SD68R',
            clientCode: 'SD688',
            shipmentDate: context.request.parameters.custpage_pss_qrdate,
            palletCount: context.request.parameters.custpage_pss_palletcount
        };
    }

    function sendRequest(getFormData){
        var url = "http://ec2-52-33-148-2.us-west-2.compute.amazonaws.com/api/Rates?";
        url += "originZip=" + getFormData.originZip;
        url += "&orginCity=" + getFormData.originCity;
        url += "&destinationZip=" + getFormData.destinationZip;
        url += "&destinationCity=" + getFormData.destinationCity;
        url += "&weight=" + getFormData.weight;
        url += "&shipmentClass=" + getFormData.shipmentClass;
        url += "&profileCode=" + getFormData.profileCode;
        url += "&clientCode=" + getFormData.clientCode;
        url += "&shipmentDate=" + getFormData.shipmentDate;
        url += "&accessorials=";
      	url += "&palletCount=" + getFormData.palletCount;
        log.audit({title: 'Request URL Generated...', details: url});

        var getRequest = http.get({
            url: url
        });
        log.audit({title: 'Response from AWS...', details: getRequest.body});
        var message = getRequest.body;
        return message;
    }

    function renderResults(message){
        log.audit({title: 'Rendering Response...'});
        var obj = JSON.parse(message);
        var resultsList = ui.createList({
            title: 'Result Rates',
            hideNavBar: 'false'
        });
        resultsList.addColumn({
            id: 'name_display',
            type: 'text',
            label: 'Carrier',
            align: 'left'
        });
        resultsList.addColumn({
            id: 'servicelevel',
            type: 'text',
            label: 'Service Level',
            align: 'left'
        });
        resultsList.addColumn({
            id: 'trandate',
            type: 'text',
            label: 'Transit Day',
            align: 'left'
        });
        resultsList.addColumn({
            id: 'amount',
            type: 'currency',
            label: 'Shipping Cost',
            align: 'left'
        });
      for (i = 0; i < obj.length; i++) {
        var res = new Object();
        res['name_display'] = obj[i].CarrierName;
        res['servicelevel'] = obj[i].ServiceLevelDescription;
        res['trandate'] = obj[i].TransitDays;
        res['amount'] = parseFloat(obj[i].NetCharge + obj[i].FuelSurcharge);
        resultsList.addRow({
        row: res
      });
      }
      log.audit({title: 'Rate List Rows generated....', details: res});
      return resultsList;
    }
    function GetTodaysFormattedDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today = mm + '/' + dd + '/' + yyyy;

        return today;
    }

    return {
        onRequest: onRequest
    };
});