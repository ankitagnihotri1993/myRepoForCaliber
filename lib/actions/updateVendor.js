'use strict';
const messages = require('elasticio-node').messages;
const vendorService = require('../commons/services/vendorService.js');
exports.process = processAction;

/** *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password
 * @returns promise resolving a message to be emitted to the platform
 */
function processAction(msg, cfg) {
  const self = this;
  console.log('caliber body ' + msg.body);
  console.log('caliber body ' + JSON.stringify(msg.body));
  vendorService.updateVendor(msg, cfg).then(function (responce) {
    console.log('Caliber vendor updated ' + JSON.stringify(responce));
    self.emit('data', messages.newMessageWithBody(responce));
    self.emit('end');
  });
  
}
