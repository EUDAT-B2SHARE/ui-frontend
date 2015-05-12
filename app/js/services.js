'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);


phonecatServices.factory('Global', ['$rootScope', '$location', '$timeout',
  function($rootScope, $location, $timeout){
  return {
    // path redirection
    path: function(data){
      $location.path(data);
    },
    // flash notification add
    flash_add: function(action, clazz, content, type){
      // get/set search values
      if(type == undefined) type = "warning";
      var title_msg = $('#alerts-container').find('.message').find('[ng-bind=title]').html();
      var title = "";
      var content_msg = $('#alerts-container').find('.message').find('[ng-bind-html=content]').html();
      // add flash for empty search
      if(content_msg != content && title_msg != title){
        action({content: content, title: title, type: type, animation: 'am-fade-and-slide-top message ' + clazz});
      }
    },
    // flash notification dismiss (click)
    flash_dismiss: function(type){
      // click dismiss button
      $timeout(function() {
        angular.element('#alerts-container').find('.' + type + ' button').trigger('click');
      }, 100);
    }
  };
}]);


phonecatServices.factory('User', ['$resource', function($resource){
  return $resource('http://localhost:5000/user/:action.json', {}, {
    authenticate: { method: 'POST', params: {action: "authenticate", remember: '@remember'},
      transformRequest: function(data){
        delete data['remember'];
        return angular.toJson(data);
      }
      },
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