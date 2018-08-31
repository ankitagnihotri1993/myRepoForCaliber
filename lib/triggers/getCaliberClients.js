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
async function processTrigger(msg, cfg) {
  const self = this;
  var clientList = await vendorService.getAllClient(cfg);// Get All Clients
  if (clientList == null || clientList == undefined || clientList == '') {
    return;
  }
  console.log('Client data ' + JSON.stringify(clientList));
  clientList.forEach(element => {
    console.log('Client Obj' + JSON.stringify(element));

    // Var data =
    //    {
    //     "ClientID": 31,
    //     "ClientName": "Agave Springs Apartments",
    //     "LegalName": "",
    //     "Code": "ASA",
    //     "OfficialAddress1": "",
    //     "OfficialAddress2": "",
    //     "OfficialAddress3": "",
    //     "OfficialCity": "",
    //     "OfficialState": "",
    //     "OfficialZip": "",
    //     "OfficialCounty": "",
    //     "OfficialCountry": "",
    //     "OfficialPhone": "",
    //     "OfficialFax": "",
    //     "BillingAddress1": "",
    //     "BillingAddress2": "",
    //     "BillingAddress3": "",
    //     "BillingCity": "",
    //     "BillingState": "",
    //     "BillingZip": "",
    //     "BillingCountry": "",
    //     "BillingPhone": "",
    //     "BillingFax": "",
    //     "ClientType": "Homeowners Association",
    //     "DateCreated": "2016-11-30T11:59:43.023",
    //     "LastModified": "2018-07-13T12:09:35.65",
    //     "EIN": "987654321",
    //     "Website": "",
    //     "APBasis": "Cash",
    //     "ARBasis": "Accrual",
    //     "ForceCostCenters": false,
    //     "Status": "Active",
    //     "StatementLateDays": 1

    // }

    self.emit('data', messages.newMessageWithBody(element));
  });
  
}

