'use strict';
const messages = require('elasticio-node').messages;
const invoiceService = require('../commons/services/invoiceService.js');
exports.process = processAction;

/** *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password
 * @returns promise resolving a message to be emitted to the platform
 */
function processAction(msg, cfg) {
  const self = this;
  invoiceService.createInvoicePayment(msg, cfg).then(function (responce) {
    self.emit('data', messages.newMessageWithBody(responce));
    self.emit('end');
  });
  
  
}
