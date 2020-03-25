/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope Public
 */
 
define(['N/record'], 
/**
  * Module params:
  * @param {record} record
*/
    function(record) {
/**
    * Definition of the Suitelet script trigger point.
    *
    * @param {Object} context
    * @param {ServerRequest} context.request - Encapsulation of the incoming request
    * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
    * @Since 2015.2
*/
        function onRequest(context) {
            var response = context.response;
            log.debug({
                title: 'Script Started',
                details: 'GOOD LOG'
            });
       //var invStringData = `{"date":"2020-03-12T17:47:22.120Z","customer":"3687411","lineItems":[{"qty":20,"price":19.4,"total":388,"item":"3912"}]}`;
            //var newJson = JSON.parse(invStringData);0
            
            var date = new Date();
            // var day = date.getDate();
            // var month = date.getMonth() +1;
            // var year = date.getFullYear();
            // var netDate = month +'/'+ day +'/'+ year;
            
            //var lineItems = newJson.lineItems;
            // Create the invoice. 
            log.debug({
                title: 'Script Started',
                details: 'GOOD LOG'
            });
            var invRec = record.create({
                type: record.Type.INVOICE,
                isDynamic: false
            });

      
            // Set body fields on the Invoice.

            invRec.setValue({
                fieldId: 'trandate',
                value: date
            });

            invRec.setValue({
                fieldId: 'entity',
                value: 11506
            });

            invRec.setValue({
                fieldId: 'subsidiary',
                value: 6
            });
            invRec.setValue({
                fieldId: 'location',
                value: 65
            });

            // Create one line in the item sublist.

            invRec.setSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: 0,
                value: 3912
            });

            invRec.setSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                line: 0,
                value: 1
            });

            invRec.setSublistValue({
                sublistId: 'item',
                fieldId: 'rate',
                line: 0,
                value: '19.4'
            });


            // Create the subrecord for that line.
            log.debug({
                title: 'Script Started',
                details: 'Before sublist record'
            });

            var subinvRec = invRec.getSublistSubrecord({
                sublistId: 'item',
                line: 0,
                fieldId: 'inventorydetail'
            });


            // Add a line to the subrecord's inventory assignment sublist.

            subinvRec.setSublistValue({
                sublistId: 'inventoryassignment',
                fieldId: 'quantity',
                line: 0,
                value: 1
            });

            subinvRec.setSublistValue({
                sublistId: 'inventoryassignment',
                fieldId: 'receiptinventorynumber',
                line: 0,
                value: '021120-001-13176'
            });


            // Save the line in the subrecord's sublist.

        
        
            // Save the line in the record's sublist

            
            // Save the record.

            try {

                var recId = invRec.save();
                
                log.debug({
                    title: 'Record created successfully',
                    details: 'Id: ' + recId
                });

            } catch (e) {
             
                log.error({
                    title: e.name,
                    details: e.message      
                });
            }
     
        
        return response.write('200');
    }
    return {
        onRequest: onRequest
    };
    }); 