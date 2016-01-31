'use strict';

angular.module('phonecatDirectives').directive('lfsCmd', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs, tabsCtrl) {

      function getCmd() {
        if (angular.isDefined(scope.request) && angular.isDefined(scope.request.model)) {
          var model = scope.request.model;

          function itemToCoordXY(item) {
            if (angular.isDefined(item)) {
              return (item.xValue / 100) + " " + (item.yValue / 100);
            } else {
              return "";
            }
          }

          function itemToCoord(item) {
            if (angular.isDefined(item)) {
              return itemToCoordXY(item) + " " + (item.zValue / 100);
            } else {
              return "";
            }
          }

          function add(str, item, index, length, itemToCoordFn) {
            str = str + itemToCoordFn(item);
            if (index < length - 1) {
              str = str + "; ";
            }
            return str;
          }

          function getCoordString(list, itemToCoordFn) {
            var res = "";
            if (angular.isDefined(list)) {
              for (var i = 0; i < list.length; i++) {
                res = add(res, list[i], i, list.length, itemToCoordFn);
              }
            }
            return res;
          }

          var points = getCoordString(model.coordinates, itemToCoordXY);
          var height = model.roomheight / 100;
          var receiver = itemToCoord(model.receiver);
          var sources = getCoordString(model.sources, itemToCoord);
          return "LF7('polygon',[" + points + "]," + height + ",[" + receiver + "],[" + sources + "])";
        }
      }
      scope.$watch('request.model', function() {
        scope.cmd = getCmd();
      });
    },
    templateUrl: 'partials/lfs-cmd.html'
  };
});