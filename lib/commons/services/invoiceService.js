const request = require('request-promise');
const createInvoiceURL = '/api/v2/invoice';
const createInvoicePaymentURL = '/api/v2/payment';
const GetInvoiceByClientURL = '/api/v2/client/{ClientId}/invoices';
const GetInvoiceByVendorURL = '/api/v2/vendor/{VendorId}/invoices';
const GetInvoiceByInvoiceId = '/api/v2/invoice/{InvoiceId}/details';
const GetLineItemByInvoiceURL = '/api/v2/invoice/{InvoiceId}/lineitems';
const GetInvoicePaymentURL = '/api/v2/invoice/{InvoiceId}/payments';
const GetClientAccountURL = '/api/v2/client/{clientId}/coa';
const CostCenterURL = '/api/v2/client/{clientId}/costcenters';
const ClientByClientIdURL = '/api/v2/client/{clientId}';

const util = require('../utility.js');

module.exports = {

  createInvoice: async function (msg, cfg) {
    var fullUrl = cfg.endPointURL + createInvoiceURL;

    const requestOptions = {
      uri: `${fullUrl}`,
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      body: msg.body,
      json: true
    };

    return await request.post(requestOptions).then(util.autoParse).catch(util.error);
  },
  createInvoicePayment: async function (msg, cfg) {
    var fullUrl = cfg.endPointURL + createInvoicePaymentURL;
    const requestOptions = {
      uri: `${fullUrl}`,
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      body: msg.body,
      json: true
    };
    return  request.post(requestOptions).then(util.autoParse).catch(util.error);
  },
  getInvoiceByClient: async function (cfg, clientId) {
    const requestOptions = {
      uri: cfg.endPointURL + GetInvoiceByClientURL.replace('{ClientId}', clientId),
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    // Console.log("client vendor request:-"+requestOptions);
    return await request.get(requestOptions).then(util.autoParse).catch(util.error);
  },
  getInvoiceByVendor: async function (cfg, vendorId) {
    const requestOptions = {
      uri: cfg.endPointURL + GetInvoiceByVendorURL.replace('{VendorId}', vendorId),
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    // Console.log("client vendor request:-"+requestOptions);
    return await request.get(requestOptions).then(util.autoParse).catch(util.error);
  },
  getLineItemsByInvoice: async function (cfg, invoiceId) {
    console.log('Lines' + cfg.endPointURL + GetLineItemByInvoiceURL.replace('{InvoiceId}', invoiceId));

    const requestOptions = {
      uri: cfg.endPointURL + GetLineItemByInvoiceURL.replace('{InvoiceId}', invoiceId),
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    // Console.log("client vendor request:-"+requestOptions);
    return await request.get(requestOptions).then(util.autoParse).catch(util.error);
  },
  getInvoiceDetails: async function (cfg, invoiceId) {
    console.log('headerURL' + cfg.endPointURL + GetInvoiceByInvoiceId.replace('{InvoiceId}', invoiceId));
    const requestOptions = {
      uri: cfg.endPointURL + GetInvoiceByInvoiceId.replace('{InvoiceId}', invoiceId),
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    // Console.log("client vendor request:-"+requestOptions);
    return await request.get(requestOptions).then(util.autoParse).catch(util.error);
  },
  getPaymentByInvoiceId: async function (cfg, invoiceId) {
    const requestOptions = {
      uri: cfg.endPointURL + GetInvoicePaymentURL.replace('{InvoiceId}', invoiceId),
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    return await request.get(requestOptions).then(util.autoParse).catch(util.error);
  },
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
  getClientByClientId: async function (cfg, clientId) {
    const requestOptions = {
      uri: cfg.endPointURL + ClientByClientIdURL.replace('{clientId}', clientId),
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    return await request.get(requestOptions).then(util.autoParse).catch(util.error);
  }
  
};
