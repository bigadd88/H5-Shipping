// JavaScript Document
// Written by Priority Suite
// 9 November 2018
// Purpose - recieves json from Zapier Zap:CruxSystems Webhook Receiver and creates a track pass
function ZapierWebhook(data) {
    //parse data from object
    var str = JSON.stringify(data);
    var jsdata = JSON.parse(str);
    nlapiLogExecution('DEBUG','JSON received', str);
    var containerStatus = jsdata.container.status;
    var containerNumber = jsdata.container.number;
    var containerDemurrage = jsdata.container.demurrage;
    var eventType = jsdata.event_type;
    var containerDepartedAt = jsdata.container.departed_at;
    var terminalName = jsdata.terminal_name;
    var vesselName = jsdata.vessel_name;
    var vesselETA = jsdata.vessel_eta;
    var vesselATA = jsdata.vessel_ata;
    var terminalTimezone = jsdata.terminal_timezone;
    var containerOtherHolds = jsdata.container.other_holds;
    var containerLastFreeDay = jsdata.container.last_free_day;
    var containerLocation = jsdata.container.location;
    var containerCustomsHold = jsdata.container.customs_hold;
    var containerLineHold = jsdata.container.line_hold;
    var containerDischargedAt = jsdata.container.discharged_at;
    var trackPass = nlapiCreateRecord('customrecord_h5_trackpass_line');
    //set final variables to submit record
    trackPass.setFieldValue('custrecord_h5_tpass_shipment_id', 123457065);
    trackPass.setFieldValue('custrecord_h5_tpass_statusraw', containerStatus);
    trackPass.setFieldValue('custrecord_h5_tpass_carriernotes', '"Container": ' + containerNumber + ' last at "terminal": ' + terminalName + ' on "Vessel": ' + vesselName + ' with "ETA": ' + vesselETA);
    trackPass.setFieldValue('custrecord_h5_tpass_timestampraw', containerDepartedAt);
    //trackPass.setFieldValue('custrecord_h5_tpass_retrievaldatetime', newDate());
    trackPass.setFieldValue('custrecord_h5_cont_demurrage', containerDemurrage);
    trackPass.setFieldValue('custrecord_h5_tpass_cont_event_type', eventType);
    trackPass.setFieldValue('custrecord_h5_tpass_cont_departed_at', containerDepartedAt);
    trackPass.setFieldValue('custrecord_h5_tpass_cont_terminal_name', terminalName);
    trackPass.setFieldValue('custrecord_h5_tpass_cont_vessel_name', vesselName);
    trackPass.setFieldValue('custrecord_h5_tpass_cont_vessel_eta', vesselETA);
    trackPass.setFieldValue('custrecord_h5_tpass_cont_vessel_ata', vesselATA);
    trackPass.setFieldValue('custrecord_h5_tpass_cont_termtimezone', terminalTimezone);
    trackPass.setFieldValue('custrecord_h5_tpass_cont_other_holds', containerOtherHolds);
    trackPass.setFieldValue('custrecord_h5_tpass_cont_last_free_day', containerLastFreeDay);
    trackPass.setFieldValue('custrecord_h5_tpass_cont_location', containerLocation);
    trackPass.setFieldValue('custrecord_h5_tpass_cont_customs_hold', containerCustomsHold);
    trackPass.setFieldValue('custrecord_h5_tpass_cont_line_hold', containerLineHold);
    trackPass.setFieldValue('custrecord_h5_tpass_cont_discharged_at', containerDischargedAt);
    nlapiSubmitRecord(trackPass);
    nlapiLogExecution('DEBUG', 'Restlet Complete', 'Track Pass Created: ' + trackPass.getId());
    return (200);
}