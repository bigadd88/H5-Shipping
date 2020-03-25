function packSimulator(request, response) {
    var invItem = request.getParameter('invitem');
    var ordQuantity = request.getParameter('ordquantity');

    nlapiLogExecution('DEBUG', 'Parameters received-invitem:', invItem);
    nlapiLogExecution('DEBUG', 'Parameters received-ordquantity:', ordQuantity);
//calc box minimum requirement
    //load inventory item variables
    //var invItem = 819;
    //var ordQuantity = 10;
    var itemRec = nlapiLoadRecord('inventoryitem', invItem);
    var itemWeight = itemRec.getFieldValue('custitem_pss_unit_weight');
    var itemLength = itemRec.getFieldValue('custitem_pss_unit_length');
    var itemWidth = itemRec.getFieldValue('custitem_pss_unit_width');
    var itemHeight = itemRec.getFieldValue('custitem_pss_unit_height');
    var itemBaseLineItemWeight = Number(itemRec.getFieldValue('custitem_pss_unit_baselineitemweight'));
    var itemPackingMaterialFactor = itemRec.getFieldValue('custitem_pss_packing_material_factor');
    //calculations
    //SQRT((width*144*quantity)/3.142+4)
    var calcWidth = Math.sqrt((itemWidth * 144 * ordQuantity)/3.142+4);
    var calcHeight = Math.sqrt((itemHeight * 144 * ordQuantity)/3.142+4);
    var calcVolume = Number(itemLength * calcWidth * calcHeight);
    var productWeight = Number(itemWeight * (1 + itemPackingMaterialFactor));
    var lineWeight = Number(ordQuantity * productWeight);
    var fixedLineWeight = Number(itemBaseLineItemWeight + lineWeight);
    var finalPackageWeight = Number(productWeight + lineWeight + fixedLineWeight + 1);
    var finalShippingWeight = Math.round(finalPackageWeight);

//search for boxes
    var containers = nlapiSearchRecord("customrecord_pss_containers",null,
        [
            ["custrecord_pss_cont_length","greaterthanorequalto", itemLength],
            "AND",
            ["custrecord_pss_cont_width","greaterthanorequalto", calcWidth],
            "AND",
            ["custrecord_pss_cont_height","greaterthanorequalto", calcHeight]
        ],
        [
            new nlobjSearchColumn("name").setSort(false),
            new nlobjSearchColumn("internalid"),
            new nlobjSearchColumn("custrecord_pss_cont_type"),
            new nlobjSearchColumn("custrecord_pss_cont_length"),
            new nlobjSearchColumn("custrecord_pss_cont_width"),
            new nlobjSearchColumn("custrecord_pss_cont_height"),
            new nlobjSearchColumn("custrecord_pss_cont_cubic_inches"),
            new nlobjSearchColumn("custrecord_pss_cont_weight"),
            new nlobjSearchColumn("custrecord_pss_cont_weight_units"),
            new nlobjSearchColumn("custrecord_pss_cont_cost")
        ]
    );
    var containerId = [];
    var volUtilizationValue = [];
    for (var x = 0; x < containers.length; x++) {
        containerId.push(containers[x].getValue('internalid'));
        volUtilizationValue.push(Math.round(containers[x].getValue('custrecord_pss_cont_cubic_inches') - calcVolume));

    }
    nlapiLogExecution('DEBUG', 'volUtilizationValue:', volUtilizationValue);
    var lowest= volUtilizationValue[0];
    for( i=1; i < volUtilizationValue.length; i++){
        if( lowest> volUtilizationValue[i]){
            lowest= volUtilizationValue[i];
        }
    }

    //var minValue = Math.min(volUtilizationValue);
    var arrayContainerSelected = volUtilizationValue.indexOf(lowest);
    var finalContainerSelected = containerId[arrayContainerSelected];
    nlapiLogExecution('DEBUG', 'arrayContainerSelected:', arrayContainerSelected);
    //var finalContainerSelected = 4;
    var fcsRec = nlapiLoadRecord('customrecord_pss_containers', finalContainerSelected);
    var fcsLength = fcsRec.getFieldValue('custrecord_pss_cont_length');
    var fcsWidth = fcsRec.getFieldValue('custrecord_pss_cont_width');
    var fcsHeight = fcsRec.getFieldValue('custrecord_pss_cont_height');

//after final box selection, get rates from Shippo
    var creds = 'andy.reeder@priority-logistics.com:Leftfoot5510!';
    var shippoToken = 'shippo_test_3ad3bec2b759abd83c0842b74424a49a9ca9a558';
    //var enCreds = nlapiEncrypt(creds, 'base64');
    //p44 endPoint URL for Rating
    var url = 'https://api.goshippo.com/shipments/';
    //setting request headers
    var headers = [];
    headers['Authorization'] = 'ShippoToken ' + shippoToken;
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';

    var jPayload = {
        "address_from":{
            "name":"",
            "street1":"",
            "city":"",
            "state":"",
            "zip":"94117",
            "country":"US"
        },
        "address_to":{
            "name":"",
            "street1":"",
            "city":"",
            "state":"",
            "zip":"94105",
            "country":"US"
        },
        "parcels":[{
            "length":fcsLength,
            "width":fcsWidth,
            "height":fcsHeight,
            "distance_unit":"in",
            "weight":finalShippingWeight,
            "mass_unit":"lb"
        }],
        "async": false
    }
    var strShippoPayload = JSON.stringify(jPayload);

    nlapiLogExecution('DEBUG', 'Payload', strShippoPayload);

    var shippoResponse = nlapiRequestURL(url, strShippoPayload, headers, 'POST');
    nlapiLogExecution('DEBUG', 'Response', shippoResponse.getBody());
    var shippoObj = shippoResponse.getBody();
    var shippoRespObj = JSON.parse(shippoObj);
    var shippoRates = shippoRespObj.rates;


    //Build the final response JSON
        var jPayload =
            {
                "PriorityShipPackSimulator": {
                    "nsCustomer": "ACP_Composites",
                    "simulatorResults": [
                        {
                            "boxOptions": containerId,
                            "calcValue": volUtilizationValue
                        }
                    ]
                },
                "SelectedContainer": [
                    {
                        "boxInternalId": finalContainerSelected,
                        "length":fcsLength,
                        "width":fcsWidth,
                        "height":fcsHeight,
                        "distance_unit":"in",
                        "weight":finalShippingWeight,
                        "mass_unit":"lb"
                    }
                ],
                "ratesReturned": {
                    "rates": shippoRates
                }
            }
        var strPayload = JSON.stringify(jPayload);

    response.write (strPayload);
}