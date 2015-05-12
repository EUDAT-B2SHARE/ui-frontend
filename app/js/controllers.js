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


phonecatControllers.controller('DefaultCtrl', ['$scope', '$alert', '$location', '$timeout', '$rootScope', '$window',
          function($scope, $alert, $location, $timeout, $rootScope, $window){

  console.log("DefaultCtrl");
  if($window.sessionStorage.user != undefined){
    $rootScope.user = JSON.parse($window.sessionStorage.user);
  }

  // search
  $scope.searchForm = {};
  $scope.searchForm.submitForm = function() {
    if($scope.searchForm.query == undefined || $scope.searchForm.query == ""){
      $rootScope.gbl.flash_add($alert, 'search', 'Please provide a search value', 'warning');
      return;
    } else {
      $rootScope.gbl.flash_dismiss('search');
    }
    // redirect to search page
    $location.path('/search/query/' + $scope.searchForm.query);
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

    // a href hooks
    $('a').each(function(i, a){
      a = $(a);
      if(!a.attr("href").startsWith("#/")){
        if(a.attr("target") == undefined)
          // overwrite remote href to _blank target (if target not set)
          a.attr("target", "_blank");
      } else {
        // attach inner-link helper
        a.addClass("inner-link");
      }
      // detect expanded navs
      var navs = $(document).find('nav .navbar-collapse');
      if(navs.hasClass('in') && a.hasClass('inner-link')){
        // collapse navs on internal link click
        navs.removeClass('in');
      }
    });


  });
}]);

phonecatControllers.controller('AboutCtrl', ['$scope', function($scope){

}]);

phonecatControllers.controller('HelpCtrl', ['$scope', function($scope){

}]);

phonecatControllers.controller('UserCtrl', ['$scope', 'User', '$alert', '$timeout', '$rootScope', '$window', '$location',
    function($scope, User, $alert, $timeout, $rootScope, $window, $location){

  console.log("UserCtrl");
  if($window.sessionStorage.user != undefined){
    $rootScope.user = JSON.parse($window.sessionStorage.user);
  }

  // logout user
  if ($location.path() == "/user/logout"){
    delete $window.sessionStorage.user;
    $rootScope.user = undefined;
    $rootScope.gbl.flash_add($alert, 'user', 'You\'ve logged out', 'success');
    $location.path("/user/login");
  }

  // login form
  $scope.userLogin = {};
  $scope.userLogin.submitForm = function() {
    var f = $scope.userLogin;
    // if(f.email == undefined || f.password == undefined){
    //   angular.element("[name=userLoginFormNg]").addClass("has-error");
    // } else {
    //   f.errorBase = "";
    //   angular.element("[name=userLoginFormNg]").removeClass("has-error");
    // }

    // call user authenticate
    User.authenticate({email: f.email, password: f.password, remember: f.remember}, function(data){
      $rootScope.gbl.flash_dismiss('socket');
      // TODO: handle invalid requests here!
      delete $window.sessionStorage.user;
      $window.sessionStorage.user = JSON.stringify(data.user);
      // $rootScope.gbl.flash_add($alert, 'user', 'Logged in as: `' + data.user.name + '`', 'success');
      $location.path('/user/profile');
    }, function(data){
      // jdata = JSON.parse(data);
      f.errorBase = data.data.error.base;
      angular.element("[name=userLoginFormNg]").addClass("has-error");
      // if(data.)
      // $rootScope.gbl.flash_add($alert, 'socket', 'Connection with server lost', 'danger');
      delete $window.sessionStorage.user;
    });



    // console.log($scope.user);





    // if(f.email == undefined || f.password == undefined){
    //   return;
    // }

    // if($scope.searchForm.query == undefined || $scope.searchForm.query == ""){
    //   $rootScope.gbl.flash_add($alert, 'search', 'Please provide a search value', 'warning');
    //   return;
    // } else {
    //   $rootScope.gbl.flash_dismiss('search');
    // }
    // redirect to search page
    // $location.path('/search/query/' + $scope.searchForm.query);
  };


}]);

phonecatControllers.controller('SearchCtrl', ['$scope', '$routeParams', '$location',
    function($scope, $routeParams, $location){
  // map parameter on scope
  $scope.query = $routeParams.query;

}]);

phonecatControllers.controller('DepositCtrl', ['$scope', '$routeParams',
    function($scope, $routeParams){
  $scope.uuid = $routeParams.uuid;
}]);


