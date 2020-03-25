 function SelectFulfillmentsToShip(request, response) {

  var eventHandler = {};
  var used = request.getMethod().toString();
  eventHandler['GET'] = handleGet;
  //eventHandler['POST'] = handlePost;

  if(typeof  eventHandler[used] !== 'function' ){
    return;
  }
eventHandler[request.getMethod()]();
}

function handleGet(){
  var lotForSearch = request.getParameter('custpage_assembly_build');
  var form = nlapiCreateForm('lot Searcher');
    form.setScript('customscript_h5_assembly_cost_cs');
    var data = grabWestRockData();
    //form.addSubmitButton('Submit');
    //form.addResetButton();

    var results;
    var select = form.addField('custpage_h5_lot_id', 'select', 'Select an Assembly Build ID');
    var htmlInstruct = form.addField('custpage_p1', 'inlinehtml').setLayoutType('outsidebelow');

    var assemblyBuildIds =[];
    for(i=0;i<data.length;i++){
      // USED assemblybuildSearch[i].id in console
      assemblyBuildIds.push(data[i][0].id);

    }
    var uniq = uniques(assemblyBuildIds);


      //  form.addField('custpage_lotid', 'text', 'Add a Lot_Id' );
    // select.addSelectOption({value:value,text:text,isSelected:isSelected})
    select.addSelectOption('','',false);
    for(var i=0;i<uniq.length;i++){
      if(lotForSearch==uniq[i]){
        select.addSelectOption(uniq[i],uniq[i],true);
        //nlapiSetFieldValue('custpage_lotid',lotForSearch,false);
      } else{
      select.addSelectOption(uniq[i],uniq[i],false);
    }
    }


    var totalQty = 0;
    var totalTotals = [];
    var totalCost =0;
    for(var i=0;i<data.length;i++){
      for(var x=0;x<data[i].length;x++){
        if(Number(data[i][x].quantity)<0){

          totalQty += Number(data[i][x].quantity)*(-1);
          totalCost += Number(data[i][x].amount)*(-1);
      }
    }
      totalTotals.push({
        QuantityTotal : Math.ceil(totalQty),
        CostTotals : Math.ceil(totalCost)
      })

      totalQty =0;
      totalCost =0;
    }


    var sublist = form.addSubList('custpage_sublist_id', 'list', 'Rates List');
    // sublist.addField('internalid', 'TEXT', 'Id');
    sublist.addField('assemblyid','TEXT','Item Id');
    sublist.addField('displayname','TEXT','Name');
      
    sublist.addField('trandate','TEXT','trandate');
    sublist.addField('type','TEXT','type');
    sublist.addField('tranid','TEXT','tranid');
    sublist.addField('entity','TEXT','entity');

    sublist.addField('quantity','TEXT','Quantity');
    sublist.addField('amount','CURRENCY','Cost');
    sublist.addField('built','integer','Amount produced');


  //      "<table id='tablecontainer' class='table'><tbody> <tr>    <td>Hank</td>     <td>Egypt</td>     <td>9</td>     </tr> <tr>    <td>Steve</td>     <td>Rowanda</td>     <td>5</td>     </tr> <tr>    <td>John</td>     <td>Pakistan</td>     <td>3</td>     </tr> </tbody></table> "


      if(lotForSearch != null){
      var found=0;
      for(var i=0;i<uniq.length;i++){
        if(lotForSearch==uniq[i]){
        found = i;
      }
      var date = new Date();
      var month =   date.getMonth()+1;
      var day =     date.getDate();
      var year =    date.getFullYear();
      var dateString = month + '/' + day + '/' + year;
      }
       htmlInstruct.setDefaultValue('<div width="100%"><table id= "tablecontainer " class= "table" width="100%" height="100%" cellspacing="2" cellpadding="2" border="0" align="center" bgcolor="#dddddd" style="font-size:16px">'
       +'<tbody> <tr  bgcolor="#ffffff"><td><b>Date Range</b></td><td>'+data[found][0].trandate +' : '+dateString+'</td></tr> '
       +'  <tr><td><b>Quantity Built</b></td><td>'+totalTotals[found].QuantityTotal+'</td></tr>'
       +'  <tr bgcolor="#ffffff"><td><b>Build Cost</b></td><td>'+totalTotals[found].CostTotals+'</td></tr>'
                                                                       // this is always rounded up to next whole value ie: 1.2 -> 2
       +'  <tr ><td><b>Average Build Cost</b></td><td>'+Math.ceil((totalTotals[found].QuantityTotal/totalTotals[found].CostTotals))+'</td></td></tr>'
       +' </tbody></table></div><br><br>');
    // htmlInstruct.setDefaultValue('<div width="100%">'
    // +' <p style="font-size:20px"><b>Date Range: </b>9-10-1990 : 9-10-2000</p> '
    //
    // +'    <p style="font-size:20px"><b>Quantity Built</b>'+totalTotals[found].QuantityTotal+'</p>'
    //                                                     // this is always rounded up to next whole value ie: 1.2 -> 2
    // +'    <p style="font-size:20px"><b>Average Build Cost</b>'+Math.ceil((totalTotals[found].QuantityTotal/totalTotals[found].CostTotals))+'</p>'
    // +'     </div><br><br>');

        sublist.setLineItemValues(data[found]);
} else {
  htmlInstruct.setDefaultValue('<div width="100%"><table id= "tablecontainer " class= "table" width="100%" height="100%" cellspacing="2" cellpadding="2" border="0" align="center" bgcolor="#dddddd" style="font-size:16px">'
  +'<tbody> <tr  bgcolor="#ffffff"><td><b>Date Range</b></td><td></td></tr> '
  +'  <tr><td><b>Quantity Built</b></td><td></td></tr>'
  +'  <tr bgcolor="#ffffff"><td><b>Build Cost</b></td><td></td></tr>'
                                                                  // this is always rounded up to next whole value ie: 1.2 -> 2
  +'  <tr ><td><b>Average Build Cost</b></td><td></td></td></tr>'
  +' </tbody></table></div><br><br>');
}

//    htmlInstruct.setDefaultValue('<div width="100%"><table id= "tablecontainer " class= "table" width="100%" height="100%" cellspacing="2" cellpadding="0" border="0" align="center" bgcolor="#dddddd">'
//    +'<tbody> <tr  bgcolor="#ffffff"><td><b>Date Range</b></td><td>9-10-1990</td><td>9-10-2000</td></tr> '
//    +'  <tr><td><b>Quantity Built</b></td><td>0</td><td></td></tr>'
//    +'  <tr  bgcolor="#ffffff"><td><b>Average Build Cost</b></td><td>0</td><td>"This is the ceiling"</td></tr>'
  //  +' </tbody></table></div><br><br>');



    response.writePage( form);
}

function handlePost(){
  var lotForSearch = request.getParameter('custpage_lotid');
  var form = nlapiCreateForm('lot Searcher');
  sublist = form.addSubList('custpage_sublist_id', 'list', 'Rates List');
  form.addField('custpage_lotid', 'text', 'Add a Lot_Id' );
  form.setScript('customscript_h5_westrock_lotid_cs');
  form.addButton('submitForm', 'Submit', 'SubmitForm()');

  var results = nlapiSearchRecord('customrecord_h5_farmer_data',null,
 [
    ['custrecord_h5_lot_id','is',lotForSearch]
 ],
 [
    new nlobjSearchColumn('custrecord_h5_lot_id').setSort(false),
    new nlobjSearchColumn('custrecord_h5_farmer_name'),
    new nlobjSearchColumn('custrecord_h5_farmer_id'),
    new nlobjSearchColumn('custrecord_h5_provider_name'),
    new nlobjSearchColumn('custrecord_h5_vol_contributed')
 ]
 );

    // sublist.addField('internalid', 'TEXT', 'Id');
      sublist.addField('custrecord_h5_lot_id','TEXT','Lot Id');
      sublist.addField('custrecord_h5_farmer_name','TEXT','Farmer Name');
      sublist.addField('custrecord_h5_farmer_id','TEXT','Farmer ID');
      sublist.addField('custrecord_h5_provider_name','TEXT','Company Name');
      sublist.addField('custrecord_h5_vol_contributed','TEXT','Amount produced');
      sublist.setLineItemValues(results);
      response.writePage(form)
}

function grabLots(){
  var lotsToSearch=[];
var lots = nlapiSearchRecord('customrecord_h5_farmer_data',null,
 [
   ['custrecord_h5_lot_id','isnotempty','']
 ],
 [
   new nlobjSearchColumn('custrecord_h5_lot_id')
 ]
);
for(var i=0;i<lots.length;i++){
  lotsToSearch.push( lots[i].getValue('custrecord_h5_lot_id'));
}
var uniqueLots = uniques(lotsToSearch);

return uniqueLots;
}

function grabWestRockData(){
  var id = [];


  var assemblybuildSearch = nlapiSearchRecord('assemblybuild',null,
  [
     ['type','anyof','Build'],
     'AND',
     ['trandate','within','thismonth'],
     'AND',
     ['anylineitem','anyof','3743'],
     'AND',
     ['mainline','is','F']
  ],
  [
     new nlobjSearchColumn('item'),
     new nlobjSearchColumn('displayname','item',null),
     new nlobjSearchColumn('trandate'),
     new nlobjSearchColumn('type'),
     new nlobjSearchColumn('tranid'),
     new nlobjSearchColumn('entity'),
     new nlobjSearchColumn('quantity'),
     new nlobjSearchColumn('amount'),
     new nlobjSearchColumn('built')
  ]
  );
    var assemblyBuildIds = [];

    for(i=0;i<assemblybuildSearch.length;i++){
      // USED assemblybuildSearch[i].id in console
      assemblyBuildIds.push(assemblybuildSearch[i].id);
    }
    var uniqueAssemblyIds = uniques(assemblyBuildIds);
    var multiDarray = [];
    for(var x=0;x<uniqueAssemblyIds.length;x++){
        multiDarray.push([]);
      }

    for(i=0;i<assemblybuildSearch.length;i++){
        for(var x=0;x<uniqueAssemblyIds.length;x++){
            // USED assemblybuildSearch[i].id in console
            if(assemblybuildSearch[i].id==uniqueAssemblyIds[x]){
              //  multiDarray[x].push(assemblybuildSearch[i]);
               multiDarray[x].push({
                 id : assemblybuildSearch[i].id,
                  assemblyid : assemblybuildSearch[i].getText('item'),
                  displayname : assemblybuildSearch[i].getValue('displayname','item'),
                  trandate : assemblybuildSearch[i].getValue('trandate'),
                  type : assemblybuildSearch[i].getValue('type'),
                  tranid : assemblybuildSearch[i].getValue('tranid'),
                  entity : assemblybuildSearch[i].getValue('entity'),
                  item : assemblybuildSearch[i].getValue('item'),
                 quantity: assemblybuildSearch[i].getValue('quantity'),
                 amount: assemblybuildSearch[i].getValue('amount'),
                 built: assemblybuildSearch[i].getValue('built')
               })
            }
        }
  }

  return multiDarray;
}

function dataGrab1(lot){
  var data = nlapiSearchRecord('customrecord_h5_farmer_data',null,
 [
    ['custrecord_h5_lot_id','is',lot]
 ],
 [
    new nlobjSearchColumn('custrecord_h5_lot_id').setSort(false),
    new nlobjSearchColumn('custrecord_h5_farmer_name'),
    new nlobjSearchColumn('custrecord_h5_farmer_id'),
    new nlobjSearchColumn('custrecord_h5_provider_name'),
    new nlobjSearchColumn('custrecord_h5_vol_contributed')
 ]
   );
  return data;
}
function uniques(arr) {
    var a = [];
    for (var i = 0, l = arr.length; i < l; i++){
        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
            a.push(arr[i]);
          }
    return a;
}
