const request = require('request-promise');
const clientURL = '/api/v2/clientlist';
const GetClientAccountURL = '/api/v2/client/{clientId}/coa';
const CostCenterURL = '/api/v2/client/{clientId}/costcenters';
const PaymentTermsURL = '/api/v2/accountingterms';
const GetClientVendorURL = '/api/v2/client/{clientId}/vendors';
const util = require('../utility.js');

module.exports = {

  // Get all client from caliber
  getAllClient: async function (cfg) {
    const requestOptions = {
      uri: cfg.endPointURL + clientURL,
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    let responce = await request.get(requestOptions).then(util.autoParse).catch(util.error);
    return responce;
  },
  // Get all Gl Account based on clientId
  getGLAccountByClient: async function (cfg, clientId) {
    const requestOptions = {
      uri: cfg.endPointURL + GetClientAccountURL.replace('{clientId}', clientId),
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    return await request.get(requestOptions).then(util.autoParse).catch(util.error);
  },
  getCostCenterByClient: async function (cfg, clientId) {
    const requestOptions = {
      uri: cfg.endPointURL + CostCenterURL.replace('{clientId}', clientId),
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    return await request.get(requestOptions).then(util.autoParse).catch(util.error);
  },
  getPaymentTerms: async function (cfg) {
    const requestOptions = {
      uri: cfg.endPointURL + PaymentTermsURL,
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    return await request.get(requestOptions).then(util.autoParse).catch(util.error);
  },
  getVendorByClient: async function (cfg, clientId) {
    const requestOptions = {
      uri: cfg.endPointURL + GetClientVendorURL.replace('{clientId}', clientId),
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    return await request.get(requestOptions).then(util.autoParse).catch(util.error);
  }
};
