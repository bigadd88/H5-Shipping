function deleteAckFiles() {
  	nlapiLogExecution('debug', 'Start of script', 'Checking for files to delete');
    var ackFiles = nlapiSearchRecord("file", null,
        [
            ["folder", "anyof", "3213046"]
        ],
        [
            new nlobjSearchColumn("name"),
            new nlobjSearchColumn("internalid")
        ]
    );

    if (ackFiles != null) {
        nlapiLogExecution('debug', 'files to delete', ackFiles.length);
        // nlapiSendEmail(author, recipient, subject, body, cc, bcc, records, attachments, notifySenderOnBounce, internalOnly, replyTo);
        // nlapiSendEmail(25149, 1583, 'Starting processing', 'Starting processing of ' + inboundsToProcess.length + ' invoices.');
        for (i = 0; i < ackFiles.length; i++) {
            var xmlFileId = ackFiles[i].getValue('internalid');
            nlapiDeleteFile(xmlFileId);
        }
    }
}