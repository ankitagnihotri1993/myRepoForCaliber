'use strict';
const messages = require('elasticio-node').messages;
const _ = require('underscore');
const vendorService = require('../commons/services/vendorService.js');
exports.process = processTrigger;

/** *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password
 * @param snapshot save the current state of integration step for the future reference.
 */
async function processTrigger(msg, cfg, snapshot) {
  const self = this;
  var date = new Date();
  date.setDate(date.getDate() - 1);
  snapshot.lastMaxDate = snapshot.lastMaxDate || ''; // //date.toLocaleString();
  console.log('snapshot before2' + snapshot.lastMaxDate);
  var clientList = await vendorService.getAllClient(cfg);// Get All Clients

  console.log('Client data ' + JSON.stringify(clientList));

  if (clientList == null || clientList == undefined || clientList == '') {
    return;
  }
  var result;
  if (snapshot.lastMaxDate != '') {
    var filterData = clientList.filter(res =>
      (new Date(res.DateCreated) > new Date(snapshot.lastMaxDate)) ||
         (new Date(res.LastModified) > new Date(snapshot.lastMaxDate))
    );
    result = filterData;
  } else {
    result = clientList;
  }

  console.log('Client data ' + JSON.stringify(clientList));
  result.forEach(element => {
    console.log('Client Obj' + JSON.stringify(element));
    self.emit('data', messages.newMessageWithBody(element));
  });

  let clientCreatedObj = _.max(clientList, function (client) {
    return new Date(client.DateCreated).getTime();
  });

  let clientUpdatedObj = _.max(clientList, function (client) {
    return new Date(client.LastModified).getTime();
  });

  if (new Date(clientCreatedObj.DateCreated) > new Date(clientUpdatedObj.LastModified)) {
    snapshot.lastMaxDate = clientCreatedObj.DateCreated;
  } else {
    snapshot.lastMaxDate = clientUpdatedObj.LastModified;
  }
  console.log('snapshot after' + snapshot.lastMaxDate);
  self.emit('snapshot', snapshot);
  self.emit('end');
  
}

