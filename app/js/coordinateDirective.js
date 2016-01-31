'use strict';

angular.module('phonecatDirectives').directive('lfsCoordinate', function() {
  return {
    restrict: 'E',
    scope: {
      c: '=coordinate'
    },
    templateUrl: 'partials/lfs-coordinate.html'
  };
});