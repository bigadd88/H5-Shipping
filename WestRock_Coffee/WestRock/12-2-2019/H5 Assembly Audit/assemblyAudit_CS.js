function assemblyBuildAudit(x){
  /*Load the assembly item
   * Build our own array
   * load assembly build transaction
   * build an array from the assembly build transaciton
   * Compare the two objects
   * build combined array
   * build html table string
   * set the inner html to table of the combined array
   *
   * we'll need another page*Suitelet template page
   */
   if(x == null){
     alert('Insufficent Parameter, please provide an assembly build ID in the url, append "&assemblybuild=#" to the url and reload the page')
   }


   buildId = x;

  // This array should contain just the item parts

  //members will be in this record
  inCompleteQty = [];
  inCompleteParts = [];
  var buildRec = nlapiLoadRecord('assemblybuild', Number(buildId));
  var tranid = buildRec.getFieldValue('tranid');
  var itemName = buildRec.getFieldValue('item');
    //  buildRec.getFieldText('item'); // THIS LINE BREAKS THE SCRIPT WE MAY NEED TO SEND TO A BACKEND TO RETURN THE NAME
    //var name = 'no name';
  var totalBuilt = buildRec.fields.quantity;
  for (var i = 1; i < buildRec.lineitems.component.length; i++) {
    // now we pull out the actual items used in the buildRec
    inCompleteParts.push(buildRec.lineitems.component[i].compitemname);
    inCompleteQty.push(buildRec.lineitems.component[i].quantity);
  }
  itemParts = [];
  itemQty =[];
  itemDisplay = [];
 var itemRec = nlapiLoadRecord('assemblyitem',itemName);
 for (var i = 1; i <  itemRec.lineitems.member.length; i++) {
   temp = itemRec.lineitems.member[i].item_display.split(' ');
   itemDisplay.push(itemRec.lineitems.member[i].item_display);
   itemParts.push(temp[0]);
   itemQty.push(itemRec.lineitems.member[i].quantity);
 }
   // Now we see what is missing in the build
   tableData = '';
   missingData = [];
    for (var i = 1; i < itemParts.length; i++) {
          if(inCompleteParts.includes(itemParts[i]) == false){
            console.log('we need: '+itemParts[i]);
            missingData.push(i);
          }
          else{
            j = inCompleteParts.indexOf(itemParts[i]);
            //begin build up of html table with Qty's

            theoreticalUsed = Number(itemQty[i])*Number(totalBuilt);
            difference = Number(inCompleteQty[j])-Number(theoreticalUsed);
            yeildlost = Number(difference)/Number(theoreticalUsed);
            ylp = yeildlost *100;
            ylp = ylp.toString();
            ylp = ylp.substring(0,5);
            tableData += "<tr><td>"+itemDisplay[i]+"</td><td><input type='checkbox' disabled='disabled' checked='checked'></input></td><td>"+itemQty[i]+"</td><td>"+theoreticalUsed+"</td><td>"+inCompleteQty[j]+"</td> <td>"+ylp+"%</td></tr>";
          }
      }


      for (var i = 0; i < missingData.length; i++) {
        // This will be formatted to account for missing data peices
        theoreticalUsed = Number(itemQty[missingData[i]])*Number(totalBuilt);
        tableData += "<tr><td>"+itemDisplay[missingData[i]]+"</td><td> <input type='checkbox' disabled='disabled'></input> </td><td>"+itemQty[missingData[i]]+"</td><td>"+theoreticalUsed+"</td><td>"+difference+"</td> <td>"+yeildlost+"%</td></tr>";
      }
      // through here it just tells us what parts we are missing form the complete build







  //actual consumption is in this transaction
	//components are a sub array
  var tableBlock1 =  "<div  id='myTable' class='table-responsive' sytle='width:100%'>"
                +"<table id='tablecontainer' class='table table-bordered table-responsive table-hover table-striped center'>"
                +"<thead>"
                    +"<tr>"
                    +"<th>Component</th> <th>Used in Build</th> <th>Base Components</th> <th>Theoretical Total</th> <th>Actual Total</th> <th>Yield % Loss</th>"
                    +"</tr>"
                +"</thead>"
                +"<tbody>"
                   + tableData
                +"</tbody>"
              +"</table>"
              +"</div>";
  document.getElementById('name').innerHTML  = itemRec.fields.displayname;
  document.getElementById('Qty').innerHTML   = itemRec.fields.itemid;
  document.getElementById('extra').innerHTML = totalBuilt+ " Built" ;
  document.getElementById('table').innerHTML = tableBlock1;
}
