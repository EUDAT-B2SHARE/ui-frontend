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

// phonecatControllers.run(function($rootScope) {
//   $rootScope.globalFoo = function() {
//     alert("I'm global foo!");
//   };
// });


phonecatControllers.controller('DefaultCtrl', ['$scope', '$alert', '$location', function($scope, $alert, $location){
  $scope.searchForm = {};
  $scope.searchForm.submitForm = function() {
    if($scope.searchForm.query == undefined || $scope.searchForm.query == ""){
      // get/set search values
      var title_msg = $('#alerts-container').find('.message').find('[ng-bind=title]').html();
      var title = "";
      var content_msg = $('#alerts-container').find('.message').find('[ng-bind-html=content]').html();
      var content = 'Please provide a search value';
      // add flash for empty search
      if(content_msg != content && title_msg != title){
        $alert({content: content, title: title, type: "warning", animation: 'am-fade-and-slide-top message search'});
      }
      return;
    } else {
      $('#alerts-container').find('.search').remove();
    }
    // redirect to search page
    $location.path('/search/query/' + $scope.searchForm.query);
  };

  $scope.goto = function(name) {
    $location.path(name);
  };

  // content view loaded
  $scope.$on('$viewContentLoaded', function(){
    // colorbox
    var v = angular.element('.img-thumbnail');
    v.colorbox({href: function(){
        // bind href with src of img
        return $(this).attr("src");
      }, maxWidth: "75%", fixed: true, scrolling: false
    });
    // stop background scrolling (body behind colorbox)
    $(document).bind('cbox_open', function(){
      $('body').addClass('stop-scrolling');
    });
    // enable scrolling
    $(document).bind('cbox_closed', function(){
      $('body').removeClass('stop-scrolling');
    });
  });
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

phonecatControllers.controller('DepositCtrl', ['$scope', '$routeParams', function($scope, $routeParams){
  $scope.uuid = $routeParams.uuid;
}]);


