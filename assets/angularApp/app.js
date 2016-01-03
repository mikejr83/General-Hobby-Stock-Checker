(function () {
  var app = angular.module('GeneralApp', ['ngTable'])
    .controller('MainController', ['$log', '$scope', function ($log, $scope) {

      $scope.year = (new Date()).getFullYear();
  }]);
}())
