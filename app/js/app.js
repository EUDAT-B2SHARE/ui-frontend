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
});

phonecatApp.config(['$routeProvider', function($routeProvider){
  // $routeProvider.when('/phones', {
  //   templateUrl: 'partials/phone-list.html',
  //   controller: 'PhoneListCtrl'
  // }).when('/phones/:phoneId', {
  //   templateUrl: 'partials/phone-detail.html',
  //   controller: 'PhoneDetailCtrl'
  // }).otherwise({
  //   redirectTo/: '/dashboard'
  // })

// <a href="#/about/legal-notice">Legal Notice</a>.
//           </p>
//           <ul class="nav navbar-nav navbar-right">
//             <li class=""><a href="#/help/terms-of-use">Terms of Use</a></li>
//             <li class=""><a href="#/help/api">REST API</a></li>
//             <li class=""><a href="#/about/eudat">About EUDAT</a></li>


  $routeProvider.when('/', {
    templateUrl: 'layout/home/index.html',
    controller: 'HomeCtrl'
  }).when('/about/b2share',{
    templateUrl: 'layout/about/b2share.html',
    controller: 'AboutCtrl'
  }).when('/about/communities',{
    templateUrl: 'layout/about/communities.html',
    controller: 'AboutCtrl'
  }).when('/about/legal-notice',{
    templateUrl: 'layout/about/legal-notice.html',
    controller: 'AboutCtrl'
  }).when('/help/user-guide',{
    templateUrl: 'layout/help/user-guide.html',
    controller: 'HelpCtrl'
  }).when('/help/faq',{
    templateUrl: 'layout/help/faq.html',
    controller: 'HelpCtrl'
  }).otherwise({
    redirectTo: '/'
  })
}]);

