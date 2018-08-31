const request = require('request-promise');
const clientURL = '/api/v2/clientlist';
const GetClientVendorURL = '/api/v2/client/{clientId}/vendors';
const GetClientAccountURL = '/api/v2/client/{clientId}/coa';
const GetVendorByIdURL = '/api/v2/vendor/{vendorId}';
const GetVendorURL = '/api/v2/vendorlist';
const updateVendorURL = '/api/v2/vendor';
const util = require('../utility.js');

module.exports = {

  getAllClient: async function (cfg) {
    const requestOptions = {
      uri: cfg.endPointURL + clientURL,
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    console.log('client request:-' + requestOptions);
    let responce = await request.get(requestOptions).then(util.autoParse).catch(util.error);
    // Console.log("responce:-"+responce);
    return responce;
  },
  getVendorByClient: async function (cfg, clientId) {
    const requestOptions = {
      uri: cfg.endPointURL + GetClientVendorURL.replace('{clientId}', clientId),
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    // Console.log("client vendor request:-"+requestOptions);
    return await request.get(requestOptions).then(util.autoParse).catch(util.error);
  },
  getAccountDetailsByClient: async function (cfg, clientId) {
    const requestOptions = {
      uri: cfg.endPointURL + GetClientAccountURL.replace('{clientId}', clientId),
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    // Console.log("client account request:-"+requestOptions);
    return await request.get(requestOptions).then(util.autoParse).catch(util.error);
  },
  getAllVendorList: async function (cfg) {
    var fullUrl = cfg.endPointURL + GetVendorURL;

    // Get the URL request
    const requestOptions = {
      uri: `${fullUrl}`,
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };

    return await request.get(requestOptions).then(util.autoParse).catch(util.error);
  },
  updateVendor: async function (msg, cfg) {
    var fullUrl = cfg.endPointURL + updateVendorURL;

    console.log('update URl' + fullUrl);
    console.log('body data' + JSON.stringify(msg.body));
    const requestOptions = {
      uri: `${fullUrl}`,
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      body: msg.body,
      json: true
    };
    return await request.put(requestOptions).then(util.autoParse).catch(util.error);
  },
  getVendorById: async function (cfg, vendorId) {
    const requestOptions = {
      uri: cfg.endPointURL + GetVendorByIdURL.replace('{vendorId}', vendorId),
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    // Console.log("client vendor request:-"+requestOptions);
    return await request.get(requestOptions).then(util.autoParse).catch(util.error);
  }
  
};
