define(['N/ui/serverWidget','N/search','N/log'], function(ui, s, log) {
/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 *@contents suitelet-results
 *@copyright 2017 Priority Suite
 *@author Andy Reeder <andy.reeder@priority-logistics.com>
 *@NModuleScope SameAccount
 */
  var contents = {};

  /**
   * @param context
   * 		{Object}
   * @param context.request
   * 		{ServerRequest}
   * @param context.response
   * 		{ServerResponse}
   *
   * @return {void}
   * @static
   * @function onRequest
   */
  function onRequest(context){
    //TODO
    log.audit({title: "Request Received!"});

    context.response.writePage({
      pageObject: renderForm()
    });
  }
  
  function renderForm(results){
  log.audit({title: "Rendering Data..."});
  var form = ui.createForm({title: "Select Available Rates"});
  var sublist = form.addSublist({
    id: 'custpage_rates_sublist',
    label: 'Avaialable Rates',
    type: 'LIST'
  });
  sublist.addField({
    id: "custrecord4",
    type: ui.FieldType.IMAGE,
    label: "Select"
  });
  sublist.addField({
    id: "internalid",
    type: ui.FieldType.TEXT,
    label: "id"
  });
  sublist.addField({
    id: "custrecord_pri_carrierlogo",
    type: ui.FieldType.IMAGE,
    label: "logo"
  });
  sublist.addField({
    id: "custrecord_pri_ratepassvendor",
    type: ui.FieldType.TEXT,
    label: "vendor"
  });
  sublist.addField({
    id: "custrecord_pri_totalshipmentcost",
    type: ui.FieldType.TEXT,
    label: "Total Cost"
  });
  sublist.addField({
    id: "custrecord_pri_ratepass_origin_zip",
    type: ui.FieldType.TEXT,
    label: "Origin Zip"
  });
  sublist.addField({
    id: "custrecord_pri_ratepass_destination_zip",
    type: ui.FieldType.TEXT,
    label: "Destination Zip"
  });
  sublist.addField({
    id: "custrecord_pri_ratepass_weight",
    type: ui.FieldType.TEXT,
    label: "Weight"
  });
  sublist.addField({
    id: "custrecord_pri_ratepass_class",
    type: ui.FieldType.TEXT,
    label: "Class"
  });
  sublist.addField({
    id: "custrecord_pri_ratepass_pf_code",
    type: ui.FieldType.TEXT,
    label: "PFC"
  });
  sublist.addField({
    id: "custrecord_pri_ratepass_client_code",
    type: ui.FieldType.TEXT,
    label: "ClientCode"
  });
  
  sublist.setSublistValue({rows: results});
  sublist.addMarkAllButtons();
  sublist.addButton({
    id: "custpage_rateSubmitBttn",
    label: "Submit"
  });
  return form;
}
  function getRates(){
    log.audit({title: "Generating Rates List..."});

    return s.create({
      type: 'customrecord_pli_ratepass_line',
      id: '10',
      filters: [
          ],
      columns: [
          "custrecord4",
          "internalid",
          "custrecord_pri_carrierlogo",
          "custrecord_pri_ratepassvendor",
          "custrecord_pri_totalshipmentcost",
          "custrecord_pri_ratepass_origin_zip",
          "custrecord_pri_ratepass_destination_zip",
          "custrecord_pri_ratepass_weight",
          "custrecord_pri_ratepass_class",
          "custrecord_pri_ratepass_pf_code",
          "custrecord_pri_ratepass_client_code",
        ],
      }).run().getRange({start: 0, end: 200});
  }
  contents.onRequest = onRequest;
  return contents;
});
