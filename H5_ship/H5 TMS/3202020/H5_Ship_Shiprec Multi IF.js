function SelectFulfillmentsToShip(request, response) {

    var eventHandler = {};
    var used = request.getMethod().toString();
    eventHandler['GET'] = handleGet;
    eventHandler['POST'] = handlePost;
  
    if(typeof  eventHandler[used] !== 'function' ){
      return;
    }
  eventHandler[request.getMethod()]();
  }
  
  function handleGet(){
    var form = nlapiCreateForm('Pick Customer');
  
    var script = "customscript_h5_shiprec_multi_if_cs";
    form.setScript('customscript_h5_shiprec_multi_if_cs');
  
  
    form.addSubmitButton('Submit');
    form.addResetButton();
  
    //form.addField(name, type, label, sourceOrRadio, tab);
    form.addField('custpage_h5_customer', 'select', 'Select Customer', 'customer');
    response.writePage(form);
  }
  
  function handlePost(){
      var form = nlapiCreateForm('Select Item Fulfillments to Ship');
      var script = "customscript_h5_shiprec_multi_if_cs";
      form.setScript('customscript_h5_shiprec_multi_if_cs');
      form.addSubmitButton('Submit');
      form.addButton('shiprec', 'Create Shipment', 'onFieldChange()');
      form.addResetButton();
      var resultCustomer = form.addField('custpage_h5_customer2', 'select', 'Select Customer', 'customer');
      //resultCustomer.setDefaultValue(request.getParameter('custpage_h5_customer'));
      var custForSearch = request.getParameter('custpage_h5_customer');
      resultCustomer.setDisplayType('inline');
      sublist = form.addSubList('custpage_sublist_id', 'list', 'Open Item Fulfillments');
      sublist.addField('selected', 'checkbox', 'Selected');
      sublist.addField('trandate', 'date', 'Order Date', 'trandate');
      sublist.addField('tranid', 'text', 'Fulfillment #', 'tranid');
      //sublist.addField('createdfrom', 'text', 'Sales Order #', 'createdFrom');
      //sublist.addField('entityid', 'text', 'Customer', 'customerMain');
      //sublist.addField('memo', 'text', 'memo');
     sublist.addField('amount', 'text', 'amount');
      //sublist.addField('shipaddress1', 'text', 'Ship To', 'shipaddress1');
      sublist.addField('internalid', 'text', 'internalid');
      var itemfulfillmentSearch = nlapiSearchRecord("itemfulfillment",null,
          [
              ["type","anyof","ItemShip"],
              "AND",
              ["status","noneof","ItemShip:C"],
              "AND",
              ["name","anyof",custForSearch],
              "AND",
              ["mainline","is","T"]
          ],
          [
              new nlobjSearchColumn("trandate"),
              new nlobjSearchColumn("tranid"),
              new nlobjSearchColumn("amount"),
              //new nlobjSearchColumn("tranid","createdFrom",null),
              //new nlobjSearchColumn("entityid","customerMain",null),
              //new nlobjSearchColumn("memo"),
              //new nlobjSearchColumn("shipaddress1","createdFrom",null),
              new nlobjSearchColumn("internalid")
          ]
      );
      sublist.setLineItemValues(itemfulfillmentSearch);
  
      response.writePage(form);
  }
  