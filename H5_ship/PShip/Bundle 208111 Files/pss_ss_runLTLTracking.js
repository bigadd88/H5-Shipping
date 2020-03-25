/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/search', 'N/record', 'N/email', 'N/runtime'],
    function(search, record, email, runtime) {
        function execute(context) {
            if (context.type !== context.InvocationType.ON_DEMAND)
                return;
            var searchId = runtime.getCurrentScript().getParameter("custscript_pss_searchid");
            try {
                search.load({
                    id: searchId
                }).run().each(function(result) {
                    log.debug({
                        details: 'loaded shipment ' + result.id + ' to track'
                    });
                    var parentShipment = record.load({
                        type: 'custrecord_pss_shipment',
                        id: 15,
                        isDynamic: true
                    });
                    var lineCount = parentShipment.getLineCount('item');
                    for (var i = 0; i < lineCount; i++) {
                        parentShipment.setSublistValue('item', 'location', i, 1);
                    }
                    var fulfillmentId = parentShipment.save();
                    var so = record.load({
                        type: record.Type.SALES_ORDER,
                        id: result.id
                    });
                    so.setValue('memo', fulfillmentId);
                    so.save();
                    return true;
                });
            } catch (e) {
                var subject = 'Fatal Error: Unable to transform salesorder to item fulfillment!';
                var authorId = -5;
                var recipientEmail = 'robert.regnier@priority-logistics.com';
                email.send({
                    author: authorId,
                    recipients: recipientEmail,
                    subject: subject,
                    body: 'Fatal error occurred in script: ' + runtime.getCurrentScript().id + '\n\n' + JSON.stringify(e)
                });
            }
        }
        return {
            execute: execute
        };
    });