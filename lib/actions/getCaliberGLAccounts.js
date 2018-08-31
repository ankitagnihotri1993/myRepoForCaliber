'use strict';
const messages = require('elasticio-node').messages;
const _ = require('underscore');
const vendorService = require('../commons/services/vendorService.js');
const util = require('../commons/utility.js');
exports.process = processAction;

/** *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values, such as endPointURL,apiKey,username,password
 * @param snapshot save the current state of integration step for the future reference.
 */
async function processAction(msg, cfg, snapshot) {
  const self = this;
  var result = await vendorService.getAccountDetailsByClient(cfg, msg.body.clientId);
  snapshot.maxDate = snapshot.maxDate || util.previousDate()

  if (!util.isEmpty(result)) {

      var filterData = result.filter(res =>
        (new Date(res.DateCreated) > new Date(snapshot.maxDate)) ||
        (new Date(res.LastModified) > new Date(snapshot.maxDate))
      );
      console.log('GL Filter Data' + JSON.stringify(filterData));
    if (!util.isEmpty(filterData)) {

      filterData.forEach(element => {
      element.AccountType = GetLedgerType(element.AccountType);
      self.emit('data', messages.newMessageWithBody(element));
   
    });
   snapshot.maxDate = util.getMaxDate(result);
   self.emit('snapshot', snapshot);

  }
}
self.emit('end');
}
function GetLedgerType(accountType) {
  if (accountType == 'Accounts Payable') {
    return 'AP_ACCOUNT';
  }
  if (accountType == 'Expense') {
    return 'EXPENSE_ACCOUNT';
  }
  return 'ACCOUNT';
  
}
