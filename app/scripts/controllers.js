'use strict';
/* Controllers*/

angular.module('twControllers', [])
.controller('AppCtrl', function($scope, $location, $resource, $rootScope) {
	$scope.$location = $location;
	$scope.$watch('$location.path()', function(path) {
		return $scope.activeNavId = path || '/';
	});
	return $scope.getClass = function(id) {
		if ($scope.activeNavId.substring(0, id.length) === id) {
			return 'active';
		} else {
			return '';
		}
	};
}).controller('ListCtrl', function ($scope, $http) {
	$scope.items = [];

	$http({
		method: 'GET',
		url: '/data/list.json'
	}).success(function (data, status, headers, config) {
		if (data.list) {
			$scope.items = data.list;
		}
	});
}).controller('FooCtrl', function ($scope, $http) {
	$http({
		method: 'GET',
		url: '/data/foo.json'
	}).success(function (data, status, headers, config) {
		$scope.title = data.title;
		$scope.desc = data.description;
	});
});

