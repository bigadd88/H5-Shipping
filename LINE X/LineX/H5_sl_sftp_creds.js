/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(["N/ui/serverWidget","N/log", "N/sftp", "N/file"], function (serverWidget, log, sftp, file) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            var form = serverWidget.createForm({
                title: "Guid Form"
            });
            form.addField({
                id: 'username',
                type: serverWidget.FieldType.TEXT,
                label: 'Username'
            });
            form.addCredentialField({
                id: 'password',
                label: 'Password',
                restrictToScriptIds: 'customscript_h5_sftp_credentials',
                restrictToDomains: ['na.ondemand.esker.com'],
            });
            form.addSubmitButton({
                label: 'Submit Button'
            });
            context.response.writePage(form);
            return;
        } else {
            var request = context.request;
            var myPwdGuid = request.parameters.password;
            log.debug("myPwdGuid", myPwdGuid);
            context.response.write(myPwdGuid);
            //adding connection here for testing
            var myHostKey = 'AAAAB3NzaC1yc2EAAAADAQABAAABAQCc8LQv5wb5pysD5jAMOSbn4aSNceeJ4qBhsV8yjp5wBYgmd5ZI+1JpR01Xib6sjwS8NPnsrQFW+60SEnHJU/SxKRljgAxoy4kEugCys6pBuKR2YqPBFNdhadIlrVdb4Yt7yKAafPtP5GnIHkQaDkQMxHw1/EkEctfSPXYSt2Tz/Jrz7VeAOYsWwm488i1v8m//o4vqpKtwDO4FaINHKFD+08xWcf73M2v3uxdEQFjjuYvMrH5sTBBVtsWbL4h7W9p9cegOovQBzjMnxP/emb3Pa4z/AGPPJYu8lZPAeZisNH7gywItVD7RLQxo8roQ3QbYkFxndQgkV+r2odVhTYeR';
            var connection = sftp.createConnection({
                username: 'Invoices@05283962.100025597',
                passwordGuid: myPwdGuid,
                url: 'na.ondemand.esker.com',
                directory: '/In_MasterData',
                hostKey: myHostKey,
                hostkeytype: 'ecdsa',
                port: 22
            });
            var myFileToUpload = file.create({
                name: 'file.txt',
                fileType: file.Type.PLAINTEXT,
                contents: 'Line-X test'
            });
            connection.upload({
                directory: '/In_MasterData',
                filename: 'file.txt',
                file: myFileToUpload,
                replaceExisting: true
            });
        }
    }

    return {
        onRequest: onRequest
    };
})

    // function mainFunc(context) {
    //     var myHostKey = "na.ondemand.esker.com”;
    //     var connection = sftp.createConnection({
    //         username: 'Invoices@05283962.100025597',
    //         passwordGuid: myPwdGuid,
    //         url: 'sftp://na.ondemand.esker.com’,
    //         directory: '/Ln_MasterData',
    //         hostKey: myHostKey,
    //         port: 22
    //     });
    // });




