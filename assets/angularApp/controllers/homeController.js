(function () {
  angular.module('GeneralApp')
    .controller('HomeController', ['$scope', 'NgTableParams', 'HomeService', function ($scope, NgTableParams, homeService) {

      $scope.tableParams = new NgTableParams({}, {
        getData: function (params) {
          console.log('getData');
          // ajax request to api
          return homeService.loadStock().then(function (results) {
            return results.data;
          });
//          return Api.get(params.url()).$promise.then(function (data) {
//            params.total(data.inlineCount); // recal. page nav controls
//            return data.results;
//          });
        }
      });

      homeService.loadStock().then(function(results) {
        console.log('results', results);
      })
  }]);
}())
