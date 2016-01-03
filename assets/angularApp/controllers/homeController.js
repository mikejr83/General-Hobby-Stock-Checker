(function () {
  angular.module('GeneralApp')
    .controller('HomeController', ['$log', '$scope', 'NgTableParams', 'HomeService', function ($log, $scope, NgTableParams, homeService) {

      $scope.tableParams = new NgTableParams({}, {
        getData: function (params) {
          $log.info('getData', params);
          // ajax request to api
          return homeService.loadStock().then(function (results) {
            $log.info('load stock done', results);
            return results;
          });
//          return Api.get(params.url()).$promise.then(function (data) {
//            params.total(data.inlineCount); // recal. page nav controls
//            return data.results;
//          });
        }
      });
  }]);
}())
