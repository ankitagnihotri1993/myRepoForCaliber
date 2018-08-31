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
  var result = await vendorService.getAccountDetailsByClient(cfg, msg.body.clientId);

  if (result != null && result.length > 0) {
    // Var GLAccountList = result[0];
    // // var date = new Date();
    // // date.setDate(date.getDate() - 1);
    // snapshot.lastMaxDate = snapshot.lastMaxDate || "" //  For now we are getting all the data to test, because we don't have any api to create venor with Client
    // console.log("snapshot before"+ snapshot.lastMaxDate);
    // var resultdata;

    // if (snapshot.lastMaxDate != "")
    // {
    //      var filterData =  GLAccountList.filter(res =>
    //        (new Date(res.DateCreated) > new Date(snapshot.lastMaxDate)) ||
    //        (new Date(res.LastModified) > new Date(snapshot.lastMaxDate))
    //      );
    //      resultdata=filterData;
    // }
    // else {
    //  resultdata = GLAccountList;
    // }

    result.forEach(element => {
      self.emit('data', messages.newMessageWithBody(element));
    });

    // Let glCreatedObj = _.max(GLAccountList, function (gl) {
    //   return   new Date(gl.DateCreated).getTime();
    // });

    // let glUpdatedObj = _.max(GLAccountList, function (gl) {
    //   return  new Date(gl.LastModified).getTime();

    // });

    // // Find max date from date created and modified then update snapshot value
    // if(new Date(glCreatedObj.DateCreated)> new Date(glUpdatedObj.LastModified))
    // {
    //     snapshot.lastMaxDate =glCreatedObj.DateCreated;
    // }
    // else
    // {
    //   snapshot.lastMaxDate = glUpdatedObj.LastModified
    // }
    // console.log("snapshot after"+ snapshot.lastMaxDate);
    // self.emit('snapshot', snapshot);
    self.emit('end');
  }
  
}
