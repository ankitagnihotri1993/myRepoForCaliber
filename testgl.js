const vendorService = require("./lib/commons/services/vendorService.js");
var Promise = require('promise');
const _ = require("underscore");
const updateVendorURL = "/api/v2/vendor";
const request = require('request-promise');
const util = require("./lib/commons/utility");
const invoiceService = require("./lib/commons/services/invoiceService.js");

async function GetAllGL(cfg) {
    const self = this;
    let paymentGLAccountList=[];
     let clientList = await vendorService.getAllClient(cfg);
     var lastMaxDate="";
     console.log("Client lenght "+clientList.length);
     for(var i=0; i<clientList.length; i++ )         
      {   
        var clientObj= clientList[i];
        var clientId=clientList[i].ClientID;
        console.log("clientId "+clientId);
        let promise=vendorService.getAccountDetailsByClient(cfg,clientId);
        let result =  await Promise.all([promise]);
        console.log('Result Lenght '+result[0].length);
        if(result[0]!=null && result[0].length>0)
        {
      var GLAccountList = result[0];
      var date = new Date();
      date.setDate(date.getDate() - 1);
      
      lastMaxDate = lastMaxDate || date.toLocaleString(); //  For now we are getting all the data to test, because we don't have any api to create venor with Client
      console.log("snapshot before"+ lastMaxDate);
      var resultdata;
     
      if (lastMaxDate != "")
       {
        var filterData =  GLAccountList.filter(res =>
          (new Date(res.DateCreated) > new Date(lastMaxDate)) || 
           (new Date(res.LastModified) > new Date(lastMaxDate))
         );
         resultdata=filterData;
      }
      else {
        resultdata = GLAccountList;
      }
      resultdata.forEach(element => {

        var glAccount = element;
        glAccount.ClientInfo=clientObj;

          console.log("GL Account data "+ JSON.stringify(element));
      //    self.emit('data', messages.newMessageWithBody(element));     
      
     });
  
     let glCreatedObj = _.max(GLAccountList, function (gl) {
        return   new Date(gl.DateCreated).getTime();
      });
  
      let glUpdatedObj = _.max(GLAccountList, function (gl) {
        return  new Date(gl.LastModified).getTime();
          
      });
  
      // Find max date from date created and modified then update snapshot value 
      if(new Date(glCreatedObj.DateCreated)> new Date(glUpdatedObj.LastModified))
      {
          lastMaxDate =glCreatedObj.DateCreated;
      }
      else
      {
        lastMaxDate=new Date(glUpdatedObj.LastModified)>new Date(lastMaxDate)?
        glUpdatedObj.LastModified:lastMaxDate;
      }
      console.log("snapshot after"+ lastMaxDate);
    //    self.emit('snapshot', snapshot);
    //     self.emit('end');
 }
 }
    
}

GetAllGL({ endPointURL: "https://asp.calibersoftware.com/capi2_APISandbox", apiKey: "MINER01", username: "asanchez", password: "xKuFyku2J3" });

