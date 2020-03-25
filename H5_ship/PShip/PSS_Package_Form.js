/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 *@NModuleScope SameAccount
 *@contents suitelet-form
 */
define(["N/search", "N/ui/serverWidget", "N/url", "N/record", "N/log"], function (s, ui, url, rec, log){
  function onRequest(context){
    var shipparentId = context.request.parameters.reqURL;
    if (context.request.method === 'GET'){
       var form = ui.createForm({
        title: 'Shipment Package Form'
      });
      var fldgrp1 = form.addFieldGroup({
        id: 'fldgrp1',
        label: 'Primary Info'
      });
      var fldgrp2 = form.addFieldGroup({
        id: 'fldgrp2',
        label: 'Dimensions'
      });
      var fldgrp3 = form.addFieldGroup({
        id: 'fldgrp3',
        label: 'Submit'
      });
      var headfld = form.addField({
        id: 'custrecord_pss_shipment_parent',
        type: ui.FieldType.TEXT,
        label: 'Parent Shipment ID'
      });
      headfld.updateDisplayType({
        displayType: ui.FieldDisplayType.INLINE
      });
      headfld.defaultValue = shipparentId;
      var inlineField = form.addField({
        id: 'custpage_pss_ilh_refbrowser',
        type: ui.FieldType.INLINEHTML,
        label: 'Refresh Parent Browser Window',
        defaultValue: '<script type="text/javascript">window.onunload = function(e){window.opener.location.reload();};</script>'
      });
      var fld1 = form.addField({
        id: 'custrecord_pss_pkgnumber',
        type: ui.FieldType.TEXT,
        label: 'Package Number',
        container: 'fldgrp1'
      });
      var fld2 = form.addField({
        id: 'custrecord_pss_piece_count',
        type: ui.FieldType.TEXT,
        label: 'Piece Count',
        container: 'fldgrp1'
      });
      var fld3 = form.addField({
        id: 'custrecord_pss_packagetype',
        type: ui.FieldType.SELECT,
        label: 'Package Type',
        container: 'fldgrp1',
        source: 'customlist_pss_package_type'
      });
      /*var fld4 = form.addField({
        id: 'custrecord_pss_inventoryunits',
        type: ui.FieldType.TEXT,
        label: 'Inventory Count',
        container: 'fldgrp1'
      });*/
      var fld5 = form.addField({
        id: 'custrecord_pss_nmfc_number_line',
        type: ui.FieldType.SELECT,
        label: 'NMFC',
        container: 'fldgrp1',
        source: 'customrecord_pss_nmfc_classification'
      });
      var fld6 = form.addField({
        id: 'custrecord_pss_hazmat',
        type: ui.FieldType.CHECKBOX,
        label: 'Hazmat',
        container: 'fldgrp1'
      });
      var fld7 = form.addField({
        id: 'custrecord_pss_weight',
        type: ui.FieldType.TEXT,
        label: 'Weight',
        container: 'fldgrp2'
      });
      var fld8 = form.addField({
        id: 'custrecord_pss_length',
        type: ui.FieldType.TEXT,
        label: 'Length',
        container: 'fldgrp2'
      });
      var fld9 = form.addField({
        id: 'custrecord_pss_width',
        type: ui.FieldType.TEXT,
        label: 'Width',
        container: 'fldgrp2'
      });
      var fld10 = form.addField({
        id: 'custrecord_pss_height',
        type: ui.FieldType.TEXT,
        label: 'Height',
        container: 'fldgrp2'
      });
      var bttn1 = form.addButton({id:'bttn1_printBOL',label:'PrintBOL',container:'fldgrp2'});

      
      form.addSubmitButton({
        label: 'Submit',
      });
    context.response.writePage(form);
    } else {
      var delimiter = /\u0001/;
      var pkgnum = context.request.parameters.custrecord_pss_pkgnumber;
      var piececnt = context.request.parameters.custrecord_pss_piece_count;
      var pkgtype = context.request.parameters.custrecord_pss_packagetype;
      var invunits = context.request.parameters.custrecord_pss_inventoryunits;
      var nmfcId = context.request.parameters.custrecord_pss_nmfc_number_line;
      var weight = context.request.parameters.custrecord_pss_weight;
      var length = context.request.parameters.custrecord_pss_length;
      var width = context.request.parameters.custrecord_pss_width;
      var height = context.request.parameters.custrecord_pss_height;
      var hazmat = context.request.parameters.custrecord_pss_hazmat;
      var shparentId = context.request.parameters.custrecord_pss_shipment_parent;
      var nmfcNumber = s.lookupFields({
        type: 'customrecord_pss_nmfc_classification',
        id: nmfcId,
        columns: ['custrecord_pss_nmfc_num']
      });
      var nmfcNumber = s.lookupFields({
        type: 'customrecord_pss_nmfc_classification',
        id: nmfcId,
        columns: ['custrecord_pss_dim_item']
      });
      var recObj = rec.create({
        type: 'customrecord_pss_shipment_line'
      });
      recObj.setValue({
        fieldId: 'custrecord_pss_pkgnumber',
        value: pkgnum
      });
      recObj.setValue({
        fieldId: 'custrecord_pss_piece_count',
        value: piececnt
      });
      recObj.setValue({
        fieldId: 'custrecord_pss_packagetype',
        value: pkgtype
      });
      /*recObj.setValue({
        fieldId: 'custrecord_pss_inventoryunits',
        value: invunits
      });*/
      recObj.setValue({
        fieldId: 'custrecord_pss_nmfc_number_line',
        value: nmfcId
      });
      recObj.setValue({
        fieldId: 'custrecord_pss_weight',
        value: weight
      });
      recObj.setValue({
        fieldId: 'custrecord_pss_length',
        value: length
      });
      recObj.setValue({
        fieldId: 'custrecord_pss_width',
        value: width
      });
      recObj.setValue({
        fieldId: 'custrecord_pss_height',
        value: height
      });
      recObj.setValue({
        fieldId: 'custrecord_pss_shipment_parent',
        value: shparentId
      });
      var packageId = recObj.save({});
      //context.response.write('Package Created');
      context.response.sendRedirect({
    	type: 'SUITELET',
    	identifier: 'customscript_pss_package_form',
        id: 'customdeploy_pss_package_form',
    	parameters: {reqURL: shparentId}
		});
    }
 }
  return {
    onRequest: onRequest
  };
});