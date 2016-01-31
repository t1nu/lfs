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

  return {
    postRequest: postRequest,
    getRequestList: getRequestList,
    getRequestById: getRequestById
  };
}]);