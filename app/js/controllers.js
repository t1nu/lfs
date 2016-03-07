'use strict';

/* Controllers */

var requestDetailURL = 'http://wb-tinu.rhcloud.com/lfs/#/requestDetail/';

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('HomeCtrl', ['$scope', '$state', 'Datamodel',
  function($scope, $state, Datamodel) {
    new WOW().init();   
    $scope.sendMail = function() {
      Datamodel.sendMail();
    }
  }
]);

phonecatControllers.controller('ContactCtrl', ['$scope', '$location', '$state', 'Datamodel',
  function($scope, $location, $state, Datamodel) {
    $scope.sendMessage = function() {
      var messageHTML = $scope.message.replace(/\n/g, "<br>");
      console.log($scope.message);
      console.log(messageHTML);
      var msg = {
        from: $scope.name + ' <' + $scope.email + '>',
        to: 'martin.haefelfinger@gmail.com',
        subject: 'WaveBusters Contact Form Message from ' + $scope.name,
        message: messageHTML
      };
      Datamodel.sendMail(msg);

      var msgConfirm = {
        to: $scope.email,
        subject: 'WaveBusters - Message received!',
        message: 'Thank you ' + $scope.name + '!<br>We received your message and will try to answer as soon as possible.<br><br>Message:<br>' + messageHTML

      }
      Datamodel.sendMail(msgConfirm);
      $location.path('/contactConfirm');
    }
  }
]);

phonecatControllers.controller('ContactConfirmCtrl', ['$scope', '$location', '$state', 'Datamodel',
  function($scope, $location, $state, Datamodel) {     
    $scope.close = function(){
        $location.path('/home');
    }
  }
]);

phonecatControllers.controller('TheoryCtrl', ['$scope', '$state', 'Datamodel',
  function($scope, $state, Datamodel) { 
  // new WOW().init();   
  }
]);

phonecatControllers.controller('RequestInitCtrl', ['$scope', '$state', 'Datamodel',
  function($scope, $state, Datamodel) {
    $scope.initRequest = function() {
      Datamodel.initRequest();
      $state.go('requestStepUser');
    }
  }
]);

phonecatControllers.controller('RequestStepUserCtrl', ['$scope', 'Datamodel',
  function($scope, Datamodel) {
    $scope.user = Datamodel.request.user;
  }
]);

phonecatControllers.controller('RequestStepLayoutCtrl', ['$scope', 'Datamodel',
  function($scope, Datamodel) {
    $scope.model = Datamodel.request.model;

    $scope.onAddCoordinate = function(c) {
      console.log(!$scope.flayout.c1.$error);
      console.log(!$scope.flayout.c2.$error);
      if (!$scope.flayout.c1.$error.min) {
        if (!$scope.flayout.c2.$error.min) {
          c.xValue = c.xValue || 0;
          c.yValue = c.yValue || 0;
          $scope.model.coordinates.push(angular.copy(c));
        }
      }
    }
    
    $scope.disableAddCoordinate = function () {
      if (($scope.flayout.c1.$error.length + $scope.flayout.c2.$error.length) > 0) {
        return true;
      } else {
        return false;
      }
    }
    
    $scope.isValidlayout = function() {
      return $scope.model.coordinates.length > 2;
    }

    $scope.onDelCoordinate = function(c) {
      var index = $scope.model.coordinates.indexOf(c);
      $scope.model.coordinates.splice(index, 1);
    }

    $scope.onDelAllCoordinates = function() {
      $scope.model.coordinates = [];
    }
  }
]);

phonecatControllers.controller('RequestStepSenderReceiverCtrl', ['$scope', 'Datamodel',
  function($scope, Datamodel) {
    $scope.model = Datamodel.request.model;
    $scope.isPointOutside = false;
    $scope.isRecPointOutside = false;

    $scope.onAddSource = function(c) {
      if (Datamodel.isInPolygon(c)) {
        $scope.isPointOutside = false;
        $scope.model.sources.push(angular.copy(c));
      } else {
        $scope.isPointOutside = true;
      }
    }
     
    $scope.isValidlayout = function() {
      return true;
    }


    $scope.onDelSource = function(c) {
      var index = $scope.model.sources.indexOf(c);
      $scope.model.sources.splice(index, 1);
    }

    $scope.onSetReceiver = function(c) {
      if (Datamodel.isInPolygon(c)) {
        $scope.isRecPointOutside = false;
        $scope.model.receiver = angular.copy(c);
      } else {
        $scope.isRecPointOutside = true;
      }
    }

  }
]);

phonecatControllers.controller('RequestStepConfirmCtrl', ['$scope', '$location', 'Datamodel', 'RestService',
  function($scope, $location, Datamodel, RestService) {
    $scope.model = Datamodel.request.model;
    $scope.user = Datamodel.request.user;
    $scope.request = Datamodel.request;

    $scope.submit = function() {
      console.log('ctrl submit!');
      var httpRequest = {
        "request_user": Datamodel.request.user,
        "model": $scope.model
      };
      RestService.postRequest(httpRequest).then(function(res) {
        Datamodel.request.user.key = res.data.key;
        $location.path('/requestStepFinal');
      });
    }
  }
]);

phonecatControllers.controller('RequestStepFinalCtrl', ['$scope', '$location', 'Datamodel', 'RestService',
  function($scope, $location, Datamodel, RestService) {
    $scope.model = Datamodel.request.model;
    $scope.user = Datamodel.request.user;
    
    console.log('sending mail!');
    var key = $scope.user.key;
    var email = $scope.user.email;
    // var key = '12341234';
    // var email = 'martin.haefelfinger@gmail.com';
    
    var msgText = '<p><h1>Thank you!</h1> We have received your request and will process it as fast as possible.'
    + '<br />Your reference key is <strong>' + key + '</strong>'
    + '<br><a href="'+ requestDetailURL + key + '">Review your Request here</a></p>';
    var msg = {
        "to": email,
        "subject": 'Confirmation from WaveBusters',
        "message": msgText
    };
    RestService.sendMail(msg).then(function() {
        console.log('mail sent!');
    });

    $scope.close = function(){
        $location.path('/home');
    }

  }
]);

phonecatControllers.controller('RequestListCtrl', ['$scope', 'Datamodel',
  function($scope, Datamodel) {
    $scope.list = [];
    Datamodel.getRequestList().then(function(list) {
      $scope.list = list;
    });
  }
]);
phonecatControllers.controller('RequestDetailFullCtrl', ['$scope', '$stateParams', 'Datamodel',
  function($scope, $stateParams, Datamodel) {
    console.log($stateParams.requestId);
    $scope.request = {};
    $scope.requestId = $stateParams.requestId;
    Datamodel.getRequestById($stateParams.requestId).then(function(request) {
      console.log('getRequestById');
      $scope.request = request;
    })
  }
]);
phonecatControllers.controller('RequestDetailCtrl', ['$scope', '$stateParams', 'Datamodel',
  function($scope, $stateParams, Datamodel) {
    $scope.request = {};
    Datamodel.getRequestByKey($stateParams.requestKey).then(function(request) {
      $scope.request = request[0];
    })
  }
]);
