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
  let response = await vendorService.getAllVendorList(cfg);
  var result;
  if (response == null || response == undefined || response == '') {
    return;
  }

  var date = new Date();
  date.setDate(date.getDate() - 1);
  snapshot.lastMaxDate = snapshot.lastMaxDate || date.toLocaleString();
  console.log('snapshot before' + snapshot.lastMaxDate);

  if (snapshot.lastMaxDate != '') {
    var filterData = response.filter(res =>
      (new Date(res.DateCreated) > new Date(snapshot.lastMaxDate)) ||

         (new Date(res.LastModified) > new Date(snapshot.lastMaxDate))

    );
    result = filterData;
  } else {
    result = response;
  }

  result.forEach(element => {
    self.emit('data', messages.newMessageWithBody(element));
  });

  let vendorCreatedObj = _.max(response, function (vendor) {
    return new Date(vendor.DateCreated).getTime();
  });

  let vendorUpdatedObj = _.max(response, function (vendor) {
    return new Date(vendor.LastModified).getTime();
  });

  if (new Date(vendorCreatedObj.DateCreated) > new Date(vendorUpdatedObj.LastModified)) {
    snapshot.lastMaxDate = vendorCreatedObj.DateCreated;
  } else {
    snapshot.lastMaxDate = vendorUpdatedObj.LastModified;
  }

  console.log('snapshot after' + snapshot.lastMaxDate);

  self.emit('snapshot', snapshot);
  self.emit('end');
  
}

