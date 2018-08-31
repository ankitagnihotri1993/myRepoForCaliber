'use strict';
const messages = require('elasticio-node').messages;
const _ = require('underscore');
const invoiceService = require('../commons/services/invoiceService.js');
exports.process = processTrigger;

/** *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password
 * @param snapshot save the current state of integration step for the future reference.
 */
async function processTrigger(msg, cfg, snapshot) {
  const self = this;
  var result = await invoiceService.getInvoiceByVendor(cfg, msg.body.vendorId);

  // Var date = new Date();
  // date.setDate(date.getDate() - 1);

  snapshot.maxDate = snapshot.maxDate || '';

  if (result != null && result.length > 0) {
    var InvoiceData;

    if (snapshot.maxDate != '') {
      var filterData = result.filter(res =>
        (new Date(res.DateCreated) > new Date(snapshot.maxDate)) ||
            (new Date(res.LastModified) > new Date(snapshot.maxDate))
      );
      console.log('Invoice Filter Data' + JSON.stringify(filterData));
      InvoiceData = filterData;
    } else {
      InvoiceData = result;
    }
    InvoiceData.forEach(async invoice => {
      var invoiceHeader = await invoiceService.getInvoiceDetails(cfg, invoice.InvoiceID);
      console.log('Header ' + JSON.stringify(invoiceHeader));
      self.emit('data', messages.newMessageWithBody(invoiceHeader));
    });
    var InvoiceCreatedObj = _.max(result, function (inv) {
      return new Date(inv.DateCreated).getTime();
    });

    var InvoiceUpdatedObj = _.max(result, function (invObj) {
      return new Date(invObj.LastModified).getTime();
    });

    if (new Date(InvoiceCreatedObj.DateCreated) > new Date(InvoiceUpdatedObj.LastModified)) {
      snapshot.maxDate = InvoiceCreatedObj.DateCreated;
    } else {
      snapshot.maxDate = InvoiceUpdatedObj.LastModified;
    }
    self.emit('snapshot', snapshot);
    self.emit('end');
  }
  
}
