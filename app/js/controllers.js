'use strict';

/* Controllers */


var phonecatControllers = angular.module('phonecatControllers', ['angular-loading-bar']);


// phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone', 'cfpLoadingBar',
//   function($scope, Phone, cfpLoadingBar){
//     // cfpLoadingBar.start();
//     // $http.get('phones/phones.json').success(function(data){
//     //   $scope.phones = data;
//     // });
//     $scope.phones = Phone.query();
//     $scope.orderProp = 'age';
//     // cfpLoadingBar.complete();
// }]);

// phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone', 'cfpLoadingBar',
//   function($scope, $routeParams, Phone, cfpLoadingBar){
//     // cfpLoadingBar.start();
//     // $http.get('phones/'+$routeParams.phoneId+'.json').success(function(data){
//     //   $scope.phone = data;
//     //   $scope.mainImageUrl = data.images[0];
//     // });

//     $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone){
//       $scope.mainImageUrl = phone.images[0];
//       // cfpLoadingBar.complete();
//     });

//     $scope.setImage = function(imageUrl){
//       $scope.mainImageUrl = imageUrl;
//     }

// }]);


phonecatControllers.controller('HomeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
  $scope.searchForm = {};
  $scope.searchForm.submitForm = function() {
    if($scope.searchForm.query == undefined)
      return;
    $scope.errorName = "blaat";
    $scope.message = "generic error";
    $location.path('/search/query/' + $scope.searchForm.query);
  };

  $scope.goto = function(name) {
    $location.path(name);
  }


}]);

phonecatControllers.controller('AboutCtrl', ['$scope', function($scope){

}]);

phonecatControllers.controller('HelpCtrl', ['$scope', function($scope){

}]);

phonecatControllers.controller('UserCtrl', ['$scope', function($scope){

}]);

phonecatControllers.controller('SearchCtrl', ['$scope', '$routeParams', '$location',
  function($scope, $routeParams, $location){
  // map parameter on scope
  $scope.query = $routeParams.query;

}]);




