/* jshint strict:true, devel:true  */
var productApp = angular.module('productApp', []); // jshint ignore:line
		
productApp.controller('ProductsController', function ($scope) {
	$scope.data = $DATA || {date: null, products:[]}; // jshint ignore:line
	$scope.productNameFilter = '';
	$scope.showSoldOut = false;
	$scope.sortReverse = false;
	$scope.showSpinner = false;
	
	$scope.orderProduct = function(product) {
		var val = parseFloat(product.specialPrice !== null ? product.specialPrice.substring(1, product.specialPrice.length) : product.regularPrice.substring(1, product.regularPrice.length));
		return val;
	};
	
	$scope.filterList = function(actual) {
		var show = false;
		
		if((!actual.soldOut || $scope.showSoldOut) && $scope.productNameFilter && $scope.productNameFilter != '') {			 //jshint ignore:line
			show = actual.name.toLowerCase().indexOf($scope.productNameFilter.toLowerCase()) > -1;
		}
		else {
			show = (!actual.soldOut || $scope.showSoldOut);
		}
			
		return show;
	};
});
