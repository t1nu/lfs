'use strict';

angular.module('phonecatDirectives').directive('lfsRequestDetail', ['$location', function($location) {
  return {
    restrict: 'E',
    scope: {
      request: '='
    },
    link: function(scope, element, attrs, tabsCtrl) {
      scope.$watch('request', function() {
        scope.model = scope.request.model;
        scope.user = scope.request.user;
      });
    },
    templateUrl: 'partials/lfs-request-detail.html'
  };
}]);