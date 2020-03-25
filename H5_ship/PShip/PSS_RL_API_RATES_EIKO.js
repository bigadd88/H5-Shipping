//this will be a Restlet.  The Restlet will listen for a post from Eiko (the customer)
//Eiko will send us a JSON object exactly like we ask for
//we parse that JSON, then ask SaaS for rates
//then we parse the XML from SaaS
//then we create a JSON to send back to Eiko
function EIKORelayRace(data, response) {
// parse data from object
//     var strObj = request.getParameter('data');

    var str = JSON.stringify(data);
    nlapiLogExecution('DEBUG', 'EIKO json string received', str);
    var jsdata = JSON.parse(str);
// var formedDate = new Date(shipDate);
    var formedDate = new Date();
    var isoDate = formedDate.toISOString();
    var origAddressee = jsdata.origin.addressee;
    var origCountry = jsdata.origin.country;
    var origZip = jsdata.origin.zip;
    var origAddr1 = jsdata.origin.addr1;
    var origCity = jsdata.origin.city;
    var origState = jsdata.origin.state;
    var consigneeAddressee = jsdata.destination.addressee;
    var consigneeAddr1 = jsdata.destination.addr1;
    var consigneeCity = jsdata.destination.city;
    var consigneeState = jsdata.destination.state;
    var consigneeZip = jsdata.destination.zip;
    var consigneeCountry = jsdata.destination.country;
    var shipDate = jsdata.shipDate;
    var shipmentId = jsdata.shipmentId;
    var pickupCloseTime = jsdata.pickupCloseTime;
    var pickupOpenTime = jsdata.pickupOpenTime;
    var refAtDestination = jsdata.refAtDestination;
    var refAtOrigin = jsdata.refAtOrigin;

    var linePallets = [];
    var pkgType = [];
    var linePieces = [];
    var lineNMFC = [];
    var lineFrClass = [];
    var lineWeight = [];
    var lineHeight = [];
    var lineWidth = [];
    var lineLength = [];
    var totWeight = 0;

    var packages = jsdata.Shipment;
    for (var x = 0; x < packages.length; x++) {
        linePallets.push(packages[x].Pallets);
        lineWeight.push(Number(packages[x].Weight));
        lineHeight.push(Number(packages[x].Height));
        lineWidth.push(Number(packages[x].Width));
        lineLength.push(Number(packages[x].Length));
        lineFrClass.push(packages[x].Class);
        lineNMFC.push(packages[x].NMFC);
        linePieces.push(Number(packages[x].Pieces));
    }

// building individual shipment lines
    function BuildShipments(load) {

        for (var i = 0; i < load.length; i++) {
            payloadxml += '<a:Shipment>';
            payloadxml += '<a:Class>' + lineFrClass[i] + '</a:Class>';
            payloadxml += '<a:HazMat>false</a:HazMat>';
            payloadxml += '<a:Height>' + lineHeight[i] + '</a:Height>';
            payloadxml += '<a:Length>' + lineLength[i] + '</a:Length>';
            payloadxml += '<a:NMFC>' + lineNMFC[i] + '</a:NMFC>';
            payloadxml += '<a:Pallets>' + linePallets[i] + '</a:Pallets>';
            payloadxml += '<a:Pieces>' + linePieces[i] + '</a:Pieces>';
            payloadxml += '<a:Weight>' + lineWeight[i] + '</a:Weight>';
            payloadxml += '<a:Width>' + lineWidth[i] + '</a:Width>';
            payloadxml += '</a:Shipment>';
        }
    }

    var accessorialArray = [];
    var accessorialsSubmitted = jsdata.Accessorials;
    for (var x = 0; x < accessorialsSubmitted.length; x++) {
        accessorialArray.push(accessorialsSubmitted[x].value);
    }

    // building individual accessorial lines
    function BuildAccessorials(acc) {

        for (var i = 0; i < acc.length; i++) {
            payloadxml += '<a:string>' + accessorialArray[i] + '</a:string>';
        }
    }


//url def
    var url = 'https://api.tmssaas.com/Services/ShipmentLiteService.svc';
//request headers
    var reqHeads = [];
    reqHeads['Content-Type'] = 'text/xml;charset=UTF-8';
    reqHeads['SOAPAction'] = 'http://tempuri.org/IShipmentLiteService/Login';
    reqHeads['Content-Length'] = '514';
    reqHeads['Host'] = 'tmssaas.com';
    reqHeads['Connection'] = 'Keep-Alive';
//generate auth xml
    var authxml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">';
    authxml += '<soapenv:Header/>';
    authxml += '<soapenv:Body>';
    authxml += '<tem:Login>';
    authxml += '<!--Optional:-->';
    authxml += '<tem:userName>priorityadmin</tem:userName>';
    authxml += '<!--Optional:-->';
    authxml += '<tem:password>Priority</tem:password>';
    authxml += '<!--Optional:-->';
    authxml += '<tem:srvToken>335D6759802A4DBEB41CD6D68AB3024D</tem:srvToken>';
    authxml += '</tem:Login>';
    authxml += '</soapenv:Body>';
    authxml += '</soapenv:Envelope>';
    nlapiLogExecution('debug', 'authXML', authxml);
    authmsg = nlapiRequestURL(url, authxml, reqHeads);//logging in and getting the user token
    nlapiLogExecution('debug', 'authmsg', authmsg);
    var authBody = authmsg.getBody();
    // nlapiLogExecution('debug', 'authbody', authBody);
    var authXML = nlapiStringToXML(authBody);
    var tokenNum = nlapiSelectValue(authXML, "//*[name()='LoginResult']");
//generate payloadxml
    var plreqHeads = [];
    var profileCode = 'EIKOR'; //EIKOR SC48R
    var clientCode = 'EKO'; //EKO SC489
    plreqHeads['Content-Type'] = 'text/xml;charset=UTF-8';
    plreqHeads['SOAPAction'] = 'http://tempuri.org/IShipmentLiteService/GetLTLRates';
    plreqHeads['Content-Length'] = '514';
    plreqHeads['Host'] = 'tmssaas.com';
    plreqHeads['Connection'] = 'Keep-Alive';
    var payloadxml = '<?xml version="1.0" encoding="UTF-8"?>';

    payloadxml += '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:t="http://tempuri.org/">';
    payloadxml += '<s:Body>';
    payloadxml += '<t:GetLTLRates xmlns="http://api.tmssaas.com/services/Wcf/ShipmentLiteService.svc">';
    payloadxml += '<t:ltlRequest xmlns:a="http://schemas.datacontract.org/2004/07/LogisticsAppSuite.RatingEngine.DataModels" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">';

    payloadxml += '<a:AccessorialCodes>';
    // payloadxml += '<a:string>lgd</a:string>';
    BuildAccessorials(accessorialsSubmitted);
    payloadxml += '</a:AccessorialCodes>';
    payloadxml += '<a:ClientCode>' + clientCode + '</a:ClientCode>';
    payloadxml += '<a:DestCity>' + consigneeCity + '</a:DestCity>';
    payloadxml += '<a:DestCountry>' + consigneeCountry + '</a:DestCountry>';
    payloadxml += '<a:DestState>' + consigneeState + '</a:DestState>';
    payloadxml += '<a:DestZip>' + consigneeZip + '</a:DestZip>';
    payloadxml += '<a:IsBatch>false</a:IsBatch>';
    payloadxml += '<a:Miles>0</a:Miles>';
    payloadxml += '<a:OrigCity>' + origCity + '</a:OrigCity>';
    payloadxml += '<a:OrigCountry>' + origCountry + '</a:OrigCountry>';
    payloadxml += '<a:OrigState>' + origState + '</a:OrigState>';
    payloadxml += '<a:OrigZip>' + origZip + '</a:OrigZip>';
    payloadxml += '<a:ProfileCode>' + profileCode + '</a:ProfileCode>';
    payloadxml += '<a:RequestId>' + shipmentId + '</a:RequestId>'; //?
    payloadxml += '<a:Route i:nil="true"/>';
    payloadxml += '<a:SCAC i:nil="true"/>';
    payloadxml += '<a:ServiceLevelCode i:nil="true"/>';
    payloadxml += '<a:ShipmentDate>' + isoDate + '</a:ShipmentDate>';
    payloadxml += '<a:Shipments>';

    BuildShipments(packages);

    payloadxml += '</a:Shipments>';
    payloadxml += '<a:SrvToken>335D6759802A4DBEB41CD6D68AB3024D</a:SrvToken>';
    payloadxml += '<a:UsrToken>' + tokenNum + '</a:UsrToken>';
    payloadxml += '<a:ZoneCode i:nil="true"/>';
    payloadxml += '</t:ltlRequest>';
    payloadxml += '</t:GetLTLRates>';
    payloadxml += '</s:Body>';
    payloadxml += '</s:Envelope>';

//make request to SaaS
    nlapiLogExecution('DEBUG', 'GetRates', 'Send Request: ' + url);
    rateResponse = nlapiRequestURL(url, payloadxml, plreqHeads); //calling the service
    var respObj = rateResponse.getBody();
    nlapiLogExecution('DEBUG', 'RatesReturned', '' + respObj);
    nlapiSendEmail(6,'robert.regnier@priority-logistics.com','Eiko Rated',respObj);
    var saasXML = nlapiStringToXML(respObj);
    var miles = nlapiSelectValue(saasXML, "//*[name()='a:Miles']");
    var requestId = nlapiSelectValue(saasXML, "//*[name()='a:RequestId']");
    var quoteNumber = nlapiSelectValue(saasXML, "//*[name()='a:SAASQuoteNumber']");

    var TotalShipmentCost = nlapiSelectValues(saasXML, "//*[name()='a:TotalShipmentCost']");
    var TransitDays = nlapiSelectValues(saasXML, "//*[name()='a:TransitDays']");
    var ServiceLevelDescription = nlapiSelectValues(saasXML, "//*[name()='a:ServiceLevelDescription']");
    var SCAC = nlapiSelectValues(saasXML, "//*[name()='a:SCAC']");
    var FuelSurcharge = nlapiSelectValues(saasXML, "//*[name()='a:FuelSurcharge']");
    var CarrierName = nlapiSelectValues(saasXML, "//*[name()='a:CarrierName']");
    var accessorialRated = nlapiSelectValues(saasXML, "//*[name()='a:AccessorialDescription']");
    var accessorialCharge = nlapiSelectValues(saasXML, "//*[name()='a:AccessorialRate']");



    var newJSON = new Array();

// looping though the indiv Node to find the data we want
    for (var x = 0; x < TotalShipmentCost.length; x++) {
        var FuelPrice = FuelSurcharge[x];
        var Carrier = CarrierName[x];
        var TotalPrice = TotalShipmentCost[x];
        var ServiceLevel = ServiceLevelDescription[x];
        var SCACvalue = SCAC[x];
        var TransitLength = TransitDays[x];
        newJSON.push({
            "quoteNumber": quoteNumber,
            "RequestId": requestId,
            "Miles": miles,
            "Carrier": Carrier,
            "TotalCost": TotalPrice,
            "FuelSurcharge": FuelPrice,
            "ServiceLevel": ServiceLevel,
            "TransitDays": TransitLength,
            "SCAC": SCACvalue
        });
    }
    // var returnJSON = JSON.stringify(newJSON);
    return(JSON.stringify(newJSON));
}
