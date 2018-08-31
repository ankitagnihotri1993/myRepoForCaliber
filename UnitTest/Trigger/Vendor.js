const vendor = require('../../lib/triggers/getCaliberVendorDetails');

var msg={body:""};
 var cfg;
 var snapshot;
cfg={
endPointURL:"https://asp.calibersoftware.com/capi2_APISandbox",
username:"asanchez",
password:"xKuFyku2J3",
apiKey: "MINER01"
};
vendor.process(msg,cfg,snapshot);

 
