const _ = require('underscore');

module.exports = {
  autoParse: function (body, response, resolveWithFullResponse) {
      console.log("body" + JSON.stringify(body));
    return body;
  },
  error: function (reason) {
    console.log('Oops! Error occurred - ', reason);
  },
  errorWithThrow: function (reason) {
    console.log('Oops! Error occurred - ', reason);
    throw new Error(reason);
  },
  isEmpty:function(value) {
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
  },
  getMaxDate:function(result){

      var createdObj = _.max(result, function (obj) {
        return new Date(obj.DateCreated).getTime();
      });
     var updatedObj = _.max(result, function (obj) {
      return new Date(obj.LastModified).getTime();
    });
    // cheking both created date and modified date of caliber because caliber API not updating the updated data when user creating the new item
     if (new Date(createdObj.DateCreated) > new Date(updatedObj.LastModified))
    {
      return createdObj.DateCreated;
    }
     else 
    {
      return updatedObj.LastModified;
    }
  },
  previousDate:function()
  {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    return  date.toISOString();
  }  
};
