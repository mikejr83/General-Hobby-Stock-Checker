(function () {
  'use strict';

  angular.module('GeneralApp')
    .controller('HomeController', ['$log', '$q', '$scope', 'NgTableParams', 'HomeService', function ($log, $q, $scope, NgTableParams, homeService) {
      var total = null;

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

          promises.push(homeService.loadStock(params.count(), (params.page() - 1) * params.count(), params.sorting())
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

          //          return deferred.promise;
        }
      });
  }]);
}());
