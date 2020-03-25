/**
 *
 *@exports PSS/quick-rate-ups-form/sl
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
define(["N/https", "N/ui/serverWidget", "N/url", "N/log"], function (https, ui, url, log){
    function onRequest(context){
        log.audit({title: 'Request recieved...'});
        //var shipParentId = context.request.parameters.parentId;
        //log.debug({title: 'shipParentId', details: shipParentId});
        if (context.request.method === 'GET'){
            context.response.writePage(generateForm());
        } else if (context.request.method === 'POST'){
            log.audit({title: 'Processing Post Method...'});
            var message = sendRequest(getFormData(context));
            var retlist = renderResults(message);
            context.response.writePage(retlist)
        }
    }

    function generateForm(context){
        log.audit({title: 'Ninja Form Render'});
        var form = ui.createForm({
            title: 'Enter UPS Parcel Details'
        });
        form.addField({
            id: 'custpage_pss_qrdate',
            type: ui.FieldType.DATE,
            label: 'Shipment Date'
        });
        //form.addField({
            //id: 'custpage_pss_qrshipmentclass',
            //type: ui.FieldType.TEXT,
            //label: 'Freight Class',
            //source: 'customlist_pri_freightclass'
        //});
        form.addField({
            id: 'custpage_pss_qrweight',
            type: ui.FieldType.TEXT,
            label: 'Weight'
        });
        form.addField({
            id: 'custpage_pss_ozip',
            type: ui.FieldType.TEXT,
            label: 'Origin Zip'
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
            originZip: context.request.parameters.custpage_pss_ozip,
            destinationZip: context.request.parameters.custpage_pss_dzip,
            weight: context.request.parameters.custpage_pss_qrweight,
            shipmentClass: context.request.parameters.custpage_pss_qrshipmentclass,
            shipmentDate: context.request.parameters.custpage_pss_qrdate
        };
    }

    function sendRequest(getFormData){
        var upsUsername = "robertpriority";
        var upsPassword = "Priority!";
        var upsToken = "1D359770AE6B7148";
        var upsAccount = "5V717Y";

        function secGen(){
            var s = '"Security": {' +
                '"UsernameToken": {'+
                  '"Username": "' + upsUsername + '",' +
                  '"Password": "' + upsPassword + '"' +
                '},' +
                '"UPSServiceAccessToken": {' +
                  '"AccessLicenseNumber": "' + upsToken + '"' +
                '}' +
              '},';
            return s;
            }

        var shipperName = 'Andy Reeder';
        var shipperNum = '5V717Y';
        var addressLine1 = '200 Gregg St.';
        var addressLine2 = '';
        var addressLine3 = '';
        var shipperCity = 'Grain Valley';
        var shipperState = 'MO';
        var shipperZip = '64029';
        var shipperCountry = 'US';
        var destName = 'Turd Furgeson';
        var destAddLine1 = '9750 Quivira Rd';
        var destAddLine2 = '';
        var destAddLine3 = '';
        var destCity = 'Lenexa';
        var destState = 'KS';
        var destZip = '66214';
        var destCountry = 'US';
        var fromName = 'Andy Reeder';
        var fromAddLine1 = '200 Gregg St.';
        var fromAddLine2 = '';
        var fromAddLine3 = '';
        var fromCity = 'Grain Valley';
        var fromState = 'MO';
        var fromZip = '64029';
        var fromCountry = 'US';
        var url = 'https://wwwcie.ups.com/rest/Rate';
        var security = secGen();
        var headers = "content-type: application/json";
        var pload =  '{ ' + 
                        security +
                       '"RateRequest": {' +
                         '"Request": {' +
                          '"RequestOption":"Shop"' +
                        '},' +
                        '"Shipment": {' + 
                        '"Shipper": {' + 
                        '"Name": "' + shipperName + '",' +
                        '"ShipperNumber": "' + shipperNum + '",' +
                        '"Address": {' +
                        '"AddressLine": [' +
                        '"' + addressLine1 + '",' +
                        '"' + addressLine2 + '",' +
                        '"' + addressLine3 + '"' +
                        '],' +
                        '"City": "' + shipperCity + '",' +
                        '"StateProvinceCode": "' + shipperState + '",' +
                        '"PostalCode": "' + shipperZip + '",' +
                        '"CountryCode": "' + shipperCountry + '"' +
                            '}' +
                        '},' +
                        '"ShipTo":{' +
                        '"Name": "' + destName + '",' +
                        '"Address": {' +
                        '"AddressLine": [' +
                        '"' + destAddLine1 + '",' +
                        '"' + destAddLine2 + '",' +
                        '"' + destAddLine3 + '"' +
                        '],' + 
                        '"City": "' + destCity + '",' +
                        '"StateProvinceCode": "'+ destState + '",' +
                        '"PostalCode": "' + destZip + '",' +
                        '"CountryCode": "' + destCountry + '"' +
                            '}' +
                        '},' +
                        '"ShipFrom":{' +
                        '"Name": "' + fromName + '",' +
                        '"Address": {' +
                        '"AddressLine": [' +
                        '"' + fromAddLine1 + '",' +
                        '"' + fromAddLine2 + '",' +
                        '"' + fromAddLine3 + '"' +
                        '],' + 
                        '"City": "' + fromCity + '",' +
                        '"StateProvinceCode": "' + fromState + '",' +
                        '"PostalCode": "' + fromZip + '",' +
                        '"CountryCode": "' + fromCountry + '"' +
                            '}' +
                        '},' +
                        '"Service": {' +
                        '"Code": "' + 03 + '",' +
                        '"Description": "Service Code Description"' +
                        '},' +
                        '"Package": {' +
                        '"PackagingType": {' +
                        '"Code": "02",' +
                        '"Description": "Rate"' +
                        '},' +
                        '"Dimensions": {' +
                        '"UnitOfMeasurement": {' +
                        '"Code": "IN",' +
                        '"Description": "inches"' +
                        '},' +
                        '"Length": "5",' +
                        '"Width": "4",' +
                        '"Height": "3"' +
                        '},' +
                        '"PackageWeight": {' +
                        '"UnitOfMeasurement": {' +
                        '"Code": "Lbs",' +
                        '"Description": "pounds"' +
                        '},' +
                        '"Weight": "3"' +
                        '},' +
                        '"ShipmentRatingOptions": {' +
                        '"NegotiatedRatesIndicator": ""' +
                        '}' +
                       '}' +
                      '}' +
                     '}' +
                    '}';

        log.audit({title: 'Request URL Generated...', details: pload});

        var getRequest = https.request({
            method: https.Method.GET,
            url: url,
            body: pload,
            headers: headers
        });
        log.audit({title: 'Response from UPS...', details: getRequest.body});
        var message = getRequest.body;
        return message;
    }

    function renderResults(message){
        log.audit({title: 'Rendering Response...'});
        var obj = JSON.parse(message);
        var resultsList = ui.createList({
            title: 'Result Rates',
            hideNavBar: 'true'
        });
        resultsList.addColumn({
            id: 'servicelevel',
            type: 'text',
            label: 'Service Level',
            align: 'left'
        });
        resultsList.addColumn({
            id: 'ratedshipmentalert',
            type: 'text',
            label: 'Rate Number',
            align: 'left'
        });
        resultsList.addColumn({
            id: 'billingweight',
            type: 'text',
            label: 'Billing Weight',
            align: 'left'
        });
        resultsList.addColumn({
            id: 'guaranteeddelivery',
            type: 'text',
            label: 'Transit Days',
            align: 'left'
        });
        resultsList.addColumn({
            id: 'totalcharges',
            type: 'currency',
            label: 'Total Charges',
            align: 'left'
        });
      for (i = 0; i < obj.RateResponse.RatedShipment.length; i++) {
        var res = new Object();
        res['servicelevel'] = obj[i].Service;
        res['ratedshipmentalert'] = obj[i].RatedShipmentAlert;
        res['billingweight'] = obj[i].BillingWeight;
        res['totalcharges'] = obj[i].TotalCharges;
        res['guaranteeddelivery'] = obj[i].GuaranteedDelivery;
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