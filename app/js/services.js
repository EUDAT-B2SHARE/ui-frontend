'use strict';

var backend = 'http://localhost:5000';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);


phonecatServices.factory('Global', ['$rootScope', '$location', '$timeout', '$routeParams',
  function($rootScope, $location, $timeout, $routeParams){
  return {
    // path redirection
    path: function(data){
      $location.path(data);
    },
    // return active to be injected into <div class="..."> upon active route
    routeActive: function(route){
      if($location.path() == route){
        return "active";
      }
    },
    pageActive: function(page){
      if($routeParams.page == page){
        return "active";
      }
    },
    // flash notification add
    flash_add: function(action, clazz, content, type){
      // get/set search values
      if(type == undefined) type = "warning";
      // var title_msg = $('#alerts-container').find('.message').find('[ng-bind=title]').html();
      // var title = "";
      var content_msg = $('#alerts-container').find('.message.' + clazz).find('[ng-bind-html=content]').html();
      // add flash for empty search
      if(content_msg != content){
        action({content: content, title: "", type: type, animation: 'am-fade-and-slide-top message ' + clazz, duration: 4});
      }
    },
    // flash notification dismiss (click)
    flash_dismiss: function(type){
      // click dismiss button
      $timeout(function() {
        angular.element('#alerts-container').find('.' + type + ' button').trigger('click');
      }, 100);
    },
  };
}]);


phonecatServices.factory('User', ['$resource', function($resource){
  return $resource(backend + '/user/:action.json', {}, {
    authenticate: { method: 'POST', params: {action: "authenticate", remember: '@remember'},
      transformRequest: function(data){
        delete data['remember'];
        return angular.toJson(data);
      }
      },
  });
}]);

phonecatServices.factory('Deposit', ['$resource', function($resource){
  return $resource(backend + '/deposit/:action.json', {}, {
    deposits: { method: 'GET', params: {action: 'index', order: '@order', order_by: '@order_by', page: '@page', page_size: '@page_size'}},
    deposit: { method: 'GET', params: {action: 'deposit', uuid: '@uuid'} },
  });
}]);



  // return {
  //     $scope.searchForm = {};
  // $scope.searchForm.submitForm = function() {
  //   if($scope.searchForm.query == undefined){
  //     $scope.searchForm_errorMessage = "Please provide a search value";
  //     return;
  //   }
  //   $scope.errorName = "blaat";
  //   $scope.message = "generic error";
  //   $location.path('/search/query/' + $scope.searchForm.query);
  // };

  // $scope.goto = function(name) {
  //   $location.path(name);
  // }
  // };