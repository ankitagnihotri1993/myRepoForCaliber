
 const vendor = require('../../lib/actions/updateVendor');

 var msg={body:""};
 var cfg;
 msg.body = {
    "VendorID": "19",
    "CompanyName": "Harwood Maintenance123",
    "Address1": "3500 Fannin",
    "Address2": null,
    "City": "77004-3333",
    "Zip": "77004-3333",
    "Country": "USA",
    "AcctTermsID": 4
  }
    cfg={
    endPointURL:"https://asp.calibersoftware.com/capi2_APISandbox",
    username:"asanchez",
    password:"xKuFyku2J3",
    apiKey: "MINER01"
    };

vendor.process(msg,cfg);

 
