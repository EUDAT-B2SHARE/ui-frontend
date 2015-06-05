'use strict';

/* Controllers */


var b2Controllers = angular.module('b2Controllers', ['angular-loading-bar']);

// phonecatControllers.run(function($rootScope) {
//   $rootScope.globalFoo = function() {
//     alert("I'm global foo!");
//   };
// });

b2Controllers.controller('HomeCtrl', ['$scope', '$alert', '$location', '$timeout', '$rootScope', '$window', 'Deposit', 'Helper', 'Upload',
    function($scope, $alert, $location, $timeout, $rootScope, $window, Deposit, Helper, Upload){

  // latest deposits
  Deposit.deposits({page: 1, page_size: 6, order_by: 'created_at', order: 'desc'}, function(data){
    $scope.deposits = data.deposits;
  }, function(data){
    // error happend
    $rootScope.Notify.flash_add($alert, 'deposits', 'Could not load latest deposits', 'warning');
  });

  // file upload
  $scope.uploadForm = {};
  $scope.uploadForm.submitForm = function(){
    var fs = $scope.uploadForm.files;
    if(!fs)
      return;
    for(var i in fs){
      var f = fs[i];
      console.log(i);
      console.log(f);
      // upload files
      Upload.upload({
        url: 'upload/url',
        fields: {'key': 'value'},
        file: f
      }).progress(function(evt){
        console.log("progress");
        console.log(evt);
      }).success(function(data, status, headers, config){
        console.log("success");
        console.log(data);
        console.log(status);
        console.log(headers);
        console.log(config);
      });

    }
  };
  $scope.uploadForm.change = function(files){
    // show preview (bind media element)
    $timeout(function() {
      angular.element('.media').media();
    }, 100);
  }
  $scope.uploadForm.reset = function(){
    // reset files, scroll to create deposit
    $scope.uploadForm.files = undefined;
    Helper.scrollToInvisible("#create-deposit-header");
  }


}]);


b2Controllers.controller('DefaultCtrl', ['$scope', '$alert', '$location', '$timeout', '$rootScope', '$window', 'Breadcrumbs', 'PageTitle', 'Session', 'Helper',
  function($scope, $alert, $location, $timeout, $rootScope, $window, Breadcrumbs, PageTitle, Session, Helper){

  // user session
  if(Session.has('user')){
    $rootScope.user = Session.get('user');
  }

  // if($window.sessionStorage.user != undefined){
  //   $rootScope.user = JSON.parse($window.sessionStorage.user);
  // }

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
    var v = angular.element('.colorbox');
    v.colorbox({href: function(){
        // bind href with src of img
        return angular.element(this).attr("src");
      }, maxWidth: "75%", fixed: true, scrolling: false
    });

    // stop background scrolling (body behind colorbox)
    angular.element(document).bind('cbox_open', function(){
      angular.element('body').addClass('stop-scrolling');
    });
    // enable scrolling
    angular.element(document).bind('cbox_closed', function(){
      angular.element('body').removeClass('stop-scrolling');
    });

    // a href hooks
    angular.element('a').each(function(i, a){
      var a = angular.element(a);
      if(a.attr("href") != undefined && !a.attr("href").startsWith("#/")){
        if(a.attr("target") == undefined)
          // overwrite remote href to _blank target (if target not set)
          a.attr("target", "_blank");
      } else {
        // attach inner-link helper
        a.addClass("inner-link");
      }
      // detect expanded navs
      var navs = angular.element(document).find('nav .navbar-collapse');
      if(navs.hasClass('in') && a.hasClass('inner-link')){
        // collapse navs on internal link click
        navs.removeClass('in');
      }
    });

    // scroll pages into view (better effect than autofocus="true")
    Helper.scrollToInvisible('#header');

    // breadcrumbs
    Breadcrumbs.load();

    // page title
    PageTitle.reset();

    // load session
    Session.load();


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

b2Controllers.controller('UserCtrl', ['$scope', 'User', '$alert', '$timeout', '$rootScope', '$window', '$location', 'Session',
  function($scope, User, $alert, $timeout, $rootScope, $window, $location, Session){

  // logout user
  if ($location.path() == "/users/logout"){
    Session.unset('user');
    $rootScope.currentUser = undefined;
    $rootScope.Notify.dismiss();
    $rootScope.Notify.flash_dismiss();
    $rootScope.Notify.flash_add($alert, 'user', 'You\'ve logged out', 'success');
    $rootScope.Notify.dismiss();
    $location.path("/users/login");
  }

  // login form
  $scope.userLogin = {};
  $scope.userLogin.submitForm = function() {
    var f = $scope.userLogin;
    // call user authenticate
    Session.unset('user');
    // delete $window.sessionStorage.user;
    User.authenticate({email: f.email, password: f.password, remember: f.remember}, function(data){
      $rootScope.Notify.flash_dismiss('user');
      // TODO: handle invalid requests here!
      var loc = "session";
      if(f.remember){
        loc = "local";
      }
      Session.set({user: data.user}, loc);
      // user session (load when default not yet loaded)
      $rootScope.user = Session.get('user');
      $scope.info = data.info;
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
  // map parameter on scope
  $scope.query = $routeParams.query;

}]);

b2Controllers.controller('SearchListCtrl', ['$scope', '$routeParams', '$location',
    function($scope, $routeParams, $location){
}]);

b2Controllers.controller('DepositListCtrl', ['$scope', '$routeParams', 'Deposit', '$rootScope', '$alert', '$location', 'Pagination',
    function($scope, $routeParams, Deposit, $rootScope, $alert, $location, Pagination){
  // force page offset
  if($routeParams.page == undefined){
    $location.path('/deposits').search('page', 1);
    return;
  }

  // latest 20 deposits
  var currentPage = $routeParams.page;
  var pageSize = 20;
  Deposit.deposits({page: currentPage, page_size: pageSize, order_by: 'created_at', order: 'desc'}, function(data){
    $scope.deposits = data.deposits;
    $scope.info = data.info;
    var totalItemCnt = $scope.info.count;
    // pagination
    $scope.pagination = Pagination.show('#deposits-paginator', 'deposits', currentPage, pageSize, data.info.count, 10);
  }, function(data){
    // error happend
    $rootScope.Notify.flash_add($alert, 'deposits', 'Could not load latest deposits', 'warning');
  });


}]);



b2Controllers.controller('DepositCtrl', ['$scope', '$routeParams', 'Deposit', '$rootScope', '$alert', '$window',
    function($scope, $routeParams, Deposit, $rootScope, $alert, $window){

  // load requested deposit
  Deposit.deposit({uuid: $routeParams.uuid}, function(data){
    $rootScope.PageTitle.setSubject(data.deposit.title);
    $scope.deposit = data.deposit;
    $scope.info = data.info;
  }, function(data){
    // error handling
    $rootScope.Notify.flash_add($alert, 'deposit', 'Could not load deposit: `'+$routeParams.uuid+'`', 'warning');
    $window.history.back();
  });

}]);


