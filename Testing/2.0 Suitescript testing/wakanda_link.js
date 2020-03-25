/**
 * @NApiVersion 2.x
 */

require(['N/record'], function(record) {
    function createAndSaveContactRecordWithPromise() {
        var nameData = {
            firstname: 'John',
            middlename: 'Doe',
            lastname: 'Smith'
        };
        var createRecordPromise = record.create.promise({
            type: record.Type.CONTACT,
            isDynamic: true
        });

        createRecordPromise.then(function(objRecord) {
            console.log('start evaluating promise content');
            objRecord.setValue({
                fieldId: 'subsidiary',
                value: '1'
            });
            for ( var key in nameData) {
                if (nameData.hasOwnProperty(key)) {
                    objRecord.setValue({
                        fieldId: key,
                        value: nameData[key]
                    });
                }
            }
            var recordId = objRecord.save({
                enableSourcing: false,
                ignoreMandatoryFields: false
            });
        }, function(e) {
            log.error('Unable to create contact', e.name);
        });
    }
    createAndSaveContactRecordWithPromise();
});
