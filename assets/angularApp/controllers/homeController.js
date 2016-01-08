(function () {
  'use strict';

  angular.module('GeneralApp')
    .controller('HomeController', ['$log', '$q', '$scope', 'NgTableParams', 'HomeService', function ($log, $q, $scope, NgTableParams, homeService) {
      var total = null;

      io.socket.on('BUILDING', function (data) {
        console.log('socket data', data);
      });

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
              $log.info('load stock done', results);
              pageResults = results;
            }));

          if (total === null) {
            promises.push(homeService.stockTotal().then(function (results) {
              $log.info('stock total done', results);
              params.total(results.data);
            }));
          }

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
  }]);
}());
