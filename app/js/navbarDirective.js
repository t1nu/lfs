'use strict';

angular.module('phonecatDirectives').directive('lfsNavbar', ['$location', 'Datamodel', function($location, Datamodel) {
  return {
    restrict: 'E',
    scope: {
      submitFn: '=',
      nextDisabled: '='
    },
    link: function(scope, element, attrs, tabsCtrl) {
      scope.isNotFirstState = function() {
        return Datamodel.state.isNotFirstState();
      }
      scope.isNotLastState = function() {
        return Datamodel.state.isNotLastState();
      }
      scope.next = function() {
        $location.path('/' + Datamodel.state.nextState());
      }
      scope.back = function() {
        $location.path('/' + Datamodel.state.prevState());
      }
      scope.submit = function() {
        scope.submitFn();
      }
    },
    templateUrl: 'partials/lfs-navbar.html'
  };
}]);