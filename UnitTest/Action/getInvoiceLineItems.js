
 const vendor = require('../../lib/actions/getInvoiceLineItems');
var snapshot;
 var msg={body:""};
 var cfg;
 msg.body = {
    "invoiceId": "1276"
  }
    cfg={
    endPointURL:"https://asp.calibersoftware.com/capi2_APISandbox",
    username:"asanchez",
    password:"xKuFyku2J3",
    apiKey: "MINER01"
    };

vendor.process(msg,cfg,snapshot);

 
