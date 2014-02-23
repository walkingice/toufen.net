'use strict';
/* Directives*/

angular.module('twDirectives', ['twServices'])
.directive('appVersion', function(version) {
	return function(scope, elm, attrs) {
		return elm.text(version);
	};
});
