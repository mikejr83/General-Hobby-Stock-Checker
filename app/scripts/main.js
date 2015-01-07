/* jshint strict:true, devel:true  */
var productApp = angular.module('productApp', []); // jshint ignore:line
		
productApp.controller('ProductsController', function ($scope) {
	$scope.products = $DATA || []; // jshint ignore:line
	
	$scope.orderProduct = function(product) {
		var val = parseFloat(product.specialPrice !== null ? product.specialPrice.substring(1, product.specialPrice.length) : product.regularPrice.substring(1, product.regularPrice.length));
		return val;
	};
});
