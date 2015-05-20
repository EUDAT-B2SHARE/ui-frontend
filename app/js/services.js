'use strict';

var backend = 'http://localhost:5000';

/* Services */

var b2Services = angular.module('b2Services', ['ngResource']);

// page title object (only used here)
var _PageTitle = {page: "", subject: "", title: "B2SHARE"};

b2Services.factory('PageTitle', ['$rootScope', '$location', '$timeout', '$routeParams',
  function($rootScope, $location, $timeout, $routeParams){
  return {
    reset: function(){
      _PageTitle = {page: "", subject: "", title: "B2SHARE"};
      // preset title via breadcrumb parsed page names
      if(_Breadcrumbs.length > 0)
        _PageTitle.page = _Breadcrumbs[0].name;
    },
    getTitle: function(){
      return _PageTitle.title + " " + _PageTitle.page + " " +
        _PageTitle.subject;
    },
    setPage: function(page){
      _PageTitle.page = page;
    },
    setSubject: function(subject){
      _PageTitle.subject = subject;
    }
  };
}]);

var _Breadcrumbs = [];

// breadcrumbs
b2Services.factory('Breadcrumbs', ['$rootScope', '$location', '$timeout', '$routeParams',
  function($rootScope, $location, $timeout, $routeParams){
  return {
    present: function(){
      return _Breadcrumbs.length > 0;
    },
    getBreadcrumbs: function(){
      return _Breadcrumbs;
    },
    load: function(){
      var uri = $location.path();
      // strip parameters
      var end = uri.indexOf('?');
      if(end == -1)
        end = uri.length;
      // strip prefix and empty entries
      var as = uri.substring(1, end).split('/').filter(function(a){ return a != ""; });
      // map as expected result
      _Breadcrumbs = as.map(function(a, i){
        var href = "#/" + as.slice(0, i+1).join('/');
        var active = as.length -1 != i;
        return {'name': a, 'href': href, 'active': active};
      });
    }
  };
}]);


b2Services.factory('Helper', ['$rootScope', '$location', '$timeout', '$routeParams',
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


b2Services.factory('User', ['$resource', function($resource){
  return $resource(backend + '/user/:action.json', {}, {
    authenticate: { method: 'POST', params: {action: "authenticate", remember: '@remember'},
      transformRequest: function(data){
        delete data['remember'];
        return angular.toJson(data);
      }
      },
  });
}]);

b2Services.factory('Deposit', ['$resource', function($resource){
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