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
  var result = await invoiceService.getClientByClientId(cfg, msg.body.clientId);
  if (result != null && result.length > 0) {
    result.forEach(client => {
      self.emit('data', messages.newMessageWithBody(client));
    });
    self.emit('end');
  }
  
}
