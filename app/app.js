'use strict';
var App;

App = angular.module('toufen.net', ['ngCookies',
                                       'ngResource',
                                       'twControllers',
                                       'twDirectives',
                                       'twFilters',
                                       'twServices',
                                       'ui.state',
                                       'partials'
                                   ]);

App.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/list");
	$stateProvider
		.state('list', {
		    url: '/list',
		    templateUrl: '/partials/list.html'
		})
		.state('foo', {
		    url: '/foo',
		    templateUrl: '/partials/foo.html'
		})
		.state('about', {
		    url: '/about',
		    templateUrl: '/partials/about.html'
		});
	return $locationProvider.html5Mode(false);
});
