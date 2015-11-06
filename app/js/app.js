'use strict';

/* App Module */

var b2App = angular.module('b2App', [
    'angular-loading-bar',
    'ngRoute',
    'b2Animations',
    'b2Controllers',
    'b2Filters',
    'b2Services',
    'ngFileUpload',
]).config(function(cfpLoadingBarProvider){
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.latencyThreshold = 30;
}).config(function($alertProvider) {
    angular.extend($alertProvider.defaults, {
        animation: 'am-fade-and-slide-top message',
        placement: 'top',
        container: "#alerts-container",
    });
}).config(['$httpProvider', function($httpProvider) {
    // push interceptor to inject user token validation
    $httpProvider.interceptors.push('b2Interceptor');
}]);



// application runner
b2App.run(['$rootScope', '$window', 'Helper', 'PageTitle', 'Breadcrumbs', 'Notify', 'Pagination',
    function($rootScope, $window, Helper, PageTitle, Breadcrumbs, Notify, Pagination) {
    // global bindings (service)
    $rootScope.Helper = Helper;
    $rootScope.PageTitle = PageTitle;
    $rootScope.Breadcrumbs = Breadcrumbs;
    $rootScope.Notify = Notify;
    $rootScope.Pagination = Pagination;

    // pluralize wrapper
    $rootScope.pluralize = function(value, cnt){
        return $window.pluralize(value, cnt);
    };
    // string helper startsWith
    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str){
            return this.slice(0, str.length) == str;
        };
    }
    // string helper endsWith
    if (typeof String.prototype.endsWith != 'function') {
        String.prototype.endsWith = function(str){
            return this.slice(-str.length) == str;
        };
    }
    // string helper capticalize
    if (typeof String.prototype.capitalize != 'function') {
        String.prototype.capitalize = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
    }

}]);

// routes
b2App.config(['$routeProvider', function($routeProvider){
    // default route
    $routeProvider.when('/', {
        templateUrl: 'layout/home.html',
        controller: 'HomeCtrl'
    }).otherwise({
        redirectTo: '/'
    });

    // about
    $routeProvider.when('/about/b2share',{
        templateUrl: 'layout/about/b2share.html',
        controller: 'AboutCtrl'
    }).when('/about/legal-notice',{
        templateUrl: 'layout/about/legal-notice.html',
        controller: 'AboutCtrl'
    }).when('/about/',{
        templateUrl: 'layout/about/index.html',
        controller: 'AboutListCtrl'
    });

    // help
    $routeProvider.when('/help/user-guide',{
        templateUrl: 'layout/help/user-guide.html',
        controller: 'HelpCtrl'
    }).when('/help/terms-of-use',{
        templateUrl: 'layout/help/terms-of-use.html',
        controller: 'HelpCtrl'
    }).when('/help/api',{
        templateUrl: 'layout/help/api.html',
        controller: 'HelpCtrl'
    }).when('/help/faq',{
        templateUrl: 'layout/help/faq.html',
        controller: 'HelpCtrl'
    }).when('/help/search',{
        templateUrl: 'layout/help/search.html',
        controller: 'HelpCtrl'
    }).when('/help/',{
        templateUrl: 'layout/help/index.html',
        controller: 'HelpListCtrl'
    });

    // user
    $routeProvider.when('/users/sign-up',{
        templateUrl: 'layout/user/sign-up.html',
        controller: 'UserCtrl'
    }).when('/users/login',{
        templateUrl: 'layout/user/login.html',
        controller: 'UserCtrl'
    }).when('/users/profile', {
        templateUrl: 'layout/user/profile.html',
        controller: 'UserCtrl'
    }).when('/users/logout', {
        templateUrl: 'layout/user/logout.html',
        controller: 'UserCtrl'
    }).when('/users/', {
        templateUrl: 'layout/user/index.html',
        controller: 'UserListCtrl'
    }).when('/users/notifications', {
        templateUrl: 'layout/user/notifications.html',
        controller: 'UserNotifyCtrl'
    }).when('/users/notifications/:type', {
        templateUrl: 'layout/user/notifications.html',
        controller: 'UserNotifyCtrl'
    });

    // communities
    $routeProvider.when('/communities',{
        templateUrl: 'layout/communities/index.html',
        controller: 'CommunitiesCtrl'
    });

    // search
    $routeProvider.when('/search/query',{
        templateUrl: 'layout/search/query.html',
        controller: 'SearchCtrl'
    }).when('/search/',{
        templateUrl: 'layout/search/index.html',
        controller: 'SearchListCtrl'
    });

    // record
    $routeProvider.when('/records/',{
        templateUrl: 'layout/records/index.html',
        controller: 'RecordListCtrl'
    }).when('/records/create',{
        templateUrl: 'layout/records/create.html',
        controller: 'RecordCreateCtrl'
    }).when('/records/:uuid',{
        templateUrl: 'layout/records/record.html',
        controller: 'RecordCtrl'
    });


}]);


