function fetchLotNumData(request,response){
  var workOrder = request.getParameter('workorder');
  //var woId = getWorkOrderID(workOrder);
  var respObj = finalJSON();
  response.write(respObj);
}

function finalJSON(){
  var JSONobj = {
    'paragraph1': 'yada yada yada',
    'image1': 'https://1212003.app.netsuite.com/core/media/media.nl?id=595395&c=1212003&h=960fb5c2caa213f1407b',
    'paragraph2': 'value',
    'image2': 'urlValue',
    'paragraph3': 'value',
    'image3': 'value',
    'arrayKeyMetrics':
        [
          {'daysHarvestToRoast': '113'},
          {'daysHarvestToRoastTT': 'Once harvested and before roasting, coffee must go through several multi-week processes to prepare it for consumption. Before roasting, coffee can stay fresh for up to one year after harvesting.'},
          {'farmersContributing': '283'},
          {'farmersContributingTT': 'Farmers commonly sell small amounts of coffee to our suppliers several times throughout the harvest season. Their deliveries are tested for quality and separated into both high- and low-quality categories. Once our supplier has enough high-quality coffee to fill an entire shipping container, they send out a taste sample. If we like the coffee, we buy the entire lot and produce several packages of product, including the package you purchased. This is why so many farmers contribute to the coffee in your cup.'},
          {'milesTraveled': '2105'},
          {'milesTraveledTT': 'Coffee only grows in high altitude regions of Central and South America, Africa, and Asia.'}
        ],
    'arrayJourneyDates':
        [
          {'beginHarvest': '1/26/2019'},
          {'beginHarvestTT': 'Farmers harvested the coffee that was blended to create your brew Farmers harvested their coffee between <First Harvest Date> and <Last Harvest Date>. Coffee grows inside a cherry on a tree. One tree can produce thousands of cherries per season, each ripening at a different time. Farmers pick ripe cherries from their trees daily, remove the fruit from the bean and dry it for about three weeks before selling the coffee to our partnering suppliers.'},
          {'beginDeliveryToMill': '2/16/2019'},
          {'beginDeliveryToMillTT': 'Farmers delivered their coffee between <Began Delivering Coffee Date> and <Last Delivery Date>. Several weeks after harvest when the coffee is dry, farmers will deliver it to one of our suppliers purchase points. The supplier runs a quality check on the coffee and pays the farmer. Then, the farmers delivery receipt number is linked to a lot ID, which includes other coffees of the same quality, certification status and delivery time frame.'},
          {'lastDeliveryToMill': '4/30/2019'},
          {'lastDeliveryToMillTT': 'Farmers made their last deliveries for this batch of coffee Farmers delivered their coffee between <First Delivery Date> and <Last Delivery Date>. The total weight of this batch of coffee was <SUM(Custrecord H5 Estimated Green Kgs)> kgs. Our supplier assigns a unique ID to each batch of coffee. This ID is linked to quality and traceability information, which differentiates the coffee from others during transport and storage.'},
          {'dispatchedForDelivery': '5/21/2019'},
          {'dispatchedForDeliveryTT': 'The coffee was dispatched for delivery to the ocean port The export-ready coffee was loaded into a shipping container and placed onto a truck, which transported the coffee to the <ATTR(Custrecord H5 Move Origin Port)>. All <AGG(Count of Farmers)> farmersZZ coffee was blended together under a special shipment ID that is linked to farmersZZ deliveries and WalmartZZs purchase order: ID <ATTR(Custrecord H5 Sref)>.'},
          {'leftPort': '6/6/2019'},
          {'leftPortTT': 'The coffee sailed for port in the United States. The coffee was loaded aboard a ship and departed the <ATTR(Custrecord H5 Move Origin Port)>.'},
          {'arrivedPort': '6/19/2019'},
          {'arrivedPortTT': 'The coffee arrived at port in the United States. The coffee arrived at <ATTR(Custrecord H5 Move Destinationwh)> in <ATTR(Custrecord H5 Move Us Port)>.'}
        ],
    'arrayOtherFacts':
        [
          {'yourCupTT': 'Profile: Medium Dark Roast Cupping Notes: Bright and fruity aroma with hints of citrus and caramel Origin: Colombia'},
          {'environmentTT': 'All coffee sourced for this product has been grown on farms that are either Rainforest Alliance certified or Fair Trade certified. Both certifications and the farmers who have achieved them have strict standards for environmental stewardship. These standards focus on biodiversity and native forest protection, limited and safe use of agrochemicals, soil and water conservation and water management.'},
          {'otherUsesTT': 'Did you know there several quick and creative ways for you to reuse your coffee grounds after you enjoy your brew?1. Mix grounds with other organic matter to be used as mulch 2. Absorb strong odors in your garbage can with dried grounds 3. Add grounds into homemade soaps and scrubs for a natural exfoliant'},
          {'brandCommitmentTT': 'Walmart and its suppliers are committed to maintaining traceable, transparent supply chains. That is why we ask every entity across the supply chain to provide standard reports on coffee quality and movement. We compile this data upon purchase to check for consistency, provide our suppliers with feedback and share the story of your coffee.'}
        ],
  };
  return JSONobj;
}

function getWorkOrderID(workOrder){
  var workOrderData = nlapiSearchRecord('transaction',null,
[
   ['status','anyof','WorkOrd:D','WorkOrd:A','WorkOrd:B'],
   'AND',
   ['mainline','is','T'],
   'AND',
   ['tranid','is', workOrder]
],
[
   new nlobjSearchColumn('internalid'),
   new nlobjSearchColumn('custbody_work_order_type_label'),
   new nlobjSearchColumn('transactionnumber'),
   new nlobjSearchColumn('trandate').setSort(false),
   new nlobjSearchColumn('item'),
   new nlobjSearchColumn('displayname','item',null),
   new nlobjSearchColumn('quantity'),
   new nlobjSearchColumn('custbody18').setSort(false),
   new nlobjSearchColumn('custbody_wcr_lot_exp_date')
]
);
  var workOrderId = workOrderData[0].id;
  return workOrderId;
}

function getFarmerID(woId){
  var newrseultres = nlapiSearchRecord('customrecord_h5_qve_sample_record',null,
[
   ['custrecord_h5_wo','anyof','3137700']
],
[
   new nlobjSearchColumn('id').setSort(false),
   new nlobjSearchColumn('created'),
   new nlobjSearchColumn('custrecord_h5_testing_status'),
   new nlobjSearchColumn('custrecord_h5_hold_status'),
   new nlobjSearchColumn('custrecord_h5_pallet'),
   new nlobjSearchColumn('custrecord_h5_wo'),
   new nlobjSearchColumn('custrecord_h5_item'),
   new nlobjSearchColumn('displayname','CUSTRECORD_H5_ITEM',null),
   new nlobjSearchColumn('custrecord_h5_sample_type'),
   new nlobjSearchColumn('lastmodifiedby')
]
);
  return farmerid
}