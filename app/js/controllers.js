'use strict';

/* Controllers */


var b2Controllers = angular.module('b2Controllers', ['angular-loading-bar']);

// phonecatControllers.run(function($rootScope) {
//   $rootScope.globalFoo = function() {
//     alert("I'm global foo!");
//   };
// });

b2Controllers.controller('HomeCtrl', ['$scope', '$alert', '$location', '$timeout', '$rootScope', '$window', 'Deposit',
    function($scope, $alert, $location, $timeout, $rootScope, $window, Deposit){

  // latest deposits
  Deposit.deposits({page: 1, page_size: 6, order_by: 'created_at', order: 'desc'}, function(data){
    $scope.deposits = data.deposits;
  }, function(data){
    // error happend
    $rootScope.Notify.flash_add($alert, 'deposits', 'Could not load latest deposits', 'warning');
  });

}]);


b2Controllers.controller('DefaultCtrl', ['$scope', '$alert', '$location', '$timeout', '$rootScope', '$window', 'Breadcrumbs', 'PageTitle',
          function($scope, $alert, $location, $timeout, $rootScope, $window, Breadcrumbs, PageTitle){

  // user session
  if($window.sessionStorage.user != undefined){
    $rootScope.user = JSON.parse($window.sessionStorage.user);
  }

  // search
  $scope.searchForm = {};
  $scope.searchForm.submitForm = function() {
    if($scope.searchForm.query == undefined || $scope.searchForm.query == ""){
      $rootScope.Notify.flash_add($alert, 'search', 'Please provide a search value', 'warning');
      return;
    } else {
      $rootScope.Notify.flash_dismiss('search');
    }
    // redirect to search page
    $location.path('/search/query/').search('query', $scope.searchForm.query);
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
      var a = $(a);
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

    // breadcrumbs
    Breadcrumbs.load();

    // page title
    PageTitle.reset();

    // // page title
    // $rootScope.page_title = "B2SHARE";
    // var bs = $scope.breadcrumbs;
    // if(bs != undefined && bs.length > 0){
    //   $rootScope.page_title += " " + bs[bs.length-1].name.capitalize();
    // }

  });
}]);

b2Controllers.controller('AboutCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
  // $rootScope.PageTitle.reset();

}]);

b2Controllers.controller('AboutListCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
  // $rootScope.PageTitle.reset();

}]);

b2Controllers.controller('HelpCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
  // $rootScope.PageTitle.reset();

}]);

b2Controllers.controller('HelpListCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
  // $rootScope.PageTitle.reset();

}]);

b2Controllers.controller('UserCtrl', ['$scope', 'User', '$alert', '$timeout', '$rootScope', '$window', '$location',
    function($scope, User, $alert, $timeout, $rootScope, $window, $location){

  // logout user
  if ($location.path() == "/users/logout"){
    delete $window.sessionStorage.user;
    $rootScope.user = undefined;
    $rootScope.Notify.dismiss();
    $rootScope.Notify.flash_dismiss('user');
    $rootScope.Notify.flash_add($alert, 'user', 'You\'ve logged out', 'success');
    $location.path("/users/login");
  }

  // login form
  $scope.userLogin = {};
  $scope.userLogin.submitForm = function() {
    var f = $scope.userLogin;
    // call user authenticate
    delete $window.sessionStorage.user;
    User.authenticate({email: f.email, password: f.password, remember: f.remember}, function(data){
      $rootScope.Notify.flash_dismiss('user');
      // TODO: handle invalid requests here!
      $window.sessionStorage.user = JSON.stringify(data.user);
      // user session (load when default not yet loaded)
      $rootScope.user = JSON.parse($window.sessionStorage.user);
      angular.element("[name=userLoginFormNg]").removeClass("has-error");
      $rootScope.Notify.flash_add($alert, 'user', 'You\'ve logged in as: `'+data.user.name+'`', 'success');
      $location.path('/users/profile');
    }, function(data){
      f.errorBase = data.data.error.base;
      angular.element("[name=userLoginFormNg]").addClass("has-error");
      if(String(data.status).startsWith("5")){
        $rootScope.Notify.flash_add($alert, 'user', 'An error has occured', 'danger');
      }
    });
  };


}]);

b2Controllers.controller('UserListCtrl', ['$scope', 'User', '$alert', '$timeout', '$rootScope', '$window', '$location',
    function($scope, User, $alert, $timeout, $rootScope, $window, $location){
  // $rootScope.PageTitle.reset();
}]);

b2Controllers.controller('UserNotifyCtrl', ['$scope', 'User', '$alert', '$timeout', '$rootScope', '$window', '$location', '$routeParams',
    function($scope, User, $alert, $timeout, $rootScope, $window, $location, $routeParams){

  $scope.group = $routeParams.group;
  // load notifications
  $scope.notifications = $rootScope.Notify.getNotifications($scope.group);

  $scope.dismiss = function(){
    // dismiss notifications
    $rootScope.Notify.dismiss();
    // reload scope
    $scope.notifications = $rootScope.Notify.getNotifications($scope.group);
  };



}]);


b2Controllers.controller('SearchCtrl', ['$scope', '$routeParams', '$location',
    function($scope, $routeParams, $location){
  // $rootScope.PageTitle.reset();
  // map parameter on scope
  $scope.query = $routeParams.query;

}]);

b2Controllers.controller('SearchListCtrl', ['$scope', '$routeParams', '$location',
    function($scope, $routeParams, $location){
  // $rootScope.PageTitle.reset();
}]);

b2Controllers.controller('DepositListCtrl', ['$scope', '$routeParams', 'Deposit', '$rootScope', '$alert', '$location',
    function($scope, $routeParams, Deposit, $rootScope, $alert, $location){
  // $rootScope.PageTitle.reset();

  // force page offset
  if($routeParams.page == undefined){
    $location.path('/deposits').search('page', 1);
    return;
  }
  $scope.currentPage = $routeParams.page;

  // latest 20 deposits
  Deposit.deposits({page: $scope.currentPage, page_size: 20, order_by: 'created_at', order: 'desc'}, function(data){
    $scope.deposits = data.deposits;
  }, function(data){
    // error happend
    // $rootScope.Notify.signal($alert, )
    $rootScope.Notify.flash_add($alert, 'deposits', 'Could not load latest deposits', 'warning');
  });

}]);



b2Controllers.controller('DepositCtrl', ['$scope', '$routeParams', 'Deposit', '$rootScope', '$alert', '$window',
    function($scope, $routeParams, Deposit, $rootScope, $alert, $window){

  // load requested deposit
  Deposit.deposit({uuid: $routeParams.uuid}, function(data){
    $rootScope.PageTitle.setSubject(data.deposit.title);
    $scope.deposit = data.deposit;
    // $rootScope.page_title = "B2SHARE / " + data.deposit.title;
  }, function(data){
    // error handling
    $rootScope.Notify.flash_add($alert, 'deposit', 'Could not load deposit: `'+$routeParams.uuid+'`', 'warning');
    $window.history.back();
  });

}]);


