'use strict';
const messages = require('elasticio-node').messages;
const _ = require('underscore');
const vendorService = require('../commons/services/vendorService.js');
const invoiceService = require('../commons/services/invoiceService.js');

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
  snapshot.lastMaxDate = snapshot.lastMaxDate || '';// Date.toLocaleString(); //  For now we are getting all the data to test, because we don't have any api to create venor with Client

  console.log('snapshot before' + snapshot.lastMaxDate);
  var clientList = await vendorService.getAllClient(cfg);// Get All Clients
  if (clientList == null || clientList == undefined || clientList == '') {
    return;
  }
  for (var i = 0; i < clientList.length; i++) {
    var clientObj = clientList[i];
    var promiseInvoiceDetails = invoiceService.getInvoiceByClient(cfg, clientObj.ClientID);
    var result = await Promise.all([promiseInvoiceDetails]);
    if (result[0] != null && result[0].length > 0) {
      var invoiceList = result[0];
      var resultData;
      if (snapshot.lastMaxDate != '') {
        var filterData = invoiceList.filter(res =>
          (new Date(res.DateCreated) > new Date(snapshot.lastMaxDate)) ||
              (new Date(res.LastModified) > new Date(snapshot.lastMaxDate))
        );
        resultData = filterData;
      } else {
        resultData = invoiceList;
      }

      resultData.forEach(async element => {
        var _InvoiceLineItems = [];
        var _InvoicePayments = [];
        var promiseLineItem = invoiceService.getLineItemsByInvoice(cfg, element.InvoiceID);
        var PaymentsPromise = invoiceService.getInvoicePaymentById(cfg, element.InvoiceID);
        var GLPromise = invoiceService.getGLAccountByClient(cfg, element.ClientID);
        var CostCenterPromise = invoiceService.getCostCenterByClient(cfg, element.ClientID);
        var vendorPromise = vendorService.getVendorById(cfg, element.PayeeID);

        var _result = await Promise.all([promiseLineItem, PaymentsPromise, GLPromise, CostCenterPromise, vendorPromise]);

        if (_result[0] != null && _result[0].length > 0) {
          _InvoiceLineItems = _result[0];
        } else {
          var invObj = {LineItemID: 0, InvoiceID: 0, VendorCodeID: '', VendorCode: '', Description: '',
            ExpenseGLAccountID: 0, ExpenseGLAccount: '', Amount: 0, CostCenterID: 0, CostCenter: '', Quantity: 0
          };
          _InvoiceLineItems.push(invObj);
        }

        if (_result[1] != null && _result[1].length > 0) {
          _InvoicePayments = _result[1];
        } else {
          var paymentObj = {PaymentDate: '', Memo: ''}; _InvoicePayments.push(paymentObj);
        }

        let invoiceObj = element;

        invoiceObj.InvoiceLineItems = _InvoiceLineItems;
        invoiceObj.InvoicePayments = _InvoicePayments;
        invoiceObj.ClientData = clientObj;
        invoiceObj.GLData = _result[2] != null && _result[2].length > 0 ? _result[2] : '';
        invoiceObj.CostCenterData = _result[3] != null && _result[3].length > 0 ? _result[3] : '';
        invoiceObj.VendorData = _result[4] != null && _result[4].length > 0 ? _result[4] : '';

        console.log('Invoice data ' + JSON.stringify(element));
        self.emit('data', messages.newMessageWithBody(element));
      });

      let invoiceCreatedObj = _.max(invoiceList, function (invoice) {
        return new Date(invoice.DateCreated).getTime();
      });

      let invoiceUpdatedObj = _.max(invoiceList, function (invoice) {
        return new Date(invoice.LastModified).getTime();
      });
      // Find max date from date created and modified then update snapshot value
      if (new Date(invoiceCreatedObj.DateCreated) > new Date(invoiceUpdatedObj.LastModified)) {
        snapshot.lastMaxDate = invoiceCreatedObj.DateCreated;
      } else {
        snapshot.lastMaxDate = invoiceUpdatedObj.LastModified;
      }
      console.log('snapshot after' + snapshot.lastMaxDate);
      self.emit('snapshot', snapshot);
      self.emit('end');
    }
    
  }
}
