'use strict';

angular.module('phonecatServices').factory('RestService', ['$http', function($http) {

  var postRequest = function(request) {
    return $http({
      url: '/requestList',
      method: "POST",
      data: request
    });
  };

  var getRequestList = function() {
    return $http.get('/requestList');
  }

  var getRequestById = function() {

  }

  var sendMail = function(msg) {
    return $http({
      url: '/sendMail',
      method: "POST",
      data: msg
    });    
  }

  return {
    postRequest: postRequest,
    getRequestList: getRequestList,
    getRequestById: getRequestById,
    sendMail: sendMail
  };
}]);