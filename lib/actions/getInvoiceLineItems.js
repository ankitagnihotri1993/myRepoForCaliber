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
async function processTrigger(msg, cfg) {
  const self = this;
  var result = await invoiceService.getLineItemsByInvoice(cfg, msg.body.invoiceId);
  if (result != null && result.length > 0) {

    var lines=[]
    var totalAmount=0;
     result.forEach(invoiceLine => {
      totalAmount+=invoiceLine.Amount
      lines.push(invoiceLine);
      });
  
     var invoiceLineData ={
      TotalAmount:totalAmount,
      LineItems:lines
    }
 console.log('Line Details ' + JSON.stringify(invoiceLineData));
   self.emit('data', messages.newMessageWithBody(invoiceLineData));
   self.emit('end');
  }
  
}
