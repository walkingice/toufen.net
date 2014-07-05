/* Controllers*/
(function (angular) {
    'use strict';
    var mod = angular.module('appControllers', []);

    mod.controller('NavbarCtrl', ['$scope', function ($scope) {
        $scope.navCollapsed = true;
        $scope.toggleNavbar = function () {
            $scope.navCollapsed = !$scope.navCollapsed;
        };
    }]);
})(window.angular);

