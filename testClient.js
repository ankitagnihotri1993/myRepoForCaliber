const vendorService = require("./lib/commons/services/vendorService.js");
const _ = require("underscore");

async function client(cfg)
{
    const self = this;
    var lastMaxDate="";
    var date = new Date();
    date.setDate(date.getDate() - 1);
    lastMaxDate = lastMaxDate || ""; ////date.toLocaleString(); 
    console.log("snapshot before"+ lastMaxDate);
    var clientList = await vendorService.getAllClient(cfg);// Get All Clients
    if (clientList == null || clientList == undefined || clientList=="") return;

    console.log(clientList.length);

    var result;
    if (lastMaxDate != "")
     {
       var filterData = clientList.filter(res =>
        (new Date(res.DateCreated) > new Date(astMaxDate)) || 
         (new Date(res.LastModified) > new Date(lastMaxDate))
       );
      result=filterData;
    }
    else {
        result = clientList;
    }

    result.forEach(element => { 

        console.log("element before"+ JSON.stringify(element) );

   // self.emit('data', messages.newMessageWithBody(element));     

   });

   let clientCreatedObj = _.max(clientList, function (client) {
   return  new Date(client.DateCreated).getTime();
    });

    let clientUpdatedObj = _.max(clientList, function (client) {
     return  new Date(client.LastModified).getTime();      
    });
    
    if(new Date(clientCreatedObj.DateCreated)> new Date(clientUpdatedObj.LastModified))
    {
 lastMaxDate =clientCreatedObj.DateCreated;
    }
    else{
lastMaxDate =clientUpdatedObj.LastModified;
    }
    console.log("snapshot after"+ lastMaxDate);
    //  self.emit('snapshot', snapshot);
    //  self.emit('end');
    }
    


client({ endPointURL: "https://asp.calibersoftware.com/capi2_APISandbox", apiKey: "MINER01", username: "asanchez", password: "xKuFyku2J3" });