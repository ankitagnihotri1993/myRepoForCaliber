'use strict';
const messages = require('elasticio-node').messages;
const vendorService = require('../commons/services/vendorService.js');
exports.process = processTrigger;

/** *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password
 * @param snapshot save the current state of integration step for the future reference.
 */
async function processTrigger(msg, cfg, snapshot) {
  const self = this;

  var VendorDetailList = [];

  var clientList = await vendorService.getAllClient(cfg);// Get All Clients

  // console.log("Client Data " + JSON.stringify(clientList));

  if (clientList === null || clientList === undefined || clientList === '') {
    return;
  }

  
  for (var i = 0; i < clientList.length; i++) {
    var clientId = clientList[i].ClientID;
    var result = await vendorService.getVendorByClient(cfg, clientId);

    if (result !== null || result.length > 0) {
      var vendorList = result;
      // Console.log("vendorList" + JSON.stringify(vendorList));
      vendorList.forEach(element => {
        var index = VendorDetailList.findIndex(o => o.VendorID === element.VendorID);

        var vendorObj = element;
        if (index > 0) {
          vendorObj.clients = VendorDetailList[index].clients;
          vendorObj.clients.push(clientList[i]);
          VendorDetailList[index] = vendorObj;
        } else {
          vendorObj.clients = [];
          vendorObj.clients.push(clientList[i]);
          VendorDetailList.push(vendorObj);
        }
      });

      // Console.log("clientId " + clientId);
    }
  }

  VendorDetailList.forEach(element => {
    console.log('Vendor data ' + JSON.stringify(element));
    self.emit('data', messages.newMessageWithBody(element));
  });

  // Console.log("snapshot after" + snapshot.lastMaxDate);
  // self.emit('snapshot', snapshot);
  self.emit('end');
}
