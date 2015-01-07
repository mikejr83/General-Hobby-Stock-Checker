/* jshint devel:true */
"use strict";
var productApp = angular.module('productApp', []);
		
productApp.controller('ProductsController', function ($scope) {
	$scope.products = $DATA || [];
	
	$scope.orderProduct = function(product) {
		var val = parseFloat(product.specialPrice != null ? product.specialPrice.substring(1, product.specialPrice.length) : product.regularPrice.substring(1, product.regularPrice.length));
		return val;
	};
});
