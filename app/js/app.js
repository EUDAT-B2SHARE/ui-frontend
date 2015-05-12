'use strict';

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
  'angular-loading-bar',
  'ngRoute',
  'phonecatAnimations',
  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices',
]).config(function(cfpLoadingBarProvider){
  cfpLoadingBarProvider.includeSpinner = false;
}).config(function($alertProvider) {
  angular.extend($alertProvider.defaults, {
    animation: 'am-fade-and-slide-top message',
    placement: 'top',
    container: "#alerts-container",
  })
});


// application runner
phonecatApp.run(function($rootScope, Global, $window) {
  // global bindings (service)
  $rootScope.gbl = Global;

  // string helper
  if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
      return this.slice(0, str.length) == str;
    };
  }

});

// routes
phonecatApp.config(['$routeProvider', function($routeProvider){
  // default route
  $routeProvider.when('/', {
    templateUrl: 'layout/home/index.html',
    controller: 'DefaultCtrl'
  }).otherwise({
    redirectTo: '/'
  });

  // about
  $routeProvider.when('/about/b2share',{
    templateUrl: 'layout/about/b2share.html',
    controller: 'AboutCtrl'
  }).when('/about/communities',{
    templateUrl: 'layout/about/communities.html',
    controller: 'AboutCtrl'
  }).when('/about/legal-notice',{
    templateUrl: 'layout/about/legal-notice.html',
    controller: 'AboutCtrl'
  });

  // help
  $routeProvider.when('/help/user-guide',{
    templateUrl: 'layout/help/user-guide.html',
    controller: 'HelpCtrl'
  }).when('/help/faq',{
    templateUrl: 'layout/help/faq.html',
    controller: 'HelpCtrl'
  }).when('/help/search',{
    templateUrl: 'layout/help/search.html',
    controller: 'HelpCtrl'
  });

  // user
  $routeProvider.when('/user/sign-up',{
    templateUrl: 'layout/user/sign-up.html',
    controller: 'UserCtrl'
  }).when('/user/login',{
    templateUrl: 'layout/user/login.html',
    controller: 'UserCtrl'
  }).when('/user/profile', {
    templateUrl: 'layout/user/profile.html',
    controller: 'UserCtrl'
  }).when('/user/logout', {
    templateUrl: 'layout/user/logout.html',
    controller: 'UserCtrl'
  });

  // search
  $routeProvider.when('/search/query/:query',{
    templateUrl: 'layout/search/query.html',
    controller: 'SearchCtrl'
  });

  // deposit
  $routeProvider.when('/deposit/:uuid',{
    templateUrl: 'layout/deposit/deposit.html',
    controller: 'DepositCtrl'
  });


}]);


