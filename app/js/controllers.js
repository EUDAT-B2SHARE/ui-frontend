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
phonecatControllers.controller('HomeCtrl', ['$scope', '$alert', '$location', '$timeout', '$rootScope', '$window', 'Deposit',
    function($scope, $alert, $location, $timeout, $rootScope, $window, Deposit){

  // latest deposits
  Deposit.deposits({page: 1, page_size: 6, order_by: 'created_at', order: 'desc'}, function(data){
    $scope.deposits = data.deposits;
  }, function(data){
    // error happend
    $rootScope.gbl.flash_add($alert, 'deposits', 'Could not load latest deposits', 'warning');
  });

}]);


phonecatControllers.controller('DefaultCtrl', ['$scope', '$alert', '$location', '$timeout', '$rootScope', '$window', 'Deposit',
          function($scope, $alert, $location, $timeout, $rootScope, $window, Deposit){

  // $rootScope.page_title = "B2SHARE";

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
    var uri = $location.path();
    var end = uri.indexOf('?');
    if(end == -1)
      end = uri.length;
    var as = uri.substring(1, end).split('/').filter(function(a){ return a != ""; });
    $scope.breadcrumbs = as.map(function(a, i){
      var href = "#/" + as.slice(0, i+1).join('/');
      var active = as.length -1 != i;
      return {'name': a, 'href': href, 'active': active};
    });

    // page title
    $rootScope.page_title = "B2SHARE";
    var bs = $scope.breadcrumbs;
    if(bs != undefined && bs.length > 0){
      $rootScope.page_title += " " + bs[bs.length-1].name.capitalize();
    }

  });
}]);

phonecatControllers.controller('AboutCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
  // $rootScope.page_title = "B2SHARE - About";
}]);

phonecatControllers.controller('AboutListCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
  // $rootScope.page_title = "B2SHARE - About";

}]);

phonecatControllers.controller('HelpCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
  // $rootScope.page_title = "B2SHARE - Help";

}]);

phonecatControllers.controller('HelpListCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
  // $rootScope.page_title = "B2SHARE / Help";

}]);

phonecatControllers.controller('UserCtrl', ['$scope', 'User', '$alert', '$timeout', '$rootScope', '$window', '$location',
    function($scope, User, $alert, $timeout, $rootScope, $window, $location){
  // $rootScope.page_title = "B2SHARE / User";

  // logout user
  if ($location.path() == "/users/logout"){
    delete $window.sessionStorage.user;
    $rootScope.user = undefined;
    $rootScope.gbl.flash_dismiss('user');
    $rootScope.gbl.flash_add($alert, 'user', 'You\'ve logged out', 'success');
    $location.path("/users/login");
  }

  // login form
  $scope.userLogin = {};
  $scope.userLogin.submitForm = function() {
    var f = $scope.userLogin;
    // call user authenticate
    delete $window.sessionStorage.user;
    User.authenticate({email: f.email, password: f.password, remember: f.remember}, function(data){
      $rootScope.gbl.flash_dismiss('user');
      // TODO: handle invalid requests here!
      $window.sessionStorage.user = JSON.stringify(data.user);
      angular.element("[name=userLoginFormNg]").removeClass("has-error");
      $rootScope.gbl.flash_add($alert, 'user', 'You\'ve logged in as: `'+data.user.name+'`', 'success');
      $location.path('/users/profile');
    }, function(data){
      f.errorBase = data.data.error.base;
      angular.element("[name=userLoginFormNg]").addClass("has-error");
      if(String(data.status).startsWith("5")){
        $rootScope.gbl.flash_add($alert, 'user', 'An error has occured', 'danger');
      }
    });
  };


}]);

phonecatControllers.controller('UserListCtrl', ['$scope', 'User', '$alert', '$timeout', '$rootScope', '$window', '$location',
    function($scope, User, $alert, $timeout, $rootScope, $window, $location){
  // $rootScope.page_title = "B2SHARE / Users";
}]);

phonecatControllers.controller('SearchCtrl', ['$scope', '$routeParams', '$location',
    function($scope, $routeParams, $location){
  // $rootScope.page_title = "B2SHARE / Search";
  // map parameter on scope
  $scope.query = $routeParams.query;

}]);

phonecatControllers.controller('SearchListCtrl', ['$scope', '$routeParams', '$location',
    function($scope, $routeParams, $location){
  // $rootScope.page_title = "B2SHARE / Search";
}]);

phonecatControllers.controller('DepositListCtrl', ['$scope', '$routeParams', 'Deposit', '$rootScope', '$alert', '$location',
    function($scope, $routeParams, Deposit, $rootScope, $alert, $location){
  // $rootScope.page_title = "B2SHARE / Deposits";
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
    $rootScope.gbl.flash_add($alert, 'deposits', 'Could not load latest deposits', 'warning');
  });

}]);



phonecatControllers.controller('DepositCtrl', ['$scope', '$routeParams', 'Deposit', '$rootScope', '$alert', '$window',
    function($scope, $routeParams, Deposit, $rootScope, $alert, $window){
  // $rootScope.page_title = "B2SHARE / Deposit";
  // if(!$routeParams.uuid.isUuid()){
  //   $window.history.back();
  // }

  // load requested deposit
  Deposit.deposit({uuid: $routeParams.uuid}, function(data){
    $scope.deposit = data.deposit;
    // $rootScope.page_title = "B2SHARE / " + data.deposit.title;
  }, function(data){
    // error handling
    $rootScope.gbl.flash_add($alert, 'deposit', 'Could not load deposit: `'+$routeParams.uuid+'`', 'warning');
    $window.history.back();
  });

}]);


