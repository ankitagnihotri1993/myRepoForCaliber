
 const vendor = require('../../lib/triggers/getInvoiceByVendor');
var snapshot={lastMaxDate:""};
 var msg={body:""};
 var cfg;
 msg.body = {
    "vendorId": "19"
  }
    cfg={
    endPointURL:"https://asp.calibersoftware.com/capi2_APISandbox",
    username:"asanchez",
    password:"xKuFyku2J3",
    apiKey: "MINER01"
    };

vendor.process(msg,cfg,snapshot);

 
