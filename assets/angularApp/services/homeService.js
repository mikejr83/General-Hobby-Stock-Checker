(function () {
  angular.module('GeneralApp')
    .service('HomeService', ['$log', '$q', '$http', function ($log, $q, $http) {

      this.loadStock = function() {
        var deferred = $q.defer();

        $http.get('/stock').then(function(response) {
          deferred.resolve(_.toArray(response.data));
        }, function (error) {
          deferred.reject(error);
        });

        return deferred.promise;
      };
  }]);
}())
