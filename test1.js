const vendorService = require("./lib/commons/services/vendorService.js");
var Promise = require('promise');
const _ = require("underscore");
const request = require('request-promise');


async function testGL(cfg)
{
debugger;
  var result = await  vendorService.getAccountDetailsByClient(cfg, 37);




    console.log("Result "+ JSON.stringify(result));


  
}
cfg={
  endPointURL:"https://asp.calibersoftware.com/capi2_APISandbox",
  username:"mtconnect@mineraltree.com",
  password:"System01##",
  apiKey: "MTUAT01"
  };
  testGL(cfg);
