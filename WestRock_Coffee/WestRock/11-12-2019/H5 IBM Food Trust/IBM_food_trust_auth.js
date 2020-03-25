function IBMFoodTrustAuth() {
//Obtain an IBM Cloud IAM token
    var url = 'https://iam.cloud.ibm.com/identity/token';
    var headers = [];
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    headers['User-Agent'] = 'Mozilla/5.0';
    headers['Accept'] = 'application/json';
    headers['Accept-Charset'] = 'utf-8';
    headers['Accept-Encoding'] = 'gzip';
    headers['Accept-Language'] = 'en-US';
    strPayloadRAW = 'grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=DM9uYx7ljgYfm68s_cpfc_pthsxeDzSknyCNhRqvgn4f';
    var response = nlapiRequestURL(url, strPayloadRAW, headers, 'POST');
    var bodyReturned = response.getBody();


//Exchange an IBM Cloud IAM token for a Service token
    var ProductionOrganizationId = 'db92b166-b5cb-48cc-9373-04a8912c61f5';

    var url2 = 'https://food.ibm.com/ift/api/identity-proxy/exchange_token/v1/organization/' + ProductionOrganizationId;
    var headers2 = [];
    headers2['Content-Type'] = 'application/json';
    var payload1 = [];
    payload1['grant_type'] = 'urn:ibm:params:oauth:grant-type:apikey';
    payload1['apikey'] = 'DM9uYx7ljgYfm68s_cpfc_pthsxeDzSknyCNhRqvgn4f';
    var response = nlapiRequestURL(url2, bodyReturned, headers2, 'POST');

    var bodyReturned2 = response.getBody();
    var parsedBody = JSON.parse(bodyReturned2);
    

//Send Scenario XML Document
var ibmXML = '';
ibmXML += '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
ibmXML += '<ns3:EPCISDocument schemaVersion="1.2" creationDate="2019-10-31T12:48:38.425Z" xmlns:ns2="urn:epcglobal:cbv:mda" xmlns:ns3="urn:epcglobal:epcis:xsd:1">';
ibmXML += '<EPCISBody>';
ibmXML += '<EventList>';
ibmXML += '<AggregationEvent>';
ibmXML += '<eventTime>2019-10-30T12:00:00Z</eventTime>';
ibmXML += '<eventTimeZoneOffset>-05:00</eventTimeZoneOffset>';
ibmXML += '<baseExtension>';
ibmXML += '<eventID>urn:uuid:6f86bf3f-6555-46c8-920e-e54b2fcecf29</eventID>';
ibmXML += '</baseExtension>';
ibmXML += '<parentID>urn:epc:id:sscc:078742334035.17769</parentID>';
ibmXML += '<childEPCs/>';
ibmXML += '<action>ADD</action>';
ibmXML += '<bizLocation>';
ibmXML += '<id>urn:ibm:ift:location:loc:078742334035.hq</id>';
ibmXML += '</bizLocation>';
ibmXML += '<bizTransactionList>';
ibmXML += '<bizTransaction type="urn:epcglobal:cbv:btt:desadv">urn:epcglobal:cbv:bt:0737698394646:DA95432</bizTransaction>';
ibmXML += '</bizTransactionList>';
ibmXML += '<extension>';
ibmXML += '<childQuantityList>';
ibmXML += '<quantityElement>';
ibmXML += '<epcClass>urn:epc:class:lgtin:078742334035.0.123</epcClass>';
ibmXML += '<quantity>1</quantity>';
ibmXML += '<uom>CS</uom>';
ibmXML += '</quantityElement>';
ibmXML += '</childQuantityList>';
ibmXML += '<sourceList>';
ibmXML += '<source type="urn:epcglobal:cbv:sdt:owning_party">urn:ibm:ift:location:loc:078742334035.hq</source>';
ibmXML += '</sourceList>';
ibmXML += '<destinationList>';
ibmXML += '<destination type="urn:epcglobal:cbv:sdt:owning_party">urn:ibm:ift:location:loc:0078742.genericLoc</destination>';
ibmXML += '</destinationList>';
ibmXML += '</extension>';
ibmXML += '</AggregationEvent>';
ibmXML += '</EventList>';
ibmXML += '</EPCISBody>';
ibmXML += '</ns3:EPCISDocument>';

var url3 = 'https://food.ibm.com/ift/api/connector/fs/connector/v1/assets';
var headers3 = [];
headers3['Content-Type'] = 'application/xml';
headers3['User-Agent'] = 'Mozilla/5.0';
headers3['Accept'] = 'application/json';
headers3['Accept-Charset'] = 'utf-8';
headers3['Accept-Encoding'] = 'gzip';
headers3['Accept-Language'] = 'en-US';
headers3['Authorization'] = 'Bearer ' + parsedBody.onboarding_token;
var response3 = nlapiRequestURL(url3, ibmXML, headers3, 'POST');

}
