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
  var promiseVendor = vendorService.getVendorByClient(cfg, cfg.clientId);
  var result = await Promise.all([promiseVendor]);
  if (result[0] != null || result[0].length > 0) {
    var vendorList = result[0];
    console.log('vendorList' + JSON.stringify(vendorList));

    var date = new Date();
    date.setDate(date.getDate() - 1);
    snapshot.lastMaxDate = snapshot.lastMaxDate || date.toLocaleString();
    //  For now we are getting all the data to test, because we don't have any api to create venor with Client
    console.log('snapshot before' + snapshot.lastMaxDate);
    if (snapshot.lastMaxDate != '') {
      var filterData = vendorList.filter(res =>
        (new Date(res.DateCreated) > new Date(snapshot.lastMaxDate)) ||
                    (new Date(res.LastModified) > new Date(snapshot.lastMaxDate))
      );
      result = filterData;
    } else {
      result = vendorList;
    }
    result.forEach(element => {
      var vendorObj = element;
      vendorObj.clientId = cfg.clientId;
      console.log('Vendor data ' + JSON.stringify(vendorObj));
      self.emit('data', messages.newMessageWithBody(vendorObj));
    });

    console.log('clientId ' + clientId);

    var vendorCreatedObj = _.max(vendorList, function (vendor) {
      return new Date(vendor.DateCreated).getTime();
    });

    var vendorUpdatedObj = _.max(vendorList, function (vendor) {
      return new Date(vendor.LastModified).getTime();
    });

    // Find max date from date created and modified then update snapshot value
    if (new Date(vendorCreatedObj.DateCreated) > new Date(vendorUpdatedObj.LastModified)) {
      snapshot.lastMaxDate = vendorCreatedObj.DateCreated;
    } else {
      snapshot.lastMaxDate = vendorUpdatedObj.LastModified;
    }
    console.log('snapshot after' + snapshot.lastMaxDate);
    self.emit('snapshot', snapshot);
    self.emit('end');
  }
  
}
