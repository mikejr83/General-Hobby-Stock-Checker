(function () {
  'use strict';

  angular.module('GeneralApp')
    .controller('HomeController', ['$log', '$q', '$scope', 'NgTableParams', 'HomeService', function ($log, $q, $scope, NgTableParams, homeService) {
      var total = null;

      $scope.totalStock = null;

      $scope.filter = {
        soldOut: false
      };

      $scope.tableParams = new NgTableParams({
        count: 10,
        sorting: {
          name: 'asc'
        }
      }, {
        getData: function (params) {
          $log.info('getData', params);
          // ajax request to api
          var promises = [],
            pageResults = [];

          promises.push(homeService.loadStock(_.cloneDeep($scope.filter), params.count(), (params.page() - 1) * params.count(), params.sorting())
            .then(function (results) {
              pageResults = results;
            }));


          promises.push(homeService.stockTotal($scope.filter.soldOut).then(function (results) {
            $log.info('stock total done', results);
            params.total(results.data);
          }));

          return $q.all(promises).then(function () {
            return pageResults;
          }, function () {
            return [];
          });

          return deferred.promise;
        }
      });

      $scope.build = function () {
        homeService.build();
      };

      $scope.$watch('filter.soldOut', function (newVal, oldVal) {
        if (newVal != oldVal) {
          $scope.tableParams.reload();
        }
      });

      homeService.stockTotal().then(function (results) {
        $log.info('stock total done2222222222', results);
        $scope.totalStock = results.data;
      });
  }]);
}());
