'use strict';
const messages = require('elasticio-node').messages;
const vendorService = require('../commons/services/vendorService.js');
const invoiceService = require('../commons/services/invoiceService.js');
const util = require('../commons/utility.js');
exports.process = processTrigger;

/** *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password
 * @param snapshot save the current state of integration step for the future reference.
 */

async function processTrigger(msg, cfg, snapshot) {
  const self = this;
  var vendorList = await vendorService.getAllVendorList(cfg);// Get All Clients
  if(util.isEmpty(vendorList)) return;

  console.log("VendorList"+ JSON.stringify(vendorList));

  snapshot.lastMaxDate =  snapshot.lastMaxDate ||  util.previousDate()

   for (var i = 0; i < vendorList.length; i++) {
    var vendorID = vendorList[i].VendorID;
    var result = await invoiceService.getInvoiceByVendor(cfg,vendorID );
    console.log("vendorID"+ vendorID);
    console.log("InvoiceResult"+ JSON.stringify(result));
    if (!util.isEmpty(result)) 
    {
        var filterData = result.filter(res =>
          (new Date(res.DateCreated) > new Date(snapshot.maxDate)) ||
              (new Date(res.LastModified) > new Date(snapshot.maxDate))
             );
           console.log('Invoice Filter Data' + JSON.stringify(filterData));

      if(!util.isEmpty(filterData))
        {
        filterData.forEach(async invoice => {
        //In order to get termid with other details we are calling below APi 
       var invoiceHeader = await invoiceService.getInvoiceDetails(cfg, invoice.InvoiceID);
       var invoiceLineItems = await invoiceService.getLineItemsByInvoice(cfg, invoice.InvoiceID);
          if(!util.isEmpty(invoiceLineItems))
            {         
            invoiceHeader.LineItems.push(invoiceLineItems);
            }
        console.log('Header ' + JSON.stringify(invoiceHeader));
      //  self.emit('data', messages.newMessageWithBody(invoiceHeader));
     
      });
 
   // self.emit('snapshot', snapshot);
    
    }
   }
  }
  self.emit('end');
}