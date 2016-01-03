(function () {
  angular.module('GeneralApp')
    .service('HomeService', ['$log', '$http', function ($log, $http) {

      this.loadStock = function() {
        return $http.get('/stock');
      };
  }]);
}())
