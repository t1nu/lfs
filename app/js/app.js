'use strict';

var phonecatApp = angular.module('phonecatApp', [
  'ui.router',
  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices',
  'phonecatDirectives'
]);

phonecatApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .state('theory', {
            url: '/theory',
            templateUrl: 'partials/theory.html',
            controller: 'TheoryCtrl'
        })
        .state('faq', {
            url: '/faq',
            templateUrl: 'partials/faq.html',
            controller: 'FaqCtrl'
        })
        .state('requestInit', {
            url: '/requestInit',
            templateUrl: 'partials/request-init.html',
            controller: 'RequestInitCtrl'
        })
        .state('requestStepUser', {
            url: '/requestStepUser',
            templateUrl: 'partials/request-step-user.html',
            controller: 'RequestStepUserCtrl'
        })
        .state('requestStepLayout', {
            url: '/requestStepLayout',
            templateUrl: 'partials/request-step-layout.html',
            controller: 'RequestStepLayoutCtrl'
        })
        .state('requestStepSenderReceiver', {
            url: '/requestStepSenderReceiver',
            templateUrl: 'partials/request-step-sender-receiver.html',
            controller: 'RequestStepSenderReceiverCtrl'
        })
        .state('requestStepConfirm', {
            url: '/requestStepConfirm',
            templateUrl: 'partials/request-step-confirm.html',
            controller: 'RequestStepConfirmCtrl'
        })
        .state('requestStepFinal', {
            url: '/requestStepFinal',
            templateUrl: 'partials/request-step-final.html',
            controller: 'RequestStepFinalCtrl'
        })
        .state('requestList', {
            url: '/requestList',
            templateUrl: 'partials/request-list.html',
            controller: 'RequestListCtrl'
        })
        .state('requestDetail', {
            url: '/requestDetail/:requestId',
            templateUrl: 'partials/request-detail.html',
            controller: 'RequestDetailCtrl'
        })
}); 