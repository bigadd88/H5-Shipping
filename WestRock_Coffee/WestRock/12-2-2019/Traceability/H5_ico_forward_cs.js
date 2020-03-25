function lotFindForward () {
var icoNumber = document.getElementById('icoId').value;
    console.log('started ' + icoNumber);
// var icoNumber = '3/0192/0186';
//search 0 - get internal ID of an ICO Lot #
    var inventorynumberSearch = nlapiSearchRecord("inventorynumber",null,
        [
            ["inventorynumber","is", icoNumber]
        ],
        [
            new nlobjSearchColumn("internalid").setSort(false),
            new nlobjSearchColumn("inventorynumber")
        ]
    );
    var icoId = inventorynumberSearch[0].id;
    console.log('ico ' + icoId);
//search 1 gets roasting WO
    var roastingWO = nlapiSearchRecord("workorder",null,
        [
            ["type","anyof","WorkOrd"],
            "AND",
            ["inventorydetail.inventorynumber","anyof",icoId]
        ],
        [
            new nlobjSearchColumn("trandate").setSort(false),
            new nlobjSearchColumn("mainline"),
            new nlobjSearchColumn("type"),
            new nlobjSearchColumn("tranid"),
            new nlobjSearchColumn("internalid")
        ]
    );
    var woIds = [];
    var woTranIds = [];
    for(i = 0; i < roastingWO.length; i++){
        woIds.push(roastingWO[i].getValue('internalid'));
        woTranIds.push(roastingWO[i].getValue('tranid'));
    }
    console.log('roasted ' + woIds);

//search 2 gets assembly build of WOs in search 1
    var roastingBuild = nlapiSearchRecord("assemblybuild",null,
        [
            ["type","anyof","Build"],
            "AND",
            ["createdfrom","anyof",woIds],
            "AND",
            ["mainline","is","T"]
        ],
        [
            new nlobjSearchColumn("trandate").setSort(false),
            new nlobjSearchColumn("type"),
            new nlobjSearchColumn("tranid"),
            new nlobjSearchColumn("internalid")
        ]
    );
    var assemblyBuildIds = [];
    var assemblyBuildTranIds = [];
    for(i = 0; i < roastingBuild.length; i++){
        assemblyBuildIds.push(roastingBuild[i].getValue('internalid'));
        assemblyBuildTranIds.push(roastingBuild[i].getValue('tranid'));
    }
    console.log('roasted builds' + assemblyBuildIds);

//search 2b find roasted supersacks
    var superSackLots = nlapiSearchRecord("inventorydetail",null,
        [
            ["transaction.internalid","anyof",assemblyBuildIds],
            "AND",
            ["itemcount","greaterthan","0"]
        ],
        [
            new nlobjSearchColumn("inventorynumber").setSort(false),
            new nlobjSearchColumn("quantity"),
            new nlobjSearchColumn("itemcount"),
            new nlobjSearchColumn("internalid","inventoryNumber",null)
        ]
    );
    var superSackIds = [];
    var superSackNumbers = [];
    for(i = 0; i < superSackLots.length; i++){
        superSackIds.push(superSackLots[i].getValue('internalid','inventoryNumber'));
        superSackNumbers.push(superSackLots[i].getText('inventoryNumber'));
    }
    console.log('supersacks ' + superSackIds);

//search 3 find fg assembly build that used roasted supersack
    var fgAssemblyBuilds = nlapiSearchRecord("assemblybuild",null,
        [
            ["inventorydetail.inventorynumber","anyof",superSackIds],
            "AND",
            ["type","anyof","Build"],
            "AND",
            ["mainline","is","F"]
        ],
        [
            new nlobjSearchColumn("trandate"),
            new nlobjSearchColumn("type"),
            new nlobjSearchColumn("tranid"),
            new nlobjSearchColumn("entity"),
            new nlobjSearchColumn("internalid")
        ]
    );
    var fgAssemblyBuildIds = [];
    var fgAssemblyBuildTranIds = [];
    for(i = 0; i < fgAssemblyBuilds.length; i++){
        fgAssemblyBuildIds.push(fgAssemblyBuilds[i].getValue('internalid'));
        fgAssemblyBuildTranIds.push(fgAssemblyBuilds[i].getValue('tranid'));
    }
    console.log('fgAssemblyBuilds ' + fgAssemblyBuildIds);

//search 4 find finished pallets for Finished assembly build
    var fgPallets = nlapiSearchRecord("inventorydetail",null,
        [
            ["transaction.internalid","anyof",fgAssemblyBuildIds],
            "AND",
            ["itemcount","greaterthan","0"]
        ],
        [
            new nlobjSearchColumn("inventorynumber").setSort(false),
            new nlobjSearchColumn("binnumber"),
            new nlobjSearchColumn("quantity"),
            new nlobjSearchColumn("itemcount"),
            new nlobjSearchColumn("internalid")
        ]
    );
    var fgPalletIds = [];
    var fgPalletNumbers = [];
    for(i = 0; i < fgPallets.length; i++){
        fgPalletIds.push(fgPallets[i].getValue('inventorynumber'));
        fgPalletNumbers.push(fgPallets[i].getText('inventorynumber'));
    }
    console.log('fgPalletIds ' + fgPalletIds);

//search 5 item fulfillment where pallet lot used
    var itemFulfillments = nlapiSearchRecord("inventorydetail",null,
        [
            ["inventorynumber","anyof", fgPalletIds],
            "AND",
            ["transaction.type","anyof","ItemShip"]
        ],
        [
            new nlobjSearchColumn("inventorynumber"),
            new nlobjSearchColumn("binnumber"),
            new nlobjSearchColumn("quantity"),
            new nlobjSearchColumn("itemcount"),
            new nlobjSearchColumn("transactionnumber","transaction",null).setSort(false),
            new nlobjSearchColumn("entity","transaction",null),
            new nlobjSearchColumn("trandate","transaction",null),
            new nlobjSearchColumn("displayname","item",null),
            new nlobjSearchColumn("item")
        ]
    );
    console.log('IFs Returned ' + itemFulfillments.length);
    var table = '<table class="table table-striped table-bordered table-sm">';
    table += '<thead><tr>';
    table += '<th scope="col">Date</th>';
    table += '<th scope="col">IF#</th>';
    table += '<th scope="col">Customer</th>';
    table += '<th scope="col">Item</th>';
    table += '<th scope="col">DisplayName</th>';
    table += '<th scope="col">Pallet #</th>';
    table += '<th scope="col">Qty</th>';
    table += '</tr></thead>';
    for (i=0; i < itemFulfillments.length; i++){
        table += '<tr><td>'+ itemFulfillments[i].getValue('trandate', 'transaction') + '</td>';
        table += '<td>'+ itemFulfillments[i].getValue('transactionnumber', 'transaction'); + '</td>';
        table += '<td>'+ itemFulfillments[i].getText('entity', 'transaction') + '</td>';
        table += '<td>'+ itemFulfillments[i].getValue('item') + '</td>';
        table += '<td>'+ itemFulfillments[i].getValue('displayname', 'item') + '</td>';
        table += '<td>'+ itemFulfillments[i].getText('inventorynumber') + '</td>';
        table += '<td>'+ itemFulfillments[i].getValue('quantity') + '</td></tr>';
    }
    table += '</table>';
    console.log(table);
    document.getElementById('roastedWO').innerHTML = woTranIds;
    document.getElementById('roastedBuild').innerHTML = assemblyBuildTranIds;
    document.getElementById('supersacks').innerHTML = superSackNumbers;
    document.getElementById('fgAssemblyBuilds').innerHTML = fgAssemblyBuildTranIds;
    document.getElementById('fgPalletIds').innerHTML = fgPalletNumbers;
    document.getElementById('results').innerHTML = table;

}