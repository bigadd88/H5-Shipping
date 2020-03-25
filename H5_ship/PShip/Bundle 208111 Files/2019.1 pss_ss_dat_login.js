function datLoginScheduled() {
    var url = 'http://cnx.test.dat.com:9280/TfmiRequest';
    var employeesUsingDAT = nlapiSearchRecord("employee",null,
        [
            ["custentity_pss_dat_user","is","T"]
        ],
        [
            new nlobjSearchColumn("entityid").setSort(false),
            new nlobjSearchColumn("custentity_pss_dat_login"),
            new nlobjSearchColumn("custentity_pss_dat_password"),
            new nlobjSearchColumn("custentity_pss_dat_primary_key"),
            new nlobjSearchColumn("custentity_pss_dat_secondary_key"),
            new nlobjSearchColumn("custentity_pss_dat_token_expiry")
        ]
    );
    var employee = [];
    for (var x = 0; x < employeesUsingDAT.length; x++) {
        employee.push(employeesUsingDAT[x].id);
        var employeeRecord = nlapiLoadRecord('employee', employee[x]);
        var datUserName = employeeRecord.getFieldValue('custentity_pss_dat_login');
        var datUserPword = employeeRecord.getFieldValue('custentity_pss_dat_password');
        var message = '';
        var xmlEnvelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tcor="http://www.tcore.com/TcoreHeaders.xsd" xmlns:tcor1="http://www.tcore.com/TcoreTypes.xsd" xmlns:tfm="http://www.tcore.com/TfmiFreightMatching.xsd">';
        xmlEnvelope += '<soapenv:Header></soapenv:Header>';
        xmlEnvelope += '<soapenv:Body>';
        var xmlBody = '<tfm:loginRequest>';
        xmlBody += '<tfm:loginOperation>';
        xmlBody += '<tfm:loginId>' + datUserName + '</tfm:loginId>';
        xmlBody += '<tfm:password>' + datUserPword + '</tfm:password>';
        xmlBody += '<tfm:thirdPartyId>PriorityShipTMS</tfm:thirdPartyId>';
        xmlBody += '</tfm:loginOperation>';
        xmlBody += '</tfm:loginRequest>';
        var xmlClosure = '</soapenv:Body>';
        xmlClosure += '</soapenv:Envelope>';
        //compile all xml elements
        var finalXML = xmlEnvelope + xmlBody + xmlClosure;
        message = nlapiRequestURL(url, finalXML, null, null); //calling the service
        var respObj = message.getBody();
        var xmlDoc = nlapiStringToXML(respObj);
        var token = nlapiSelectNode(xmlDoc, "//*[name()='tfm:token']");
        var primary = nlapiSelectValue(token, "//*[name()='tcor:primary']");
        var secondary = nlapiSelectValue(token, "//*[name()='tcor:secondary']");
        var expiration = nlapiSelectValue(token, "//*[name()='tfm:expiration']");
        employeeRecord.setFieldValue('custentity_pss_dat_primary_key', primary);
        employeeRecord.setFieldValue('custentity_pss_dat_secondary_key', secondary);
        employeeRecord.setFieldValue('custentity_pss_dat_token_expiry', expiration);
        nlapiSubmitRecord(employeeRecord);
        }
    }
