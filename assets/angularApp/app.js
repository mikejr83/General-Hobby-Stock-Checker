(function () {
  'use strict';
  var app = angular.module('GeneralApp', ['ngTable']);

  app.controller('MainController', ['$log', '$scope', function ($log, $scope) {

    $scope.year = (new Date()).getFullYear();
  }]);
}());
