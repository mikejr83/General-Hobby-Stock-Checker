(function () {
  'use strict';

  var app = angular.module('GeneralApp');

  app.service('HomeService', ['$log', '$q', '$http', function ($log, $q, $http) {

    this.loadStock = function (filter, limit, skip, sort) {
      var deferred = $q.defer(),
        stockUrl = new URI('/stock'),
        sortKeys = _.keys(sort),
        sortValues = _.values(sort),
        search = {
          limit: limit || 10,
          skip: skip || 0,
          sort: sortKeys.length > 0 && sortValues.length > 0 ? sortKeys[0] + ' ' + sortValues[0] : 'name asc'
        };

      if (filter.soldOut !== undefined && !filter.soldOut) {
        filter.soldOut = 0;
      } else if (filter.soldOut !== undefined) {
        delete filter.soldOut;
      }

      _.extend(search, filter);

      stockUrl.search(search);

      $http.get(stockUrl.toString()).then(function (response) {
        var resultsArray = _.toArray(response.data);
        resultsArray = _.sortByOrder(resultsArray, _.keys(sort), _.values(sort));
        deferred.resolve(resultsArray);
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise;
    };

    this.stockTotal = function (soldOut) {
      var url = new URI('/stock/total');

      if (soldOut !== undefined && !soldOut) {
        url.search({
          soldOut:  '0'
        });
      }

      return $http.get(url.toString());

    };

    this.build = function () {
      return $http.get('/stock/build');
    }
    }]);
}());
