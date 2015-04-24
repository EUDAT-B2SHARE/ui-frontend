'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);


phonecatServices.factory('Phone', ['$resource', function($resource){
  return $resource('phones/:phoneId.json', {}, {
    query: {method: 'GET', params: {phoneId: 'phones'}, isArray: true}
  });
}]);


phonecatServices.factory('Global', ['$rootScope', '$location',
  function($rootScope, $location){
  return {
    path: function(data){
      $location.path(data);
    }
  };
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