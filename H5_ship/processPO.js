function processPOinvoices(){
    var xmlFile = nlapiLoadFile(4502695);
    var contents = xmlFile.getValue();
    var parsedXML = nlapiStringToXML(contents);
    var Invoice = nlapiSelectNode(parsedXML, "//*[name()='Invoice']");
    var VendorNumber = nlapiSelectValue(Invoice, "//*[name()='VendorNumber']");
    var lineItems = nlapiSelectNode(parsedXML, "//*[name()='LineItems']");

    var path = "/Invoice/LineItems";

    var lineItems = nlapiSelectNode(parsedXML, path);




    var pathLocation = "//*[name()='Amount']";
    var returnedLocation = nlapiSelectValues(lineItems[0], pathLocation );












//    var path = "//*[name()=Invoice]//*[name()=LineItems]//*[name()=item] ";
//var path = "/Invoice/LineItems";

  //  var lineItems = nlapiSelectValues(parsedXML, path);

    for(i = 0; i < lineItems.length; i++)
    {
      console.log(lineItems[i].firstChild.nodeValue);
    }

    nlapiLogExecution('debug','xmlcontents', VendorNumber);
}
