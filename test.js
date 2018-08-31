const vendorService = require("./lib/commons/services/vendorService.js");
var Promise = require('promise');
const _ = require("underscore");
const updateVendorURL = "/api/v2/vendor";
const request = require('request-promise');
const util = require("./lib/commons/utility");
const invoiceService = require("./lib/commons/services/invoiceService.js");
async function processTrigger(cfg) {
  var lastMaxDate;
  debugger;
  var clientList = await vendorService.getAllClient(cfg);// Get All Clients
  if (clientList == null || clientList == undefined || clientList == "") return;
  for (var i = 0; i < clientList.length; i++) {
    var clientId = clientList[i].ClientID;
    var paymentGLAccounts = [];
    var expenseGLAccount = [];
    //Get Accounts and vendor by Client by
    var promiseAccountDetails = vendorService.getAccountDetailsByClient(cfg, clientId);
    var promiseVendor = vendorService.getVendorByClient(cfg, clientId);

    var result = await Promise.all([promiseAccountDetails, promiseVendor]);
    if (result[1] != null || result[1].length > 0) {

      if (result[0] != null && result[0].length > 0) {
        result[0].forEach(element => {

          if (element.AccountType == "Bank" && element.Balance > 0) {
            paymentGLAccounts.push(element.AccountNumber);
          }
          else {
            paymentGLAccounts.push(element.AccountNumber);
          }
        });
        result[0].forEach(element => {
          if (element.AccountType == "Expense") {
            expenseGLAccount.push(element.AccountID);
          }
        });
      }

      var vendorList = result[1];

      var date = new Date();
      date.setDate(date.getDate() - 1);
      lastMaxDate = lastMaxDate || ""//date.toLocaleString(); //  For now we are getting all the data to test, because we don't have any api to create venor with Client
      console.log("snapshot before" + lastMaxDate);
      var result;

      if (lastMaxDate != "") {
        var filterData = vendorList.filter(res =>
          (new Date(res.DateCreated) > new Date(lastMaxDate)) ||
          (new Date(res.LastModified) > new Date(lastMaxDate))
        );
        result = filterData;
      }
      else {
        result = vendorList;
      }

      result.forEach(element => {

        var vendorObj = element;
        vendorObj.clientid = clientId;
        vendorObj.paymentGLAccountId = paymentGLAccounts;
        vendorObj.expenseGLAccount = expenseGLAccount;

        console.log("Vendor data " + JSON.stringify(vendorObj));
        self.emit('data', messages.newMessageWithBody(vendorObj));

      });

      let vendorCreatedObj = _.max(vendorList, function (vendor) {
        return new Date(vendor.DateCreated).getTime();
      });

      let vendorUpdatedObj = _.max(vendorList, function (vendor) {
        return new Date(vendor.LastModified).getTime();

      });

      if (new Date(vendorCreatedObj.DateCreated) > new Date(vendorUpdatedObj.LastModified)) {
        lastMaxDate = vendorCreatedObj.DateCreated;
      }
      else {
        lastMaxDate = vendorUpdatedObj.LastModified;
      }

      // console.log("snapshot after"+ snapshot.lastMaxDate);
      //  self.emit('snapshot', snapshot);
      //   self.emit('end');
    }
  }
}

function updateVendor(cfg) {
  var fullUrl = cfg.endPointURL + updateVendorURL;

  const requestOptions = {
    uri: `${fullUrl}`,
    headers: {
      'Authorization': "basic " + Buffer.from(cfg.apiKey + ":" + cfg.username + ":" + cfg.password).toString('base64'),

    },
    body: {
      "VendorID": "1595",
      "VendorType": null,
      "CompanyName": "rahul update9july",
      "Phone": "555-555-5555",
      "Email": null,
      "Address1": "111",
      "Address2": "222",
      "City": "333",
      "Zip": "77006",
      "Country": "UK",
      "VAcctNumber": "0",
      "StateTaxID": null,
      "IsActive": false,
      "ACHAccountNumber": "",
      "ACHRoutingNumber": ""
    },
    json: true
  };

  return request.put(requestOptions).then(util.autoParse).catch(util.error);
}

async function GetAllInvoice(cfg) {

  const self = this;
  var date = new Date();
   
var  lastMaxDate="" ;


  date.setDate(date.getDate() - 1);

  lastMaxDate = lastMaxDate || "";//date.toLocaleString(); //  For now we are getting all the data to test, because we don't have any api to create venor with Client

  console.log("snapshot before"+ lastMaxDate);
  var clientList = await vendorService.getAllClient(cfg);// Get All Clients
  if (clientList == null || clientList == undefined || clientList=="") return;
  for(var i=0; i<clientList.length; i++ )         
  {   
    var clientObj=clientList[i];
    var promiseInvoiceDetails =invoiceService.getInvoiceByClient(cfg,clientObj.ClientID);
    var result =  await Promise.all([promiseInvoiceDetails]);
    if(result[0]!=null && result[0].length>0)
    {     
        var invoiceList = result[0];
        var resultData;
        if (lastMaxDate != "")
        {
          var filterData =  invoiceList.filter(res =>
            (new Date(res.DateCreated) > new Date(lastMaxDate)) || 
            (new Date(res.LastModified) > new Date(lastMaxDate))
          );
          resultData=filterData;
        }
        else {
          resultData = invoiceList;
        }

    resultData.forEach(async element => {  
    var _InvoiceLineItems=[]; 
    var _InvoicePayments=[]; 
    var promiseLineItem =invoiceService.getLineItemsByInvoice(cfg,element.InvoiceID);
    var PaymentsPromise =invoiceService.getInvoicePaymentById(cfg,element.InvoiceID);
    var GLPromise =invoiceService.getGLAccountByClient(cfg,element.ClientID);
    var CostCenterPromise =invoiceService.getCostCenterByClient(cfg,element.ClientID);
    var vendorPromise =vendorService.getVendorById(cfg,element.PayeeID);

    var _result =  await Promise.all([promiseLineItem,PaymentsPromise,GLPromise,CostCenterPromise,vendorPromise]);

    if(_result[0]!=null && _result[0].length>0)
    { 
     _InvoiceLineItems  =  _result[0];
    }
    else
    {
      var invObj={LineItemID: 0,InvoiceID: 0,VendorCodeID: "",VendorCode: "",Description: "",
      ExpenseGLAccountID: 0,ExpenseGLAccount: "",Amount: 0,CostCenterID: 0,CostCenter: "",Quantity: 0,
     };
     _InvoiceLineItems.push(invObj);
    }

    if(_result[1]!=null && _result[1].length>0) {_InvoicePayments  =  _result[1];}
    else {var paymentObj={PaymentDate:"",Memo:""}; _InvoicePayments.push(paymentObj); }
    
   let invoiceObj = element;     
  
   invoiceObj.InvoiceLineItems= _InvoiceLineItems;    
   invoiceObj.InvoicePayments= _InvoicePayments;
   invoiceObj.ClientData=clientObj;
   invoiceObj.GLData= _result[2]!=null && _result[2].length>0? _result[2] : "";
   invoiceObj.CostCenterData=_result[3]!=null && _result[3].length>0? _result[3] : "";
   invoiceObj.VendorData=_result[4]!=null && _result[4].length>0? _result[4] : "";

   console.log("ClientData data "+ JSON.stringify(invoiceObj.ClientData));
   console.log("GLData data "+ JSON.stringify(invoiceObj.GLData));
   console.log("CostCenterData data "+ JSON.stringify(invoiceObj.CostCenterData));
   console.log("VendorData data "+ JSON.stringify(invoiceObj.VendorData));

  console.log("Invoice data "+ JSON.stringify(invoiceObj.ClientData));
  // self.emit('data', messages.newMessageWithBody(element));     
  
 });

//  let invoiceCreatedObj = _.max(invoiceList, function (invoice) {
//     return   new Date(invoice.DateCreated).getTime();
//   });

//   let invoiceUpdatedObj = _.max(invoiceList, function (invoice) {
//     return  new Date(invoice.LastModified).getTime();
      
//   });
//   // Find max date from date created and modified then update snapshot value 
//   if(new Date(invoiceCreatedObj.DateCreated)> new Date(invoiceUpdatedObj.LastModified))
//   {
//     snapshot.lastMaxDate =invoiceCreatedObj.DateCreated;
//   }
//   else
//   {
//    snapshot.lastMaxDate =invoiceUpdatedObj.LastModified;
//   }
//   console.log("snapshot after"+ snapshot.lastMaxDate);
//   self.emit('snapshot', snapshot);
//  self.emit('end');
}
}
}

//test();
GetAllInvoice({ endPointURL: "https://asp.calibersoftware.com/capi2_APISandbox", apiKey: "MINER01", username: "asanchez", password: "xKuFyku2J3" });

// updateVendor(
// {endPointURL:"https://asp.calibersoftware.com/capi2_APISandbox",apiKey:"MINER01",username:"asanchez",password:"xKuFyku2J3"});
// processTrigger({endPointURL:"https://asp.calibersoftware.com/capi2_APISandbox",apiKey:"MINER01",username:"asanchez",password:"xKuFyku2J3"});


