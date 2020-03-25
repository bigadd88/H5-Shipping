/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 *@NModuleScope SameAccount
 *@contents suitelet-form
 */
define(["N/search", "N/ui/serverWidget", "N/url", "N/log"], function (s, ui, url, log){
	function onRequest(context){
    var packAssist = ui.createAssistant({
                title: 'PriorityShip Configuration Wizard'
            });
      		packAssist.setSplash({
            	title: 'Welcome to PriorityShip Configuration Wizard!',
    			text1: 'We can configure PriorityShip for out of the box operation.',
    			text2: 'Thanks for installing!'
            });
      		packAssist.addStep({
   				id : 'stepOne',
    			label : 'Select Parent Record',
              	stepNumber: 1
			});
      		packAssist.addStep({
              	id: 'stepTwo',
              	label: 'Select GL Account',
              	stepNumber: 2
            });
      		packAssist.addStep({
              	id: 'stepThree',
              	label: 'Select Rating Tariff',
              	stepNumber: 3
            });
      		packAssist.addStep({
              	id: 'finished',
              	label: 'Review Data and Save',
              	stepNumber: 4
            });
    if (context.request.method === 'GET'){
    	if (!packAssist.isFinished()) {
	        if (packAssist.getCurrentStep() == null) {
	            packAssist.setCurrentStep(packAssist.getStep("stepOne"));

                    //add splash screen
                    packAssist.setSplash("Welcome!", "Enter your details");
                }

                var step = packAssist.getCurrentStep();

                //display part
                if (step.getName() == 'stepOne') {

                    packAssist.addField("custpage_firstname", "text", "First Name");
                    packAssist.addField("custpage_lastname", "text", "Last Name");

                }

                else if (step.getName() == 'stepTwo') {

                    packAssist.addField("custpage_phone", "phone", "Phone");
                    packAssist.addField("custpage_email", "email", "E-mail");
                    packAssist.addField("custpage_address", "textarea", "Address");

                }

                else if (step.getName() == 'stepThree') {

                    packAssist.addField("custpage_empid", "text", "Employee ID");
                    packAssist.addField("custpage_companyname", "text", "Company Name");

                }

                else if (step.getName() == 'Finished') {

                    var personalDetails = packAssist.getStep('PersonalDetails');
                    var contactDetails = packAssist.getStep('ContactDetails');
                    var employementDetails = packAssist.getStep('EmployementDetails');

                    //fetching values from previous steps
                    var firstName = packAssist.getFieldValue('custpage_firstname');
                    var lastName = packAssist.getFieldValue('custpage_lastname');

                    var phone = contactDetails.getFieldValue('custpage_phone');
                    var email = contactDetails.getFieldValue('custpage_email');
                    var address = contactDetails.getFieldValue('custpage_address');

                    var empId = employementDetails.getFieldValue('custpage_empid');
                    var companyName = employementDetails.getFieldValue('custpage_companyname');

                    //displaying
                    packAssist.addField('custpage_displayfirstname', 'Label', "First Name : " + firstName);
                    packAssist.addField('custpage_displaylastname', 'Label', "Last Name : " + lastName);
                    packAssist.addField('custpage_displayphone', 'Label', "Phone : " + phone);
                    packAssist.addField('custpage_displayemail', 'Label', "Email : " + email);
                    packAssist.addField('custpage_displayaddress', 'Label', "Address : " + address);
                    packAssist.addField('custpage_displayempid', 'Label', "Employee ID : " + empId);
                    packAssist.addField('custpage_displaycompanyname', 'Label', "Company Name : " + companyName);

                    packAssist.addField('custpage_displaymessage', 'Label', "Click Finish to submit");

                }

            }

    context.response.writePage(packAssist);
    }
  }
  return {
    onRequest: onRequest
  };
});