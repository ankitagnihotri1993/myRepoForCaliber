const vendorService = require("./lib/commons/services/vendorService.js");
const _ = require("underscore");

async function client(cfg)
{
    const self = this;

    var VendorDetailList = [];

    console.log("called");
    var clientList = await vendorService.getAllClient(cfg);// Get All Clients

    console.log("Client Data " + JSON.stringify(clientList));

    if (clientList == null || clientList == undefined || clientList == "") return;

    for (var i = 0; i < clientList.length; i++) {

        var clientId = clientList[i].ClientID;
        var result = await vendorService.getVendorByClient(cfg, clientId);


        if (result != null || result.length > 0) {
            var vendorList = result;
            // console.log("vendorList" + JSON.stringify(vendorList));    
            vendorList.forEach(element => {
                var index = VendorDetailList.findIndex(o => o.VendorID === element.VendorID);

                var vendorObj = element;
                if (index >0) {
                    vendorObj.clients = VendorDetailList[index].clients;
                    vendorObj.clients.push(clientList[i]);
                    VendorDetailList[index] = vendorObj;
                } else {
                    vendorObj.clients = [];
                    vendorObj.clients.push(clientList[i]);
                    VendorDetailList.push(vendorObj);
                 
                }
            });

           // console.log("clientId " + clientId);


        }
    }

    VendorDetailList.forEach(element => {
        // console.log("Vendor data " + element.VendorID);
        console.log("cli data " + JSON.stringify(element.clients.length));
       // self.emit('data', messages.newMessageWithBody(element));
    });


    }
    


client({ endPointURL: "https://asp.calibersoftware.com/capi2_APISandbox", apiKey: "MINER01", username: "asanchez", password: "xKuFyku2J3" });