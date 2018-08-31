const request = require('request-promise');
const loginURL = '/api/v2/login';
const util = require('../utility.js');

module.exports = {

  // Login service
  login: async function (cfg) {
    const requestOptions = {
      uri: cfg.endPointURL + loginURL,
      headers: {
        Authorization: 'basic ' + Buffer.from(cfg.apiKey + ':' + cfg.username + ':' + cfg.password).toString('base64')
      },
      json: true
    };
    console.log('login request:-' + requestOptions);
    return await request.get(requestOptions).then(util.autoParse).catch(util.errorWithThrow);
  }
};
