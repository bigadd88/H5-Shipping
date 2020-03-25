function generateBillSelector() {
    var form,
        sublist;

    //GET
    if (request.getMethod() == 'GET') {
        //create form
        //var recName = request.getParameter('NLNAME');
        //var batId = request.getParameter('batchId');
      	var nsurl = 'https://system.na1.netsuite.com';
        form = nlapiCreateForm('Vendor Bill Audit', false);
        //create sublist to show results
        sublist = form.addSubList('custpage_sublist_id', 'list', 'Bill List');
        sublist.addMarkAllButtons();
        sublist.addRefreshButton();
      	//creating dropdown filter list
      	//entSelect.addSelectOption(",");
        //form buttons
        form.setScript('customscript_pss_vendor_bill_audit_cs');
        form.addButton('submitForm', 'Submit', 'SubmitForm()');
      	//Add the search column names to the sublist field
        sublist.addField('custrecord_pss_bill_selected', 'checkbox', 'Selected');
      	sublist.addField('view', 'url', 'View', null).setLinkText('View');
      	sublist.addField('internalid', 'TEXT', 'internalid')
        sublist.addField('tranid', 'TEXT', 'Reference Number');
        sublist.addField('entity', 'TEXT', 'Vendor');
        sublist.addField('trandate', 'TEXT', 'Date');
        sublist.addField('approvalstatus', 'TEXT', 'Approval Status');
        sublist.addField('custpage_pss_carrierbilledamount', 'CURRENCY', 'Carrier Billed Amount');
        sublist.addField('amount', 'CURRENCY', 'Amount');
      	sublist.addField('custpage_pss_difference', 'CURRENCY', 'Difference');
      	//sublist.setOrder('entity');
        //run existing saved search
        var fil = new Array();
        //fil[0] = new nlobjSearchFilter('type', null, 'is', 'bill');
        fil[0] = new nlobjSearchFilter('custbody_pss_audit_date', null, 'isempty');
        var col = new Array();
        col[0] = new nlobjSearchColumn('transactionnumber');
        col[1] = new nlobjSearchColumn('tranid');
        col[2] = new nlobjSearchColumn('entity');
        col[3] = new nlobjSearchColumn('trandate');
        col[4] = new nlobjSearchColumn('approvalstatus');
        col[5] = new nlobjSearchColumn('amount');
        col[6] = new nlobjSearchColumn('internalid');
      	col[7] = new nlobjSearchColumn('custbody_pss_carrierbilledamount');
        var searchResults = nlapiSearchRecord('transaction', 'customsearch_pss_vendor_bill_audit', fil, col);
        //additional sublist fields
        for (var i = 0; i < searchResults.length; i++){
          	var viewUrl = nsurl + nlapiResolveURL('RECORD', 'vendorbill', searchResults[i].getId(), 'VIEW');
          	var billedAmount = searchResults[i].getValue('custbody_pss_carrierbilledamount');
          	var calcAmount = searchResults[i].getValue('amount');
            var row = i + 1;
          	sublist.setLineItemValue('view', row, viewUrl);
          	sublist.setLineItemValue('internalid', row,searchResults[i].getValue('internalid'));
            sublist.setLineItemValue('tranid', row, searchResults[i].getValue('tranid'));
            sublist.setLineItemValue('entity', row, searchResults[i].getText('entity'));
            sublist.setLineItemValue('trandate', row, searchResults[i].getValue('trandate'));
            sublist.setLineItemValue('approvalstatus', row, searchResults[i].getText('approvalstatus'));
          	sublist.setLineItemValue('custpage_pss_carrierbilledamount', row, searchResults[i].getValue('custbody_pss_carrierbilledamount'));
            sublist.setLineItemValue('amount', row, searchResults[i].getValue('amount'));
          	sublist.setLineItemValue('custpage_pss_difference', row, billedAmount - calcAmount);
        }
        response.writePage(form);
    }
    if (request.getMethod() == 'POST') {
        var req = request.getLineItemCount('custpage_sublist_id');
      	var tNow = getTodayShortDate();
        for (var i = 1; i < req + 1; i++) {
            var vals = request.getLineItemValue('custpage_sublist_id', 'custrecord_pss_bill_selected', i);
            if (vals == 'T') {
                var intId = request.getLineItemValue('custpage_sublist_id', 'internalid', i);
              	var recordLine = nlapiLoadRecord('transaction', intId);
              	recordLine.setFieldValue('paymenthold', 'F');
              	recordLine.setFieldValue('custbody_pss_audit_date', tNow);
              	recordLine.setFieldValue('custbody_pss_status', 4);
              	var auditedLine = nlapiSubmitRecord(recordLine);
            }
        }
        nlapiLogExecution('DEBUG', 'WhasamattaU', 'Bills Selected are: ' + recordLine);
        window.location.reload('true');
    }
}