'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Datamodel', ['RestService', '$q',
  function(RestService, $q) {

    var state = {
      "currentState": 0,
      "states": ['requestStepUser', 'requestStepLayout', 'requestStepSenderReceiver', 'requestStepConfirm'],
      "isNotFirstState": function() {
        return this.currentState > 0;
      },
      "isNotLastState": function() {
        return this.currentState < this.states.length - 1;
      },
      "nextState": function() {
        if (this.isNotLastState()) {
          this.currentState = this.currentState + 1;
        }
        return this.states[this.currentState];
      },
      "prevState": function() {
        if (this.isNotFirstState()) {
          this.currentState = this.currentState - 1;
        }
        return this.states[this.currentState];
      }
    };

    var request = {};
    var initRequest = function() {
      state.currentState = 0;

      request.model = {
        "coordinates": [{
          "xValue": 120,
          "yValue": 0
        }, {
          "xValue": 120,
          "yValue": 180
        }, {
          "xValue": 0,
          "yValue": 180
        }, {
          "xValue": 0,
          "yValue": 0
        }],
        "sources": []
      };
      request.user = {};
    }

    var list = [];

    var isInPolygon = function(c) {
      var p = c;
      var polygon = request.model.coordinates;

      var isInside = false;
      var minX = polygon[0].x, maxX = polygon[0].x;
      var minY = polygon[0].y, maxY = polygon[0].y;
      for (var n = 1; n < polygon.length; n++) {
        var q = polygon[n];
        minX = Math.min(q.x, minX);
        maxX = Math.max(q.x, maxX);
        minY = Math.min(q.y, minY);
        maxY = Math.max(q.y, maxY);
      }

      if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
        return false;
      }

      var i = 0, j = polygon.length - 1;
      for (i, j; i < polygon.length; j = i++) {
        if ((polygon[i].yValue > p.yValue) != (polygon[j].yValue > p.yValue) &&
          p.xValue < (polygon[j].xValue - polygon[i].xValue) * (p.yValue - polygon[i].yValue) / (polygon[j].yValue - polygon[i].yValue) + polygon[i].xValue) {
          isInside = !isInside;
        }
      }

      return isInside;
    }

    var getRequestList = function() {
      var deferred = $q.defer();
      var promise = deferred.promise;

      if (list.length == 0) {
        RestService.getRequestList().then(function(response) {
          console.log(response);
          list = response.data;
          deferred.resolve(list);
        });
      }
      else {
        deferred.resolve(list);
      }
      return promise;
    }

    var getRequestById = function(id) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      getRequestList().then(function(list) {
        for (var i = 0; i < list.length; i++) {
          if (list[i].request_id == id) {
            deferred.resolve(list[i]);
          }
        }
      }, function() {
        deferred.reject();
      });
      return promise;
    }

    return {
      request: request,
      state: state,
      initRequest: initRequest,
      isInPolygon: isInPolygon,
      getRequestList: getRequestList,
      getRequestById: getRequestById
    };
  }
]);