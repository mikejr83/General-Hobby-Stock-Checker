(function () {
  angular.module('GeneralApp')
    .service('HomeService', ['$log', '$q', '$http', function ($log, $q, $http) {

      this.loadStock = function(limit, skip, sort) {
        var deferred = $q.defer(),
            stockUrl = new URI('/stock');

        stockUrl.search({
          limit: limit || 10,
          skip: skip || 0
        });

        $http.get(stockUrl.toString()).then(function(response) {
          var resultsArray = _.toArray(response.data);
          resultsArray = _.sortByOrder(resultsArray, _.keys(sort), _.values(sort));
          deferred.resolve(resultsArray);
        }, function (error) {
          deferred.reject(error);
        });

        return deferred.promise;
      };

      this.stockTotal = function () {
        return $http.get('/stock/total');
      };
  }]);
}())
